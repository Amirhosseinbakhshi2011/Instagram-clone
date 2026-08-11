import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  CURRENT_USER,
  INITIAL_USERS,
  INITIAL_POSTS,
  INITIAL_STORIES,
  INITIAL_CONVERSATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REPORTS,
} from './src/data/initialData.js';
import { User, Post, Story, Conversation, Message, Notification, Report } from './src/types/index.js';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory data persistence stores
let currentUser: User = { ...CURRENT_USER };
let usersStore: User[] = [...INITIAL_USERS];
let postsStore: Post[] = [...INITIAL_POSTS];
let storiesStore: Story[] = [...INITIAL_STORIES];
let conversationsStore: Conversation[] = [...INITIAL_CONVERSATIONS];
let notificationsStore: Notification[] = [...INITIAL_NOTIFICATIONS];
let reportsStore: Report[] = [...INITIAL_REPORTS];

// Initialize Gemini AI Client on Server Side
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ==========================================
// API ROUTES
// ==========================================

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', app: 'Amira', version: '2.0.0', creator: 'Amirhossein Bakhshi' });
});

// Authentication Routes
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = usersStore.find((u) => u.email.toLowerCase() === (email || '').toLowerCase()) || currentUser;
  currentUser = { ...user };
  res.json({ success: true, user: currentUser, token: 'amira_token_session_jwt' });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { username, displayName, email } = req.body;
  const newUser: User = {
    id: `user_${Date.now()}`,
    username: username || `user_${Math.floor(Math.random() * 10000)}`,
    displayName: displayName || 'Amira Creator',
    email: email || 'creator@amira.app',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    bio: 'Joined Amira ✦ Next Generation Social Platform',
    isVerified: false,
    isPrivate: false,
    role: 'USER',
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
    createdAt: new Date().toISOString(),
  };
  usersStore.unshift(newUser);
  currentUser = { ...newUser };
  res.json({ success: true, user: currentUser, token: 'amira_token_session_jwt' });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  res.json({ user: currentUser });
});

app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Reset link sent to email if account exists.' });
});

app.post('/api/auth/reset-password', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Password updated successfully.' });
});

// User Profiles
app.get('/api/users', (req: Request, res: Response) => {
  const query = ((req.query.q as string) || '').toLowerCase();
  const filtered = usersStore.filter(
    (u) => u.username.toLowerCase().includes(query) || u.displayName.toLowerCase().includes(query)
  );
  res.json({ users: filtered });
});

app.get('/api/users/:username', (req: Request, res: Response) => {
  const user = usersStore.find((u) => u.username.toLowerCase() === req.params.username.toLowerCase());
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  const userPosts = postsStore.filter((p) => p.authorId === user.id);
  res.json({ user, posts: userPosts });
});

