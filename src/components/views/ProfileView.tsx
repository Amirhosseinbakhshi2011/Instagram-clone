import React, { useState, useEffect } from 'react';
import {
  Grid,
  Bookmark,
  Repeat2,
  Tag,
  Pin,
  MapPin,
  Link as LinkIcon,
  Calendar,
  Edit3,
  UserCheck,
  UserPlus,
  ShieldAlert,
  VolumeX,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { User, Post } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

export const ProfileView: React.FC = () => {
  const { selectedUsername, addToast, setActiveMediaUrl } = useApp();
  const { user: authUser, updateUser } = useAuth();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'reposts' | 'pinned'>('posts');
  const [isLoading, setIsLoading] = useState(true);

  // Edit Profile Modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editWebsite, setEditWebsite] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const [editCoverUrl, setEditCoverUrl] = useState('');

  const targetUsername = selectedUsername || authUser?.username;
  const isSelf = authUser?.username === targetUsername;

  useEffect(() => {
    if (!targetUsername) return;
    async function loadProfile() {
      setIsLoading(true);
      try {
        const res = await api.getUserByUsername(targetUsername!);
        setProfileUser(res.user);
        setUserPosts(res.posts);

        if (res.user) {
          setEditDisplayName(res.user.displayName);
          setEditBio(res.user.bio || '');
          setEditWebsite(res.user.website || '');
          setEditLocation(res.user.location || '');
          setEditAvatarUrl(res.user.avatarUrl);
          setEditCoverUrl(res.user.coverUrl || '');
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, [targetUsername]);

  if (isLoading || !profileUser) {
    return <div className="text-center py-24 text-slate-400 text-sm">Loading profile...</div>;
  }

  const handleToggleFollow = async () => {
    try {
      const res = await api.toggleFollow(profileUser.username);
      setProfileUser((prev) =>
        prev
          ? {
              ...prev,
              isFollowing: res.isFollowing,
              followersCount: res.followersCount,
            }
          : null
      );
      addToast(res.isFollowing ? `Now following @${profileUser.username}` : `Unfollowed @${profileUser.username}`);
    } catch (err) {
      addToast('Follow toggle error', 'error');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser({
      displayName: editDisplayName,
      bio: editBio,
      website: editWebsite,
      location: editLocation,
      avatarUrl: editAvatarUrl,
      coverUrl: editCoverUrl,
    });
    setProfileUser((prev) =>
      prev
        ? {
            ...prev,
            displayName: editDisplayName,
            bio: editBio,
            website: editWebsite,
            location: editLocation,
            avatarUrl: editAvatarUrl,
            coverUrl: editCoverUrl,
          }
        : null
    );
    setIsEditOpen(false);
    addToast('Profile updated!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Cover Header */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md">
        <div className="h-44 sm:h-56 w-full relative bg-gradient-to-r from-amber-950 via-slate-900 to-amber-900">
          <img
            src={
              profileUser.coverUrl ||
              'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1600'
            }
            alt="Cover"
            className="w-full h-full object-cover opacity-80"
          />
        </div>

        {/* Profile Details Container */}
        <div className="p-6 relative bg-white dark:bg-slate-900 pt-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            <Avatar
              src={profileUser.avatarUrl}
              size="xl"
              isVerified={profileUser.isVerified}
              className="ring-4 ring-white dark:ring-slate-900 rounded-full"
            />

            {/* Action Buttons */}
            <div className="flex items-center gap-2 self-end">
              {isSelf ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)}>
                  <Edit3 className="w-4 h-4 mr-1.5" />
                  <span>Edit Profile</span>
                </Button>
              ) : (
                <>
                  <Button
                    variant={profileUser.isFollowing ? 'secondary' : 'gold'}
                    size="sm"
                    onClick={handleToggleFollow}
                  >
                    {profileUser.isFollowing ? (
                      <>
                        <UserCheck className="w-4 h-4 mr-1.5" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-1.5" />
                        <span>Follow</span>
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* User Bio Information */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 dark:text-white">
                  {profileUser.displayName}
                </h1>
                {profileUser.role === 'ADMIN' && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 text-[10px] font-bold uppercase">
                    CREATOR / ADMIN
                  </span>
                )}
              </div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                @{profileUser.username}
              </span>
            </div>

            {profileUser.bio && (
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line max-w-2xl">
                {profileUser.bio}
              </p>
            )}

            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
              {profileUser.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>{profileUser.location}</span>
                </div>
              )}
              {profileUser.website && (
                <a
                  href={profileUser.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-amber-500 hover:underline"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>{profileUser.website.replace(/^https?:\/\//, '')}</span>
                </a>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Joined {new Date(profileUser.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Counter Stats */}
            <div className="flex items-center gap-6 pt-2 text-xs">
              <div>
                <span className="font-bold text-slate-900 dark:text-white mr-1">
                  {profileUser.postsCount}
                </span>
                <span className="text-slate-500 dark:text-slate-400">Posts</span>
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white mr-1">
                  {profileUser.followersCount.toLocaleString()}
                </span>
                <span className="text-slate-500 dark:text-slate-400">Followers</span>
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white mr-1">
                  {profileUser.followingCount}
                </span>
                <span className="text-slate-500 dark:text-slate-400">Following</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-6 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 py-3 border-b-2 transition-colors ${
            activeTab === 'posts'
              ? 'border-amber-500 text-amber-500'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Posts</span>
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-2 py-3 border-b-2 transition-colors ${
            activeTab === 'saved'
              ? 'border-amber-500 text-amber-500'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved</span>
        </button>
        <button
          onClick={() => setActiveTab('pinned')}
          className={`flex items-center gap-2 py-3 border-b-2 transition-colors ${
            activeTab === 'pinned'
              ? 'border-amber-500 text-amber-500'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Pin className="w-4 h-4" />
          <span>Pinned</span>
        </button>
      </div>

      {/* Post Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {userPosts.map((post) => (
          <div
            key={post.id}
            onClick={() => setActiveMediaUrl(post.media[0]?.url)}
            className="aspect-square rounded-2xl overflow-hidden bg-slate-950 cursor-pointer group relative border border-slate-200/60 dark:border-slate-800/60"
          >
            <img
              src={post.media[0]?.url}
              alt="Post thumbnail"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Profile">
        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={editDisplayName}
              onChange={(e) => setEditDisplayName(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Bio
            </label>
            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              rows={3}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Location
            </label>
            <input
              type="text"
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Website Link
            </label>
            <input
              type="text"
              value={editWebsite}
              onChange={(e) => setEditWebsite(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Avatar Image URL
            </label>
            <input
              type="text"
              value={editAvatarUrl}
              onChange={(e) => setEditAvatarUrl(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
