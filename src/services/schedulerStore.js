/**
 * schedulerStore.js — localStorage-backed post scheduler
 */

const STORAGE_KEY = 'linkedin_scheduled_posts';

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function save(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export function getAll() {
  return load();
}

export function saveDraft(content) {
  const posts = load();
  const newPost = {
    id: Date.now().toString(),
    content,
    status: 'Draft',
    createdAt: new Date().toISOString(),
    scheduledFor: null,
  };
  posts.unshift(newPost);
  save(posts);
  return newPost;
}

export function updateStatus(id, status, scheduledFor = null) {
  const posts = load();
  const idx = posts.findIndex((p) => p.id === id);
  if (idx !== -1) {
    posts[idx].status = status;
    if (scheduledFor) posts[idx].scheduledFor = scheduledFor;
    save(posts);
  }
  return posts;
}

export function deletePost(id) {
  const posts = load().filter((p) => p.id !== id);
  save(posts);
  return posts;
}
