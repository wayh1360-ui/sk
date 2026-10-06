import React, { useState, useMemo } from 'react';
import { MatrixSelection, Language, AppMode } from '../types';
import {
  X,
  Terminal,
  Copy,
  Check,
  Sparkles,
  Wand2,
  RefreshCw,
  Sliders,
  ChevronRight,
  ArrowRight,
  User,
  Image as ImageIcon,
  Shirt,
  MapPin,
  Layers,
  Upload
} from 'lucide-react';

export type SlashCommandType = '/Character' | '/Background' | '/Clothes' | '/Reference' | '/Preset';

interface SlashCommandStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  selection: MatrixSelection;
  onUpdateSelection: (updates: Partial<MatrixSelection>) => void;
  onGeneratePrompt: () => void;
  isGeneratingPrompt?: boolean;
}

export const SlashCommandStudioModal: React.FC<SlashCommandStudioModalProps> = ({
  isOpen,
  onClose,
  language,
  selection,
  onUpdateSelection,
  onGeneratePrompt,
  isGeneratingPrompt
}) => {
  const isMyanmar = language === 'my';
  const [activeCommand, setActiveCommand] = useState<SlashCommandType>('/Character');

  // Slash Command State Model
  const [characterStyle, setCharacterStyle] = useState<string>('Photorealistic Human');
  const [charExpression, setCharExpression] = useState<string>('Gentle Confident Smile');
  const [charPose, setCharPose] = useState<string>('Standing Heroic Pose looking at camera');
  const [charAge, setCharAge] = useState<string>('Young Adult (early 20s)');
  const [charEthnicity, setCharEthnicity] = useState<string>('Burmese / Southeast Asian');
  const [charArtStyle, setCharArtStyle] = useState<string>('Masterpiece Photorealistic Portrait');

  const [bgPreset, setBgPreset] = useState<string>('Cyberpunk Neon City');
  const [bgLighting, setBgLighting] = useState<string>('Cinematic Volumetric Rim Light');
  const [bgTimeOfDay, setBgTimeOfDay] = useState<string>('Night / Neon Midnight');
  const [bgWeather, setBgWeather] = useState<string>('Rain Reflections on Wet Asphalt');

  const [clothesPreset, setClothesPreset] = useState<string>('Traditional Cultural Attire');
  const [clothesFabric, setClothesFabric] = useState<string>('Woven Silk with Gold Thread Motifs');
  const [clothesPalette, setClothesPalette] = useState<string>('Royal Cyan and Gold accents');
  const [clothesAccessories, setClothesAccessories] = useState<string>('Ornate Heritage Jewelry');

  const [refType, setRefType] = useState<string>('Face / Character Sheet Consistency Reference');
  const [refDetails, setRefDetails] = useState<string>('100% facial likeness preservation from user photo');

  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Command Definitions & Presets
  const COMMANDS = [
    {
      id: '/Character' as SlashCommandType,
      label: '/Character',
      labelMm: '/ဇာတ်ကောင်',
      icon: User,
      descEn: 'Select & customize character style, expression & ethnicity',
      descMm: 'ဇာတ်ကောင်၊ အသက်၊ ပိုစ့်နှင့် ရုပ်သွင် စိတ်ကြိုက်ရွေးချယ်ရန်'
    },
    {
      id: '/Background' as SlashCommandType,
      label: '/Background',
      labelMm: '/နောက်ခံ',
      icon: MapPin,
      descEn: 'Set environment, lighting, weather & atmosphere',
      descMm: 'ပတ်ဝန်းကျင်၊ အလင်းနှင့် ရာသီဥတု သတ်မှတ်ရန်'
    },
    {
      id: '/Clothes' as SlashCommandType,
      label: '/Clothes',
      labelMm: '/ဝတ်စုံ',
      icon: Shirt,
      descEn: 'Choose outfit styles, fabrics, palette & accessories',
      descMm: 'ဝတ်စုံ၊ အထည်အဆင်၊ အရောင်နှင့် အသုံးအဆောင်များ'
    },
    {
      id: '/Reference' as SlashCommandType,
      label: '/Reference',
      labelMm: '/ရည်ညွှန်းချက်',
      icon: ImageIcon,
      descEn: 'Attach pose, style, palette & facial consistency',
      descMm: 'မျက်နှာ၊ ပိုစ့်၊ စတိုင် ရည်ညွှန်းဓာတ်ပုံ/လင့်ခ်များ'
    },
    {
      id: '/Preset' as SlashCommandType,
      label: '/Preset',
      labelMm: '/အသင့်သုံးစုံတွဲ',
      icon: Layers,
      descEn: 'Quick-load full master combinations across all parameters',
      descMm: 'အသင့်သုံး အထူးဖန်တီးချက်များ တစ်ခါတည်းရွေးရန်'
    }
  ];

  // Full Preset Recipes (/Preset)
  const PRESET_RECIPES = [
    {
      titleEn: 'Cinematic Portrait',
      titleMm: 'စီနီမက်တစ် ရုပ်ရှင်ဆန်သော ပုံတူ',
      desc: 'Photorealistic Human + Royal Silk Attire + Golden Hour Temple + 85mm f/1.2 Bokeh',
      apply: () => {
        setCharacterStyle('Photorealistic Human');
        setCharExpression('Gentle Royal Smile');
        setCharPose('Standing Graceful Eye-Level');
        setCharAge('Young Adult (22 years old)');
        setCharEthnicity('Burmese / Southeast Asian');
        setCharArtStyle('Photorealistic 8K UHD');
        setBgPreset('Historical / Vintage Setting');
        setBgLighting('Golden Hour Warm Rim Light');
        setBgTimeOfDay('Golden Hour Sunset');
        setBgWeather('Clear Warm Atmosphere');
        setClothesPreset('Traditional Cultural Attire');
        setClothesFabric('Woven Heavy Silk with Intricate Gold Thread Embroidery');
        setClothesPalette('Crimson Red and Royal Gold');
        setClothesAccessories('Gold Necklace and Matching Earplugs');
        setRefType('Face / Character Sheet Consistency Reference');
        setRefDetails('100% facial likeness, identical eyes, nose, lips');
      }
    },
    {
      titleEn: 'Anime Concept Art',
      titleMm: 'အန်နီမေး သရုပ်ဖော် စတိုင်အပြည့်',
      desc: 'Anime Manga Keyframe + High Fantasy Robes + Bioluminescent Forest + Ethereal Glow',
      apply: () => {
        setCharacterStyle('Anime / Manga Style');
        setCharExpression('Determined Ethereal Gaze');
        setCharPose('Dynamic Spellcasting Stance');
        setCharAge('Teen / Youthful Ethereal');
        setCharEthnicity('Ethereal / Fantasy');
        setCharArtStyle('Makoto Shinkai High-End Anime Keyframe');
        setBgPreset('Fantasy Forest / Nature');
        setBgLighting('Ethereal Bioluminescent Soft Glow');
        setBgTimeOfDay('Twilight Blue Hour');
        setBgWeather('Glowing Spores and Floating Petals');
        setClothesPreset('High Fantasy Armor / Robes');
        setClothesFabric('Flowing Enchanted Silk Robe with Silver Filigree');
        setClothesPalette('Starlight Silver and Azure Blue');
        setClothesAccessories('Glowing Rune Staff and Crystal Tiara');
        setRefType('Style Reference (Art style transfer)');
        setRefDetails('High-end Kyoto Animation / Ufotable art style');
      }
    },
    {
      titleEn: 'Cyberpunk Futuristic Persona',
      titleMm: 'ခေတ်လွန် ဆိုက်ဘာပန့်ခ် စတိုင်',
      desc: 'Cyberpunk Persona + Sci-Fi Mech Gear + Cyberpunk Neon City + Rain Reflections',
      apply: () => {
        setCharacterStyle('Cyberpunk / Futuristic Persona');
        setCharExpression('Intense Confident Smirk');
        setCharPose('Leaning on Neon Railing');
        setCharAge('Young Adult (25 years old)');
        setCharEthnicity('Cybernetic Asian / Biomechanical');
        setCharArtStyle('Cyberpunk Neo-Tokyo Photography');
        setBgPreset('Cyberpunk Neon City');
        setBgLighting('Dual-Tone Neon Cyan and Hot Pink Rim Light');
        setBgTimeOfDay('Neon Midnight');
        setBgWeather('Rain with Wet Reflections on Pavement');
        setClothesPreset('Sci-Fi Suit / Mech Gear');
        setClothesFabric('Weathered Carbon Fiber Jacket with Glowing Fiber-Optic Trim');
        setClothesPalette('Matte Black, Electric Cyan, Neon Magenta');
        setClothesAccessories('Holographic AR Visor and Bionic Arm');
        setRefType('Face / Character Sheet Consistency Reference');
        setRefDetails('100% face likeness with subtle glowing cybernetics');
      }
    },
    {
      titleEn: 'Photorealistic Product / Model Showcase',
      titleMm: 'ခေတ်မီ စတူဒီယို မော်ဒယ် စတိုင်',
      desc: 'Photorealistic Human + Streetwear Casual + Modern Minimalist Studio + Softbox Light',
      apply: () => {
        setCharacterStyle('Photorealistic Human');
        setCharExpression('High-Fashion Editorial Neutral Look');
        setCharPose('Candid High-Fashion Walking Stance');
        setCharAge('Young Adult (24 years old)');
        setCharEthnicity('Modern International / Asian');
        setCharArtStyle('Vogue Studio Editorial Photography');
        setBgPreset('Modern Minimalist Studio');
        setBgLighting('Soft Diffused Studio High-Key Lighting');
        setBgTimeOfDay('Daylight Studio');
        setBgWeather('Controlled Studio Air');
        setClothesPreset('Streetwear / Modern Casual');
        setClothesFabric('Oversized Heavyweight Cotton and Tailored Wool');
        setClothesPalette('Monochromatic Slate, Off-White and Beige');
        setClothesAccessories('Minimalist Silver Chain and Designer Sunglasses');
        setRefType('Pose Reference (URL/Description)');
        setRefDetails('Editorial Paris Fashion Week pose');
      }
    }
  ];

  // Dynamically Assemble the Master Prompt in the Exact Required Layout:
  // [Subject / Character Details] + [Outfit / Clothes] + [Environment / Background] + [Art Style & Lighting] + [Reference Modifiers] --ar 16:9 --v 6.0
  const masterPromptFormula = useMemo(() => {
    const subjectPart = `[${characterStyle}, ${charAge}, ${charEthnicity}, ${charExpression}, ${charPose}]`;
    const clothesPart = `[${clothesPreset}, ${clothesFabric}, color palette ${clothesPalette}, ${clothesAccessories}]`;
    const envPart = `[${bgPreset}, ${bgTimeOfDay}, ${bgWeather}]`;
    const stylePart = `[${charArtStyle}, ${bgLighting}]`;
    const refPart = `[${refType}: ${refDetails}]`;

    return `${subjectPart} + ${clothesPart} + ${envPart} + ${stylePart} + ${refPart} --ar 16:9 --v 6.0`;
  }, [
    characterStyle, charAge, charEthnicity, charExpression, charPose,
    clothesPreset, clothesFabric, clothesPalette, clothesAccessories,
    bgPreset, bgTimeOfDay, bgWeather,
    charArtStyle, bgLighting,
    refType, refDetails
  ]);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(masterPromptFormula);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleApplyToStudio = () => {
    // Map slash command selections back to MatrixSelection
    onUpdateSelection({
      customInstruction: masterPromptFormula,
      moodEmotion: charExpression,
      customPoseDetails: charPose,
      customLightingDetails: `${bgLighting} during ${bgTimeOfDay}`,
      customLocationDetails: `${bgPreset} (${bgWeather})`,
      customGarmentDescription: `${clothesPreset}, ${clothesFabric}, ${clothesPalette}, ${clothesAccessories}`,
      aspectRatio: '16:9'
    });
    onClose();
    onGeneratePrompt();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-2xl animate-fadeIn">
      <div
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-950 border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 shadow-sm">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                  <span>Slash Command System</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                    /cmd Mode
                  </span>
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                {isMyanmar
                  ? 'Slash Command များ (/Character, /Background, /Clothes, /Reference, /Preset) ဖြင့် စနစ်တကျ အဆင့်ဆင့် တည်ဆောက်ပါ'
                  : 'Build detailed, structured prompts step-by-step using interactive slash commands and recommendations'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Command Switcher Tabs */}
        <div className="px-6 py-3 border-b border-slate-800/80 bg-slate-900/30 flex items-center gap-2 overflow-x-auto custom-scrollbar">
          {COMMANDS.map((cmd) => {
            const Icon = cmd.icon;
            const isActive = activeCommand === cmd.id;
            return (
              <button
                key={cmd.id}
                type="button"
                onClick={() => setActiveCommand(cmd.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-sm'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{cmd.label}</span>
                <span className="text-[10px] opacity-75 font-normal">
                  {isMyanmar ? cmd.labelMm : ''}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Workspace Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">

          {/* =========================================================================
              COMMAND 1: /Character
          ========================================================================= */}
          {activeCommand === '/Character' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="text-cyan-400 font-mono">/Character</span>
                  <span className="text-slate-400 text-xs font-normal">
                    {isMyanmar ? 'ဇာတ်ကောင် ပုံစံနှင့် အသွင်အပြင်များ' : 'Select character style & follow-up recommendations'}
                  </span>
                </h3>
              </div>

              {/* Main Presets */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">
                  {isMyanmar ? '၁။ Character Preset ရွေးချယ်ပါ:' : '1. Choose Character Preset:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  {[
                    'Anime / Manga Style',
                    'Photorealistic Human',
                    'Fantasy / Sci-Fi Creature',
                    'Cyberpunk / Futuristic Persona',
                    '3D Render / Pixar Style'
                  ].map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setCharacterStyle(style)}
                      className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer ${
                        characterStyle === style
                          ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <span>{style}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Follow-up Recommendations upon Selection */}
              <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 space-y-3">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  <span>{isMyanmar ? 'အကြံပြုချက် ရွေးချယ်စရာများ (Follow-Up Recommendations):' : 'Recommended Sub-Features:'}</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      {isMyanmar ? 'မျက်နှာ အမူအရာ (Expression):' : 'Facial Expression:'}
                    </label>
                    <input
                      type="text"
                      value={charExpression}
                      onChange={(e) => setCharExpression(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      {isMyanmar ? 'ကိုယ်ဟန် အနေအထား (Pose):' : 'Body Pose & Stance:'}
                    </label>
                    <input
                      type="text"
                      value={charPose}
                      onChange={(e) => setCharPose(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      {isMyanmar ? 'အသက်အရွယ် (Age):' : 'Character Age:'}
                    </label>
                    <input
                      type="text"
                      value={charAge}
                      onChange={(e) => setCharAge(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      {isMyanmar ? 'လူမျိုးနွယ် / ဒေသ (Ethnicity):' : 'Ethnicity & Heritage:'}
                    </label>
                    <input
                      type="text"
                      value={charEthnicity}
                      onChange={(e) => setCharEthnicity(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              COMMAND 2: /Background
          ========================================================================= */}
          {activeCommand === '/Background' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="text-cyan-400 font-mono">/Background</span>
                  <span className="text-slate-400 text-xs font-normal">
                    {isMyanmar ? 'ပတ်ဝန်းကျင်နှင့် နောက်ခံ အလင်းများ' : 'Set environment, lighting and visual atmosphere'}
                  </span>
                </h3>
              </div>

              {/* Presets */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">
                  {isMyanmar ? '၁။ Background Preset ရွေးချယ်ပါ:' : '1. Choose Background Environment:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    'Cyberpunk Neon City',
                    'Fantasy Forest / Nature',
                    'Modern Minimalist Studio',
                    'Sci-Fi Spaceship Interior',
                    'Historical / Vintage Setting',
                    'Abstract / Solid Color Gradient'
                  ].map((bg) => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setBgPreset(bg)}
                      className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer ${
                        bgPreset === bg
                          ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <span>{bg}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub-features: Lighting, Time, Weather */}
              <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 space-y-3">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  <span>{isMyanmar ? 'အလင်းနှင့် ရာသီဥတု သတ်မှတ်ချက်များ (Atmospheric Sub-features):' : 'Atmospheric Sub-features:'}</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      {isMyanmar ? 'အလင်းအမှောင် (Lighting):' : 'Lighting Style:'}
                    </label>
                    <input
                      type="text"
                      value={bgLighting}
                      onChange={(e) => setBgLighting(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      {isMyanmar ? 'အချိန် (Time of Day):' : 'Time of Day:'}
                    </label>
                    <input
                      type="text"
                      value={bgTimeOfDay}
                      onChange={(e) => setBgTimeOfDay(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      {isMyanmar ? 'ရာသီဥတု (Weather):' : 'Weather Condition:'}
                    </label>
                    <input
                      type="text"
                      value={bgWeather}
                      onChange={(e) => setBgWeather(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              COMMAND 3: /Clothes
          ========================================================================= */}
          {activeCommand === '/Clothes' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="text-cyan-400 font-mono">/Clothes</span>
                  <span className="text-slate-400 text-xs font-normal">
                    {isMyanmar ? 'ဝတ်စုံနှင့် အထည်အဆင် ဒီဇိုင်းများ' : 'Choose outfit style, fabric, palette & accessories'}
                  </span>
                </h3>
              </div>

              {/* Presets */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">
                  {isMyanmar ? '၁။ Outfit Style ရွေးချယ်ပါ:' : '1. Choose Outfit Preset:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    'Streetwear / Modern Casual',
                    'High Fantasy Armor / Robes',
                    'Sci-Fi Suit / Mech Gear',
                    'Formal Wear / Tuxedo & Gown',
                    'Vintage / Historical Costume',
                    'Traditional Cultural Attire'
                  ].map((cl) => (
                    <button
                      key={cl}
                      type="button"
                      onClick={() => setClothesPreset(cl)}
                      className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer ${
                        clothesPreset === cl
                          ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <span>{cl}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub-features: Fabric, Palette, Accessories */}
              <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 space-y-3">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  <span>{isMyanmar ? 'အထည်နှင့် အသုံးအဆောင် အသေးစိတ် (Garment Sub-features):' : 'Garment Sub-features:'}</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      {isMyanmar ? 'အထည်အသား (Fabric Texture):' : 'Fabric Texture:'}
                    </label>
                    <input
                      type="text"
                      value={clothesFabric}
                      onChange={(e) => setClothesFabric(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      {isMyanmar ? 'အရောင် (Color Palette):' : 'Color Palette:'}
                    </label>
                    <input
                      type="text"
                      value={clothesPalette}
                      onChange={(e) => setClothesPalette(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      {isMyanmar ? 'အသုံးအဆောင် (Accessories):' : 'Accessories (Hats/Jewelry):'}
                    </label>
                    <input
                      type="text"
                      value={clothesAccessories}
                      onChange={(e) => setClothesAccessories(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              COMMAND 4: /Reference
          ========================================================================= */}
          {activeCommand === '/Reference' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="text-cyan-400 font-mono">/Reference</span>
                  <span className="text-slate-400 text-xs font-normal">
                    {isMyanmar ? 'ရည်ညွှန်းချက် ပုံရိပ်နှင့် သတ်မှတ်ချက်များ' : 'Attach reference image, pose, style or consistency guidance'}
                  </span>
                </h3>
              </div>

              {/* Presets */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">
                  {isMyanmar ? '၁။ Reference အမျိုးအစား ရွေးချယ်ပါ:' : '1. Choose Reference Type:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    'Pose Reference (URL/Description)',
                    'Style Reference (Art style transfer)',
                    'Color Palette Reference',
                    'Face / Character Sheet Consistency Reference'
                  ].map((ref) => (
                    <button
                      key={ref}
                      type="button"
                      onClick={() => setRefType(ref)}
                      className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer ${
                        refType === ref
                          ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <span>{ref}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  {isMyanmar ? 'Reference လင့်ခ် သို့မဟုတ် အသေးစိတ် ညွှန်ကြားချက်:' : 'Reference Description or Consistency Guidance:'}
                </label>
                <textarea
                  rows={3}
                  value={refDetails}
                  onChange={(e) => setRefDetails(e.target.value)}
                  placeholder="Specify URL, image details or consistency constraints..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>
          )}

          {/* =========================================================================
              COMMAND 5: /Preset
          ========================================================================= */}
          {activeCommand === '/Preset' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="text-cyan-400 font-mono">/Preset</span>
                  <span className="text-slate-400 text-xs font-normal">
                    {isMyanmar ? 'အသင့်သုံး စုံတွဲ ဖန်တီးချက်များ (Quick-load full recipes)' : 'Quick-load full combinations across all parameters'}
                  </span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRESET_RECIPES.map((rec, i) => (
                  <div
                    key={i}
                    onClick={rec.apply}
                    className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-400 hover:bg-slate-900 transition-all cursor-pointer space-y-2 group shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-white group-hover:text-cyan-200 transition-colors">
                        {isMyanmar ? rec.titleMm : rec.titleEn}
                      </h4>
                      <span className="text-[11px] text-cyan-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Load</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {rec.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              LIVE OUTPUT CODE BLOCK (Required Layout Format)
          ========================================================================= */}
          <div className="rounded-2xl bg-slate-900 border border-cyan-500/40 p-4 space-y-2.5 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-bold text-white">
                  {isMyanmar ? 'စနစ်တကျ ဖွဲ့စည်းထားသော Master Prompt ရလဒ်:' : 'Structured Master Prompt Output:'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-cyan-400" />}
                <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-xs leading-relaxed overflow-x-auto selection:bg-cyan-900 selection:text-white">
              <code>{masterPromptFormula}</code>
            </pre>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {isMyanmar ? 'ပိတ်မည်' : 'Close'}
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleCopyPrompt}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="h-3.5 w-3.5 text-cyan-400" />
              <span>{isMyanmar ? 'Prompt ကူးယူမည်' : 'Copy Formula'}</span>
            </button>

            <button
              type="button"
              onClick={handleApplyToStudio}
              disabled={isGeneratingPrompt}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-white to-cyan-300 hover:from-cyan-300 hover:to-white text-black font-black text-xs shadow-lg transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              <Wand2 className="h-4 w-4 text-black" />
              <span>{isMyanmar ? '✨ Studio ထဲထည့်သွင်း၍ Prompt ထုတ်မည်' : '✨ Apply & Generate Master Prompt'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
