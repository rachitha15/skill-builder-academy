import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export interface ValidationResult {
  check: string;
  passed: boolean;
  message: string;
}

export interface PlaybookSection {
  title: string;
  query: string;
  sourceFilter: string;
  threshold: number;
  synthesis: string;
  sources: string[];
  explanation: string;
}

export interface LennyModuleState {
  id: number;
  status: 'locked' | 'in_progress' | 'completed';
  xpEarned: number;
  attempts: number;
  hintsUsed: number;
  userWork: string;
  layer1Results: ValidationResult[] | null;
  layer2Results: any | null;
  searchResults: any[] | null;
}

export interface LennyCourseState {
  currentModule: number;
  totalXP: number;
  modules: LennyModuleState[];
  selectedTopic: string | null;
  playbook: PlaybookSection[] | null;
}

type LennyCourseAction =
  | { type: 'START_MODULE'; moduleId: number }
  | { type: 'COMPLETE_MODULE'; moduleId: number; xpEarned: number }
  | { type: 'INCREMENT_ATTEMPTS'; moduleId: number }
  | { type: 'USE_HINT'; moduleId: number }
  | { type: 'UPDATE_WORK'; moduleId: number; work: string }
  | { type: 'SET_LAYER1_RESULTS'; moduleId: number; results: ValidationResult[] }
  | { type: 'SET_LAYER2_RESULTS'; moduleId: number; results: any }
  | { type: 'SET_SEARCH_RESULTS'; moduleId: number; results: any[] }
  | { type: 'ADD_XP'; amount: number }
  | { type: 'SELECT_TOPIC'; topic: string }
  | { type: 'ADD_PLAYBOOK_SECTION'; section: PlaybookSection }
  | { type: 'RESET_PROGRESS' };

const initialModules: LennyModuleState[] = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  status: 'locked' as const,
  xpEarned: 0,
  attempts: 0,
  hintsUsed: 0,
  userWork: '',
  layer1Results: null,
  layer2Results: null,
  searchResults: null,
}));

const initialState: LennyCourseState = {
  currentModule: 1,
  totalXP: 0,
  modules: initialModules,
  selectedTopic: null,
  playbook: null,
};

function loadState(): LennyCourseState {
  try {
    const saved = localStorage.getItem('untutorial-lenny-progress');
    if (saved) {
      const parsed = JSON.parse(saved) as LennyCourseState;
      return parsed;
    }
  } catch {}
  return initialState;
}

function lennyReducer(state: LennyCourseState, action: LennyCourseAction): LennyCourseState {
  switch (action.type) {
    case 'SELECT_TOPIC': {
      const modules = state.modules.map(m =>
        m.id === 1 ? { ...m, status: 'in_progress' as const } : m
      );
      return { ...state, modules, selectedTopic: action.topic };
    }
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
    case 'SET_SEARCH_RESULTS': {
      const modules = state.modules.map(m =>
        m.id === action.moduleId ? { ...m, searchResults: action.results } : m
      );
      return { ...state, modules };
    }
    case 'ADD_XP':
      return { ...state, totalXP: state.totalXP + action.amount };
    case 'ADD_PLAYBOOK_SECTION': {
      const playbook = state.playbook ? [...state.playbook, action.section] : [action.section];
      return { ...state, playbook };
    }
    case 'RESET_PROGRESS':
      return initialState;
    default:
      return state;
  }
}

interface LennyCourseContextValue {
  state: LennyCourseState;
  dispatch: React.Dispatch<LennyCourseAction>;
}

const LennyCourseContext = createContext<LennyCourseContextValue | undefined>(undefined);

export function LennyCourseProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(lennyReducer, undefined, loadState);

  useEffect(() => {
    localStorage.setItem('untutorial-lenny-progress', JSON.stringify(state));
  }, [state]);

  return (
    <LennyCourseContext.Provider value={{ state, dispatch }}>
      {children}
    </LennyCourseContext.Provider>
  );
}

export function useLennyCourse() {
  const ctx = useContext(LennyCourseContext);
  if (!ctx) throw new Error('useLennyCourse must be used within LennyCourseProvider');
  return ctx;
}
