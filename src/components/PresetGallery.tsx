import React, { useState, useMemo, useEffect } from 'react';
import { AppMode, Language, PresetTemplate } from '../types';
import { PRESET_TEMPLATES } from '../data/presetData';
import {
  Sparkles,
  Flame,
  Search,
  X,
  Copy,
  Check,
  Eye,
  Wand2,
  Layers,
  HelpCircle,
  Sliders,
  Camera,
  Film,
  Info,
  CheckCircle2,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { buildComprehensiveMasterPrompt } from '../utils/promptBuilder';

interface PresetGalleryProps {
  language: Language;
  onSelectPreset: (preset: PresetTemplate) => void;
  activePresetId?: string;
  onApplyAndClose?: () => void;
  initialCategory?: 'all' | 'traditional' | 'festival' | 'fashion' | 'cinematic';
  onGeneratePrompt?: () => void;
}

const getModeBadge = (mode: AppMode) => {
  switch (mode) {
    case 'txt2img':
      return { mm: '၄ ကတ် Prompt', en: '4-Box Prompt', tag: 'PROMPT', color: 'border-cyan-500/60 text-cyan-300' };
    default:
      return { mm: 'ဖန်တီးမှု', en: 'Preset', tag: 'PROMPT', color: 'border-slate-700 text-slate-300' };
  }
};

const getNegativePrompt = (preset: PresetTemplate) => {
  if (preset.selection.photoStyle === 'cyberpunk_neon') {
    return 'daylight, bright sunshine, pastel colors, vintage film grain, blurry, deformed hands, extra fingers, cartoonish, low resolution, artifacts, distorted neon signs, bad anatomy';
  }
  if (preset.id.includes('royal') || preset.selection.garmentStyle?.includes('royal')) {
    return 'modern western clothes, t-shirt, jeans, sunglasses, plastic accessories, blurry, deformed hands, extra fingers, low quality, distorted architecture, cartoonish, bad proportions';
  }
  if (preset.id.includes('pet') || preset.selection.subject === 'pet') {
    return 'deformed paws, extra limbs, human face, bad fur texture, blurry eyes, low quality, noise, artifacts, distorted ears, bad anatomy';
  }
  return 'blurry, deformed face, distorted eyes, bad anatomy, extra fingers, mutated hands, smooth plastic skin, low resolution, oversaturated, noise, artifacts, watermark, duplicate';
};

const getAIInstructions = (preset: PresetTemplate) => {
  const ar = preset.selection.aspectRatio || '9:16';
  return {
    midjourney: `--ar ${ar} --v 6.1 --style raw --s 250`,
    flux: `Guidance Scale: 3.5 | Steps: 28-35 | Aspect Ratio: ${ar} | Sampler: Euler`,
    sdxl: `CFG Scale: 7.0 | Sampler: DPM++ 2M Karras | Steps: 30-40 | Clip Skip: 2`,
    dalle3: `Aspect: ${ar === '9:16' ? 'Vertical 9:16 (1024x1792)' : ar === '16:9' ? 'Horizontal 16:9 (1792x1024)' : 'Square 1:1 (1024x1024)'}`,
    customizationTipsMm: [
      '၁။ Model ပြောင်းလဲရန်- Box 1 (Subject) သို့သွား၍ အသက်အရွယ် သို့မဟုတ် လူမျိုး/မျက်နှာသွင်ပြင်ကို ပြင်ဆင်နိုင်သည်။',
      '၂။ ဝတ်စုံ/အဆင် ပြောင်းလဲရန်- Box 2 (Wardrobe) တွင် ပိုးထည်၊ ကတ္တီပါ သို့မဟုတ် အရောင်များကို စိတ်ကြိုက်လဲလှယ်နိုင်သည်။',
      '၃။ အလင်းနှင့် ရှုခင်း ပြောင်းလဲရန်- Box 3 (Scene) တွင် နေဝင်ဆည်းဆာ၊ ည neon သို့မဟုတ် စတူဒီယို မီးများကို ပြောင်းလဲနိုင်သည်။',
      '၄။ ကင်မရာ စတိုင်လ် ပြောင်းလဲရန်- Box 4 (Camera) တွင် 85mm Portrait သို့မဟုတ် 35mm Cinematic Wide ကို ရွေးချယ်နိုင်သည်။'
    ],
    customizationTipsEn: [
      '1. Subject & Face: Head to Box 1 to customize ethnicity, age, model type, or facial expression.',
      '2. Wardrobe & Fabrics: Head to Box 2 to swap Acheik patterns, silk longyi, modern velvet, or ethnic weaves.',
      '3. Scene & Atmosphere: Head to Box 3 to switch between golden hour sunset, festive night lights, or misty fog.',
      '4. Camera & Aesthetics: Head to Box 4 to tune camera primes (85mm portrait, 35mm wide), lighting, and 8K profiles.'
    ]
  };
};

export const PresetGallery: React.FC<PresetGalleryProps> = ({
  language,
  onSelectPreset,
  activePresetId,
  onApplyAndClose,
  initialCategory = 'all',
  onGeneratePrompt
}) => {
  const isMyanmar = language === 'my';
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'traditional' | 'festival' | 'fashion' | 'cinematic'>(initialCategory);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [copiedNegativeId, setCopiedNegativeId] = useState<string | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'prompt' | 'instructions' | 'boxes'>('prompt');

  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  // Track the currently inspected/picked template for ready-made prompt viewing
  const [inspectedPresetId, setInspectedPresetId] = useState<string | null>(
    activePresetId || PRESET_TEMPLATES[0]?.id || null
  );

  const filteredTemplates = useMemo(() => {
    let list = PRESET_TEMPLATES;

    if (activeCategory === 'traditional') {
      list = list.filter(t => t.id.includes('royal') || t.id.includes('silk') || t.id.includes('weaver') || t.id.includes('shan') || t.id.includes('kachin') || t.id.includes('chin') || t.id.includes('mon') || t.id.includes('rakhine') || t.id.includes('thanaka') || t.id.includes('pao'));
    } else if (activeCategory === 'festival') {
      list = list.filter(t => t.id.includes('thingyan') || t.id.includes('thadingyut') || t.id.includes('balloon') || t.id.includes('wedding') || t.id.includes('dance') || t.id.includes('manao'));
    } else if (activeCategory === 'fashion') {
      list = list.filter(t => t.id.includes('vogue') || t.id.includes('cyber') || t.id.includes('taikpong') || t.id.includes('retro') || t.id.includes('cafe'));
    } else if (activeCategory === 'cinematic') {
      list = list.filter(t => t.id.includes('bagan') || t.id.includes('ngapali') || t.id.includes('kalaw') || t.id.includes('popa') || t.id.includes('mingun') || t.id.includes('mandalay') || t.id.includes('hasselblad') || t.id.includes('sand'));
    }

    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(t => 
      t.titleEn.toLowerCase().includes(q) ||
      t.titleMm.toLowerCase().includes(q) ||
      (t.selection.subject && t.selection.subject.toLowerCase().includes(q)) ||
      (t.selection.location && t.selection.location.toLowerCase().includes(q)) ||
      (t.selection.event && t.selection.event.toLowerCase().includes(q))
    );
  }, [searchQuery, activeCategory]);

  const inspectedPreset = useMemo(() => {
    if (!inspectedPresetId) return null;
    return PRESET_TEMPLATES.find(p => p.id === inspectedPresetId) || null;
  }, [inspectedPresetId]);

  const inspectedPrompt = useMemo(() => {
    if (!inspectedPreset) return null;
    try {
      return buildComprehensiveMasterPrompt(inspectedPreset.selection, language);
    } catch {
      return null;
    }
  }, [inspectedPreset, language]);

  const handleCopyPrompt = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const handleCopyNegative = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNegativeId(id);
    setTimeout(() => setCopiedNegativeId(null), 2000);
  };

  const handleTemplateClick = (preset: PresetTemplate) => {
    setInspectedPresetId(preset.id);
    onSelectPreset(preset);
  };

  return (
    <div className="space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-400" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-2">
            <span>{isMyanmar ? 'အသင့်သုံး 30 Studio Presets (Box 5)' : '30 Curated Studio Templates (Box 5)'}</span>
            <span className="text-[10px] font-mono text-cyan-300 font-bold bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800/60">
              30 Templates
            </span>
          </h3>
        </div>

        {/* Quick Search in Presets */}
        <div className="relative w-full sm:w-60">
          <div className="flex items-center rounded-xl bg-black/40 border border-white/10 px-2.5 py-1.5 text-xs focus-within:border-cyan-400">
            <Search className="h-3.5 w-3.5 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isMyanmar ? 'Template ရှာရန် (ဥပမာ- ပုဂံ, သင်္ကြန်)...' : 'Search 30 templates...'}
              className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-0.5 text-slate-400 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-[11px]">
        {[
          { id: 'all', labelMm: 'အားလုံး (၃၀)', labelEn: 'All (30)' },
          { id: 'traditional', labelMm: 'ရိုးရာနန်းတွင်း/တိုင်းရင်းသား (၁၀)', labelEn: 'Royal & Ethnic (10)' },
          { id: 'festival', labelMm: 'ပွဲတော်/မင်္ဂလာဆောင် (၈)', labelEn: 'Festivals & Wedding (8)' },
          { id: 'fashion', labelMm: 'ခေတ်ပေါ်/ဆိုက်ဘာ (၆)', labelEn: 'Modern & Cyber (6)' },
          { id: 'cinematic', labelMm: 'ရုပ်ရှင်ဆန်/ရှုခင်း (၆)', labelEn: 'Cinematic & Scenery (6)' }
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer border ${
              activeCategory === cat.id
                ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300 shadow-sm'
                : 'bg-white/[0.03] border-white/08 text-slate-400 hover:text-slate-200 hover:border-white/15'
            }`}
          >
            {isMyanmar ? cat.labelMm : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Grid of 30 Templates */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-h-[320px] overflow-y-auto custom-scrollbar p-1">
        {filteredTemplates.map((preset) => {
          const isSelected = activePresetId === preset.id || inspectedPresetId === preset.id;
          const badge = getModeBadge(preset.mode);

          return (
            <div
              key={preset.id}
              role="button"
              tabIndex={0}
              onClick={() => handleTemplateClick(preset)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleTemplateClick(preset);
                }
              }}
              className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.35)] ring-1 ring-cyan-400/50 scale-[1.02] bg-slate-900/90'
                  : 'border-white/08 hover:border-cyan-400/40 bg-black/40 hover:scale-[1.01]'
              }`}
            >
              <div className="relative h-24 sm:h-28 w-full overflow-hidden bg-slate-950">
                <img
                  src={preset.previewUrl}
                  alt={preset.titleEn}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                <span className="absolute top-2 left-2 text-base drop-shadow-md">
                  {preset.emoji}
                </span>

                {/* Overlaid Mode Label Badge */}
                <div className={`absolute top-2 right-2 flex items-center gap-1 rounded-lg bg-slate-950/90 px-1.5 py-0.5 text-[9px] font-black tracking-tight border shadow-md backdrop-blur-md ${badge.color}`}>
                  <span>{isMyanmar ? badge.mm : badge.en}</span>
                </div>
              </div>

              <div className="p-2.5 space-y-1 bg-black/60 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {isMyanmar ? preset.titleMm : preset.titleEn}
                  </h4>
                  <p className="text-[10px] text-slate-400 line-clamp-1">
                    {isMyanmar ? preset.titleEn : preset.titleMm}
                  </p>
                </div>
                <div className="pt-1 flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1 text-cyan-400/90 font-mono">
                    <Eye className="h-2.5 w-2.5 text-cyan-400" />
                    <span>{isMyanmar ? 'အသေးစိတ်ကြည့်' : 'Inspect'}</span>
                  </div>
                  {isSelected && (
                    <span className="flex items-center gap-0.5 px-1 py-0.2 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-800 text-[9px]">
                      <Check className="h-2.5 w-2.5" />
                      <span>{isMyanmar ? 'ရွေးထား' : 'Active'}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🌟 DETAIL PROMPT & INSTRUCTIONS SECTION FOR PICKED TEMPLATE */}
      {inspectedPreset && inspectedPrompt && (
        <div className="rounded-2xl bg-slate-900 border border-cyan-500/40 p-4 sm:p-5 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          
          {/* Header Card: Selected Template Info & Main Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <img
                src={inspectedPreset.previewUrl}
                alt={inspectedPreset.titleEn}
                referrerPolicy="no-referrer"
                className="h-12 w-12 rounded-xl object-cover border border-cyan-400/50 shadow-md shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-lg">{inspectedPreset.emoji}</span>
                  <h4 className="text-sm sm:text-base font-black text-white">
                    {isMyanmar ? inspectedPreset.titleMm : inspectedPreset.titleEn}
                  </h4>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800/60">
                    Box 5 Detail Studio
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {isMyanmar ? 'အောက်တွင် အသေးစိတ် Detail Prompt နှင့် သုံးစွဲပုံ အညွှန်း (Instructions) ကို ကြည့်ရှုနိုင်ပါသည်' : 'Inspect detailed prompt parameters, negative prompt, and AI model usage instructions below'}
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopyPrompt(inspectedPrompt.masterPrompt, inspectedPreset.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer shadow-sm"
              >
                {copiedPromptId === inspectedPreset.id ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{isMyanmar ? 'ကူးယူပြီး' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-cyan-400" />
                    <span>{isMyanmar ? 'Copy Prompt' : 'Copy Prompt'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectPreset(inspectedPreset);
                  if (onApplyAndClose) onApplyAndClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-black font-black text-xs transition-all shadow-md cursor-pointer active:scale-95"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{isMyanmar ? '၄ ကတ် ဖြည့်ပြီး သုံးမည်' : 'Load into 4 Boxes'}</span>
              </button>

              {onGeneratePrompt && (
                <button
                  type="button"
                  onClick={() => {
                    onSelectPreset(inspectedPreset);
                    onGeneratePrompt();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black text-xs transition-all shadow-md cursor-pointer active:scale-95"
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  <span>{isMyanmar ? 'Generate Master Prompt' : 'Generate Master Prompt'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Navigation Tabs between Detail Prompt, Instructions & 4-Box Architecture */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <button
              type="button"
              onClick={() => setActiveDetailTab('prompt')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeDetailTab === 'prompt'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isMyanmar ? '၁။ Detail Prompt (အသေးစိတ် Prompt)' : '1. Detail Prompt'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDetailTab('instructions')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeDetailTab === 'instructions'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>{isMyanmar ? '၂။ Instructions (သုံးစွဲပုံ အညွှန်း)' : '2. Usage Instructions'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDetailTab('boxes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeDetailTab === 'boxes'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>{isMyanmar ? '၃။ ၄ ကတ် အခွဲများ (4-Box Breakdown)' : '3. 4-Box Architecture'}</span>
            </button>
          </div>

          {/* TAB 1: DETAIL PROMPT (Positive Prompt + Negative Prompt + Specs Grid) */}
          {activeDetailTab === 'prompt' && (
            <div className="space-y-3">
              {/* Positive Master Prompt */}
              <div className="rounded-xl bg-black/80 border border-white/10 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-cyan-400 font-mono font-bold">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                    POSITIVE MASTER PROMPT
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[10px]">
                      Ratio: <strong className="text-white">{inspectedPreset.selection.aspectRatio || '9:16'}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyPrompt(inspectedPrompt.masterPrompt, inspectedPreset.id)}
                      className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 border border-white/10 hover:border-cyan-400 text-slate-300 hover:text-white text-[10px] cursor-pointer"
                    >
                      <Copy className="h-2.5 w-2.5 text-cyan-400" />
                      <span>{copiedPromptId === inspectedPreset.id ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
                <div className="text-xs sm:text-[13px] text-slate-200 font-sans leading-relaxed max-h-36 overflow-y-auto custom-scrollbar select-text pr-1 bg-black/40 p-2.5 rounded-lg border border-white/5">
                  {inspectedPrompt.masterPrompt}
                </div>
              </div>

              {/* Negative Prompt */}
              <div className="rounded-xl bg-black/70 border border-rose-900/30 p-3 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-rose-400 font-mono font-bold">
                  <span>NEGATIVE PROMPT (ရှောင်ရှားရမည့်အရာများ)</span>
                  <button
                    type="button"
                    onClick={() => handleCopyNegative(getNegativePrompt(inspectedPreset), `neg_${inspectedPreset.id}`)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 border border-rose-900/40 hover:border-rose-400 text-slate-300 hover:text-rose-200 text-[10px] cursor-pointer"
                  >
                    <Copy className="h-2.5 w-2.5 text-rose-400" />
                    <span>{copiedNegativeId === `neg_${inspectedPreset.id}` ? 'Copied Negative!' : 'Copy Negative'}</span>
                  </button>
                </div>
                <div className="text-xs text-rose-200/90 font-mono leading-relaxed select-text bg-black/40 p-2 rounded-lg border border-white/5">
                  {getNegativePrompt(inspectedPreset)}
                </div>
              </div>

              {/* Technical Parameter Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/08">
                  <span className="text-cyan-400 font-bold block text-[10px]">RECOMMENDED RATIO</span>
                  <span className="text-white font-mono font-bold text-xs mt-0.5 block">
                    {inspectedPreset.selection.aspectRatio || '9:16'}
                  </span>
                  <span className="text-slate-400 text-[10px]">TikTok, Reels & Mobile</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/08">
                  <span className="text-cyan-400 font-bold block text-[10px]">CAMERA SPECIFICATIONS</span>
                  <span className="text-white font-medium text-xs mt-0.5 block truncate">
                    {inspectedPreset.selection.camera || 'Sony A7R V'}
                  </span>
                  <span className="text-slate-400 text-[10px]">Prime Portrait Lens</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/08">
                  <span className="text-cyan-400 font-bold block text-[10px]">LIGHTING & ATMOSPHERE</span>
                  <span className="text-white font-medium text-xs mt-0.5 block truncate">
                    {inspectedPreset.selection.timeAndLighting || 'Golden Hour Glow'}
                  </span>
                  <span className="text-slate-400 text-[10px]">Volumetric studio lighting</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/08">
                  <span className="text-cyan-400 font-bold block text-[10px]">QUALITY ENGINE PROFILE</span>
                  <span className="text-white font-medium text-xs mt-0.5 block truncate">
                    {inspectedPreset.selection.qualityProfile || '8K UHD Masterpiece'}
                  </span>
                  <span className="text-slate-400 text-[10px]">Photorealistic skin texture</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STEP-BY-STEP INSTRUCTIONS & MODEL GUIDE */}
          {activeDetailTab === 'instructions' && (
            <div className="space-y-3.5">
              {/* How to run in AI Models */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                    <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 font-mono text-[10px] border border-blue-800">
                      Midjourney
                    </span>
                    <span>Midjourney v6.1 / v6</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Paste positive prompt into Discord /imagine, and append parameter flags:
                  </p>
                  <div className="p-2 rounded bg-black border border-white/10 text-[11px] font-mono text-cyan-300 select-all">
                    {getAIInstructions(inspectedPreset).midjourney}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                    <span className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-400 font-mono text-[10px] border border-purple-800">
                      Flux.1
                    </span>
                    <span>Flux.1 (Dev / Schnell)</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Paste prompt directly into Flux.1 web or ComfyUI:
                  </p>
                  <div className="p-2 rounded bg-black border border-white/10 text-[11px] font-mono text-purple-300 select-all">
                    {getAIInstructions(inspectedPreset).flux}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono text-[10px] border border-emerald-800">
                      SDXL
                    </span>
                    <span>Stable Diffusion XL</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Put positive prompt in Positive box, and Negative prompt in Negative box:
                  </p>
                  <div className="p-2 rounded bg-black border border-white/10 text-[11px] font-mono text-emerald-300 select-all">
                    {getAIInstructions(inspectedPreset).sdxl}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                    <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 font-mono text-[10px] border border-amber-800">
                      DALL-E 3
                    </span>
                    <span>ChatGPT & Bing Creator</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Copy and paste the positive prompt directly into ChatGPT:
                  </p>
                  <div className="p-2 rounded bg-black border border-white/10 text-[11px] font-mono text-amber-300 select-all">
                    {getAIInstructions(inspectedPreset).dalle3}
                  </div>
                </div>
              </div>

              {/* Customization Tips in Myanmar and English */}
              <div className="p-3.5 rounded-xl bg-black/50 border border-cyan-500/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                  <Info className="h-4 w-4" />
                  <span>{isMyanmar ? 'စိတ်ကြိုက် ပြင်ဆင်အသုံးပြုနည်း လမ်းညွှန် (Customization Tips)' : 'Customization & Tuning Guide'}</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  {(isMyanmar
                    ? getAIInstructions(inspectedPreset).customizationTipsMm
                    : getAIInstructions(inspectedPreset).customizationTipsEn
                  ).map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 4-BOX ARCHITECTURE BREAKDOWN */}
          {activeDetailTab === 'boxes' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                {isMyanmar
                  ? 'ဤ Template သည် အောက်ပါ ပင်မ ၄ ကတ် အစိတ်အပိုင်းများဖြင့် ဖွဲ့စည်းထားပြီး "Load into 4 Boxes" ခလုတ်နှိပ်၍ ကတ်တစ်ခုချင်းစီကို အသေးစိတ် ထပ်မံ ပြင်ဆင်နိုင်ပါသည်:'
                  : 'This template is structured across the 4 foundational studio boxes. Click "Load into 4 Boxes" to import and edit each individual component:'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-black/60 border border-cyan-500/30 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
                    <span>Box 1: Subject (လူ/အရာဝတ္ထု)</span>
                    <span className="text-[10px] font-mono text-slate-400">Pillar 1</span>
                  </div>
                  <div className="text-xs text-slate-200 space-y-0.5">
                    <div><strong>Hero:</strong> {inspectedPreset.selection.subject}</div>
                    <div><strong>Ethnicity:</strong> {inspectedPreset.selection.ethnicity || 'Burmese'}</div>
                    <div><strong>Pose:</strong> {inspectedPreset.selection.poseExpression || 'Front portrait looking at camera'}</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/60 border border-amber-500/30 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                    <span>Box 2: Wardrobe & Styling (ဝတ်စုံ & ပုံစံ)</span>
                    <span className="text-[10px] font-mono text-slate-400">Pillar 2</span>
                  </div>
                  <div className="text-xs text-slate-200 space-y-0.5">
                    <div><strong>Garment:</strong> {inspectedPreset.selection.garmentStyle || 'Silk Longyi'}</div>
                    <div><strong>Fabric:</strong> {inspectedPreset.selection.garmentFabric || 'Traditional Woven Silk'}</div>
                    {inspectedPreset.selection.culturalPropsDetails && (
                      <div><strong>Props:</strong> {inspectedPreset.selection.culturalPropsDetails}</div>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/60 border border-teal-500/30 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-teal-400">
                    <span>Box 3: Scene & Environment (နောက်ခံ & ပတ်ဝန်းကျင်)</span>
                    <span className="text-[10px] font-mono text-slate-400">Pillar 3</span>
                  </div>
                  <div className="text-xs text-slate-200 space-y-0.5">
                    <div><strong>Location:</strong> {inspectedPreset.selection.location || 'Yangon, Myanmar'}</div>
                    <div><strong>Event:</strong> {inspectedPreset.selection.event || 'Thingyan / Cultural'}</div>
                    <div><strong>Lighting:</strong> {inspectedPreset.selection.timeAndLighting || 'Golden hour'}</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/60 border border-indigo-500/30 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-400">
                    <span>Box 4: Camera & Aesthetics (ကင်မရာ & အလင်းအမှောင်)</span>
                    <span className="text-[10px] font-mono text-slate-400">Pillar 4</span>
                  </div>
                  <div className="text-xs text-slate-200 space-y-0.5">
                    <div><strong>Camera:</strong> {inspectedPreset.selection.camera || 'Sony A7R V'}</div>
                    <div><strong>Photo Style:</strong> {inspectedPreset.selection.photoStyle || 'Cinematic Editorial'}</div>
                    <div><strong>Ratio:</strong> {inspectedPreset.selection.aspectRatio || '9:16'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