app.patch('/api/users/:id', (req: Request, res: Response) => {
  const { displayName, bio, website, location, avatarUrl, coverUrl, isPrivate } = req.body;
  const index = usersStore.findIndex((u) => u.id === req.params.id);
  if (index !== -1) {
    usersStore[index] = {
      ...usersStore[index],
      ...(displayName && { displayName }),
      ...(bio !== undefined && { bio }),
      ...(website !== undefined && { website }),
      ...(location !== undefined && { location }),
      ...(avatarUrl && { avatarUrl }),
      ...(coverUrl && { coverUrl }),
      ...(isPrivate !== undefined && { isPrivate }),
    };
    if (currentUser.id === req.params.id) {
      currentUser = { ...usersStore[index] };
    }
    res.json({ success: true, user: usersStore[index] });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.post('/api/users/:username/follow', (req: Request, res: Response) => {
  const user = usersStore.find((u) => u.username.toLowerCase() === req.params.username.toLowerCase());
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  user.isFollowing = !user.isFollowing;
  user.followersCount += user.isFollowing ? 1 : -1;
  res.json({ success: true, isFollowing: user.isFollowing, followersCount: user.followersCount });
});

app.post('/api/users/:username/block', (req: Request, res: Response) => {
  const user = usersStore.find((u) => u.username.toLowerCase() === req.params.username.toLowerCase());
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  user.isBlocked = !user.isBlocked;
  res.json({ success: true, isBlocked: user.isBlocked });
});

app.post('/api/users/:username/mute', (req: Request, res: Response) => {
  const user = usersStore.find((u) => u.username.toLowerCase() === req.params.username.toLowerCase());
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  user.isMuted = !user.isMuted;
  res.json({ success: true, isMuted: user.isMuted });
});

// Posts
app.get('/api/posts', (req: Request, res: Response) => {
  const feedType = (req.query.feed as string) || 'all';
  let feedPosts = [...postsStore];
  if (feedType === 'following') {
    feedPosts = feedPosts.filter((p) => p.author.isFollowing || p.authorId === currentUser.id);
  } else if (feedType === 'trending') {
    feedPosts.sort((a, b) => b.likesCount + b.commentsCount * 2 - (a.likesCount + a.commentsCount * 2));
  }
  res.json({ posts: feedPosts });
});

app.post('/api/posts', (req: Request, res: Response) => {
  const { caption, media, location, hashtags, mentions } = req.body;
  const newPost: Post = {
    id: `post_${Date.now()}`,
    authorId: currentUser.id,
    author: currentUser,
    media: media && media.length > 0 ? media : [
      {
        id: `m_${Date.now()}`,
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
        type: 'image',
      }
    ],
    caption: caption || '',
    location: location || '',
    hashtags: hashtags || [],
    mentions: mentions || [],
    likesCount: 0,
    commentsCount: 0,
    savesCount: 0,
    repostsCount: 0,
    isLiked: false,
    isSaved: false,
    isReposted: false,
    createdAt: new Date().toISOString(),
  };
  postsStore.unshift(newPost);
  currentUser.postsCount += 1;
  res.json({ success: true, post: newPost });
});

app.get('/api/posts/:id', (req: Request, res: Response) => {
  const post = postsStore.find((p) => p.id === req.params.id);
  if (!post) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }
  res.json({ post });
});

app.delete('/api/posts/:id', (req: Request, res: Response) => {
  postsStore = postsStore.filter((p) => p.id !== req.params.id);
  res.json({ success: true, message: 'Post deleted' });
});

app.post('/api/posts/:id/like', (req: Request, res: Response) => {
  const post = postsStore.find((p) => p.id === req.params.id);
  if (!post) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }
  post.isLiked = !post.isLiked;
  post.likesCount += post.isLiked ? 1 : -1;
  res.json({ success: true, isLiked: post.isLiked, likesCount: post.likesCount });
});

app.post('/api/posts/:id/save', (req: Request, res: Response) => {
  const post = postsStore.find((p) => p.id === req.params.id);
  if (!post) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }
  post.isSaved = !post.isSaved;
  post.savesCount += post.isSaved ? 1 : -1;
  res.json({ success: true, isSaved: post.isSaved, savesCount: post.savesCount });
});

app.post('/api/posts/:id/repost', (req: Request, res: Response) => {
  const post = postsStore.find((p) => p.id === req.params.id);
  if (!post) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }
  post.isReposted = !post.isReposted;
  post.repostsCount += post.isReposted ? 1 : -1;
  res.json({ success: true, isReposted: post.isReposted, repostsCount: post.repostsCount });
});

app.post('/api/posts/:id/pin', (req: Request, res: Response) => {
  const post = postsStore.find((p) => p.id === req.params.id);
  if (!post) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }
  post.isPinned = !post.isPinned;
  res.json({ success: true, isPinned: post.isPinned });
});

app.post('/api/posts/:id/report', (req: Request, res: Response) => {
  const { reason } = req.body;
  const post = postsStore.find((p) => p.id === req.params.id);
  const newReport: Report = {
    id: `rep_${Date.now()}`,
    reporter: currentUser,
    targetType: 'post',
    targetId: req.params.id,
    reason: reason || 'Inappropriate content',
    status: 'pending',
    createdAt: new Date().toISOString(),
    postDetails: post,
  };
  reportsStore.unshift(newReport);
  res.json({ success: true, message: 'Report submitted to moderators.' });
});

