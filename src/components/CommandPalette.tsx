import React, { useEffect, useRef, useMemo } from 'react';
import {
  Language,
  MatrixSelection,
  AppMode,
  LocationOption,
  LightingOption,
  CameraOption,
  SubjectOption,
  PoseOption,
  ColorGradeOption,
  GarmentOption,
  AspectRatioOption,
} from '../types';
import {
  LOCATION_OPTIONS,
  LIGHTING_OPTIONS,
  CAMERA_OPTIONS,
  CAMERA_ANGLE_OPTIONS,
  SUBJECT_OPTIONS,
  POSE_EXPRESSION_OPTIONS,
  COLOR_GRADE_OPTIONS,
  PHOTO_STYLE_OPTIONS,
  GARMENT_OPTIONS,
  ASPECT_RATIOS,
  PRESET_TEMPLATES,
} from '../data/presetData';
import {
  MapPin,
  Sun,
  Camera,
  User,
  Smile,
  Palette,
  Shirt,
  Maximize2,
  Wand2,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Trash2,
  Layers,
  ChevronRight,
  ArrowUpDown,
  CornerDownLeft,
  Command,
} from 'lucide-react';

export type CommandCategory =
  | 'background'
  | 'lighting'
  | 'camera'
  | 'subject'
  | 'pose'
  | 'style'
  | 'garment'
  | 'aspect'
  | 'preset'
  | 'mode'
  | 'action';

export interface CommandItem {
  id: string;
  trigger: string; // e.g. "/background", "/lighting", "/generate"
  label: string;
  labelMm?: string;
  description: string;
  descriptionMm?: string;
  category: CommandCategory;
  categoryLabel: string;
  categoryLabelMm?: string;
  emoji?: string;
  icon?: React.ElementType;
  shortcut?: string;
  keywords?: string[];
  matrixUpdate?: Partial<MatrixSelection>;
  action?: () => void;
  insertText?: string;
  isCategoryRoot?: boolean;
}

