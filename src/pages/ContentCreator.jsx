import React, { useState } from 'react';
import { generateLinkedInPost } from '../services/aiApi';
import { saveDraft } from '../services/schedulerStore';
import { getSelectedProvider, PROVIDERS } from '../services/aiApi';
import { publishPost, isLinkedInConnected } from '../services/linkedinApi';

const ContentCreator = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState('');
  const [selectedTone, setSelectedTone] = useState('Thought Leader');
  const [toast, setToast] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const activeProvider = PROVIDERS.find((p) => p.id === getSelectedProvider());

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const post = await generateLinkedInPost(prompt, selectedTone);
      setGeneratedPost(post);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendToScheduler = () => {
    if (!generatedPost.trim()) return;
    saveDraft(generatedPost);
    showToast('Post saved to Scheduler as a draft!');
  };

  const handlePublishToLinkedIn = async () => {
    if (!generatedPost.trim()) return;
    if (!isLinkedInConnected()) {
      showToast('Please connect LinkedIn in Settings first.', 'error');
      return;
    }
    
    setIsPublishing(true);
    try {
      await publishPost(generatedPost);
      showToast('Successfully published to LinkedIn!');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  const tones = [
    { label: 'Thought Leader', icon: 'history_edu' },
    { label: 'Educational', icon: 'lightbulb' },
    { label: 'Conversational', icon: 'sentiment_very_satisfied' },
    { label: 'Analytical', icon: 'trending_up' },
  ];

  return (
    <div className="pt-20 flex-1 flex h-[calc(100vh)] overflow-hidden relative">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[999] px-5 py-3 rounded-2xl shadow-xl font-bold text-sm flex items-center gap-2 transition-all ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
        }`}>
          <span className="material-symbols-outlined text-base">
            {toast.type === 'error' ? 'error' : 'check_circle'}
          </span>
          {toast.msg}
        </div>
      )}

      {/* Left Panel */}
      <section
        className="w-[420px] bg-[#f5f4ed] dark:bg-[#161614] h-full p-10 relative z-10 shadow-xl shadow-anthracite/5 overflow-y-auto"
        style={{ borderRadius: '0 4rem 4rem 0' }}
      >
        <div className="max-w-xs space-y-10">
          <header>
            <h2 className="font-headline text-3xl font-extrabold text-anthracite dark:text-white tracking-tight mb-2">
              Compose.
            </h2>
            <p className="text-[#5e6058] dark:text-[#9e9d99] text-sm leading-relaxed">
              Leverage editorial intelligence to craft your next viral LinkedIn narrative.
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-white/10 rounded-full border border-[#b1b3a9]/20 dark:border-white/10 text-[11px] font-bold text-[#5e6058] dark:text-[#9e9d99]">
              <span>{activeProvider?.icon}</span>
              <span className="dark:text-white">{activeProvider?.name || 'No provider'}</span>
              <span className="text-[#b1b3a9]">·</span>
              <span className="font-mono text-[10px]">{activeProvider?.model}</span>
            </div>
          </header>

          <form className="space-y-8" onSubmit={handleGenerate}>
            {/* Topic Input */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-[#5e6058] dark:text-[#9e9d99] px-1">
                Topic or Idea
              </label>
              <textarea
                className="w-full bg-white dark:bg-white/5 border border-[#b1b3a9]/10 dark:border-white/10 rounded-xl py-4 px-4 text-sm focus:ring-2 focus:ring-anthracite dark:focus:ring-white/30 focus:border-transparent transition-all outline-none resize-none text-anthracite dark:text-white placeholder-[#9e9d99]"
                placeholder="What's the narrative today? Share a raw thought, a link, or a core insight..."
                rows="5"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            {/* Tone Selection */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-[#5e6058] dark:text-[#9e9d99] px-1">
                Tone of Voice
              </label>
              <div className="grid grid-cols-2 gap-2">
                {tones.map((tone) => (
                  <button
                    key={tone.label}
                    type="button"
                    onClick={() => setSelectedTone(tone.label)}
                    className={`text-xs font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                      selectedTone === tone.label
                        ? 'bg-anthracite dark:bg-white text-white dark:text-anthracite'
                        : 'bg-[#e2e3d9] dark:bg-white/10 text-anthracite dark:text-white hover:bg-[#fbf9f4] dark:hover:bg-white/20'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">{tone.icon}</span>
                    {tone.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-[#31332c] dark:bg-white text-[#fbf9f4] dark:text-anthracite font-headline font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform shadow-lg disabled:opacity-50 disabled:hover:scale-100"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Curating Intelligence...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  <span>Generate Masterpiece</span>
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Right Panel: Live Preview */}
      <section className="flex-1 bg-[#fbf9f4] dark:bg-[#0e0e0c] p-12 overflow-y-auto min-h-[calc(100vh-5rem)]">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#006499]" />
              <h3 className="font-headline font-bold text-lg text-anthracite dark:text-white">Live Preview</h3>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigator.clipboard.writeText(generatedPost).then(() => showToast('Copied!'))}
                disabled={!generatedPost}
                className="bg-white dark:bg-white/5 text-anthracite dark:text-white border border-[#b1b3a9]/10 dark:border-white/10 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-[#e8e9e0] dark:hover:bg-white/10 transition-colors shadow-sm disabled:opacity-30"
              >
                <span className="material-symbols-outlined text-sm">content_copy</span>
                Copy
              </button>
              <button
                onClick={handleSendToScheduler}
                disabled={!generatedPost}
                className="bg-white dark:bg-white/5 text-anthracite dark:text-white border border-[#b1b3a9]/10 dark:border-white/10 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-[#e8e9e0] dark:hover:bg-white/10 transition-colors shadow-sm disabled:opacity-30"
              >
                <span className="material-symbols-outlined text-sm">calendar_add_on</span>
                Schedule
              </button>
              <button
                onClick={handlePublishToLinkedIn}
                disabled={!generatedPost || isPublishing}
                className="bg-[#0077B5] text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-[#005885] transition-colors shadow-md disabled:opacity-30"
              >
                {isPublishing ? (
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <span className="material-symbols-outlined text-sm">send</span>
                )}
                {isPublishing ? 'Publishing...' : 'Publish to LinkedIn'}
              </button>
            </div>
          </div>

          {/* Editorial Preview Card */}
          <div className="bg-white dark:bg-white/5 rounded-[2rem] p-12 shadow-2xl shadow-anthracite/5 border border-[#b1b3a9]/5 dark:border-white/5 min-h-[600px] relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#5f5e5e]/5 rounded-full blur-3xl group-hover:bg-[#5f5e5e]/10 transition-colors duration-700" />

            <article className="relative z-10 space-y-8">
              <div className="flex items-center gap-4 mb-12">
                <img
                  className="w-12 h-12 rounded-full grayscale"
                  alt="User professional portrait"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDM1f6jqRDKgvTlYWAY6HTdofvBD8sFBHJwv0lTLO7V02FXk1VhC7suW5YhHrhA4X1fsLuvJALqTGT97XQ9XnszKl82kN4L8kH-R1pUfeA5Q8jqf5Dt0UunpyCRuPflqCouWimQAsTP3v4zp_9ZeAu5m9o_fHfok-c_6trBULONNJsejlm8JyxV9HZsIR86FISetOtnhK6g-x2QiO282w7wd4zSRiQkfLHza7y2N7FaUjYu0putfvAfadh5Uf7Cb4YaJBICWmRBYfX_"
                />
                <div>
                  <p className="font-headline font-extrabold text-anthracite dark:text-white">Alex Chen</p>
                  <p className="text-xs text-[#5e6058] dark:text-[#9e9d99]">Editorial Director at The Curator • 1m ago</p>
                </div>
              </div>

              <div className="space-y-6">
                {generatedPost ? (
                  <div className="space-y-4 text-anthracite/90 dark:text-white/90 leading-relaxed font-body text-lg whitespace-pre-wrap">
                    {generatedPost}
                  </div>
                ) : (
                  <>
                    <h4 className="font-headline text-4xl font-black text-anthracite dark:text-white leading-[1.1] tracking-tight">
                      The "Algorithm-First" Era is Dead. Long Live the Human Editor.
                    </h4>
                    <div className="space-y-4 text-anthracite/80 dark:text-white/70 leading-relaxed font-body text-lg">
                      <p>LinkedIn isn't a billboard. It's a dinner party. And at a dinner party, the loudest person in the room is rarely the most interesting.</p>
                      <p>I've spent the last 6 months analyzing over 2,500 "viral" posts, and the data is clear: engagement is shifting from <strong>REACH</strong> to <strong>RESONANCE</strong>.</p>
                      <ul className="space-y-2 pl-4 border-l-2 border-[#5f5e5e]/20 italic">
                        <li>Resonance requires vulnerability.</li>
                        <li>Resonance requires a specific point of view.</li>
                        <li>Resonance requires the editorial courage to be wrong.</li>
                      </ul>
                    </div>
                  </>
                )}

                <div className="pt-6 flex flex-wrap gap-2">
                  {['#EditorialStrategy', '#ContentMarketing', '#LinkedInGrowth'].map(tag => (
                    <span key={tag} className="text-[#006499] font-bold text-sm">{tag}</span>
                  ))}
                </div>
              </div>
            </article>

            <div className="mt-12 pt-8 border-t border-[#b1b3a9]/10 dark:border-white/10 flex items-center justify-between text-[#5e6058] dark:text-[#9e9d99]">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-1.5 text-xs font-bold"><span className="material-symbols-outlined text-sm">thumb_up</span> 142</span>
                <span className="flex items-center gap-1.5 text-xs font-bold"><span className="material-symbols-outlined text-sm">chat_bubble</span> 24</span>
                <span className="flex items-center gap-1.5 text-xs font-bold"><span className="material-symbols-outlined text-sm">share</span> 12</span>
              </div>
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-50">AI Content Creator v3.0</span>
            </div>
          </div>

          {/* Post Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-1 bg-[#f5f4ed] dark:bg-white/5 p-6 rounded-3xl">
              <p className="text-[10px] font-bold text-[#5e6058] dark:text-[#9e9d99] uppercase tracking-widest mb-1">Estimated Read</p>
              <h5 className="font-headline font-extrabold text-2xl text-anthracite dark:text-white">
                {generatedPost ? `${Math.max(1, Math.ceil(generatedPost.length / 800))}m 45s` : '2m 45s'}
              </h5>
            </div>
            <div className="col-span-2 bg-white dark:bg-white/5 p-6 rounded-3xl flex justify-between items-center border border-[#b1b3a9]/5 dark:border-white/5">
              <div>
                <p className="text-[10px] font-bold text-[#5e6058] dark:text-[#9e9d99] uppercase tracking-widest mb-1">Tone Analysis</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#5f5e5e] dark:bg-white" />
                    <span className="text-xs font-bold text-anthracite dark:text-white">85% {selectedTone.split(' ')[0]}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#006499]" />
                    <span className="text-xs font-bold text-anthracite dark:text-white">15% Engaging</span>
                  </div>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#5f5e5e]/20 dark:text-white/10 text-4xl">analytics</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContentCreator;
