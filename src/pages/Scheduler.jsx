import React, { useState, useEffect } from 'react';
import { getAll, deletePost, updateStatus } from '../services/schedulerStore';
import { isLinkedInConnected, publishPost } from '../services/linkedinApi';

const STATUS_STYLES = {
  Scheduled: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400',
  Draft: 'bg-[#f5f4ed] dark:bg-white/10 text-[#5e6058] dark:text-[#9e9d99] border border-[#b1b3a9]/20 dark:border-white/10',
  'Needs Review': 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',
  Published: 'bg-[#006499]/10 text-[#006499]',
};

const Scheduler = ({ onNavigate }) => {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('All');
  const [publishing, setPublishing] = useState({});
  const [publishResult, setPublishResult] = useState({});
  const liConnected = isLinkedInConnected();

  const handlePublish = async (post) => {
    setPublishing((p) => ({ ...p, [post.id]: true }));
    setPublishResult((p) => ({ ...p, [post.id]: null }));
    try {
      await publishPost(post.content);
      setPosts(updateStatus(post.id, 'Published'));
      setPublishResult((p) => ({ ...p, [post.id]: 'ok' }));
    } catch (err) {
      setPublishResult((p) => ({ ...p, [post.id]: err.message }));
    } finally {
      setPublishing((p) => ({ ...p, [post.id]: false }));
    }
  };

  useEffect(() => {
    setPosts(getAll());
  }, []);

  const handleDelete = (id) => setPosts(deletePost(id));
  const handleStatus = (id, status) => setPosts(updateStatus(id, status));

  const filters = ['All', 'Draft', 'Scheduled', 'Needs Review', 'Published'];
  const filtered = filter === 'All' ? posts : posts.filter((p) => p.status === filter);

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="pt-24 pb-16 px-10 w-full overflow-x-hidden">
      {/* Header */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-headline font-extrabold text-anthracite dark:text-white tracking-tight">Content Calendar</h2>
          <p className="text-[#5e6058] dark:text-[#9e9d99] font-medium mt-2">Manage and schedule your upcoming LinkedIn posts.</p>
        </div>
        <button
          onClick={() => onNavigate('content')}
          className="flex items-center gap-2 px-6 py-2.5 bg-anthracite dark:bg-white text-[#f5f4ed] dark:text-anthracite rounded-full font-headline text-sm font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          New Post
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filter === f
                ? 'bg-anthracite dark:bg-white text-[#f5f4ed] dark:text-anthracite shadow-sm'
                : 'bg-white dark:bg-white/5 text-[#5e6058] dark:text-[#9e9d99] border border-[#b1b3a9]/20 dark:border-white/10 hover:border-anthracite/40 dark:hover:border-white/30'
            }`}
          >
            {f}
            {f === 'All' && posts.length > 0 && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                filter === f ? 'bg-white/20' : 'bg-[#f5f4ed] dark:bg-white/10'
              }`}>
                {posts.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="bg-white dark:bg-white/5 rounded-[2rem] p-16 text-center border border-[#b1b3a9]/10 dark:border-white/5 shadow-sm">
          <span className="material-symbols-outlined text-5xl text-[#b1b3a9] dark:text-[#5e6058] mb-4 block">calendar_today</span>
          <h3 className="font-headline font-bold text-xl text-anthracite dark:text-white mb-2">No posts yet</h3>
          <p className="text-[#5e6058] dark:text-[#9e9d99] text-sm mb-6">
            Generate content in the Compose tab and click "Send to Scheduler".
          </p>
          <button
            onClick={() => onNavigate('content')}
            className="px-6 py-3 bg-anthracite dark:bg-white text-[#f5f4ed] dark:text-anthracite rounded-full text-sm font-bold hover:shadow-lg transition-all"
          >
            Create Your First Post
          </button>
        </div>
      )}

      {/* Posts List */}
      {filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-[#b1b3a9]/10 dark:border-white/5 hover:shadow-md dark:hover:shadow-black/20 transition-all group"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${STATUS_STYLES[post.status] || STATUS_STYLES.Draft}`}>
                      {post.status}
                    </span>
                    <span className="text-[11px] text-[#5e6058] dark:text-[#9e9d99] font-medium">{formatDate(post.createdAt)}</span>
                  </div>
                  <p className="text-sm text-anthracite dark:text-white/80 leading-relaxed line-clamp-3 font-body whitespace-pre-wrap">
                    {post.content}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  {(post.status === 'Draft' || post.status === 'Scheduled') && (
                    <div className="relative group/li">
                      <button
                        onClick={() => liConnected ? handlePublish(post) : null}
                        disabled={publishing[post.id] || !liConnected}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                          !liConnected
                            ? 'bg-[#e2e3d9] dark:bg-white/5 text-[#9e9d99] cursor-not-allowed'
                            : publishResult[post.id] === 'ok'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-[#0077B5]/10 text-[#0077B5] hover:bg-[#0077B5]/20'
                        }`}
                        title={!liConnected ? 'Connect LinkedIn in Settings first' : 'Publish to LinkedIn now'}
                      >
                        {publishing[post.id] ? (
                          <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        )}
                        {publishResult[post.id] === 'ok' ? 'Posted!' : publishing[post.id] ? 'Posting…' : 'Publish'}
                      </button>
                      {!liConnected && (
                        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-anthracite text-white text-[10px] font-medium px-2 py-1 rounded-lg opacity-0 group-hover/li:opacity-100 transition-opacity pointer-events-none z-10">
                          Connect LinkedIn in Settings
                        </div>
                      )}
                      {publishResult[post.id] && publishResult[post.id] !== 'ok' && (
                        <p className="absolute top-full mt-1 left-0 text-[10px] text-red-500 whitespace-nowrap max-w-[200px] truncate">
                          {publishResult[post.id]}
                        </p>
                      )}
                    </div>
                  )}
                  {post.status === 'Draft' && (
                    <button
                        onClick={() => handleStatus(post.id, 'Scheduled')}
                        className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        Schedule
                      </button>
                  )}
                  {post.status === 'Scheduled' && (
                    <button
                      onClick={() => handleStatus(post.id, 'Published')}
                      className="px-3 py-1.5 bg-[#006499]/10 text-[#006499] rounded-lg text-xs font-bold hover:bg-[#006499]/20 transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">publish</span>
                      Mark Published
                    </button>
                  )}
                  <button
                    onClick={() => navigator.clipboard.writeText(post.content)}
                    className="p-1.5 rounded-lg text-[#5e6058] dark:text-[#9e9d99] hover:bg-[#f5f4ed] dark:hover:bg-white/10 transition-colors"
                    title="Copy"
                  >
                    <span className="material-symbols-outlined text-base">content_copy</span>
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Delete"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Scheduler;