// Comments
app.get('/api/posts/:id/comments', (req: Request, res: Response) => {
  res.json({
    comments: [
      {
        id: 'c_1',
        postId: req.params.id,
        author: INITIAL_USERS[1],
        content: 'Truly inspirational design language! Loving the typography and spatial layout.',
        likesCount: 14,
        isLiked: true,
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
      {
        id: 'c_2',
        postId: req.params.id,
        author: INITIAL_USERS[2],
        content: 'Clean execution as always @amirhossein_bakhshi. The obsidian theme looks incredible on desktop.',
        likesCount: 8,
        isLiked: false,
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      },
    ],
  });
});

app.post('/api/posts/:id/comments', (req: Request, res: Response) => {
  const { content } = req.body;
  const post = postsStore.find((p) => p.id === req.params.id);
  if (post) {
    post.commentsCount += 1;
  }
  const newComment = {
    id: `c_${Date.now()}`,
    postId: req.params.id,
    author: currentUser,
    content: content || 'Awesome post!',
    likesCount: 0,
    isLiked: false,
    createdAt: new Date().toISOString(),
  };
  res.json({ success: true, comment: newComment });
});

// Stories
app.get('/api/stories', (req: Request, res: Response) => {
  res.json({ stories: storiesStore });
});

app.post('/api/stories', (req: Request, res: Response) => {
  const { mediaUrl, mediaType, caption } = req.body;
  const newStory: Story = {
    id: `story_${Date.now()}`,
    author: currentUser,
    mediaUrl: mediaUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    mediaType: mediaType || 'image',
    caption: caption || '',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    viewsCount: 1,
    hasViewed: true,
  };
  storiesStore.unshift(newStory);
  res.json({ success: true, story: newStory });
});

app.post('/api/stories/:id/view', (req: Request, res: Response) => {
  const story = storiesStore.find((s) => s.id === req.params.id);
  if (story) {
    story.hasViewed = true;
    story.viewsCount += 1;
  }
  res.json({ success: true });
});

// Messaging
app.get('/api/conversations', (req: Request, res: Response) => {
  res.json({ conversations: conversationsStore });
});

app.get('/api/conversations/:id/messages', (req: Request, res: Response) => {
  res.json({
    messages: [
      {
        id: 'm_100',
        conversationId: req.params.id,
        senderId: INITIAL_USERS[1].id,
        sender: INITIAL_USERS[1],
        content: 'Hi Amirhossein! Loving the Amira design system updates.',
        createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
      },
      {
        id: 'm_101',
        conversationId: req.params.id,
        senderId: currentUser.id,
        sender: currentUser,
        content: 'Thank you Sara! We integrated Gemini AI directly for captions & hashtag recommendations.',
        createdAt: new Date(Date.now() - 1800 * 1000).toISOString(),
      },
    ],
  });
});

app.post('/api/conversations/:id/messages', (req: Request, res: Response) => {
  const { content, mediaUrl } = req.body;
  const newMessage: Message = {
    id: `msg_${Date.now()}`,
    conversationId: req.params.id,
    senderId: currentUser.id,
    sender: currentUser,
    content: content || '',
    mediaUrl,
    createdAt: new Date().toISOString(),
  };
  
  const convIndex = conversationsStore.findIndex((c) => c.id === req.params.id);
  if (convIndex !== -1) {
    conversationsStore[convIndex].lastMessage = newMessage;
    conversationsStore[convIndex].updatedAt = newMessage.createdAt;
  }
  res.json({ success: true, message: newMessage });
});

// Notifications
app.get('/api/notifications', (req: Request, res: Response) => {
  res.json({ notifications: notificationsStore });
});

app.post('/api/notifications/mark-read', (req: Request, res: Response) => {
  notificationsStore = notificationsStore.map((n) => ({ ...n, isRead: true }));
  res.json({ success: true });
});

// Search & Explore
app.get('/api/search', (req: Request, res: Response) => {
  const query = ((req.query.q as string) || '').toLowerCase();
  const matchedUsers = usersStore.filter(
    (u) => u.username.toLowerCase().includes(query) || u.displayName.toLowerCase().includes(query)
  );
  const matchedPosts = postsStore.filter(
    (p) => p.caption.toLowerCase().includes(query) || p.hashtags.some((h) => h.toLowerCase().includes(query))
  );
  const matchedHashtags = ['AmiraExcellence', 'FutureUI', 'DesignSystems', 'MachineLearning', 'Architecture', 'Cyberpunk', 'TehranCreatives']
    .filter((h) => h.toLowerCase().includes(query));

  res.json({
    users: matchedUsers,
    posts: matchedPosts,
    hashtags: matchedHashtags,
  });
});

app.get('/api/explore', (req: Request, res: Response) => {
  res.json({
    trendingPosts: postsStore,
    trendingUsers: usersStore.slice(1, 6),
    categories: ['Art & Design', 'Artificial Intelligence', 'Architecture', 'Photography', 'Fashion', 'Technology'],
    hashtags: [
      { name: 'AmiraExcellence', postsCount: '14.2K' },
      { name: 'FutureUI', postsCount: '8.9K' },
      { name: 'DesignSystems', postsCount: '24.1K' },
      { name: 'TehranCreatives', postsCount: '6.5K' },
      { name: 'MachineLearning', postsCount: '32.0K' },
    ],
  });
});

// AI Features Powered by Gemini API Server-Side
app.post('/api/ai/caption', async (req: Request, res: Response) => {
  const { prompt, topic, tone } = req.body;
  const aiClient = getGeminiClient();

  if (!aiClient) {
    res.json({
      caption: `✨ Captivating moment captured on Amira. Exploring ${topic || 'creative horizons'} with modern aesthetics and timeless style.`,
      hashtags: ['#Amira', '#CreativeVision', '#DesignExcellence', '#Aesthetics'],
    });
    return;
  }

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `You are an AI caption assistant for a modern luxury social media app called "Amira". Generate an engaging, high-end caption based on this topic/prompt: "${prompt || topic || 'a beautiful moment'}". Tone requested: ${tone || 'luxurious & poetic'}. Keep it within 2-3 sentences and include 3 relevant hashtags.`,
    });
    const generatedText = response.text || 'Living in the quiet elegance of modern design. ✦ #Amira #ModernAesthetics';
    res.json({ caption: generatedText });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.json({
      caption: `Living in the quiet elegance of modern design and artistic expression. ✦ #Amira #CreativeVision #DesignSystems`,
    });
  }
});

