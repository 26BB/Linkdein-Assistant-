import React from 'react';

const NAV = [
  { id: 'dashboard',   label: 'Dashboard',   icon: 'dashboard' },
  { id: 'content',     label: 'Compose',     icon: 'auto_awesome' },
  { id: 'scheduler',   label: 'Scheduler',   icon: 'calendar_today' },
  { id: 'engagement',  label: 'Engagement',  icon: 'insights' },
  { id: 'audience',    label: 'Audience',    icon: 'groups' },
  { id: 'settings',    label: 'Settings',    icon: 'settings' },
];

const Sidebar = ({ currentPath, setCurrentPath }) => {
  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-[#f5f4ed] dark:bg-[#111110] flex flex-col py-8 px-4 z-50 border-r border-outline-variant/10 dark:border-white/5 transition-colors duration-300">
      {/* Logo */}
      <div className="mb-12 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-anthracite rounded-xl flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-300">
            <span className="material-symbols-outlined text-cream" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          </div>
          <div>
            <h1 className="font-headline font-bold text-xl text-anthracite dark:text-white leading-none">The Curator</h1>
            <p className="text-[10px] uppercase tracking-widest text-[#5e6058] font-bold mt-1">Editorial Intel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-3">
        {NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPath(item.id)}
            className={`w-full flex items-center gap-3 py-3 px-5 rounded-full font-bold transition-all duration-300 hover:translate-x-1 ${
              currentPath === item.id
                ? 'bg-white dark:bg-white/10 text-anthracite dark:text-white'
                : 'text-[#5e6058] dark:text-[#9e9d99] hover:text-anthracite dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
            }`}
            style={currentPath === item.id ? { boxShadow: '0 4px 14px 0 rgba(0,0,0,0.05)' } : {}}
          >
            <span
              className="material-symbols-outlined"
              style={currentPath === item.id ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className="font-body">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Workspace card */}
      <div
        className="mt-auto px-5 py-5 bg-white dark:bg-white/5 rounded-3xl shadow-sm border border-outline-variant/5 dark:border-white/5"
        style={{ borderRadius: '60% 40% 70% 30% / 40% 50% 50% 60%' }}
      >
        <p className="text-xs font-bold text-anthracite dark:text-white mb-2">Workspace Usage</p>
        <div className="h-1.5 w-full bg-[#f5f4ed] dark:bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-anthracite w-2/3" />
        </div>
        <p className="text-[10px] text-[#5e6058] dark:text-[#9e9d99] mt-2 font-medium">64% of data processed</p>
      </div>
    </aside>
  );
};

export default Sidebar;
