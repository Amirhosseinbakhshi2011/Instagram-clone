import React from 'react';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { BottomNav } from './BottomNav';
import { HeaderMobile } from './HeaderMobile';
import { CommandPalette } from './CommandPalette';
import { ToastContainer } from '../ui/Toast';

import { HomeFeedView } from '../views/HomeFeedView';
import { ExploreView } from '../views/ExploreView';
import { MessagesView } from '../views/MessagesView';
import { NotificationsView } from '../views/NotificationsView';
import { ProfileView } from '../views/ProfileView';
import { SettingsView } from '../views/SettingsView';
import { AdminView } from '../views/AdminView';

import { CreatePostModal } from '../social/CreatePostModal';
import { CreateStoryModal } from '../social/CreateStoryModal';
import { StoryViewerModal } from '../social/StoryViewerModal';
import { MediaViewerModal } from '../social/MediaViewerModal';

import { useApp } from '../../context/AppContext';

export const MainLayout: React.FC = () => {
  const { currentView } = useApp();

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeFeedView />;
      case 'explore':
        return <ExploreView />;
      case 'messages':
        return <MessagesView />;
      case 'notifications':
        return <NotificationsView />;
      case 'profile':
        return <ProfileView />;
      case 'settings':
        return <SettingsView />;
      case 'admin':
        return <AdminView />;
      default:
        return <HomeFeedView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <HeaderMobile />

      <div className="flex justify-between max-w-7xl mx-auto">
        {/* Left Navigation Sidebar */}
        <LeftSidebar />

        {/* Main Central Workspace */}
        <main className="flex-1 min-w-0 p-3 sm:p-6 lg:p-8">
          {renderView()}
        </main>

        {/* Right Info Sidebar (Hidden on small screens) */}
        <RightSidebar />
      </div>

      <BottomNav />

      {/* Global Modals & Notifications */}
      <CreatePostModal />
      <CreateStoryModal />
      <StoryViewerModal />
      <MediaViewerModal />
      <CommandPalette />
      <ToastContainer />
    </div>
  );
};