app.post('/api/ai/hashtags', async (req: Request, res: Response) => {
  const { caption } = req.body;
  const aiClient = getGeminiClient();

  if (!aiClient) {
    res.json({
      hashtags: ['AmiraExcellence', 'FutureUI', 'DesignSystems', 'Aesthetics', 'TechArt'],
    });
    return;
  }

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Generate 5 trending, clean hashtags (without # symbol) for this social media caption: "${caption}". Return only comma separated tags.`,
    });
    const tags = (response.text || '')
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);
    res.json({ hashtags: tags.length > 0 ? tags : ['AmiraExcellence', 'FutureUI', 'DesignSystems'] });
  } catch (error) {
    res.json({ hashtags: ['AmiraExcellence', 'FutureUI', 'DesignSystems', 'Aesthetics'] });
  }
});

app.post('/api/ai/rewrite', async (req: Request, res: Response) => {
  const { text } = req.body;
  const aiClient = getGeminiClient();

  if (!aiClient) {
    res.json({ rewrittenText: `${text || 'Crafting elegant social experiences.'} ✦ Refined with Amira AI.` });
    return;
  }

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Rewrite this caption to make it more polished, engaging, and elegant for Amira social platform: "${text}". Keep the original meaning intact.`,
    });
    res.json({ rewrittenText: response.text || text });
  } catch (error) {
    res.json({ rewrittenText: text });
  }
});

// Admin Moderation API
app.get('/api/admin/stats', (req: Request, res: Response) => {
  res.json({
    totalUsers: usersStore.length,
    totalPosts: postsStore.length,
    totalReports: reportsStore.length,
    pendingReports: reportsStore.filter((r) => r.status === 'pending').length,
    activeToday: 1420,
    creatorCredit: {
      name: 'Amirhossein Bakhshi',
      github: 'https://github.com/Amirhosseinbakhshi2011',
      project: 'Amira Social Network',
    },
  });
});

app.get('/api/admin/reports', (req: Request, res: Response) => {
  res.json({ reports: reportsStore });
});

app.post('/api/admin/reports/:id/action', (req: Request, res: Response) => {
  const { status } = req.body;
  const reportIndex = reportsStore.findIndex((r) => r.id === req.params.id);
  if (reportIndex !== -1) {
    reportsStore[reportIndex].status = status || 'actioned';
  }
  res.json({ success: true, report: reportsStore[reportIndex] });
});

// Vite & Static file handling
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Amira] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