export interface CommandPaletteProps {
  isOpen: boolean;
  query: string; // User input after the slash (e.g. "back", "light", "cam", or "")
  onSelect: (command: CommandItem) => void;
  onClose: () => void;
  language?: Language;
  className?: string;
  selection?: MatrixSelection;
  onGeneratePrompt?: () => void;
  onResetAll?: () => void;
  onClearInput?: () => void;
  onModeChange?: (mode: AppMode) => void;
  selectedIndex: number;
  onSelectedIndexChange: (index: number) => void;
  onQueryChange?: (newQuery: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  query,
  onSelect,
  onClose,
  language = 'en',
  className = '',
  selection,
  onGeneratePrompt,
  onResetAll,
  onClearInput,
  onModeChange,
  selectedIndex,
  onSelectedIndexChange,
  onQueryChange,
}) => {
  const isMyanmar = language === 'my';
  const listRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLButtonElement>(null);

  // 1. Build Comprehensive Catalog of Commands and Sub-options
  const allCommands = useMemo<CommandItem[]>(() => {
    const list: CommandItem[] = [];

    // --- ROOT COMMANDS (Categories) ---
    list.push(
      {
        id: 'root_background',
        trigger: '/background',
        label: 'Background & Location',
        labelMm: 'နောက်ခံ နှင့် တည်နေရာ',
        description: 'Set environment, scenery or studio backdrop (/back)',
        descriptionMm: 'သဘာဝရှုခင်း၊ စတူဒီယိုနောက်ခံ ရွေးချယ်ရန်',
        category: 'background',
        categoryLabel: 'Environment',
        categoryLabelMm: 'ပတ်ဝန်းကျင်',
        emoji: '🏞️',
        icon: MapPin,
        keywords: ['background', 'back', 'bg', 'location', 'place', 'scene', 'studio', 'temple', 'outdoor', 'indoor'],
        isCategoryRoot: true,
      },
      {
        id: 'root_lighting',
        trigger: '/lighting',
        label: 'Lighting & Atmosphere',
        labelMm: 'အလင်းရောင် နှင့် လေထု',
        description: 'Golden hour, neon, rembrandt, soft natural light (/light)',
        descriptionMm: 'ရွှေရောင်ဆည်းဆာ၊ နီယွန်မီးရောင်၊ စတူဒီယိုအလင်း',
        category: 'lighting',
        categoryLabel: 'Lighting',
        categoryLabelMm: 'အလင်းရောင်',
        emoji: '💡',
        icon: Sun,
        keywords: ['lighting', 'light', 'sun', 'golden', 'neon', 'candle', 'rembrandt', 'shadow', 'illumination'],
        isCategoryRoot: true,
      },
      {
        id: 'root_camera',
        trigger: '/camera',
        label: 'Camera, Optics & Angle',
        labelMm: 'ကင်မရာ၊ မှန်ဘီလူး နှင့် ထောင့်',
        description: 'Sony A7R V, Hasselblad, Leica, 85mm portrait, eye-level (/cam)',
        descriptionMm: 'Sony, Hasselblad, Leica ကင်မရာနှင့် မှန်ဘီလူး ဆက်တင်များ',
        category: 'camera',
        categoryLabel: 'Optics',
        categoryLabelMm: 'ကင်မရာ',
        emoji: '📷',
        icon: Camera,
        keywords: ['camera', 'cam', 'lens', 'angle', 'sony', 'leica', 'hasselblad', 'bokeh', 'portrait'],
        isCategoryRoot: true,
      },
      {
        id: 'root_subject',
        trigger: '/subject',
        label: 'Subject / Character Type',
        labelMm: 'ဇာတ်ကောင် / မော်ဒယ် အမျိုးအစား',
        description: 'Woman, man, couple, child, pet, product or fashion model (/sub)',
        descriptionMm: 'အမျိုးသမီး၊ အမျိုးသား၊ စုံတွဲ၊ ကလေး၊ အိမ်မွေးတိရစ္ဆာန်',
        category: 'subject',
        categoryLabel: 'Character',
        categoryLabelMm: 'ဇာတ်ကောင်',
        emoji: '👤',
        icon: User,
        keywords: ['subject', 'sub', 'model', 'person', 'woman', 'man', 'couple', 'child', 'pet', 'character'],
        isCategoryRoot: true,
      },
      {
        id: 'root_pose',
        trigger: '/pose',
        label: 'Pose & Expression',
        labelMm: 'ဟန်ပန် နှင့် အမူအရာ',
        description: 'Looking at camera, gentle smile, editorial high-fashion stance (/pose)',
        descriptionMm: 'ကင်မရာကြည့်၊ အပြုံး၊ ဖက်ရှင်ဟန်ပန်များ',
        category: 'pose',
        categoryLabel: 'Posture',
        categoryLabelMm: 'ဟန်ပန်',
        emoji: '✨',
        icon: Smile,
        keywords: ['pose', 'expression', 'gesture', 'smile', 'look', 'eyes', 'action', 'face'],
        isCategoryRoot: true,
      },
      {
        id: 'root_style',
        trigger: '/style',
        label: 'Style & Color Grade',
        labelMm: 'အရောင်စပ် နှင့် စတိုင်',
        description: 'Cyber neon, teal-orange, vintage warm film, ultra-realism (/style)',
        descriptionMm: 'Cyber neon၊ ရုပ်ရှင်ဆန်သော အရောင်၊ ရှေးဟောင်း ဖလင်စတိုင်',
        category: 'style',
        categoryLabel: 'Aesthetic',
        categoryLabelMm: 'စတိုင်',
        emoji: '🎨',
        icon: Palette,
        keywords: ['style', 'color', 'grade', 'film', 'teal', 'vintage', 'neon', 'portra', 'mood'],
        isCategoryRoot: true,
      },
      {
        id: 'root_garment',
        trigger: '/garment',
        label: 'Garment & Outfit',
        labelMm: 'ဝတ်စုံ နှင့် ဖက်ရှင်',
        description: 'Silk acheik longyi, evening gown, tailored suit, casual (/outfit)',
        descriptionMm: 'မြန်မာ့ရိုးရာ ချိတ်လုံချည်၊ ညနေခင်းဂါဝန်၊ အနောက်တိုင်း တိုက်ပုံ',
        category: 'garment',
        categoryLabel: 'Attire',
        categoryLabelMm: 'ဝတ်စုံ',
        emoji: '👗',
        icon: Shirt,
        keywords: ['garment', 'outfit', 'clothes', 'dress', 'suit', 'silk', 'longyi', 'attire', 'fashion'],
        isCategoryRoot: true,
      },
      {
        id: 'root_aspect',
        trigger: '/aspect',
        label: 'Aspect Ratio',
        labelMm: 'ပုံဆိုဒ် အချိုးအစား (Aspect Ratio)',
        description: '9:16 (Story), 16:9 (Cinema), 1:1 (Square), 4:5 (Portrait) (/ar)',
        descriptionMm: '၉:၁၆ ဒေါင်လိုက်၊ ၁၆:၉ အလျားလိုက်၊ ၁:၁ လေးထောင့်',
        category: 'aspect',
        categoryLabel: 'Dimensions',
        categoryLabelMm: 'အချိုးအစား',
        emoji: '📐',
        icon: Maximize2,
        keywords: ['aspect', 'ar', 'ratio', 'dimension', 'size', '9:16', '16:9', '1:1', '4:5', 'resolution'],
        isCategoryRoot: true,
      },
      {
        id: 'root_preset',
        trigger: '/preset',
        label: 'Master Studio Presets',
        labelMm: 'အသင့်သုံး မာစတာ ပရီးဆက်များ',
        description: 'Thingyan Cyber Queen, Konbaung Royal Court, Inle Lake Dawn (/preset)',
        descriptionMm: 'နာမည်ကျော် ဓာတ်ပုံ ပရီးဆက် ၃၀ ကျော်မှ ရွေးချယ်ရန်',
        category: 'preset',
        categoryLabel: 'Templates',
        categoryLabelMm: 'ပရီးဆက်',
        emoji: '⭐',
        icon: Sparkles,
        keywords: ['preset', 'template', 'thingyan', 'konbaung', 'inle', 'royal', 'gallery'],
        isCategoryRoot: true,
      },
      {
        id: 'action_generate',
        trigger: '/generate',
        label: 'Generate Master Prompt',
        labelMm: 'မာစတာ Prompt ထုတ်ယူမည်',
        description: 'Compile prompt with active matrix & open studio results',
        descriptionMm: 'ရွေးချယ်ထားသော အချက်အလက်များဖြင့် Prompt အပြည့်အစုံ ရေးဆွဲရန်',
        category: 'action',
        categoryLabel: 'Action',
        categoryLabelMm: 'လုပ်ဆောင်ချက်',
        emoji: '⚡',
        icon: Wand2,
        shortcut: 'Enter',
        keywords: ['generate', 'gen', 'run', 'create', 'build', 'prompt', 'start', 'submit'],
        action: onGeneratePrompt,
      },
      {
        id: 'action_reset',
        trigger: '/reset',
        label: 'Reset All Options',
        labelMm: 'ရွေးချယ်မှုများ အားလုံး Reset ပြန်လုပ်မည်',
        description: 'Revert matrix choices back to pristine default state',
        descriptionMm: 'ရွေးချယ်ထားသော ဆက်တင်အားလုံးကို မူလအတိုင်း ပြန်လည်သတ်မှတ်မည်',
        category: 'action',
        categoryLabel: 'Action',
        categoryLabelMm: 'လုပ်ဆောင်ချက်',
        emoji: '🔄',
        icon: RotateCcw,
        keywords: ['reset', 'clear_all', 'default', 'revert', 'clean'],
        action: onResetAll,
      },
      {
        id: 'action_clear',
        trigger: '/clear',
        label: 'Clear Prompt Input',
        labelMm: 'Prompt စာသားကို ရှင်းထုတ်မည်',
        description: 'Empty current text area prompt content',
        descriptionMm: 'လက်ရှိ ရိုက်ထည့်ထားသော စာသားကို ဖျက်မည်',
        category: 'action',
        categoryLabel: 'Action',
        categoryLabelMm: 'လုပ်ဆောင်ချက်',
        emoji: '🧹',
        icon: Trash2,
        keywords: ['clear', 'empty', 'erase', 'delete', 'input'],
        action: onClearInput,
      },
      {
        id: 'action_help',
        trigger: '/help',
        label: 'Slash Command Help & Shortcuts',
        labelMm: 'အသုံးပြုနည်း အကူအညီ နှင့် ဖြတ်လမ်းခလုတ်များ',
        description: 'Type /back, /light, /cam, /sub, /pose, /style, /aspect, /gen',
        descriptionMm: 'Slash command များ အသုံးပြုပုံ လမ်းညွှန်ချက်',
        category: 'action',
        categoryLabel: 'Help',
        categoryLabelMm: 'အကူအညီ',
        emoji: '❓',
        icon: HelpCircle,
        keywords: ['help', 'info', 'shortcuts', 'guide', 'commands', '?'],
      }
    );

    // --- SUB-OPTIONS: BACKGROUND OPTIONS (/background or /back) ---
    LOCATION_OPTIONS.forEach((loc) => {
      list.push({
        id: `loc_${loc.id}`,
        trigger: `/background ${loc.id}`,
        label: loc.labelEn,
        labelMm: loc.labelMm,
        description: `Set background to ${loc.labelEn} (${loc.environmentType})`,
        descriptionMm: `${loc.labelMm} ကို နောက်ခံအဖြစ် သတ်မှတ်မည်`,
        category: 'background',
        categoryLabel: 'Background',
        categoryLabelMm: 'နောက်ခံ',
        emoji: loc.emoji,
        icon: MapPin,
        keywords: [
          'background',
          'back',
          'bg',
          'location',
          loc.id,
          loc.labelEn.toLowerCase(),
          loc.labelMm,
          loc.environmentType,
          loc.category || '',
        ],
        matrixUpdate: { location: loc.id },
        insertText: `in ${loc.labelEn} setting`,
      });
    });

    // --- SUB-OPTIONS: LIGHTING OPTIONS (/lighting or /light) ---
    LIGHTING_OPTIONS.forEach((light) => {
      if (light.id === 'skip') return;
      list.push({
        id: `light_${light.id}`,
        trigger: `/lighting ${light.id}`,
        label: light.labelEn,
        labelMm: light.labelMm,
        description: `Atmospheric lighting: ${light.labelEn}`,
        descriptionMm: `အလင်းရောင် ဆက်တင်: ${light.labelMm}`,
        category: 'lighting',
        categoryLabel: 'Lighting',
        categoryLabelMm: 'အလင်းရောင်',
        emoji: light.emoji,
        icon: Sun,
        keywords: ['lighting', 'light', 'sun', light.id, light.labelEn.toLowerCase(), light.labelMm],
        matrixUpdate: { timeAndLighting: light.id },
        insertText: `illuminated by ${light.labelEn.toLowerCase()}`,
      });
    });

    // --- SUB-OPTIONS: CAMERA OPTIONS (/camera or /cam) ---
    CAMERA_OPTIONS.forEach((cam) => {
      list.push({
        id: `cam_${cam.id}`,
        trigger: `/camera ${cam.id}`,
        label: cam.label,
        labelMm: cam.labelMm || cam.label,
        description: `Optics: ${cam.lens} at ${cam.aperture}`,
        descriptionMm: `မှန်ဘီလူး: ${cam.lens} ${cam.aperture}`,
        category: 'camera',
        categoryLabel: 'Camera',
        categoryLabelMm: 'ကင်မရာ',
        emoji: cam.emoji || '📷',
        icon: Camera,
        keywords: ['camera', 'cam', 'lens', cam.id, cam.label.toLowerCase(), cam.lens.toLowerCase()],
        matrixUpdate: { camera: cam.id },
        insertText: `shot on ${cam.label} with ${cam.lens}`,
      });
    });

    CAMERA_ANGLE_OPTIONS.forEach((angle) => {
      list.push({
        id: `angle_${angle.id}`,
        trigger: `/camera angle:${angle.id}`,
        label: angle.labelEn,
        labelMm: angle.labelMm,
        description: `Camera perspective: ${angle.labelEn}`,
        descriptionMm: `ကင်မရာ ရိုက်ကွင်းထောင့်: ${angle.labelMm}`,
        category: 'camera',
        categoryLabel: 'Camera Angle',
        categoryLabelMm: 'ကင်မရာထောင့်',
        emoji: angle.emoji,
        icon: Camera,
        keywords: ['camera', 'cam', 'angle', angle.id, angle.labelEn.toLowerCase(), angle.labelMm],
        matrixUpdate: { cameraAngle: angle.id },
        insertText: `captured from a ${angle.labelEn.toLowerCase()} perspective`,
      });
    });

    // --- SUB-OPTIONS: SUBJECT OPTIONS (/subject or /sub) ---
    SUBJECT_OPTIONS.forEach((sub) => {
      list.push({
        id: `sub_${sub.id}`,
        trigger: `/subject ${sub.id}`,
        label: sub.labelEn,
        labelMm: sub.labelMm,
        description: sub.description,
        descriptionMm: `${sub.labelMm} ဇာတ်ကောင် ရွေးချယ်ရန်`,
        category: 'subject',
        categoryLabel: 'Subject',
        categoryLabelMm: 'ဇာတ်ကောင်',
        emoji: sub.emoji,
        icon: User,
        keywords: ['subject', 'sub', 'model', sub.id, sub.labelEn.toLowerCase(), sub.labelMm],
        matrixUpdate: { subject: sub.id },
        insertText: `a beautiful portrait of a ${sub.labelEn.toLowerCase()}`,
      });
    });

    // --- SUB-OPTIONS: POSE OPTIONS (/pose) ---
    POSE_EXPRESSION_OPTIONS.slice(0, 15).forEach((pose) => {
      list.push({
        id: `pose_${pose.id}`,
        trigger: `/pose ${pose.id}`,
        label: pose.labelEn,
        labelMm: pose.labelMm,
        description: `Pose & Expression: ${pose.labelEn}`,
        descriptionMm: `ဟန်ပန်: ${pose.labelMm}`,
        category: 'pose',
        categoryLabel: 'Pose',
        categoryLabelMm: 'ဟန်ပန်',
        emoji: pose.emoji,
        icon: Smile,
        keywords: ['pose', 'expression', pose.id, pose.labelEn.toLowerCase(), pose.labelMm],
        matrixUpdate: { poseExpression: pose.id },
        insertText: `with ${pose.labelEn.toLowerCase()}`,
      });
    });

    // --- SUB-OPTIONS: STYLE / COLOR OPTIONS (/style or /color) ---
    COLOR_GRADE_OPTIONS.forEach((col) => {
      list.push({
        id: `style_${col.id}`,
        trigger: `/style ${col.id}`,
        label: col.labelEn,
        labelMm: col.labelMm,
        description: `Color grade: ${col.filmStock || col.labelEn}`,
        descriptionMm: `အရောင်စပ်: ${col.labelMm}`,
        category: 'style',
        categoryLabel: 'Style',
        categoryLabelMm: 'စတိုင်',
        emoji: col.emoji || '🎨',
        icon: Palette,
        keywords: ['style', 'color', 'grade', col.id, col.labelEn.toLowerCase(), col.labelMm, col.filmStock?.toLowerCase() || ''],
        matrixUpdate: { colorGrade: col.id },
        insertText: `color graded with ${col.labelEn.toLowerCase()} aesthetic`,
      });
    });

    // --- SUB-OPTIONS: GARMENT OPTIONS (/garment or /outfit) ---
    GARMENT_OPTIONS.slice(0, 12).forEach((garment) => {
      list.push({
        id: `garment_${garment.id}`,
        trigger: `/garment ${garment.id}`,
        label: garment.labelEn,
        labelMm: garment.labelMm,
        description: `Fabric: ${garment.fabric}`,
        descriptionMm: `ဝတ်စုံ: ${garment.labelMm}`,
        category: 'garment',
        categoryLabel: 'Garment',
        categoryLabelMm: 'ဝတ်စုံ',
        emoji: garment.emoji || '👗',
        icon: Shirt,
        keywords: ['garment', 'outfit', 'dress', garment.id, garment.labelEn.toLowerCase(), garment.labelMm, garment.fabric.toLowerCase()],
        matrixUpdate: { garmentStyle: garment.id },
        insertText: `wearing an exquisite ${garment.labelEn.toLowerCase()} made of ${garment.fabric}`,
      });
    });

    // --- SUB-OPTIONS: ASPECT RATIO (/aspect or /ar) ---
    ASPECT_RATIOS.forEach((ar) => {
      list.push({
        id: `aspect_${ar.id}`,
        trigger: `/aspect ${ar.ratio}`,
        label: `${ar.ratio} · ${ar.label}`,
        labelMm: `${ar.ratio} · ${ar.label}`,
        description: `Aspect ratio format: ${ar.ratio} (${ar.width}x${ar.height})`,
        descriptionMm: `ပုံဆိုဒ် အချိုးအစား: ${ar.ratio}`,
        category: 'aspect',
        categoryLabel: 'Aspect Ratio',
        categoryLabelMm: 'အချိုးအစား',
        emoji: '📐',
        icon: Maximize2,
        keywords: ['aspect', 'ar', 'ratio', ar.ratio, ar.id, ar.label.toLowerCase()],
        matrixUpdate: { aspectRatio: ar.ratio },
        insertText: `--ar ${ar.ratio}`,
      });
    });

    // --- APP MODE SWITCHES (/mode) ---
    const MODES: { id: AppMode; labelEn: string; labelMm: string; desc: string; emoji: string }[] = [
      { id: 'txt2img', labelEn: 'Txt2Img (Prompt to Image)', labelMm: 'Txt2Img (စာသားမှ ဓာတ်ပုံ)', desc: 'Generate master prompts & photorealistic visuals from text', emoji: '✨' },
      { id: 'img2img', labelEn: 'Img2Img (Photo to Photo)', labelMm: 'Img2Img (ဓာတ်ပုံမှ ဓာတ်ပုံ)', desc: 'Upload reference image with identity and facial lock', emoji: '🖼️' },
      { id: 'clothes-swap', labelEn: 'Clothes Swap (Virtual Try-on)', labelMm: 'Clothes Swap (ဝတ်စုံလဲလှယ်)', desc: 'Switch attire and traditional silk longyi seamlessly', emoji: '👗' },
      { id: 'background-only', labelEn: 'Background Only (Scenery)', labelMm: 'Background Only (နောက်ခံသီးသန့်)', desc: 'Pure scenery and architectural backdrops without characters', emoji: '🏞️' },
    ];

    MODES.forEach((m) => {
      list.push({
        id: `mode_${m.id}`,
        trigger: `/mode ${m.id}`,
        label: m.labelEn,
        labelMm: m.labelMm,
        description: m.desc,
        descriptionMm: m.labelMm,
        category: 'mode',
        categoryLabel: 'Mode Switch',
        categoryLabelMm: 'မုဒ် ရွေးချယ်မှု',
        emoji: m.emoji,
        icon: Layers,
        keywords: ['mode', 'switch', m.id, m.labelEn.toLowerCase(), m.labelMm],
        action: () => {
          if (onModeChange) onModeChange(m.id);
        },
      });
    });

    // --- PRESETS (/preset) ---
    PRESET_TEMPLATES.slice(0, 10).forEach((preset) => {
      list.push({
        id: `preset_${preset.id}`,
        trigger: `/preset ${preset.id}`,
        label: preset.titleEn,
        labelMm: preset.titleMm,
        description: `Ready-made master template (${preset.mode})`,
        descriptionMm: `${preset.titleMm} အသင့်သုံး မာစတာ ပရီးဆက်`,
        category: 'preset',
        categoryLabel: 'Studio Preset',
        categoryLabelMm: 'ပရီးဆက်',
        emoji: '⭐',
        icon: Sparkles,
        keywords: ['preset', 'template', preset.id, preset.titleEn.toLowerCase(), preset.titleMm],
        matrixUpdate: preset.selection,
        insertText: preset.titleEn,
      });
    });

    return list;
  }, [onGeneratePrompt, onResetAll, onClearInput, onModeChange]);

  // 2. Dynamic Filtering Algorithm Based On User Slash Input
  const filteredCommands = useMemo<CommandItem[]>(() => {
    const rawClean = query.trim().toLowerCase();

    // If empty slash query (just "/"), show all root categories and primary action triggers
    if (!rawClean) {
      return allCommands.filter((cmd) => cmd.isCategoryRoot || cmd.category === 'action' || cmd.category === 'aspect');
    }

    // Split words: e.g. "back studio" -> ["back", "studio"]
    const tokens = rawClean.split(/\s+/).filter(Boolean);
    const primaryToken = tokens[0] || '';
    const secondaryToken = tokens.slice(1).join(' ');

    // Check if primaryToken matches a known category or alias
    const isBackgroundQuery = ['back', 'bg', 'background', 'location', 'place', 'scene'].some((t) => t.startsWith(primaryToken) || primaryToken.startsWith(t));
    const isLightingQuery = ['light', 'lighting', 'sun', 'illumination'].some((t) => t.startsWith(primaryToken) || primaryToken.startsWith(t));
    const isCameraQuery = ['cam', 'camera', 'lens', 'angle', 'optics'].some((t) => t.startsWith(primaryToken) || primaryToken.startsWith(t));
    const isSubjectQuery = ['sub', 'subject', 'model', 'person', 'char'].some((t) => t.startsWith(primaryToken) || primaryToken.startsWith(t));
    const isPoseQuery = ['pose', 'gesture', 'expression', 'stance'].some((t) => t.startsWith(primaryToken) || primaryToken.startsWith(t));
    const isStyleQuery = ['style', 'color', 'grade', 'film', 'look'].some((t) => t.startsWith(primaryToken) || primaryToken.startsWith(t));
    const isGarmentQuery = ['garment', 'outfit', 'dress', 'clothes', 'attire'].some((t) => t.startsWith(primaryToken) || primaryToken.startsWith(t));
    const isAspectQuery = ['aspect', 'ar', 'ratio', 'size', '9:16', '16:9', '1:1', '4:5', '3:4'].some((t) => t.startsWith(primaryToken) || primaryToken.startsWith(t));
    const isModeQuery = ['mode', 'switch'].some((t) => t.startsWith(primaryToken) || primaryToken.startsWith(t));
    const isPresetQuery = ['preset', 'template'].some((t) => t.startsWith(primaryToken) || primaryToken.startsWith(t));
    const isActionQuery = ['gen', 'generate', 'run', 'reset', 'clear', 'help'].some((t) => t.startsWith(primaryToken) || primaryToken.startsWith(t));

    // Priority 1: If user typed "/back" (or similar category prefix)
    if (isBackgroundQuery) {
      const rootCmd = allCommands.find((c) => c.id === 'root_background');
      const subItems = allCommands.filter((c) => {
        if (c.category !== 'background' || c.isCategoryRoot) return false;
        if (!secondaryToken) return true;
        return c.keywords?.some((k) => k.includes(secondaryToken)) || c.label.toLowerCase().includes(secondaryToken) || c.description.toLowerCase().includes(secondaryToken);
      });
      return rootCmd ? [rootCmd, ...subItems] : subItems;
    }

    if (isLightingQuery) {
      const rootCmd = allCommands.find((c) => c.id === 'root_lighting');
      const subItems = allCommands.filter((c) => {
        if (c.category !== 'lighting' || c.isCategoryRoot) return false;
        if (!secondaryToken) return true;
        return c.keywords?.some((k) => k.includes(secondaryToken)) || c.label.toLowerCase().includes(secondaryToken) || c.description.toLowerCase().includes(secondaryToken);
      });
      return rootCmd ? [rootCmd, ...subItems] : subItems;
    }

    if (isCameraQuery) {
      const rootCmd = allCommands.find((c) => c.id === 'root_camera');
      const subItems = allCommands.filter((c) => {
        if (c.category !== 'camera' || c.isCategoryRoot) return false;
        if (!secondaryToken) return true;
        return c.keywords?.some((k) => k.includes(secondaryToken)) || c.label.toLowerCase().includes(secondaryToken) || c.description.toLowerCase().includes(secondaryToken);
      });
      return rootCmd ? [rootCmd, ...subItems] : subItems;
    }

    if (isSubjectQuery) {
      const rootCmd = allCommands.find((c) => c.id === 'root_subject');
      const subItems = allCommands.filter((c) => {
        if (c.category !== 'subject' || c.isCategoryRoot) return false;
        if (!secondaryToken) return true;
        return c.keywords?.some((k) => k.includes(secondaryToken)) || c.label.toLowerCase().includes(secondaryToken);
      });
      return rootCmd ? [rootCmd, ...subItems] : subItems;
    }

    if (isPoseQuery) {
      const rootCmd = allCommands.find((c) => c.id === 'root_pose');
      const subItems = allCommands.filter((c) => {
        if (c.category !== 'pose' || c.isCategoryRoot) return false;
        if (!secondaryToken) return true;
        return c.keywords?.some((k) => k.includes(secondaryToken)) || c.label.toLowerCase().includes(secondaryToken);
      });
      return rootCmd ? [rootCmd, ...subItems] : subItems;
    }

    if (isStyleQuery) {
      const rootCmd = allCommands.find((c) => c.id === 'root_style');
      const subItems = allCommands.filter((c) => {
        if (c.category !== 'style' || c.isCategoryRoot) return false;
        if (!secondaryToken) return true;
        return c.keywords?.some((k) => k.includes(secondaryToken)) || c.label.toLowerCase().includes(secondaryToken);
      });
      return rootCmd ? [rootCmd, ...subItems] : subItems;
    }

    if (isGarmentQuery) {
      const rootCmd = allCommands.find((c) => c.id === 'root_garment');
      const subItems = allCommands.filter((c) => {
        if (c.category !== 'garment' || c.isCategoryRoot) return false;
        if (!secondaryToken) return true;
        return c.keywords?.some((k) => k.includes(secondaryToken)) || c.label.toLowerCase().includes(secondaryToken);
      });
      return rootCmd ? [rootCmd, ...subItems] : subItems;
    }

    if (isAspectQuery) {
      const rootCmd = allCommands.find((c) => c.id === 'root_aspect');
      const subItems = allCommands.filter((c) => {
        if (c.category !== 'aspect' || c.isCategoryRoot) return false;
        if (!secondaryToken) return true;
        return c.keywords?.some((k) => k.includes(secondaryToken)) || c.label.toLowerCase().includes(secondaryToken);
      });
      return rootCmd ? [rootCmd, ...subItems] : subItems;
    }

    if (isModeQuery) {
      return allCommands.filter((c) => c.category === 'mode');
    }

    if (isPresetQuery) {
      const rootCmd = allCommands.find((c) => c.id === 'root_preset');
      const subItems = allCommands.filter((c) => {
        if (c.category !== 'preset' || c.isCategoryRoot) return false;
        if (!secondaryToken) return true;
        return c.keywords?.some((k) => k.includes(secondaryToken)) || c.label.toLowerCase().includes(secondaryToken);
      });
      return rootCmd ? [rootCmd, ...subItems] : subItems;
    }

    if (isActionQuery) {
      return allCommands.filter((c) => c.category === 'action');
    }

    // Generic Fuzzy / Keyword Substring Search across all commands
    const matches = allCommands.filter((cmd) => {
      const triggerMatch = cmd.trigger.toLowerCase().includes(rawClean);
      const labelMatch = cmd.label.toLowerCase().includes(rawClean);
      const labelMmMatch = cmd.labelMm ? cmd.labelMm.toLowerCase().includes(rawClean) : false;
      const descMatch = cmd.description.toLowerCase().includes(rawClean);
      const keywordMatch = cmd.keywords?.some((k) => k.toLowerCase().includes(rawClean)) || false;

      return triggerMatch || labelMatch || labelMmMatch || descMatch || keywordMatch;
    });

    return matches.slice(0, 30);
  }, [allCommands, query]);

  // Keep selected index within bounds when filtered results change
  useEffect(() => {
    if (selectedIndex >= filteredCommands.length) {
      onSelectedIndexChange(0);
    }
  }, [filteredCommands.length, selectedIndex, onSelectedIndexChange]);

  // Auto-scroll the active item into view
  useEffect(() => {
    if (activeItemRef.current && listRef.current) {
      activeItemRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [selectedIndex]);

  // If closed or no commands match, return null or empty state
  if (!isOpen) {
    return null;
  }

  // Handle clicking a command
  const handleItemClick = (cmd: CommandItem) => {
    // If user clicked a root category command (e.g. "/background"), fill query to drill down
    if (cmd.isCategoryRoot && onQueryChange) {
      const cleanTrigger = cmd.trigger.replace('/', '');
      onQueryChange(cleanTrigger);
      onSelectedIndexChange(0);
      return;
    }

    onSelect(cmd);
  };

  return (
    <div
      role="listbox"
      aria-label="Slash command palette"
      className={`absolute bottom-full mb-2 left-0 right-0 z-50 rounded-2xl bg-slate-950/95 border border-slate-800/90 shadow-[0_-16px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl overflow-hidden flex flex-col transition-all duration-150 ${className}`}
      style={{ maxHeight: '21rem' }}
    >
      {/* Palette Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-cyan-500/10 border border-cyan-400/30 text-cyan-400">
            <Command className="h-3 w-3" />
          </div>
          <span className="text-xs font-bold text-slate-200 tracking-tight">
            {isMyanmar ? 'အမိန့်ပေးစနစ် (Slash Commands)' : 'Studio Slash Commands'}
          </span>
          {query && (
            <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
              /{query}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <span className="font-mono tabular-nums font-semibold text-slate-300">
            {filteredCommands.length}
          </span>
          <span>{isMyanmar ? 'ခုတွေ့ရှိ' : 'matches'}</span>
        </div>
      </div>

      {/* Commands List */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto p-1.5 space-y-1 custom-scrollbar overscroll-contain"
        tabIndex={-1}
      >
        {filteredCommands.length === 0 ? (
          <div className="py-8 px-4 text-center space-y-1.5">
            <p className="text-xs font-semibold text-slate-300">
              {isMyanmar ? 'ကိုက်ညီသော အမိန့်စနစ် မရှိပါ' : `No commands found matching "/${query}"`}
            </p>
            <p className="text-[11px] text-slate-400">
              {isMyanmar
                ? 'စမ်းကြည့်ရန်: /back, /light, /cam, /sub, /pose, /style, /aspect, /gen'
                : 'Try typing: /back, /light, /cam, /sub, /pose, /style, /aspect, /gen'}
            </p>
          </div>
        ) : (
          filteredCommands.map((cmd, idx) => {
            const isSelected = idx === selectedIndex;
            const IconComponent = cmd.icon;

            return (
              <button
                key={cmd.id}
                ref={isSelected ? activeItemRef : null}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleItemClick(cmd)}
                onMouseEnter={() => onSelectedIndexChange(idx)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-cyan-500/15 border border-cyan-400/50 text-white shadow-[0_2px_12px_rgba(6,182,212,0.18)] ring-1 ring-cyan-500/25'
                    : 'bg-transparent border border-transparent text-slate-300 hover:bg-slate-900/80 hover:text-white'
                }`}
              >
                {/* Left: Emoji / Icon & Labels */}
                <div className="flex items-center gap-2.5 truncate min-w-0 pr-2">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm transition-all ${
                      isSelected
                        ? 'bg-cyan-500 text-black font-bold shadow-sm scale-105'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 group-hover:border-slate-700'
                    }`}
                  >
                    {cmd.emoji ? (
                      <span>{cmd.emoji}</span>
                    ) : IconComponent ? (
                      <IconComponent className="h-3.5 w-3.5" />
                    ) : (
                      <Command className="h-3.5 w-3.5" />
                    )}
                  </div>

                  <div className="truncate min-w-0">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-xs font-bold text-cyan-400 shrink-0">
                        {cmd.trigger}
                      </span>
                      <span className="text-xs font-semibold text-slate-100 truncate">
                        {isMyanmar && cmd.labelMm ? cmd.labelMm : cmd.label}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 truncate max-w-sm sm:max-w-md">
                      {isMyanmar && cmd.descriptionMm ? cmd.descriptionMm : cmd.description}
                    </p>
                  </div>
                </div>

                {/* Right: Category Unboxed Tag / Action Hint */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-medium text-slate-400 hidden sm:inline">
                    {isMyanmar && cmd.categoryLabelMm ? cmd.categoryLabelMm : cmd.categoryLabel}
                  </span>

                  {cmd.isCategoryRoot ? (
                    <ChevronRight
                      className={`h-3.5 w-3.5 transition-transform ${
                        isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-slate-500'
                      }`}
                    />
                  ) : isSelected ? (
                    <CornerDownLeft className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                  ) : null}
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Palette Footer - Clean Keyboard Shortcuts Discipline */}
      <div className="flex items-center justify-between px-3 py-1.5 border-t border-slate-800/80 bg-slate-950 text-[10px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[9px] text-slate-300">
              ↑
            </kbd>
            <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[9px] text-slate-300">
              ↓
            </kbd>
            <span>{isMyanmar ? 'ရွှေ့မည်' : 'navigate'}</span>
          </span>

          <span className="hidden sm:flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[9px] text-slate-300">
              ↵ Enter
            </kbd>
            <span>{isMyanmar ? 'ရွေးမည်' : 'select'}</span>
          </span>

          <span className="hidden md:flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[9px] text-slate-300">
              tab
            </kbd>
            <span>{isMyanmar ? 'ဖြည့်မည်' : 'complete'}</span>
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[9px] text-slate-300">
            esc
          </kbd>
          <span>{isMyanmar ? 'ပိတ်မည်' : 'dismiss'}</span>
        </button>
      </div>
    </div>
  );
};
