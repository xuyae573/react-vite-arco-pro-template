import { create } from 'zustand';
import defaultSettings from '../settings.json';

export interface GlobalState {
  settings?: typeof defaultSettings;
  userInfo?: {
    name?: string;
    avatar?: string;
    job?: string;
    organization?: string;
    location?: string;
    email?: string;
    permissions: Record<string, string[]>;
  };
  userLoading?: boolean;
}

const initialState: GlobalState = {
  settings: defaultSettings,
  userInfo: {
    permissions: {},
  },
};

interface GlobalStore extends GlobalState {
  updateSettings: (settings: typeof defaultSettings) => void;
  updateUserInfo: (
    userInfo: Partial<GlobalState['userInfo']>,
    userLoading?: boolean,
  ) => void;
}

export const useGlobalStore = create<GlobalStore>((set) => ({
  ...initialState,

  // Function to update settings
  updateSettings: (settings) =>
    set((state) => ({
      ...state,
      settings,
    })),

  // Function to update user info
  updateUserInfo: (userInfo, userLoading = false) =>
    set((state) => ({
      ...state,
      userInfo: {
        ...state.userInfo,
        ...userInfo,
      },
      userLoading,
    })),
}));
