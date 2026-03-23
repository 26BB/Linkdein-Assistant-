import React, { useState } from 'react';

const AudienceAnalytics = () => {
  const [period, setPeriod] = useState('30d');

  const periods = [{ id: '30d', label: 'Last 30 Days' }, { id: '90d', label: '90 Days' }, { id: '1y', label: '1 Year' }];

  const companies = [
    { initial: 'G', name: 'Google', followers: 142 },
    { initial: 'M', name: 'Microsoft', followers: 98 },
    { initial: 'A', name: 'Amazon', followers: 84 },
    { initial: 'S', name: 'Salesforce', followers: 76 },
    { initial: 'M', name: 'Meta', followers: 65 },
    { initial: 'N', name: 'Netflix', followers: 43 },
  ];

  const countries = [
    { name: 'United States', pct: 42, color: 'bg-[#006499]', flag: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvEYQwh910Mkmxww8WyS6vDHhHg6yqtBRJLGpc3BVXNlPU6OR7CwIjj9swwIP3FQHLQ_sUylVAkxSXXtpupm1nOE1vt5n42GZNW5ezT3Qc75RmRB2Lcsa9gWu8oM9LIg8_8rBZfYbYue0dEhjkb_RzIR28XQ3e8-lFtLJlsI9VjNUBLt3aAPNqANdfaOChkflYlCRcnfXAJzLoYAYyPql2B4os9h8dW5sIX0QFn_NI_rZPganj5Md4g1xYvWj40CJ-uqx9BUfDBomQ' },
    { name: 'United Kingdom', pct: 18, color: 'bg-[#5f5e5e]', flag: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpClmdEaqpzm5T___yNSATOjCPWLfntwv95hERIR6XJxMh1Kf3Lbd14K_RyuKN3X5Kqnc167DMqfVGTHKgJ8MnETbQ_uCh67Bz9p1eUQl9s_EYmNq6xD5p9A-tMM_JP0pyUNwazc-49eYGZen5Np_BXxQH46jICLojwafdM_DexUzULaQQSsLEOoS1IHdSRu9KIy2pFpuZYqGn5sF5LaSvDt0S5oMRERlmXQ1k2BZpZOnVQmo7havq-c_g1uyXBPPPJDSa7EvqtcHB' },
    { name: 'Germany', pct: 12, color: 'bg-[#5f5e5e]', flag: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHmOoGZN48DZzf3iSanrJ89cNzT_IWIXvDYscJGoz3aS2gBf46HMasznd8256Mr7Yxtt2sIxi-G5tmuZY9y7vxy82mmqtzF4zt-TBM3Wk27p2yRdUjMwF0ywyyrX9M8mxdTUtSF3QL-cL5uBLBLifDsTNuKBFH1fhEWJzJhkI6Oq8Wp5DhRLcuE9AnId2H13dk1XevSpKVazee2bpn6wV2rthICWQTBMsWBO0izorsTy037Klx30cOyVMBZ4c8XjMrcwcrOIKjCTzY' },
    { name: 'Canada', pct: 9, color: 'bg-[#5f5e5e]', flag: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIT4ZctXX5ixn4pQvTYbeOjTojSZn44pQYbuH8-zKIE6tuvbSs24UbP9_78QEI3GNR5Vb_NjMFotj9ZgZgKF03vY08sTEHUuOliMO-4uJ9SZxEf8BM8MaKxAugyBruebUNv4l32DHM7hEb7wVSHvYtBcjLOy-RCJJ5TRq1mXqqEaSEqyTIV9H27fHHUbHIOU7vxCIEd3PTmVBoh0Z1b-74m3oK8L8iIzHSes3GalKzFNfNlzoq1QvoWmw0vcPy0pZU2HolrailgReE' },
  ];

  const seniority = [
    { label: 'CXO / Partner', pct: 14, color: 'bg-[#5f5e5e]' },
    { label: 'VP / Director', pct: 22, color: 'bg-[#5f5e5e]' },
    { label: 'Manager / Lead', pct: 38, color: 'bg-[#006499]' },
    { label: 'Senior Individual Contributor', pct: 18, color: 'bg-[#5f5e5e]' },
    { label: 'Entry / Junior', pct: 8, color: 'bg-[#b1b3a9]' },
  ];

  const industries = [
    { num: '01', label: 'Software Dev', dot: 'bg-[#006499]' },
    { num: '02', label: 'Marketing', dot: 'bg-[#5f5e5e]' },
    { num: '03', label: 'Finance', dot: 'bg-[#535252]' },
    { num: '04', label: 'Consulting', dot: 'bg-[#b1b3a9]' },
  ];

  return (
    <main className="pt-24 pb-12 px-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-bold text-[#5e6058] mb-2 uppercase tracking-tighter">
            <span>Analytics</span>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="text-[#31332c]">Audience Intelligence</span>
          </nav>
          <h2 className="text-4xl font-headline font-extrabold tracking-tight text-[#31332c] dark:text-white">Audience Depth</h2>
        </div>
        <div className="flex items-center gap-2 bg-[#efeee6] rounded-full p-1 self-start">
          {periods.map(p => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${period === p.id ? 'bg-white shadow-sm text-[#31332c]' : 'text-[#5e6058] hover:text-[#31332c]'}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* Main Audience Overview */}
        <div className="col-span-12 lg:col-span-8 bg-white dark:bg-white/5 rounded-xl p-8 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#5f5e5e]/5 rounded-full -mr-20 -mt-20 blur-3xl transition-all duration-700 group-hover:scale-110" />
          <div className="flex justify-between items-start mb-12 relative z-10">
            <div>
              <p className="text-sm font-bold text-[#5e6058] dark:text-[#9e9d99] mb-1">Total Network Size</p>
              <h3 className="text-6xl font-headline font-extrabold text-[#31332c] dark:text-white tracking-tighter">25,482</h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-[#006499]/10 text-[#006499] px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  +5.2%
                </span>
                <span className="text-[10px] text-[#5e6058] font-medium">vs. previous period</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-[#5e6058] mb-2">Growth Velocity</span>
              <div className="h-12 w-32 flex items-end gap-1">
                {[40, 55, 45, 70, 85, 100].map((h, i) => (
                  <div
                    key={i}
                    className={`w-full rounded-t-sm ${i < 4 ? 'bg-[#efeee6]' : i === 4 ? 'bg-[#5f5e5e]' : 'bg-[#006499]'}`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Growth Chart SVG */}
          <div className="relative h-48 w-full mt-auto">
            <svg className="w-full h-full" viewBox="0 0 1000 200">
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#006499" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#006499" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,180 Q50,170 100,160 T200,140 T300,150 T400,120 T500,100 T600,110 T700,80 T800,60 T900,70 T1000,40" fill="none" stroke="#006499" strokeLinecap="round" strokeWidth="3" />
              <path d="M0,180 Q50,170 100,160 T200,140 T300,150 T400,120 T500,100 T600,110 T700,80 T800,60 T900,70 T1000,40 L1000,200 L0,200 Z" fill="url(#chartGradient)" />
              <line stroke="#b1b3a9" strokeDasharray="4" strokeOpacity="0.1" x1="0" x2="1000" y1="50" y2="50" />
              <line stroke="#b1b3a9" strokeDasharray="4" strokeOpacity="0.1" x1="0" x2="1000" y1="100" y2="100" />
              <line stroke="#b1b3a9" strokeDasharray="4" strokeOpacity="0.1" x1="0" x2="1000" y1="150" y2="150" />
            </svg>
            <div className="flex justify-between mt-4 text-[10px] font-bold text-[#5e6058] uppercase tracking-widest opacity-50">
              {['May 01', 'May 10', 'May 20', 'Today'].map(t => <span key={t}>{t}</span>)}
            </div>
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="col-span-12 lg:col-span-4 bg-[#5f5e5e] text-white rounded-xl p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-white">auto_awesome</span>
            </div>
            <h4 className="text-2xl font-headline font-bold mb-4 leading-tight">Content Intelligence</h4>
            <p className="text-white/80 leading-relaxed text-sm">
              High concentration of <span className="text-white font-bold italic">VPs &amp; C-Suite</span> in <span className="text-white font-bold italic">Software Engineering</span>.
            </p>
            <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Recommendation</p>
              <p className="text-sm font-medium">Pivot toward strategic leadership narratives and long-range tech roadmaps. They are looking for architectural vision, not syntax.</p>
            </div>
          </div>
          <button className="mt-8 flex items-center gap-2 text-xs font-bold group">
            View AI Persona Report
            <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Demographics Section */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* Seniority Breakdown */}
        <div className="col-span-12 md:col-span-7 bg-white dark:bg-white/5 rounded-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-lg font-headline font-bold dark:text-white">Seniority Spectrum</h4>
            <span className="material-symbols-outlined text-[#5e6058]">info</span>
          </div>
          <div className="space-y-6">
            {seniority.map(({ label, pct, color }) => (
              <div key={label}>
                <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-tighter">
                  <span className="text-[#31332c]">{label}</span>
                  <span className="text-[#5e6058]">{pct}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#efeee6] rounded-full overflow-hidden">
                  <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Industries */}
        <div className="col-span-12 md:col-span-5 bg-[#f5f4ed] dark:bg-white/5 rounded-xl p-8 flex flex-col border border-white/40 dark:border-white/5">
          <h4 className="text-lg font-headline font-bold mb-8 dark:text-white">Top Industries</h4>
          <div className="flex flex-wrap gap-3">
            {industries.map(({ num, label, dot }) => (
              <div key={num} className="bg-white dark:bg-white/10 px-4 py-3 rounded-xl flex-1 min-w-[140px] flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${dot}`} />
                <div>
                  <p className="text-[10px] font-bold text-[#5e6058] uppercase tracking-widest">{num}</p>
                  <p className="text-sm font-bold text-[#31332c]">{label}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-auto pt-8">
            <p className="text-xs text-[#5e6058] leading-relaxed">
              Industry concentration has shifted <span className="font-bold text-[#31332c]">+12%</span> toward <span className="underline decoration-[#006499]/30 decoration-2 underline-offset-4">Deep Tech</span> this month.
            </p>
          </div>
        </div>
      </div>

      {/* Geographic and Company Insights */}
      <div className="grid grid-cols-12 gap-6">
        {/* Top Countries */}
        <div className="col-span-12 lg:col-span-4 bg-white dark:bg-white/5 rounded-xl p-8">
          <h4 className="text-lg font-headline font-bold mb-6 dark:text-white">Top Countries</h4>
          <div className="space-y-6">
            {countries.map(({ name, pct, color, flag }) => (
              <div key={name} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#efeee6] overflow-hidden flex-shrink-0">
                  <img src={flag} alt={`${name} flag`} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold text-[#31332c]">{name}</span>
                    <span className="text-xs font-medium text-[#5e6058]">{pct}%</span>
                  </div>
                  <div className="h-1 bg-[#efeee6] rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Follower Workplaces */}
        <div className="col-span-12 lg:col-span-8 bg-[#efeee6] dark:bg-white/5 rounded-xl p-8 relative">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-lg font-headline font-bold dark:text-white">Follower Workplaces</h4>
            <button className="text-xs font-bold text-[#5f5e5e] hover:underline">Full Export</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {companies.map(({ initial, name, followers }) => (
              <div key={name} className="bg-white dark:bg-white/10 p-4 rounded-xl flex items-center justify-between group cursor-pointer hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#fbf9f4] rounded-lg flex items-center justify-center font-headline font-bold text-[#5f5e5e]">
                    {initial}
                  </div>
                  <div>
                    <p className="text-sm font-bold dark:text-white">{name}</p>
                    <p className="text-[10px] text-[#5e6058] font-medium">{followers} Followers</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#b1b3a9] opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AudienceAnalytics;
