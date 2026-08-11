import { User, Post, Story, Conversation, Message, Notification, Report } from '../types';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error (${res.status}): ${errorText}`);
  }

  return res.json();
}

export const api = {
  // Auth
  async login(email?: string, password?: string) {
    return fetchJson<{ success: boolean; user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(username: string, displayName: string, email: string) {
    return fetchJson<{ success: boolean; user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, displayName, email }),
    });
  },

  async logout() {
    return fetchJson<{ success: boolean }>('/api/auth/logout', { method: 'POST' });
  },

  async getMe() {
    return fetchJson<{ user: User }>('/api/auth/me');
  },

  // Users
  async getUsers(q?: string) {
    return fetchJson<{ users: User[] }>(`/api/users${q ? `?q=${encodeURIComponent(q)}` : ''}`);
  },

  async getUserByUsername(username: string) {
    return fetchJson<{ user: User; posts: Post[] }>(`/api/users/${username}`);
  },

  async updateUserProfile(userId: string, updates: Partial<User>) {
    return fetchJson<{ success: boolean; user: User }>(`/api/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async toggleFollow(username: string) {
    return fetchJson<{ success: boolean; isFollowing: boolean; followersCount: number }>(
      `/api/users/${username}/follow`,
      { method: 'POST' }
    );
  },

  async toggleBlock(username: string) {
    return fetchJson<{ success: boolean; isBlocked: boolean }>(`/api/users/${username}/block`, {
      method: 'POST',
    });
  },

  async toggleMute(username: string) {
    return fetchJson<{ success: boolean; isMuted: boolean }>(`/api/users/${username}/mute`, {
      method: 'POST',
    });
  },

  // Posts
  async getPosts(feed: 'all' | 'following' | 'trending' = 'all') {
    return fetchJson<{ posts: Post[] }>(`/api/posts?feed=${feed}`);
  },

  async createPost(postData: {
    caption: string;
    media?: any[];
    location?: string;
    hashtags?: string[];
    mentions?: string[];
  }) {
    return fetchJson<{ success: boolean; post: Post }>('/api/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },

  async getPostById(id: string) {
    return fetchJson<{ post: Post }>(`/api/posts/${id}`);
  },

  async deletePost(id: string) {
    return fetchJson<{ success: boolean }>(`/api/posts/${id}`, { method: 'DELETE' });
  },

  async toggleLikePost(id: string) {
    return fetchJson<{ success: boolean; isLiked: boolean; likesCount: number }>(`/api/posts/${id}/like`, {
      method: 'POST',
    });
  },

  async toggleSavePost(id: string) {
    return fetchJson<{ success: boolean; isSaved: boolean; savesCount: number }>(`/api/posts/${id}/save`, {
      method: 'POST',
    });
  },

  async toggleRepost(id: string) {
    return fetchJson<{ success: boolean; isReposted: boolean; repostsCount: number }>(`/api/posts/${id}/repost`, {
      method: 'POST',
    });
  },

  async togglePinPost(id: string) {
    return fetchJson<{ success: boolean; isPinned: boolean }>(`/api/posts/${id}/pin`, {
      method: 'POST',
    });
  },

  async reportPost(id: string, reason: string) {
    return fetchJson<{ success: boolean; message: string }>(`/api/posts/${id}/report`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  // Comments
  async getComments(postId: string) {
    return fetchJson<{ comments: any[] }>(`/api/posts/${postId}/comments`);
  },

  async addComment(postId: string, content: string) {
    return fetchJson<{ success: boolean; comment: any }>(`/api/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  // Stories
  async getStories() {
    return fetchJson<{ stories: Story[] }>('/api/stories');
  },

  async createStory(data: { mediaUrl: string; mediaType: 'image' | 'video'; caption?: string }) {
    return fetchJson<{ success: boolean; story: Story }>('/api/stories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async markStoryViewed(storyId: string) {
    return fetchJson<{ success: boolean }>(`/api/stories/${storyId}/view`, { method: 'POST' });
  },

  // Messages
  async getConversations() {
    return fetchJson<{ conversations: Conversation[] }>('/api/conversations');
  },

  async getMessages(conversationId: string) {
    return fetchJson<{ messages: Message[] }>(`/api/conversations/${conversationId}/messages`);
  },

  async sendMessage(conversationId: string, content: string, mediaUrl?: string) {
    return fetchJson<{ success: boolean; message: Message }>(`/api/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content, mediaUrl }),
    });
  },

  // Notifications
  async getNotifications() {
    return fetchJson<{ notifications: Notification[] }>('/api/notifications');
  },

  async markNotificationsRead() {
    return fetchJson<{ success: boolean }>('/api/notifications/mark-read', { method: 'POST' });
  },

  // Search & Explore
  async search(query: string) {
    return fetchJson<{ users: User[]; posts: Post[]; hashtags: string[] }>(
      `/api/search?q=${encodeURIComponent(query)}`
    );
  },

  async getExplore() {
    return fetchJson<{
      trendingPosts: Post[];
      trendingUsers: User[];
      categories: string[];
      hashtags: { name: string; postsCount: string }[];
    }>('/api/explore');
  },

  // AI Assistance
  async generateAiCaption(prompt?: string, topic?: string, tone?: string) {
    return fetchJson<{ caption: string }>('/api/ai/caption', {
      method: 'POST',
      body: JSON.stringify({ prompt, topic, tone }),
    });
  },

  async suggestHashtags(caption: string) {
    return fetchJson<{ hashtags: string[] }>('/api/ai/hashtags', {
      method: 'POST',
      body: JSON.stringify({ caption }),
    });
  },

  async rewriteCaption(text: string) {
    return fetchJson<{ rewrittenText: string }>('/api/ai/rewrite', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  // Admin
  async getAdminStats() {
    return fetchJson<{
      totalUsers: number;
      totalPosts: number;
      totalReports: number;
      pendingReports: number;
      activeToday: number;
      creatorCredit: any;
    }>('/api/admin/stats');
  },

  async getAdminReports() {
    return fetchJson<{ reports: Report[] }>('/api/admin/reports');
  },

  async getReports() {
    return fetchJson<{ reports: Report[] }>('/api/admin/reports');
  },

  async resolveReport(reportId: string, status: string) {
    return fetchJson<{ success: boolean }>(`/api/admin/reports/${reportId}/action`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  },
};
