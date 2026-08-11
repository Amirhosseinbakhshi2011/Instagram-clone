export type Role = 'USER' | 'MODERATOR' | 'ADMIN';

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  coverUrl?: string;
  bio?: string;
  website?: string;
  location?: string;
  isVerified: boolean;
  isPrivate: boolean;
  role: Role;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: string;
  isFollowing?: boolean;
  isBlocked?: boolean;
  isMuted?: boolean;
}

export interface PostMedia {
  id: string;
  url: string;
  type: 'image' | 'video';
  aspectRatio?: string;
  altText?: string;
}

export interface Post {
  id: string;
  authorId: string;
  author: User;
  media: PostMedia[];
  caption: string;
  location?: string;
  hashtags: string[];
  mentions: string[];
  likesCount: number;
  commentsCount: number;
  savesCount: number;
  repostsCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  isReposted?: boolean;
  isPinned?: boolean;
  commentsDisabled?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: User;
  content: string;
  likesCount: number;
  isLiked?: boolean;
  createdAt: string;
  parentId?: string;
  replies?: Comment[];
}

export interface Story {
  id: string;
  author: User;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption?: string;
  createdAt: string;
  expiresAt: string;
  viewsCount: number;
  hasViewed?: boolean;
  reactionsCount?: number;
}

export interface UserStoryGroup {
  author: User;
  stories: Story[];
  hasUnseen: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender: User;
  content: string;
  mediaUrl?: string;
  reaction?: string;
  readAt?: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface Notification {
  id: string;
  recipientId: string;
  actor: User;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'story_reaction' | 'repost' | 'system';
  postId?: string;
  postMediaUrl?: string;
  commentContent?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Report {
  id: string;
  reporter: User;
  targetType: 'post' | 'user' | 'comment';
  targetId: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'dismissed' | 'actioned';
  createdAt: string;
  postDetails?: Post;
  userDetails?: User;
}

export interface UserSettings {
  accountPrivate: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  soundEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
  allowDirectMessages: 'everyone' | 'following' | 'none';
}
