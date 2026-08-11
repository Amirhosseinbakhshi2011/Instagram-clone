import React, { createContext, useContext, useState } from 'react';
import { Story, Post } from '../types';

export type ViewType =
  | 'home'
  | 'explore'
  | 'messages'
  | 'notifications'
  | 'profile'
  | 'settings'
  | 'admin';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  text: string;
}

interface AppContextType {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  selectedUsername: string | null;
  navigateToProfile: (username: string) => void;
  activeStoryGroup: Story[] | null;
  setActiveStoryGroup: (stories: Story[] | null) => void;
  activeMediaUrl: string | null;
  setActiveMediaUrl: (url: string | null) => void;
  isCreatePostOpen: boolean;
  setIsCreatePostOpen: (open: boolean) => void;
  isCreateStoryOpen: boolean;
  setIsCreateStoryOpen: (open: boolean) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  toasts: ToastMessage[];
  addToast: (text: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  activePostModal: Post | null;
  setActivePostModal: (post: Post | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);
  const [activeStoryGroup, setActiveStoryGroup] = useState<Story[] | null>(null);
  const [activeMediaUrl, setActiveMediaUrl] = useState<string | null>(null);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [activePostModal, setActivePostModal] = useState<Post | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const navigateToProfile = (username: string) => {
    setSelectedUsername(username);
    setCurrentView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedUsername,
        navigateToProfile,
        activeStoryGroup,
        setActiveStoryGroup,
        activeMediaUrl,
        setActiveMediaUrl,
        isCreatePostOpen,
        setIsCreatePostOpen,
        isCreateStoryOpen,
        setIsCreateStoryOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        toasts,
        addToast,
        removeToast,
        activePostModal,
        setActivePostModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
