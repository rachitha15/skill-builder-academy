import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export interface ValidationResult {
  check: string;
  passed: boolean;
  message: string;
}

export interface ModuleState {
  id: number;
  status: 'locked' | 'in_progress' | 'completed';
  xpEarned: number;
  attempts: number;
  hintsUsed: number;
  userWork: string;
  layer1Results: ValidationResult[] | null;
  layer2Results: any | null;
}

export interface CourseState {
  currentModule: number;
  totalXP: number;
  modules: ModuleState[];
}

type CourseAction =
  | { type: 'START_MODULE'; moduleId: number }
  | { type: 'COMPLETE_MODULE'; moduleId: number; xpEarned: number }
  | { type: 'INCREMENT_ATTEMPTS'; moduleId: number }
  | { type: 'USE_HINT'; moduleId: number }
  | { type: 'UPDATE_WORK'; moduleId: number; work: string }
  | { type: 'SET_LAYER1_RESULTS'; moduleId: number; results: ValidationResult[] }
  | { type: 'SET_LAYER2_RESULTS'; moduleId: number; results: any }
  | { type: 'ADD_XP'; amount: number }
  | { type: 'RESET_PROGRESS' };

const initialModules: ModuleState[] = Array.from({ length: 7 }, (_, i) => ({
  id: i + 1,
  status: 'locked' as const,
  xpEarned: 0,
  attempts: 0,
  hintsUsed: 0,
  userWork: '',
  layer1Results: null,
  layer2Results: null,
}));

const initialState: CourseState = {
  currentModule: 1,
  totalXP: 0,
  modules: initialModules,
};

function loadState(): CourseState {
  try {
    const saved = localStorage.getItem('untutorial-progress');
    if (saved) {
      const parsed = JSON.parse(saved) as CourseState;

      // Backward-compat migration: if progress is effectively untouched,
      // keep Module 1 in locked/not-started state on the map.
      const isUntouched = parsed.modules?.every(m =>
        m.status !== 'completed' &&
        m.attempts === 0 &&
        m.hintsUsed === 0 &&
        m.xpEarned === 0 &&
        m.userWork.trim().length === 0
      );

      if (isUntouched && parsed.modules?.[0]?.status === 'in_progress') {
        parsed.modules[0] = { ...parsed.modules[0], status: 'locked' };
      }

      return parsed;
    }
  } catch {}
  return initialState;
}

function courseReducer(state: CourseState, action: CourseAction): CourseState {
  switch (action.type) {
    case 'START_MODULE': {
      const modules = state.modules.map(m =>
        m.id === action.moduleId && m.status === 'locked'
          ? { ...m, status: 'in_progress' as const }
          : m
      );
      return { ...state, modules, currentModule: action.moduleId };
    }
    case 'COMPLETE_MODULE': {
      const modules = state.modules.map(m => {
        if (m.id === action.moduleId) return { ...m, status: 'completed' as const, xpEarned: action.xpEarned };
        if (m.id === action.moduleId + 1 && m.status === 'locked') return { ...m, status: 'in_progress' as const };
        return m;
      });
      return { ...state, modules, totalXP: state.totalXP + action.xpEarned };
    }
    case 'INCREMENT_ATTEMPTS': {
      const modules = state.modules.map(m =>
        m.id === action.moduleId ? { ...m, attempts: m.attempts + 1 } : m
      );
      return { ...state, modules };
    }
    case 'USE_HINT': {
      const modules = state.modules.map(m =>
        m.id === action.moduleId ? { ...m, hintsUsed: m.hintsUsed + 1 } : m
      );
      return { ...state, modules };
    }
    case 'UPDATE_WORK': {
      const modules = state.modules.map(m =>
        m.id === action.moduleId ? { ...m, userWork: action.work } : m
      );
      return { ...state, modules };
    }
    case 'SET_LAYER1_RESULTS': {
      const modules = state.modules.map(m =>
        m.id === action.moduleId ? { ...m, layer1Results: action.results } : m
      );
      return { ...state, modules };
    }
    case 'SET_LAYER2_RESULTS': {
      const modules = state.modules.map(m =>
        m.id === action.moduleId ? { ...m, layer2Results: action.results } : m
      );
      return { ...state, modules };
    }
    case 'ADD_XP':
      return { ...state, totalXP: state.totalXP + action.amount };
    case 'RESET_PROGRESS':
      return initialState;
    default:
      return state;
  }
}

interface CourseContextValue {
  state: CourseState;
  dispatch: React.Dispatch<CourseAction>;
}

const CourseContext = createContext<CourseContextValue | undefined>(undefined);

export function CourseProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(courseReducer, undefined, loadState);

  useEffect(() => {
    localStorage.setItem('untutorial-progress', JSON.stringify(state));
  }, [state]);

  return (
    <CourseContext.Provider value={{ state, dispatch }}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourse() {
  const ctx = useContext(CourseContext);
  if (!ctx) throw new Error('useCourse must be used within CourseProvider');
  return ctx;
}
