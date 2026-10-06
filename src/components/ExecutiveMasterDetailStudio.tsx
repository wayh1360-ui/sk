import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  AppMode,
  Language,
  MatrixSelection,
  PresetTemplate,
  PromptResult
} from '../types';
import {
  SUBJECT_OPTIONS,
  PET_OPTIONS,
  PRODUCT_OPTIONS,
  FASHION_OPTIONS,
  WEDDING_COUPLE_OPTIONS,
  LOVERS_COUPLE_OPTIONS,
  EVENT_OPTIONS,
  LOCATION_OPTIONS,
  LIGHTING_OPTIONS,
  MOOD_OPTIONS,
  CAMERA_OPTIONS,
  CAMERA_ANGLE_OPTIONS,
  PHOTO_STYLE_OPTIONS,
  RETOUCH_OPTIONS,
  COLOR_GRADE_OPTIONS,
  ASPECT_RATIOS,
  QUALITY_PROFILES,
  GARMENT_OPTIONS,
  IDENTITY_LOCK_OPTIONS,
  ETHNICITY_OPTIONS,
  POSE_EXPRESSION_OPTIONS,
  AGE_RANGE_OPTIONS,
  CHILD_AGE_OPTIONS,
  HEIGHT_OPTIONS,
  WEIGHT_OPTIONS
} from '../data/presetData';

// Sub components
import { CoupleDetailsCustomizer } from './CoupleDetailsCustomizer';
import { WeddingPropsPanel } from './WeddingPropsPanel';
import { SubjectPreserveFeatureBox } from './SubjectPreserveFeatureBox';
import { CulturalPropsDropdown } from './CulturalPropsDropdown';
import { GarmentSelectionCarousel } from './GarmentSelectionCarousel';
import { CustomGarmentUploader } from './CustomGarmentUploader';
import { ClothesSwapPanel } from './ClothesSwapPanel';
import { EventSelectionCarousel } from './EventSelectionCarousel';
import { LocationSelectionCarousel } from './LocationSelectionCarousel';
import { LightingSelectionCarousel } from './LightingSelectionCarousel';
import { SkinRetouchSelectionCarousel } from './SkinRetouchSelectionCarousel';
import { PoseSelectionCarousel } from './PoseSelectionCarousel';
import { FilmColorSelectionCarousel } from './FilmColorSelectionCarousel';
import { MakeupSelectionCarousel } from './MakeupSelectionCarousel';
import { MoodSelectionCarousel } from './MoodSelectionCarousel';
import { CameraSelectionCarousel } from './CameraSelectionCarousel';
import { PhotoStyleSelectionCarousel } from './PhotoStyleSelectionCarousel';
import { CameraAngleSelectionCarousel } from './CameraAngleSelectionCarousel';
import { QualityEngineSelectionCarousel } from './QualityEngineSelectionCarousel';
import { Img2ImgUploader } from './Img2ImgUploader';
import { PresetGallery } from './PresetGallery';
import { SelectedOptionsSummaryModal } from './SelectedOptionsSummaryModal';
import { PromptInputArea } from './PromptInputArea';
import { CommandPalette } from './CommandPalette';

// Icons
import {
  Search,
  X,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  User,
  Shirt,
  MapPin,
  Camera,
  Sparkles,
  Globe,
  Clock,
  Ruler,
  Scale,
  Heart,
  Film,
  Flame,
  Mountain,
  Sun,
  Palette,
  Check,
  Layers,
  Maximize2,
  Smile,
  ShieldCheck,
  Settings2,
  SlidersHorizontal,
  Sliders,
  Edit2,
  Trash2,
  Menu,
  Wand2,
  RefreshCcw,
  CheckCircle2,
  Plus,
  ArrowLeft,
  ArrowRight,
  Home,
  Copy,
  RotateCcw
} from 'lucide-react';

export type PillarId = 'box1' | 'box2' | 'box3' | 'box4' | 'box5';

interface SubMenuDefinition {
  id: string;
  countBadge?: string | number;
  labelMm: string;
  labelEn: string;
  descMm: string;
  descEn: string;
  icon: React.ElementType;
  keywords: string[];
  getCurrentSummary: (selection: MatrixSelection, language: Language) => string;
}

interface PillarDefinition {
  id: PillarId;
  boxNumber: string;
  boxLabel: string;
  titleMm: string;
  titleEn: string;
  taglineMm: string;
  taglineEn: string;
  icon: React.ElementType;
  subMenus: SubMenuDefinition[];
  getCurrentSummary: (selection: MatrixSelection, language: Language) => string;
}

interface ExecutiveMasterDetailStudioProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  language: Language;
  selection: MatrixSelection;
  onUpdateSelection: (updates: Partial<MatrixSelection>) => void;
  onGeneratePrompt: () => void;
  isGeneratingPrompt: boolean;
  onResetAll: () => void;
  onOpenOutput?: () => void;
  promptResult?: PromptResult | null;
  onSelectPreset?: (preset: PresetTemplate) => void;
  activePresetId?: string;
}

export const ExecutiveMasterDetailStudio: React.FC<ExecutiveMasterDetailStudioProps> = ({
  currentMode,
  onModeChange,
  language,
  selection,
  onUpdateSelection,
  onGeneratePrompt,
  isGeneratingPrompt,
  onResetAll,
  onOpenOutput,
  promptResult,
  onSelectPreset,
  activePresetId
}) => {
  const isMyanmar = language === 'my';

  // Master State: null means First Interface (Welcome view with 4 boxes)
  const [activePillarId, setActivePillarId] = useState<PillarId | null>(null);

  // Active sub-menu inside the side panel
  const [activeSubMenuId, setActiveSubMenuId] = useState<string>('subject_type');

  // Prominent enclosed search query inside the opened side panel
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected options summary modal state
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState<boolean>(false);

  // Quick Add Menu popover inside Glass UI Menu Bar
  const [isAddMenuOpen, setIsAddMenuOpen] = useState<boolean>(false);

  // Reset prompt confirmation feedback state
  const [resetNotice, setResetNotice] = useState<boolean>(false);

  const handleResetPrompt = () => {
    onResetAll();
    setSearchQuery('');
    setResetNotice(true);
    setTimeout(() => {
      setResetNotice(false);
    }, 2500);
  };

  // Internal helper states
  const [userAgeMode, setUserAgeMode] = useState<'child' | 'adult' | null>(null);
  const [showPersonBoxesInBackgroundMode, setShowPersonBoxesInBackgroundMode] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'pet' | 'product' | 'fashion' | 'couple_wedding' | 'couple_lovers'>(
    selection.subject === 'product' ? 'product' : selection.subject === 'fashion' ? 'fashion' : selection.subject === 'couple' ? 'couple_wedding' : 'pet'
  );

  const shouldHidePersonBoxes = currentMode === 'background-only' && !showPersonBoxesInBackgroundMode;

  const heightScrollRef = useRef<HTMLDivElement>(null);
  const weightScrollRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLElement>(null);

  const handleHeightScroll = (direction: 'left' | 'right') => {
    if (heightScrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      try {
        heightScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      } catch {
        heightScrollRef.current.scrollLeft += scrollAmount;
      }
    }
  };

  const handleWeightScroll = (direction: 'left' | 'right') => {
    if (weightScrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      try {
        weightScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      } catch {
        weightScrollRef.current.scrollLeft += scrollAmount;
      }
    }
  };

  // Reset scroll of the workbench right content area whenever user switches box or submenu
  useEffect(() => {
    if (rightContentRef.current) {
      try {
        rightContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {
        rightContentRef.current.scrollTop = 0;
      }
    }
  }, [activePillarId, activeSubMenuId]);

  // -------------------------------------------------------------
  // PILLARS DEFINITION MAPPING TO BOX 1, BOX 2, BOX 3, BOX 4
  // -------------------------------------------------------------
  const PILLARS: PillarDefinition[] = useMemo(() => [
    {
      id: 'box1',
      boxNumber: '1',
      boxLabel: 'Box1',
      titleMm: 'အဓိက ဇာတ်ကောင်နှင့် ကိုယ်ပိုင်ဟန်',
      titleEn: 'Subject & Identity Architecture',
      taglineMm: 'ဇာတ်ကောင်၊ အသက်၊ လူမျိုး၊ ဟန်ပန် နှင့် မျက်နှာမူရင်းရုပ် ထိန်းသိမ်းခြင်း',
      taglineEn: 'Character, ethnicity, stature, signature pose, and 100% facial preservation',
      icon: User,
      getCurrentSummary: (sel, lang) => {
        const sub = SUBJECT_OPTIONS.find(s => s.id === sel.subject);
        const eth = ETHNICITY_OPTIONS.find(e => e.id === sel.ethnicity);
        const lock = IDENTITY_LOCK_OPTIONS.find(l => l.id === sel.identityLock);
        const subName = lang === 'my' ? (sub?.labelMm || 'အမျိုးသမီး') : (sub?.labelEn || 'Woman');
        const ethName = lang === 'my' ? (eth?.labelMm || 'မြန်မာ') : (eth?.labelEn || 'Burmese');
        const lockName = lock ? (lang === 'my' ? lock.labelMm : lock.labelEn) : '100% Face Lock';
        return `${subName} · ${ethName} · ${lockName}`;
      },
      subMenus: [
        {
          id: 'subject_type',
          countBadge: '7',
          labelMm: 'ဇာတ်ကောင် အမျိုးအစား',
          labelEn: 'Subject Category',
          descMm: 'အမျိုးသမီး၊ အမျိုးသား၊ စုံတွဲ၊ ကလေး၊ တိရစ္ဆာန်၊ ကုန်ပစ္စည်း၊ ဖက်ရှင်',
          descEn: 'Woman, Man, Couple, Child, Pet, Commercial Product, Fashion',
          icon: User,
          keywords: ['subject', 'woman', 'man', 'couple', 'child', 'pet', 'product', 'fashion', 'ဇာတ်ကောင်', 'အမျိုးသမီး'],
          getCurrentSummary: (sel, lang) => {
            const opt = SUBJECT_OPTIONS.find(s => s.id === sel.subject);
            return opt ? `${opt.emoji} ${lang === 'my' ? opt.labelMm : opt.labelEn}` : 'Woman';
          }
        },
        {
          id: 'identity_lock',
          countBadge: '4',
          labelMm: 'ရည်ညွှန်းပုံနှင့် မျက်နှာထိန်းချုပ်မှု',
          labelEn: 'Identity Lock & Face Ref',
          descMm: 'မူရင်းရုပ် ၁၀၀% မပြောင်းစေရန် Face Lock နှင့် Reference ပုံတင်ရန်',
          descEn: '100% Facial Identity Lock, Body Structure Lock & Photo Reference',
          icon: ShieldCheck,
          keywords: ['identity', 'lock', 'face', 'preserve', 'reference', 'img2img', 'မျက်နှာ', 'မူရင်းရုပ်'],
          getCurrentSummary: (sel, lang) => {
            const lock = IDENTITY_LOCK_OPTIONS.find(l => l.id === sel.identityLock);
            return lock ? `${lock.emoji} ${lang === 'my' ? lock.labelMm : lock.labelEn}` : '100% Face Lock';
          }
        },
        {
          id: 'ethnicity_culture',
          countBadge: '9',
          labelMm: 'လူမျိုးနှင့် ယဉ်ကျေးမှု ရိုးရာ',
          labelEn: 'Ethnicity & Cultural Heritage',
          descMm: 'မြန်မာ၊ ရှမ်း၊ ကရင်၊ ထိုင်း၊ ကိုရီးယား၊ အနောက်တိုင်း၊ ယဉ်ကျေးမှု အသုံးအဆောင်',
          descEn: 'Burmese, Shan, Karen, Thai, Korean, Western & Cultural Props',
          icon: Globe,
          keywords: ['ethnicity', 'culture', 'burmese', 'shan', 'karen', 'thanaka', 'umbrella', 'လူမျိုး', 'ယဉ်ကျေးမှု'],
          getCurrentSummary: (sel, lang) => {
            const eth = ETHNICITY_OPTIONS.find(e => e.id === (sel.ethnicity || 'burmese'));
            return eth ? `${eth.emoji} ${lang === 'my' ? eth.labelMm : eth.labelEn}` : 'Burmese';
          }
        },
        {
          id: 'physical_profile',
          countBadge: '3',
          labelMm: 'အရပ်၊ အလေးချိန်နှင့် အသက်',
          labelEn: 'Physical Stature & Age Profile',
          descMm: 'ကလေးအသက် (၃–၁၂)၊ လူကြီးအသက်၊ အရပ်အမြင့် (Height)၊ ခန္ဓာကိုယ် တည်ဆောက်ပုံ',
          descEn: 'Child/Adult Age, Stature / Height, and Body Build Profile',
          icon: Ruler,
          keywords: ['age', 'height', 'weight', 'stature', 'body', 'build', 'အသက်', 'အရပ်', 'အလေးချိန်'],
          getCurrentSummary: (sel, lang) => {
            const age = [...CHILD_AGE_OPTIONS, ...AGE_RANGE_OPTIONS].find(a => a.id === sel.ageRange);
            const h = HEIGHT_OPTIONS.find(ht => ht.id === sel.heightRange);
            return `${age ? (lang === 'my' ? age.labelMm : age.labelEn) : '26-35 yrs'} ${h ? `· ${h.labelEn}` : ''}`;
          }
        },
        {
          id: 'pose_expression',
          countBadge: '25',
          labelMm: 'ဟန်ပန်နှင့် မျက်နှာအမူအရာ',
          labelEn: 'Pose & Facial Expression',
          descMm: 'စတူဒီယို ပရော်ဖက်ရှင်နယ် ဓာတ်ပုံဟန်ပန် ၂၅ မျိုး',
          descEn: '25 signature editorial, portrait, and action pose selections',
          icon: Smile,
          keywords: ['pose', 'expression', 'stance', 'emotion', 'smile', 'look', 'ဟန်ပန်', 'အမူအရာ'],
          getCurrentSummary: (sel, lang) => {
            const p = POSE_EXPRESSION_OPTIONS.find(po => po.id === sel.poseExpression);
            return p ? `${p.emoji} ${lang === 'my' ? p.labelMm : p.labelEn}` : 'Looking at Camera';
          }
        },
        {
          id: 'couple_customizer',
          countBadge: '20',
          labelMm: 'စုံတွဲနှင့် မင်္ဂလာဆောင် စတူဒီယို',
          labelEn: 'Couple & Wedding Studio',
          descMm: 'မင်္ဂလာဆောင်နှင့် ချစ်သူရည်စား စုံတွဲ၊ သတို့သား/သတို့သမီး ဝတ်စုံနှင့် ခေတ် ၃ ခေတ်',
          descEn: 'Romantic Lovers & Wedding Ceremony customization with 3 Historic Eras',
          icon: Heart,
          keywords: ['couple', 'wedding', 'bride', 'groom', 'lovers', 'စုံတွဲ', 'မင်္ဂလာဆောင်'],
          getCurrentSummary: (sel, lang) => {
            return sel.coupleOutfitType === 'wedding'
              ? (lang === 'my' ? '💍 မင်္ဂလာဆောင် စုံတွဲ' : '💍 Wedding Couple')
              : (lang === 'my' ? '👩‍❤️‍👨 ချစ်သူရည်စား စုံတွဲ' : '👩‍❤️‍👨 Lovers Couple');
          }
        }
      ]
    },
    {
      id: 'box2',
      boxNumber: '2',
      boxLabel: 'Box2',
      titleMm: 'ဖက်ရှင်၊ အဝတ်အစားနှင့် ဝတ်စုံလဲ',
      titleEn: 'Wardrobe & Clothes Swap Studio',
      taglineMm: 'မဂ္ဂဇင်း ဖက်ရှင် ဝတ်စုံလဲ၊ ရိုးရာ ပိုးလုံချည် နှင့် ခေတ်မီ ဒီဇိုင်းများ',
      taglineEn: 'AI fashion clothes swapping, silk longyi, evening gowns, and fabrics',
      icon: Shirt,
      getCurrentSummary: (sel, lang) => {
        const g = GARMENT_OPTIONS.find(ga => ga.id === sel.garmentStyle);
        const gName = g ? (lang === 'my' ? g.labelMm : g.labelEn) : 'Silk Longyi';
        const fab = sel.garmentFabric || 'Woven Silk';
        return `${gName} · ${fab}`;
      },
      subMenus: [
        {
          id: 'clothes_swap_studio',
          countBadge: '2',
          labelMm: 'မဂ္ဂဇင်း ဝတ်စုံလဲ စတူဒီယို',
          labelEn: 'AI Clothes Swap Studio',
          descMm: 'ပုံထဲရှိ မူရင်းလူကို မပြောင်းဘဲ ဝတ်စုံလဲလှယ်ပေးသော စနစ် (Presets / Custom Upload)',
          descEn: 'High-fashion garment replacement using presets or custom uploaded garments',
          icon: Shirt,
          keywords: ['clothes', 'swap', 'fashion', 'outfit', 'magazine', 'upload', 'ဝတ်စုံလဲ', 'ဖက်ရှင်'],
          getCurrentSummary: (sel, lang) => {
            return sel.clothesSwapOption === 'custom_garment_upload'
              ? (lang === 'my' ? '📁 ကိုယ်ပိုင်ဝတ်စုံ တင်ထားသည်' : '📁 Custom Garment')
              : (lang === 'my' ? '✨ အသင့်ပါ ဝတ်စုံရွေးထားသည်' : '✨ In-App Presets');
          }
        },
        {
          id: 'garment_catalog',
          countBadge: '32',
          labelMm: 'ဝတ်စုံ စတိုင်လ် ရွေးချယ်မှု',
          labelEn: 'Garment & Outfit Catalog',
          descMm: 'မြန်မာ့ရိုးရာ ချိတ်ထည်၊ ပိုးလုံချည်၊ ညနေခင်းဝတ်စုံ၊ စမတ်ကျသော ဖက်ရှင် ၃၂ မျိုး',
          descEn: '32 traditional longyi, modern suits, evening dresses, and street styles',
          icon: Palette,
          keywords: ['garment', 'longyi', 'silk', 'gown', 'suit', 'dress', 'acheik', 'လုံချည်', 'ပိုး', 'ဝတ်စုံ'],
          getCurrentSummary: (sel, lang) => {
            const g = GARMENT_OPTIONS.find(ga => ga.id === sel.garmentStyle);
            return g ? (lang === 'my' ? g.labelMm : g.labelEn) : 'Silk Longyi';
          }
        },
        {
          id: 'fabric_texture',
          countBadge: '6',
          labelMm: 'ပိတ်စ နှင့် အသွင်အပြင် (Fabric)',
          labelEn: 'Fabric Texture & Material',
          descMm: 'ပိုးရက်ကန်း၊ ရေစက်ကလေးများ၊ ကတ္တီပါ၊ ဇာ၊ ရွှေချည်ထိုး ပိတ်စများ',
          descEn: 'Woven Silk with Water Droplets, Velvet, Satin, Gold Brocade, Handwoven Cotton',
          icon: Layers,
          keywords: ['fabric', 'material', 'silk', 'texture', 'velvet', 'cotton', 'ပိတ်စ', 'အထည်'],
          getCurrentSummary: (sel) => {
            return sel.garmentFabric || 'Woven Silk with Water Droplets';
          }
        },
        {
          id: 'cultural_accessories',
          countBadge: '33',
          labelMm: 'ရိုးရာ အသုံးအဆောင်နှင့် ရတနာ',
          labelEn: 'Cultural Props & Ornaments',
          descMm: 'ပုသိမ်ထီး၊ စပယ်ပန်းကုံး၊ သနပ်ခါး၊ ရှမ်းလွယ်အိတ်၊ ရွှေဆွဲကြိုးနှင့် ကျောက်မျက်များ',
          descEn: 'Pathein oil-paper umbrella, Jasmine garland, Thanaka paste, Shan bag, Royal jewelry',
          icon: Sparkles,
          keywords: ['props', 'ornaments', 'umbrella', 'jewelry', 'garland', 'ပုသိမ်ထီး', 'ပန်းကုံး', 'ရတနာ'],
          getCurrentSummary: (sel, lang) => {
            return sel.includeCulturalProps
              ? (lang === 'my' ? '🌸 ရိုးရာပစ္စည်းများ ထည့်သွင်းထားသည်' : '🌸 Props Enabled')
              : (lang === 'my' ? 'မပါဝင်ပါ' : 'None');
          }
        }
      ]
    },
    {
      id: 'box3',
      boxNumber: '3',
      boxLabel: 'Box3',
      titleMm: 'နောက်ခံ၊ ပွဲတော်နှင့် အလင်းအမှောင်',
      titleEn: 'Scene, Environment & Lighting',
      taglineMm: 'သင်္ကြန်၊ သီတင်းကျွတ်၊ ဆိုက်ဘာရန်ကုန်၊ ပုဂံ နှင့် စတူဒီယို အလင်းအမှောင်',
      taglineEn: 'Festivals, cyber environments, ancient temples, and master studio lighting',
      icon: MapPin,
      getCurrentSummary: (sel, lang) => {
        const ev = EVENT_OPTIONS.find(e => e.id === sel.event);
        const loc = LOCATION_OPTIONS.find(l => l.id === sel.location);
        const lit = LIGHTING_OPTIONS.find(li => li.id === sel.timeAndLighting);
        const evName = ev ? (lang === 'my' ? ev.labelMm : ev.labelEn) : 'Thingyan';
        const locName = loc ? (lang === 'my' ? loc.labelMm : loc.labelEn) : 'Cyber Yangon';
        const litName = lit ? (lang === 'my' ? lit.labelMm : lit.labelEn) : 'Neon Midnight';
        return `${evName} · ${locName} · ${litName}`;
      },
      subMenus: [
        {
          id: 'events_festivals',
          countBadge: '30',
          labelMm: 'ပွဲတော်များနှင့် အခမ်းအနားများ',
          labelEn: 'Festivals & Events',
          descMm: 'သင်္ကြန် ရေကစားပွဲတော်၊ သီတင်းကျွတ် မီးထွန်းပွဲ၊ တန်ဆောင်တိုင်၊ မင်္ဂလာပွဲ ၃၀ မျိုး',
          descEn: 'Thingyan Water Festival, Thadingyut Lanterns, Tazaungdaing, Wedding Reception',
          icon: Sun,
          keywords: ['event', 'festival', 'thingyan', 'thadingyut', 'wedding', 'beach', 'ပွဲတော်', 'သင်္ကြန်'],
          getCurrentSummary: (sel, lang) => {
            const ev = EVENT_OPTIONS.find(e => e.id === sel.event);
            return ev ? `${ev.emoji} ${lang === 'my' ? ev.labelMm : ev.labelEn}` : 'Thingyan Festival';
          }
        },
        {
          id: 'locations_environments',
          countBadge: '36',
          labelMm: 'နောက်ခံ ရှုခင်းနှင့် တည်နေရာ',
          labelEn: 'Locations & Backdrops',
          descMm: 'ဆိုက်ဘာ ရန်ကုန်၊ ပုဂံ ရှေးဟောင်းဘုရားများ၊ အင်းလေးကန်၊ ခေတ်မီ စတူဒီယို ၃၆ မျိုး',
          descEn: 'Cyber Yangon, Bagan Temples, Inle Lake, Modern Minimalist Studio, Luxury Hotel',
          icon: Mountain,
          keywords: ['location', 'place', 'city', 'yangon', 'bagan', 'studio', 'temple', 'နောက်ခံ', 'နေရာ'],
          getCurrentSummary: (sel, lang) => {
            const loc = LOCATION_OPTIONS.find(l => l.id === sel.location);
            return loc ? `${loc.emoji} ${lang === 'my' ? loc.labelMm : loc.labelEn}` : 'Cyber Yangon';
          }
        },
        {
          id: 'lighting_ambiance',
          countBadge: '30',
          labelMm: 'စတူဒီယို အလင်းအမှောင် (Lighting)',
          labelEn: 'Studio & Natural Lighting',
          descMm: 'ရမ်ဘရန့် စတူဒီယိုမီး၊ နီယွန်မီးရောင်၊ ညနေခင်း ရွှေရောင်ဆည်းဆာ၊ သဘာဝအလင်း ၃၀ မျိုး',
          descEn: 'Studio Rembrandt, Neon Practical, Volumetric Rim Light, Golden Hour, Soft Natural',
          icon: Sun,
          keywords: ['lighting', 'light', 'rembrandt', 'neon', 'golden hour', 'rim light', 'studio', 'အလင်း'],
          getCurrentSummary: (sel, lang) => {
            const lit = LIGHTING_OPTIONS.find(l => l.id === sel.timeAndLighting);
            return lit ? `${lit.emoji} ${lang === 'my' ? lit.labelMm : lit.labelEn}` : 'Neon Midnight';
          }
        },
        {
          id: 'mood_emotion',
          countBadge: '15',
          labelMm: 'ခံစားချက် နှင့် ရသ (Mood)',
          labelEn: 'Mood & Emotional Tone',
          descMm: 'ကြည်နူးဖွယ်၊ ရုပ်ရှင်ဆန်သော အခိုက်အတန့်၊ လွမ်းမောဖွယ်၊ တက်ကြွရွှင်လန်း ၁၅ မျိုး',
          descEn: 'Dreamy Romantic, Cinematic Dramatic, Joyful Celebration, Serene Peace',
          icon: Heart,
          keywords: ['mood', 'emotion', 'romantic', 'dramatic', 'joy', 'vibe', 'atmosphere', 'ခံစားချက်'],
          getCurrentSummary: (sel, lang) => {
            const m = MOOD_OPTIONS.find(mo => mo.id === sel.moodEmotion);
            return m ? `${m.emoji} ${lang === 'my' ? m.labelMm : m.labelEn}` : 'Cinematic Dramatic';
          }
        },
        {
          id: 'background_only_settings',
          countBadge: '1',
          labelMm: 'နောက်ခံ သီးသန့် မုဒ် (Scenery Isolation)',
          labelEn: 'Background Scenery Isolation',
          descMm: 'လူပုဂ္ဂိုလ်ပုံ မပါဘဲ သဘာဝရှုခင်းနှင့် စတူဒီယို နောက်ခံ သီးသန့် ထုတ်လုပ်ရန် ဆက်တင်',
          descEn: 'Isolate pure scenery without models, with option to toggle character parameters',
          icon: Mountain,
          keywords: ['background', 'scenery', 'landscape', 'backdrop', 'isolation', 'နောက်ခံ'],
          getCurrentSummary: () => {
            return currentMode === 'background-only'
              ? (isMyanmar ? '🏞️ Background Mode Active' : '🏞️ Active')
              : (isMyanmar ? 'ပုံမှန် မုဒ်' : 'Standard');
          }
        }
      ]
    },
    {
      id: 'box4',
      boxNumber: '4',
      boxLabel: 'Box4',
      titleMm: 'ကင်မရာ၊ ဖလင်နှင့် စတူဒီယို မက်ထရစ်',
      titleEn: 'Optics, Camera & Studio Matrix',
      taglineMm: 'Sony A7R V၊ Hasselblad၊ Kodak Portra 400၊ 8K UHD နှင့် 9:16 အချိုးအစား',
      taglineEn: 'Professional lenses, film stocks, skin retouches, aspect ratios, and AI engines',
      icon: Camera,
      getCurrentSummary: (sel) => {
        const cam = CAMERA_OPTIONS.find(c => c.id === sel.camera);
        const col = COLOR_GRADE_OPTIONS.find(c => c.id === sel.colorGrade);
        const ar = sel.aspectRatio || '9:16';
        const camName = cam?.label || 'Sony A7R V';
        const colName = col?.labelEn || 'Cyber Neon';
        return `${camName} · ${colName} · ${ar}`;
      },
      subMenus: [
        {
          id: 'camera_lens',
          countBadge: '20',
          labelMm: 'ကင်မရာနှင့် မှန်ဘီလူး (Camera & Lens)',
          labelEn: 'Camera Body & Optics',
          descMm: 'Sony A7R V 85mm f/1.2၊ Hasselblad H6D-100c၊ Leica M11၊ Canon EOS R5 ၂၀ မျိုး',
          descEn: 'Sony A7R V, Hasselblad medium format, Leica M11, Canon EOS R5 optics',
          icon: Camera,
          keywords: ['camera', 'lens', 'sony', 'hasselblad', 'leica', 'canon', 'aperture', 'ကင်မရာ'],
          getCurrentSummary: (sel) => {
            const cam = CAMERA_OPTIONS.find(c => c.id === sel.camera);
            return cam ? cam.label : 'Sony A7R V (85mm f/1.2)';
          }
        },
        {
          id: 'camera_angles',
          countBadge: '15',
          labelMm: 'ကင်မရာ အလှည့်အကွေး (Angles & Framing)',
          labelEn: 'Camera Angles & Framing',
          descMm: 'မျက်လုံးအဆင့် မျက်နှာပုံ၊ အောက်မှပင့်ရိုက်ချက်၊ ဒတ်ချ်ထောင့်၊ အနီးကပ် မက်ခရို ၁၅ မျိုး',
          descEn: 'Eye-level portrait, Low-angle majestic, Dutch angle, Close-up macro, Drone view',
          icon: SlidersHorizontal,
          keywords: ['angle', 'framing', 'close-up', 'low angle', 'drone', 'macro', 'ရှုထောင့်'],
          getCurrentSummary: (sel, lang) => {
            const a = CAMERA_ANGLE_OPTIONS.find(ang => ang.id === sel.cameraAngle);
            return a ? `${a.emoji} ${lang === 'my' ? a.labelMm : a.labelEn}` : 'Eye-level Portrait';
          }
        },
        {
          id: 'color_film',
          countBadge: '19',
          labelMm: 'ဖလင် အရောင်တိုနင် (Film Stocks & LUTs)',
          labelEn: 'Film Stocks & Color LUTs',
          descMm: 'Kodak Portra 400၊ Fujifilm Pro 400H၊ Cyber Neon၊ CineModern Teal & Orange ၁၉ မျိုး',
          descEn: 'Kodak Portra 400, Fujifilm Pro 400H, Cyber Neon, CineModern Teal & Orange',
          icon: Film,
          keywords: ['film', 'color', 'portra', 'fuji', 'neon', 'teal orange', 'grade', 'lut', 'ဖလင်'],
          getCurrentSummary: (sel, lang) => {
            const col = COLOR_GRADE_OPTIONS.find(c => c.id === sel.colorGrade);
            return col ? (lang === 'my' ? col.labelMm : col.labelEn) : 'Cyber Neon';
          }
        },
        {
          id: 'retouch_makeup',
          countBadge: '15',
          labelMm: 'အသားအရေ နှင့် မိတ်ကပ် (Skin & Makeup)',
          labelEn: 'Skin Retouching & Makeup',
          descMm: 'ချွေးပေါက်ပါမြင်ရသော သဘာဝအသားအရေ၊ မြန်မာ့ရိုးရာ သနပ်ခါး၊ Glamour မိတ်ကပ်',
          descEn: 'Sub-surface skin pores, natural editorial finish, traditional Thanaka, and glam makeup',
          icon: Sparkles,
          keywords: ['skin', 'retouch', 'makeup', 'pores', 'beauty', 'thanaka', 'အသားအရေ', 'မိတ်ကပ်'],
          getCurrentSummary: (sel, lang) => {
            const ret = RETOUCH_OPTIONS.find(r => r.id === sel.retouching);
            return ret ? (lang === 'my' ? ret.labelMm : ret.labelEn) : 'Ultra-Realism';
          }
        },
        {
          id: 'photo_styles',
          countBadge: '20',
          labelMm: 'ဓာတ်ပုံ အနုပညာ စတိုင်လ် (Photo Styles)',
          labelEn: 'Photography Aesthetics',
          descMm: 'ဖက်ရှင် မဂ္ဂဇင်း စတိုင်လ်၊ မှတ်တမ်းရုပ်ရှင်၊ ရုပ်ရှင်ကားကြီး စတိုင်လ် ၂၀ မျိုး',
          descEn: 'High Fashion Editorial, Documentary Photojournalism, Cinematic Still, 90s Film',
          icon: Palette,
          keywords: ['style', 'photo style', 'aesthetic', 'vogue', 'editorial', 'vintage', 'စတိုင်လ်'],
          getCurrentSummary: (sel, lang) => {
            const ps = PHOTO_STYLE_OPTIONS.find(p => p.id === sel.photoStyle);
            return ps ? `${ps.emoji} ${lang === 'my' ? ps.labelMm : ps.labelEn}` : 'Editorial Vogue';
          }
        },
        {
          id: 'aspect_ratio_settings',
          countBadge: '6',
          labelMm: 'ဓာတ်ပုံ အချိုးအစား (Aspect Ratio)',
          labelEn: 'Aspect Ratio & Resolution',
          descMm: '9:16 (TikTok/Reels), 4:5 (Instagram), 16:9 (Widescreen), 1:1 (Square), 3:4',
          descEn: '9:16 TikTok/Reels, 4:5 Instagram Portrait, 16:9 Cinematic, 1:1 Square, 3:4',
          icon: Maximize2,
          keywords: ['aspect', 'ratio', 'resolution', '9:16', '4:5', '16:9', '1:1', 'pixels', 'အချိုးအစား'],
          getCurrentSummary: (sel) => {
            const ar = ASPECT_RATIOS.find(r => r.ratio === (sel.aspectRatio || '9:16') || r.id === sel.aspectRatio);
            return ar ? `${ar.ratio} (${ar.width}×${ar.height})` : '9:16 (1080×1920)';
          }
        },
        {
          id: 'quality_engine_settings',
          countBadge: '15',
          labelMm: 'အရည်အသွေး အင်ဂျင် နှင့် Sliders',
          labelEn: 'Quality Profile & Weights',
          descMm: '8K UHD Ultra Detail, Midjourney Raw, Unreal Engine 5, Style Strength & Weight',
          descEn: '8K UHD Ultra Detail, Midjourney Photoreal, Unreal Engine 5, Style & Prompt Weights',
          icon: Settings2,
          keywords: ['quality', 'engine', '8k', 'uhd', 'unreal', 'weight', 'strength', 'sliders', 'အင်ဂျင်'],
          getCurrentSummary: (sel) => {
            const q = QUALITY_PROFILES.find(qp => qp.id === sel.qualityProfile);
            return q ? q.label : '8K UHD Masterpiece';
          }
        }
      ]
    },
    {
      id: 'box5',
      boxNumber: '5',
      boxLabel: 'Box 5',
      titleMm: 'Templates & Presets (အသင့်သုံး ပုံစံများ)',
      titleEn: 'Templates & Presets',
      taglineMm: 'အသင့်သုံး 30 Studio Templates များ · Detail Prompt & Instructions',
      taglineEn: '30 Curated Studio Presets with Detail Prompt & Instructions',
      icon: Layers,
      getCurrentSummary: (_sel, lang) => lang === 'my' ? '30 Studio Templates' : '30 Curated Templates',
      subMenus: [
        {
          id: 'template_gallery_all',
          countBadge: '30',
          labelMm: 'Templates အားလုံး (All 30 Presets)',
          labelEn: 'All 30 Studio Templates',
          descMm: 'ရိုးရာ၊ ပွဲတော်၊ ဖက်ရှင်၊ ရုပ်ရှင်ဆန် စတူဒီယို အသင့်သုံး ပုံစံများ',
          descEn: 'All 30 templates with complete positive prompt, negative prompt & instructions',
          icon: Layers,
          keywords: ['template', 'preset', 'all', 'studio', '30'],
          getCurrentSummary: () => '30 Templates'
        },
        {
          id: 'template_traditional',
          countBadge: '10',
          labelMm: 'ရိုးရာ နန်းတွင်း / တိုင်းရင်းသား',
          labelEn: 'Royal Courts & Ethnic Heritage',
          descMm: 'ကုန်းဘောင်၊ အင်းဝ၊ ရှမ်း၊ ကချင်၊ ချင်း၊ မွန်၊ ရခိုင်၊ ပအိုဝ်း ရိုးရာဝတ်စုံများ',
          descEn: 'Konbaung, Inwa, Shan, Kachin, Chin, Mon, Rakhine, Pa-O Royal Heritage',
          icon: Sparkles,
          keywords: ['traditional', 'royal', 'ethnic', 'shan', 'kachin', 'chin', 'mon', 'rakhine'],
          getCurrentSummary: () => 'Royal & Ethnic'
        },
        {
          id: 'template_festival',
          countBadge: '8',
          labelMm: 'ပွဲတော် နှင့် မင်္ဂလာအခမ်းအနား',
          labelEn: 'Festivals & Wedding Celebrations',
          descMm: 'သင်္ကြန်ရေသဘင်၊ သီတင်းကျွတ်မီးထွန်းပွဲ၊ တန်ဆောင်တိုင်မီးပုံးပျံ၊ ရိုးရာမင်္ဂလာဆောင်',
          descEn: 'Thingyan Water Festival, Thadingyut Lights, Hot Air Balloon, Traditional Wedding',
          icon: Flame,
          keywords: ['festival', 'wedding', 'thingyan', 'thadingyut', 'balloon'],
          getCurrentSummary: () => 'Festivals & Wedding'
        },
        {
          id: 'template_fashion',
          countBadge: '6',
          labelMm: 'ခေတ်ပေါ် ဖက်ရှင် နှင့် ဆိုက်ဘာ',
          labelEn: 'Modern Fashion & Cyberpunk',
          descMm: 'ရန်ကုန် ဆိုက်ဘာ၊ Vogue မဂ္ဂဇင်းကာဗာ၊ ခေတ်ပေါ် ရိုးရာပေါင်းစပ်',
          descEn: 'Cyberpunk Yangon, Vogue Fashion Cover, Modern Fusion',
          icon: Sparkles,
          keywords: ['modern', 'fashion', 'cyberpunk', 'vogue'],
          getCurrentSummary: () => 'Modern & Cyber'
        },
        {
          id: 'template_cinematic',
          countBadge: '6',
          labelMm: 'ရုပ်ရှင်ဆန် နှင့် ရှုခင်း',
          labelEn: 'Cinematic & Scenery',
          descMm: 'ပုဂံနေဝင်ဆည်းဆာ၊ အင်းလေး ရေပြင်ရှုခင်း၊ မန္တလေး တောင်ရိပ်',
          descEn: 'Sunset Bagan Temples, Inle Lake Waterscape, Mandalay Hill Scenery',
          icon: Film,
          keywords: ['cinematic', 'scenery', 'bagan', 'inle', 'landscape'],
          getCurrentSummary: () => 'Cinematic & Scenery'
        }
      ]
    }
  ], [currentMode, isMyanmar]);

  const currentPillar = useMemo(() => {
    if (!activePillarId) return null;
    return PILLARS.find(p => p.id === activePillarId) || PILLARS[0];
  }, [activePillarId, PILLARS]);

  const handleSelectPillar = (pillarId: PillarId, subMenuId?: string) => {
    setActivePillarId(pillarId);
    setSearchQuery('');
    const pillar = PILLARS.find(p => p.id === pillarId);
    if (subMenuId) {
      setActiveSubMenuId(subMenuId);
    } else if (pillar && pillar.subMenus.length > 0) {
      setActiveSubMenuId(pillar.subMenus[0].id);
    }
  };

  const PILLAR_ORDER: PillarId[] = ['box1', 'box2', 'box3', 'box4', 'box5'];
  const currentPillarIndex = activePillarId ? PILLAR_ORDER.indexOf(activePillarId) : 0;
  const prevPillarId = currentPillarIndex > 0 ? PILLAR_ORDER[currentPillarIndex - 1] : null;
  const nextPillarId = currentPillarIndex < PILLAR_ORDER.length - 1 ? PILLAR_ORDER[currentPillarIndex + 1] : null;

  const handlePrevBox = () => {
    if (prevPillarId) {
      handleSelectPillar(prevPillarId);
    }
  };

  const handleNextBox = () => {
    if (nextPillarId) {
      handleSelectPillar(nextPillarId);
    }
  };

  const ADDABLE_CATEGORIES: Array<{
    pillarId: PillarId;
    subMenuId: string;
    labelEn: string;
    labelMm: string;
    emoji: string;
  }> = [
    { pillarId: 'box1', subMenuId: 'subject_type', labelEn: 'Subject Character', labelMm: 'ဇာတ်ကောင်', emoji: '👤' },
    { pillarId: 'box1', subMenuId: 'identity_lock', labelEn: 'Face / Identity Lock', labelMm: 'မျက်နှာ သတ်မှတ်ချက်', emoji: '🔒' },
    { pillarId: 'box1', subMenuId: 'pose_expression', labelEn: 'Pose & Expression', labelMm: 'ကိုယ်ဟန် အမူအရာ', emoji: '🧘' },
    { pillarId: 'box1', subMenuId: 'ethnicity_heritage', labelEn: 'Ethnicity & Region', labelMm: 'လူမျိုးနွယ် / ဒေသ', emoji: '🇲🇲' },
    { pillarId: 'box2', subMenuId: 'garment_catalog', labelEn: 'Garment / Longyi Style', labelMm: 'ဝတ်စုံ ဒီဇိုင်း', emoji: '👗' },
    { pillarId: 'box2', subMenuId: 'cultural_accessories', labelEn: 'Cultural Accessories', labelMm: 'ရိုးရာ အသုံးအဆောင်', emoji: '🌸' },
    { pillarId: 'box2', subMenuId: 'custom_garment_upload', labelEn: 'Custom Clothes Upload', labelMm: 'စိတ်ကြိုက်ဝတ်စုံ', emoji: '🧵' },
    { pillarId: 'box3', subMenuId: 'locations_environments', labelEn: 'Location & Setting', labelMm: 'နောက်ခံ ပတ်ဝန်းကျင်', emoji: '📍' },
    { pillarId: 'box3', subMenuId: 'lighting_ambiance', labelEn: 'Lighting & Atmosphere', labelMm: 'အလင်းအမှောင်', emoji: '💡' },
    { pillarId: 'box3', subMenuId: 'events_festivals', labelEn: 'Festival / Event', labelMm: 'ပွဲတော် / အခမ်းအနား', emoji: '🎉' },
    { pillarId: 'box4', subMenuId: 'camera_lens', labelEn: 'Camera & Lens', labelMm: 'ကင်မရာ / Lens', emoji: '📷' },
    { pillarId: 'box4', subMenuId: 'color_film', labelEn: 'Color LUT / Film Look', labelMm: 'ဖလင်အရောင် Tone', emoji: '🎞️' },
    { pillarId: 'box4', subMenuId: 'retouch_texture', labelEn: 'Skin & Retouching', labelMm: 'အသားအရေ Retouch', emoji: '✨' },
    { pillarId: 'box4', subMenuId: 'makeup_styling', labelEn: 'Makeup Styling', labelMm: 'မိတ်ကပ် ပြင်ဆင်မှု', emoji: '💄' }
  ];

  const handleDeleteOption = (id: string) => {
    switch (id) {
      case 'subject':
        onUpdateSelection({ subject: 'woman', customSubjectDetails: '' });
        break;
      case 'identityLock':
        onUpdateSelection({ identityLock: 'no_lock', referenceImage: null });
        break;
      case 'referenceImage':
        onUpdateSelection({ referenceImage: null });
        break;
      case 'ethnicity':
        onUpdateSelection({ ethnicity: 'skip', customEthnicityDetails: '' });
        break;
      case 'pose':
        onUpdateSelection({ poseExpression: 'skip', customPoseDetails: '' });
        break;
      case 'stature':
        onUpdateSelection({ ageRange: undefined, heightRange: undefined, weightRange: undefined });
        break;
      case 'garment':
        onUpdateSelection({ garmentStyle: 'skip', garmentFabric: '' });
        break;
      case 'fabric':
        onUpdateSelection({ garmentFabric: '' });
        break;
      case 'culturalProps':
        onUpdateSelection({ includeCulturalProps: false, culturalPropsDetails: '' });
        break;
      case 'customGarment':
        onUpdateSelection({ customGarmentImage: null, customGarmentDescription: '', clothesSwapOption: 'in_app_preset' });
        break;
      case 'event':
        onUpdateSelection({ event: 'skip', customEventDetails: '' });
        break;
      case 'location':
        onUpdateSelection({ location: 'skip', customLocationDetails: '' });
        break;
      case 'lighting':
        onUpdateSelection({ timeAndLighting: 'skip', customLightingDetails: '' });
        break;
      case 'mood':
        onUpdateSelection({ moodEmotion: 'skip' });
        break;
      case 'camera':
        onUpdateSelection({ camera: 'skip' });
        break;
      case 'cameraAngle':
        onUpdateSelection({ cameraAngle: 'skip' });
        break;
      case 'colorGrade':
        onUpdateSelection({ colorGrade: 'skip' });
        break;
      case 'retouching':
        onUpdateSelection({ retouching: 'skip' });
        break;
      case 'makeup':
        onUpdateSelection({ makeup: 'skip' });
        break;
      case 'aspectRatio':
        onUpdateSelection({ aspectRatio: '9:16' });
        break;
      case 'qualityProfile':
        onUpdateSelection({ qualityProfile: 'skip' });
        break;
      default:
        break;
    }
  };

  const activeOptionChips = useMemo(() => {
    const chips: Array<{
      id: string;
      pillarId: PillarId;
      subMenuId: string;
      categoryLabelMm: string;
      categoryLabelEn: string;
      valueLabelMm: string;
      valueLabelEn: string;
      emoji?: string;
      canDelete: boolean;
    }> = [];

    // 1. Subject
    const sub = SUBJECT_OPTIONS.find(s => s.id === selection.subject);
    chips.push({
      id: 'subject',
      pillarId: 'box1',
      subMenuId: 'subject_type',
      categoryLabelMm: 'ဇာတ်ကောင်',
      categoryLabelEn: 'Subject',
      valueLabelMm: sub?.labelMm || selection.subject,
      valueLabelEn: sub?.labelEn || selection.subject,
      emoji: sub?.emoji || '👤',
      canDelete: true
    });

    // 2. Garment
    if (selection.garmentStyle && selection.garmentStyle !== 'skip') {
      const g = GARMENT_OPTIONS.find(ga => ga.id === selection.garmentStyle);
      chips.push({
        id: 'garment',
        pillarId: 'box2',
        subMenuId: 'garment_catalog',
        categoryLabelMm: 'ဝတ်စုံ',
        categoryLabelEn: 'Garment',
        valueLabelMm: g?.labelMm || selection.garmentStyle,
        valueLabelEn: g?.labelEn || selection.garmentStyle,
        emoji: g?.emoji || '👗',
        canDelete: true
      });
    }

    // 3. Location
    if (selection.location && selection.location !== 'skip') {
      const loc = LOCATION_OPTIONS.find(l => l.id === selection.location);
      chips.push({
        id: 'location',
        pillarId: 'box3',
        subMenuId: 'locations_environments',
        categoryLabelMm: 'နောက်ခံ',
        categoryLabelEn: 'Location',
        valueLabelMm: loc?.labelMm || selection.location,
        valueLabelEn: loc?.labelEn || selection.location,
        emoji: loc?.emoji || '📍',
        canDelete: true
      });
    }

    // 4. Lighting
    if (selection.timeAndLighting && selection.timeAndLighting !== 'skip') {
      const lit = LIGHTING_OPTIONS.find(li => li.id === selection.timeAndLighting);
      chips.push({
        id: 'lighting',
        pillarId: 'box3',
        subMenuId: 'lighting_ambiance',
        categoryLabelMm: 'အလင်း',
        categoryLabelEn: 'Lighting',
        valueLabelMm: lit?.labelMm || selection.timeAndLighting,
        valueLabelEn: lit?.labelEn || selection.timeAndLighting,
        emoji: lit?.emoji || '💡',
        canDelete: true
      });
    }

    // 5. Event
    if (selection.event && selection.event !== 'skip') {
      const ev = EVENT_OPTIONS.find(e => e.id === selection.event);
      chips.push({
        id: 'event',
        pillarId: 'box3',
        subMenuId: 'events_festivals',
        categoryLabelMm: 'ပွဲတော်',
        categoryLabelEn: 'Event',
        valueLabelMm: ev?.labelMm || selection.event,
        valueLabelEn: ev?.labelEn || selection.event,
        emoji: ev?.emoji || '🎉',
        canDelete: true
      });
    }

    // 6. Camera
    if (selection.camera && selection.camera !== 'skip') {
      const cam = CAMERA_OPTIONS.find(c => c.id === selection.camera);
      chips.push({
        id: 'camera',
        pillarId: 'box4',
        subMenuId: 'camera_lens',
        categoryLabelMm: 'ကင်မရာ',
        categoryLabelEn: 'Camera',
        valueLabelMm: cam?.label || selection.camera,
        valueLabelEn: cam?.label || selection.camera,
        emoji: '📷',
        canDelete: true
      });
    }

    // 7. Color / Film
    if (selection.colorGrade && selection.colorGrade !== 'skip') {
      const col = COLOR_GRADE_OPTIONS.find(c => c.id === selection.colorGrade);
      chips.push({
        id: 'colorGrade',
        pillarId: 'box4',
        subMenuId: 'color_film',
        categoryLabelMm: 'ဖလင်',
        categoryLabelEn: 'Film LUT',
        valueLabelMm: col?.labelMm || selection.colorGrade,
        valueLabelEn: col?.labelEn || selection.colorGrade,
        emoji: '🎞️',
        canDelete: true
      });
    }

    // 8. Aspect Ratio
    if (selection.aspectRatio) {
      chips.push({
        id: 'aspectRatio',
        pillarId: 'box4',
        subMenuId: 'aspect_ratio_settings',
        categoryLabelMm: 'အချိုး',
        categoryLabelEn: 'Ratio',
        valueLabelMm: selection.aspectRatio,
        valueLabelEn: selection.aspectRatio,
        emoji: '📐',
        canDelete: true
      });
    }

    // 9. Cultural Props
    if (selection.includeCulturalProps || selection.culturalPropsDetails) {
      chips.push({
        id: 'culturalProps',
        pillarId: 'box2',
        subMenuId: 'cultural_accessories',
        categoryLabelMm: 'ရိုးရာ',
        categoryLabelEn: 'Props',
        valueLabelMm: 'သနပ်ခါး/ပုသိမ်ထီး',
        valueLabelEn: 'Cultural Props',
        emoji: '🌸',
        canDelete: true
      });
    }

    // 10. Photo Reference
    if (selection.referenceImage) {
      chips.push({
        id: 'referenceImage',
        pillarId: 'box1',
        subMenuId: 'identity_lock',
        categoryLabelMm: 'ရည်ညွှန်းပုံ',
        categoryLabelEn: 'Photo Ref',
        valueLabelMm: 'ပုံတင်ထားသည်',
        valueLabelEn: 'Attached',
        emoji: '🖼️',
        canDelete: true
      });
    }

    // 11. Pose & Expression
    if (selection.poseExpression && selection.poseExpression !== 'looking_at_camera' && selection.poseExpression !== 'skip') {
      const p = POSE_EXPRESSION_OPTIONS.find(po => po.id === selection.poseExpression);
      chips.push({
        id: 'pose',
        pillarId: 'box1',
        subMenuId: 'pose_expression',
        categoryLabelMm: 'ကိုယ်ဟန်',
        categoryLabelEn: 'Pose',
        valueLabelMm: p?.labelMm || selection.poseExpression,
        valueLabelEn: p?.labelEn || selection.poseExpression,
        emoji: '🧘',
        canDelete: true
      });
    }

    // 12. Ethnicity & Heritage
    if (selection.ethnicity && selection.ethnicity !== 'skip' && (selection.ethnicity !== 'burmese' || selection.customEthnicityDetails)) {
      const eth = ETHNICITY_OPTIONS.find(e => e.id === selection.ethnicity);
      chips.push({
        id: 'ethnicity',
        pillarId: 'box1',
        subMenuId: 'ethnicity_heritage',
        categoryLabelMm: 'လူမျိုး/ဒေသ',
        categoryLabelEn: 'Ethnicity',
        valueLabelMm: eth?.labelMm || selection.ethnicity,
        valueLabelEn: eth?.labelEn || selection.ethnicity,
        emoji: '🇲🇲',
        canDelete: true
      });
    }

    // 13. Retouching & Texture
    if (selection.retouching && selection.retouching !== 'ultra_realism' && selection.retouching !== 'skip') {
      const r = RETOUCH_OPTIONS.find(ro => ro.id === selection.retouching);
      chips.push({
        id: 'retouching',
        pillarId: 'box4',
        subMenuId: 'retouch_texture',
        categoryLabelMm: 'အသားအရေ',
        categoryLabelEn: 'Retouching',
        valueLabelMm: r?.labelMm || selection.retouching,
        valueLabelEn: r?.labelEn || selection.retouching,
        emoji: '✨',
        canDelete: true
      });
    }

    // 14. Makeup Styling
    if (selection.makeup && selection.makeup !== 'traditional_myanmar' && selection.makeup !== 'skip') {
      chips.push({
        id: 'makeup',
        pillarId: 'box4',
        subMenuId: 'makeup_styling',
        categoryLabelMm: 'မိတ်ကပ်',
        categoryLabelEn: 'Makeup',
        valueLabelMm: selection.makeup.replace(/_/g, ' '),
        valueLabelEn: selection.makeup.replace(/_/g, ' '),
        emoji: '💄',
        canDelete: true
      });
    }

    // 15. Custom Garment
    if (selection.customGarmentImage || selection.customGarmentDescription) {
      chips.push({
        id: 'customGarment',
        pillarId: 'box2',
        subMenuId: 'custom_garment_upload',
        categoryLabelMm: 'စိတ်ကြိုက်ဝတ်စုံ',
        categoryLabelEn: 'Custom Clothes',
        valueLabelMm: selection.customGarmentDescription ? selection.customGarmentDescription.slice(0, 15) : 'Uploaded image',
        valueLabelEn: selection.customGarmentDescription ? selection.customGarmentDescription.slice(0, 15) : 'Uploaded image',
        emoji: '🧵',
        canDelete: true
      });
    }

    // 16. Quality Profile
    if (selection.qualityProfile && selection.qualityProfile !== '8k_uhd' && selection.qualityProfile !== 'skip') {
      chips.push({
        id: 'qualityProfile',
        pillarId: 'box4',
        subMenuId: 'quality_profile',
        categoryLabelMm: 'အရည်အသွေး',
        categoryLabelEn: 'Quality',
        valueLabelMm: selection.qualityProfile.toUpperCase(),
        valueLabelEn: selection.qualityProfile.toUpperCase(),
        emoji: '💎',
        canDelete: true
      });
    }

    return chips;
  }, [selection]);

  const filteredSubMenus = useMemo(() => {
    if (!currentPillar) return [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return currentPillar.subMenus;

    return currentPillar.subMenus.filter(sub => {
      const matchLabel = sub.labelEn.toLowerCase().includes(q) || sub.labelMm.toLowerCase().includes(q);
      const matchDesc = sub.descEn.toLowerCase().includes(q) || sub.descMm.toLowerCase().includes(q);
      const matchKeywords = sub.keywords.some(k => k.toLowerCase().includes(q));
      return matchLabel || matchDesc || matchKeywords;
    });
  }, [currentPillar, searchQuery]);

  React.useEffect(() => {
    if (filteredSubMenus.length > 0 && !filteredSubMenus.some(s => s.id === activeSubMenuId)) {
      setActiveSubMenuId(filteredSubMenus[0].id);
    }
  }, [filteredSubMenus, activeSubMenuId]);

  // -------------------------------------------------------------
  // RENDER CONTENT VIEW CONTAINER FOR ACTIVE SUB MENU
  // -------------------------------------------------------------
  const renderContentView = () => {
    switch (activeSubMenuId) {
      case 'subject_type':
        return (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <User className="h-4 w-4 text-cyan-400" />
                <span>{isMyanmar ? 'အဓိက ဇာတ်ကောင် အမျိုးအစား ရွေးချယ်ပါ' : 'Select Primary Subject Category'}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isMyanmar
                  ? 'သင်ဖန်တီးလိုသော ဓာတ်ပုံထဲမှ အဓိက ဇာတ်ကောင် (သို့မဟုတ်) အရာဝတ္ထုကို ရွေးချယ်ပါ'
                  : 'Choose the hero subject, model, or commercial object for your photograph.'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {SUBJECT_OPTIONS.map((sub, idx) => {
                const isSelected = selection.subject === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      if (isSelected) {
                        // Second click: cancel / reset subject
                        setUserAgeMode(null);
                        onUpdateSelection({
                          subject: 'woman',
                          customSubjectDetails: '',
                          ageRange: undefined
                        });
                        return;
                      }

                      if (sub.id === 'pet') {
                        setActiveSubTab('pet');
                        onUpdateSelection({
                          subject: 'pet',
                          customSubjectDetails: selection.customSubjectDetails || PET_OPTIONS[0].promptText
                        });
                      } else if (sub.id === 'product') {
                        setActiveSubTab('product');
                        onUpdateSelection({
                          subject: 'product',
                          customSubjectDetails: selection.customSubjectDetails || PRODUCT_OPTIONS[0].promptText
                        });
                      } else if (sub.id === 'fashion') {
                        setActiveSubTab('fashion');
                        onUpdateSelection({
                          subject: 'fashion',
                          customSubjectDetails: selection.customSubjectDetails || FASHION_OPTIONS[0].promptText,
                          garmentStyle: FASHION_OPTIONS[0].promptText
                        });
                      } else if (sub.id === 'couple') {
                        setActiveSubTab('couple_wedding');
                        onUpdateSelection({
                          subject: 'couple',
                          customSubjectDetails: selection.customSubjectDetails || WEDDING_COUPLE_OPTIONS[0].promptText
                        });
                      } else if (sub.id === 'child') {
                        setUserAgeMode('child');
                        onUpdateSelection({
                          subject: 'child',
                          ageRange: selection.ageRange?.includes('years') ? selection.ageRange : '7_years'
                        });
                      } else {
                        setUserAgeMode('adult');
                        onUpdateSelection({
                          subject: sub.id,
                          ageRange: selection.ageRange?.includes('years') ? '18_25' : selection.ageRange
                        });
                      }
                    }}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-slate-950 border-cyan-400 text-white shadow-[0_0_16px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                        : 'bg-black/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md text-[11px] font-bold bg-slate-800 text-slate-400">
                        {idx + 1}
                      </span>
                      <span className="text-xl shrink-0">{sub.emoji}</span>
                      <div className="truncate">
                        <div className="text-xs font-bold truncate">
                          {isMyanmar ? sub.labelMm : sub.labelEn}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {sub.labelEn}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="h-2 w-2 rounded-full bg-cyan-400 shrink-0"></div>
                    )}
                  </button>
                );
              })}
            </div>

            {(selection.subject === 'pet' || selection.subject === 'product' || selection.subject === 'fashion') && (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                    <span>
                      {selection.subject === 'pet'
                        ? (isMyanmar ? 'အိမ်မွေးတိရစ္ဆာန် Option ၂၀ မျိုး' : 'Select Pet Option (20 Variations)')
                        : selection.subject === 'product'
                        ? (isMyanmar ? 'ကုန်ပစ္စည်း Option ၂၀ မျိုး' : 'Select Commercial Product Option (20 Variations)')
                        : (isMyanmar ? 'ဖက်ရှင် Option ၂၅ မျိုး' : 'Select Fashion Option (25 Variations)')}
                    </span>
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {(selection.subject === 'pet' ? PET_OPTIONS : selection.subject === 'product' ? PRODUCT_OPTIONS : FASHION_OPTIONS).map((opt) => {
                    const isSelected = selection.customSubjectDetails === opt.promptText || selection.garmentStyle === opt.promptText;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            // Second click: cancel / deselect option
                            onUpdateSelection({
                              customSubjectDetails: '',
                              garmentStyle: selection.subject === 'fashion' ? 'silk_longyi' : selection.garmentStyle
                            });
                            return;
                          }
                          if (selection.subject === 'pet') {
                            onUpdateSelection({ subject: 'pet', customSubjectDetails: opt.promptText });
                          } else if (selection.subject === 'product') {
                            onUpdateSelection({ subject: 'product', customSubjectDetails: opt.promptText });
                          } else if (selection.subject === 'fashion') {
                            onUpdateSelection({ subject: 'fashion', customSubjectDetails: opt.promptText, garmentStyle: opt.promptText });
                          }
                        }}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border text-left text-xs transition-all ${
                          isSelected
                            ? 'bg-slate-900 border-cyan-400 text-cyan-100 shadow-sm'
                            : 'bg-black/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                        }`}
                      >
                        <span className="text-base">{opt.emoji}</span>
                        <span className="truncate font-medium">{isMyanmar ? opt.labelMm : opt.labelEn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isMyanmar ? 'ဇာတ်ကောင် အသေးစိတ် ဖြည့်စွက်ရန် (Optional):' : 'Fine-Grained Subject Specification (Optional):'}
              </label>
              <input
                type="text"
                value={selection.customSubjectDetails || ''}
                onChange={(e) => onUpdateSelection({ customSubjectDetails: e.target.value })}
                placeholder={isMyanmar ? "ဥပမာ- အသက် ၂၄ နှစ်အရွယ်၊ မျက်မှန်အဝိုင်းနှင့် ချစ်စဖွယ် အပြုံး..." : "e.g. 24yo model with rimless round glasses, warm genuine smile..."}
                className="w-full rounded-xl bg-black/90 border border-slate-800 px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-all shadow-inner"
              />
            </div>
          </div>
        );

      case 'identity_lock':
        return (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-cyan-400" />
                <span>{isMyanmar ? 'ဓာတ်ပုံ အထောက်အထား နှင့် မူရင်းရုပ် ထိန်းသိမ်းခြင်း' : 'Identity Preservation & Reference Engine'}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isMyanmar
                  ? 'မျက်နှာသွင်ပြင် မပြောင်းလဲဘဲ မူရင်းလူအတိုင်း ၁၀၀% ထိန်းသိမ်းပြီး စတိုင်လ်အသစ် ဖန်တီးပါ'
                  : 'Maintain 100% facial fidelity and bone structure while reimagining environment, lighting, and wardrobe.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {IDENTITY_LOCK_OPTIONS.map((lock) => {
                const currentLock = selection.identityLock || (currentMode === 'txt2img' ? 'no_lock' : 'face_100');
                const isSelected = currentLock === lock.id;
                return (
                  <button
                    key={lock.id}
                    onClick={() => onUpdateSelection({ identityLock: isSelected ? 'no_lock' : lock.id })}
                    className={`flex flex-col text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-slate-950 border-cyan-400 text-white shadow-[0_0_16px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400'
                        : 'bg-black/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-xs">
                        <span className="text-base">{lock.emoji}</span>
                        <span>{isMyanmar ? lock.labelMm : lock.labelEn}</span>
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-cyan-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                      {isMyanmar
                        ? lock.descMm
                        : lock.id === 'face_100'
                        ? 'Preserve 100% facial features, eyes, nose, and lips unchanged.'
                        : lock.id === 'face_body_lock'
                        ? 'Preserve facial identity and anatomical body proportions.'
                        : lock.id === 'soft_ref'
                        ? 'Soft organic resemblance adapted to lighting and styling.'
                        : 'Unrestricted creative generation without facial locking.'}
                    </p>
                  </button>
                );
              })}
            </div>

            <SubjectPreserveFeatureBox
              selection={selection}
              onUpdateSelection={onUpdateSelection}
              isMyanmar={isMyanmar}
            />

            <div className="pt-2">
              <Img2ImgUploader
                language={language}
                selection={selection}
                onUpdateSelection={onUpdateSelection}
                currentMode={currentMode}
              />
            </div>
          </div>
        );

      case 'ethnicity_culture':
        return (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Globe className="h-4 w-4 text-cyan-400" />
                <span>{isMyanmar ? 'လူမျိုး နှင့် ရိုးရာ ယဉ်ကျေးမှု ရွေးချယ်ပါ' : 'Select Ethnicity & Cultural Heritage'}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isMyanmar
                  ? 'မြန်မာ့တိုင်းရင်းသားများနှင့် ကမ္ဘာ့လူမျိုးစုံ မျက်နှာသွင်ပြင်ကို သတ်မှတ်ပါ'
                  : 'Define facial structure, heritage, and regional cultural hallmarks.'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ETHNICITY_OPTIONS.map((eth) => {
                const currentEth = selection.ethnicity || 'burmese';
                const isSelected = currentEth === eth.id;
                return (
                  <button
                    key={eth.id}
                    onClick={() => onUpdateSelection({ ethnicity: isSelected ? 'skip' : eth.id, customEthnicityDetails: isSelected ? '' : undefined })}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all ${
                      isSelected
                        ? 'bg-slate-950 border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400'
                        : 'bg-black/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span className="text-base">{eth.emoji}</span>
                      <span className="font-semibold truncate">{isMyanmar ? eth.labelMm : eth.labelEn}</span>
                    </span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <CulturalPropsDropdown
                language={language}
                selection={selection}
                onUpdateSelection={onUpdateSelection}
              />
            </div>
          </div>
        );

      case 'physical_profile':
        const ageOptions = userAgeMode === 'child' ? CHILD_AGE_OPTIONS : AGE_RANGE_OPTIONS;
        return (
          <div className="space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Ruler className="h-4 w-4 text-cyan-400" />
                <span>{isMyanmar ? 'အရပ်အမြင့်၊ အလေးချိန်နှင့် အသက်အရွယ်' : 'Physical Stature, Build & Age Profile'}</span>
              </h3>
            </div>

            <div className="space-y-2.5 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-amber-400" />
                  <span>{isMyanmar ? 'အသက်အရွယ် အပိုင်းအခြား (Age Range)' : 'Age Range Profile'}</span>
                </span>
                <div className="flex items-center gap-1 bg-black p-0.5 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setUserAgeMode('child')}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded ${userAgeMode === 'child' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'}`}
                  >
                    {isMyanmar ? 'ကလေး (၃–၁၂)' : 'Child (3-12)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserAgeMode('adult')}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded ${userAgeMode !== 'child' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'}`}
                  >
                    {isMyanmar ? 'လူကြီး (Adult)' : 'Adult'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {ageOptions.map((age) => {
                  const currentAge = selection.ageRange || (userAgeMode === 'child' ? '7_years' : '18_25');
                  const isSelected = currentAge === age.id;
                  return (
                    <button
                      key={age.id}
                      type="button"
                      onClick={() => onUpdateSelection({ ageRange: isSelected ? '' : age.id })}
                      className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-slate-900 border-cyan-400 text-white font-bold shadow-sm'
                          : 'bg-black/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <div className="text-base">{age.emoji}</div>
                      <div className="truncate mt-1">{isMyanmar ? age.labelMm : age.labelEn}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2.5 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Ruler className="h-3.5 w-3.5 text-sky-400" />
                  <span>{isMyanmar ? 'အရပ်အမြင့် (Height / Stature)' : 'Height / Stature'}</span>
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateSelection({ heightRange: 'skip' })}
                  className="text-[10px] text-amber-400 hover:underline"
                >
                  {isMyanmar ? 'မူလအတိုင်း ထားပါ' : 'Reset Height'}
                </button>
              </div>

              <div className="relative">
                <div className="flex items-center gap-1.5 mb-1.5 text-[10px] text-slate-400 justify-end">
                  <button onClick={() => handleHeightScroll('left')} className="p-1 rounded bg-slate-800 hover:bg-slate-700">
                    <ChevronLeft className="h-3 w-3" />
                  </button>
                  <button onClick={() => handleHeightScroll('right')} className="p-1 rounded bg-slate-800 hover:bg-slate-700">
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
                <div ref={heightScrollRef} className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
                  {HEIGHT_OPTIONS.map((opt) => {
                    const isSelected = selection.heightRange === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => onUpdateSelection({ heightRange: isSelected ? '' : opt.id })}
                        className={`shrink-0 px-3 py-2 rounded-xl border text-xs font-medium whitespace-nowrap transition-all ${
                          isSelected
                            ? 'bg-slate-900 border-cyan-400 text-white font-bold shadow-sm'
                            : 'bg-black/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                        }`}
                      >
                        <span className="mr-1.5">{opt.emoji}</span>
                        <span>{isMyanmar ? opt.labelMm : opt.labelEn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-2.5 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Scale className="h-3.5 w-3.5 text-teal-400" />
                  <span>{isMyanmar ? 'ခန္ဓာကိုယ် တည်ဆောက်ပုံ (Weight / Build)' : 'Body Build & Weight'}</span>
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateSelection({ weightRange: 'skip' })}
                  className="text-[10px] text-amber-400 hover:underline"
                >
                  {isMyanmar ? 'မူလအတိုင်း ထားပါ' : 'Reset Build'}
                </button>
              </div>

              <div className="relative">
                <div className="flex items-center gap-1.5 mb-1.5 text-[10px] text-slate-400 justify-end">
                  <button onClick={() => handleWeightScroll('left')} className="p-1 rounded bg-slate-800 hover:bg-slate-700">
                    <ChevronLeft className="h-3 w-3" />
                  </button>
                  <button onClick={() => handleWeightScroll('right')} className="p-1 rounded bg-slate-800 hover:bg-slate-700">
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
                <div ref={weightScrollRef} className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
                  {WEIGHT_OPTIONS.map((opt) => {
                    const isSelected = selection.weightRange === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => onUpdateSelection({ weightRange: isSelected ? '' : opt.id })}
                        className={`shrink-0 px-3 py-2 rounded-xl border text-xs font-medium whitespace-nowrap transition-all ${
                          isSelected
                            ? 'bg-slate-900 border-cyan-400 text-white font-bold shadow-sm'
                            : 'bg-black/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                        }`}
                      >
                        <span className="mr-1.5">{opt.emoji}</span>
                        <span>{isMyanmar ? opt.labelMm : opt.labelEn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case 'pose_expression':
        return (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Smile className="h-4 w-4 text-cyan-400" />
                <span>{isMyanmar ? 'ဟန်ပန်နှင့် မျက်နှာအမူအရာ (၂၅ မျိုး)' : 'Signature Poses & Emotional Expressions (25 Poses)'}</span>
              </h3>
            </div>
            <PoseSelectionCarousel
              language={language}
              selection={selection}
              onUpdateSelection={onUpdateSelection}
            />
          </div>
        );

      case 'couple_customizer':
        return (
          <div className="space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Heart className="h-4 w-4 text-rose-400" />
                <span>{isMyanmar ? 'စုံတွဲနှင့် မင်္ဂလာဆောင် စတူဒီယို ဆက်တင်' : 'Couple & Wedding Studio Atelier'}</span>
              </h3>
            </div>

            {selection.subject !== 'couple' && (
              <div className="p-3 rounded-xl bg-slate-950 border border-rose-500/40 flex items-center justify-between">
                <span className="text-xs text-rose-200">
                  {isMyanmar ? 'စုံတွဲမုဒ်ကို ဖွင့်ရန် ဤခလုတ်ကို နှိပ်ပါ' : 'Activate Couple Mode for this section'}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateSelection({ subject: 'couple' })}
                  className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-500"
                >
                  {isMyanmar ? 'စုံတွဲမုဒ် ပြောင်းမည်' : 'Switch to Couple'}
                </button>
              </div>
            )}

            <CoupleDetailsCustomizer
              selection={selection}
              onUpdateSelection={onUpdateSelection}
              isMyanmar={isMyanmar}
            />

            <WeddingPropsPanel
              selection={selection}
              onUpdateSelection={onUpdateSelection}
              isMyanmar={isMyanmar}
            />
          </div>
        );

      // ---------------------------------------------------------
      // BOX 2: WARDROBE & CLOTHES SWAP
      // ---------------------------------------------------------
      case 'clothes_swap_studio':
        return (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Shirt className="h-4 w-4 text-amber-400" />
                <span>{isMyanmar ? 'မဂ္ဂဇင်း ဖက်ရှင် ဝတ်စုံလဲ စတူဒီယို' : 'AI Fashion Clothes Swap Studio'}</span>
              </h3>
            </div>

            <ClothesSwapPanel
              language={language}
              selection={selection}
              onUpdateSelection={onUpdateSelection}
              currentMode={currentMode}
            />

            <div className="pt-2">
              <CustomGarmentUploader
                language={language}
                selection={selection}
                onUpdateSelection={onUpdateSelection}
              />
            </div>
          </div>
        );

      case 'garment_catalog':
        return (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Palette className="h-4 w-4 text-amber-400" />
                <span>{isMyanmar ? 'ဝတ်စုံ စတိုင်လ် ရွေးချယ်မှု (၃၂ မျိုး)' : 'Garment & Outfit Catalog (32 Options)'}</span>
              </h3>
            </div>

            <GarmentSelectionCarousel
              language={language}
              selection={selection}
              onUpdateSelection={onUpdateSelection}
            />
          </div>
        );

      case 'fabric_texture':
        return (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Layers className="h-4 w-4 text-amber-400" />
                <span>{isMyanmar ? 'ပိတ်စ အမျိုးအစား နှင့် အသွင်အပြင် (Fabric Texture)' : 'Fabric Weave & Material Texture'}</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { label: 'Woven Silk with Water Droplets', labelMm: 'ရေစက်စိုစွတ်နေသော ပိုးရက်ကန်း', desc: 'Photorealistic Thingyan water droplets on crisp woven silk' },
                { label: 'Traditional Konbaung Gold Brocade', labelMm: 'ကုန်းဘောင်ခေတ် ရွှေချည်ထိုး ပိုးထည်', desc: 'Intricate metallic gold embroidery with royal motifs' },
                { label: 'Lustrous Royal Velvet', labelMm: 'တောက်ပ နူးညံ့သော မင်းခမ်းတော် ကတ္တီပါ', desc: 'Deep light-absorbing velvet with opulent rim sheen' },
                { label: 'Crisp Tailored Cotton Linen', labelMm: 'သပ်ရပ် သဘာဝကျသော ချည်သား ပိတ်ချော', desc: 'Breathable, tactile organic weave texture' },
                { label: 'High-Shine Liquid Silk Satin', labelMm: 'အရည်ပျော်နေသကဲ့သို့ တောက်ပသော ပိုးဖဲ', desc: 'Fluid liquid draping with specular studio reflections' },
                { label: 'Heavy Wool Suiting Texture', labelMm: 'ဂုဏ်သရေရှိ သိုးမွေး ကုတ်အင်္ကျီ ပိတ်သား', desc: 'Fine herringbone or matte worsted wool weave' }
              ].map((fab, idx) => {
                const isSelected = selection.garmentFabric === fab.label;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onUpdateSelection({ garmentFabric: isSelected ? '' : fab.label })}
                    className={`flex flex-col text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-slate-900 border-amber-400 text-white shadow-md ring-1 ring-amber-400'
                        : 'bg-black/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-xs">
                      <span>{isMyanmar ? fab.labelMm : fab.label}</span>
                      {isSelected && <Check className="h-4 w-4 text-amber-400" />}
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1">{fab.desc}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <input
                type="text"
                value={selection.garmentFabric || ''}
                onChange={(e) => onUpdateSelection({ garmentFabric: e.target.value })}
                placeholder="e.g. Handwoven raw silk with subtle gold threads..."
                className="w-full rounded-xl bg-black/90 border border-slate-800 px-3.5 py-2.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
        );

      case 'cultural_accessories':
        return (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>{isMyanmar ? 'ရိုးရာ အသုံးအဆောင်နှင့် ရတနာများ' : 'Cultural Accessories, Props & Jewelry'}</span>
              </h3>
            </div>

            <CulturalPropsDropdown
              language={language}
              selection={selection}
              onUpdateSelection={onUpdateSelection}
            />
          </div>
        );

      // ---------------------------------------------------------
      // BOX 3: SCENE & LIGHTING
      // ---------------------------------------------------------
      case 'events_festivals':
        return (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Sun className="h-4 w-4 text-teal-400" />
                <span>{isMyanmar ? 'ပွဲတော်များနှင့် အခမ်းအနားများ (၃၀ မျိုး)' : 'Festivals & Ceremonies (30 Options)'}</span>
              </h3>
            </div>
            <EventSelectionCarousel
              language={language}
              selection={selection}
              onUpdateSelection={onUpdateSelection}
            />
          </div>
        );

      case 'locations_environments':
        return (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Mountain className="h-4 w-4 text-teal-400" />
                <span>{isMyanmar ? 'နောက်ခံ ရှုခင်းနှင့် တည်နေရာ (၃၆ မျိုး)' : 'Locations & Scenery (36 Options)'}</span>
              </h3>
            </div>
            <LocationSelectionCarousel
              language={language}
              selection={selection}
              onUpdateSelection={onUpdateSelection}
            />
          </div>
        );

      case 'lighting_ambiance':
        return (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Sun className="h-4 w-4 text-teal-400" />
                <span>{isMyanmar ? 'စတူဒီယို နှင့် သဘာဝ အလင်းအမှောင် (၃၀ မျိုး)' : 'Master Studio & Ambient Lighting (30 Options)'}</span>
              </h3>
            </div>
            <LightingSelectionCarousel
              language={language}
              selection={selection}
              onUpdateSelection={onUpdateSelection}
            />
            <div className="pt-2">
              <input
                type="text"
                value={selection.customLightingDetails || ''}
                onChange={(e) => onUpdateSelection({ customLightingDetails: e.target.value })}
                placeholder="e.g. Soft diffused side lighting, atmospheric rain reflection..."
                className="w-full rounded-xl bg-black/90 border border-slate-800 px-3.5 py-2.5 text-xs text-slate-200 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>
        );

      case 'mood_emotion':
        return (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Heart className="h-4 w-4 text-teal-400" />
                <span>{isMyanmar ? 'ခံစားချက် နှင့် ရသ အသွင်အပြင် (၁၅ မျိုး)' : 'Emotional Mood & Atmospheric Vibe (15 Options)'}</span>
              </h3>
            </div>
            <MoodSelectionCarousel
              language={language}
              selection={selection}
              onUpdateSelection={onUpdateSelection}
            />
          </div>
        );

      case 'background_only_settings':
        return (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Mountain className="h-4 w-4 text-teal-400" />
                <span>{isMyanmar ? 'နောက်ခံ သီးသန့် မုဒ် (Scenery Isolation System)' : 'Scenery & Backdrop Isolation System'}</span>
              </h3>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-teal-500/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-200">
                  {isMyanmar ? 'နောက်ခံ သီးသန့် မုဒ် အခြေအနေ' : 'Background Only Mode Status'}
                </span>
                <button
                  type="button"
                  onClick={() => onModeChange(currentMode === 'background-only' ? 'img2img' : 'background-only')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    currentMode === 'background-only'
                      ? 'bg-teal-500 text-black font-bold shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {currentMode === 'background-only'
                    ? (isMyanmar ? '✅ ဖွင့်ထားသည်' : '✅ Active')
                    : (isMyanmar ? '⚪ ဖွင့်မည်' : '⚪ Inactive')}
                </button>
              </div>

              <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
                <span className="text-xs text-slate-300">
                  {isMyanmar ? 'လူပုဂ္ဂိုလ် ဆက်တင်များ ပြသရန် Option Key:' : 'Character Settings Option Key:'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowPersonBoxesInBackgroundMode(!showPersonBoxesInBackgroundMode)}
                  className="px-2.5 py-1 rounded bg-black border border-slate-700 text-xs text-teal-300 hover:bg-slate-900"
                >
                  {showPersonBoxesInBackgroundMode ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
            </div>
          </div>
        );

      // ---------------------------------------------------------
      // BOX 4: OPTICS & CAMERA MATRIX
      // ---------------------------------------------------------
      case 'camera_lens':
        return (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Camera className="h-4 w-4 text-cyan-400" />
                <span>{isMyanmar ? 'ကင်မရာနှင့် မှန်ဘီလူး ဆက်တင် (၂၀ မျိုး)' : 'Camera Body & Master Optics (20 Options)'}</span>
              </h3>
            </div>
            <CameraSelectionCarousel
              language={language}
              selection={selection}
              onUpdateSelection={onUpdateSelection}
            />
          </div>
        );

      case 'camera_angles':
        return (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-cyan-400" />
                <span>{isMyanmar ? 'ကင်မရာ အလှည့်အကွေး နှင့် ရှုထောင့် (၁၅ မျိုး)' : 'Camera Angles & Framing (15 Options)'}</span>
              </h3>
            </div>
            <CameraAngleSelectionCarousel
              language={language}
              selection={selection}
              onUpdateSelection={onUpdateSelection}
            />
          </div>
        );

      case 'color_film':
        return (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Film className="h-4 w-4 text-cyan-400" />
                <span>{isMyanmar ? 'ဖလင် အရောင်တိုနင် နှင့် LUTs (၁၉ မျိုး)' : 'Film Stocks & Color Grading LUTs (19 Options)'}</span>
              </h3>
            </div>
            <FilmColorSelectionCarousel
              language={language}
              selection={selection}
              onUpdateSelection={onUpdateSelection}
            />
          </div>
        );

      case 'retouch_makeup':
        return (
          <div className="space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span>{isMyanmar ? 'အသားအရေ ချောမွေ့မှု နှင့် မိတ်ကပ် ပြင်ဆင်ခြင်း' : 'Skin Retouching & Makeup Artistry'}</span>
              </h3>
            </div>

            <SkinRetouchSelectionCarousel
              language={language}
              selection={selection}
              onUpdateSelection={onUpdateSelection}
            />

            <MakeupSelectionCarousel
              language={language}
              selection={selection}
              onUpdateSelection={onUpdateSelection}
            />
          </div>
        );

      case 'photo_styles':
        return (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Palette className="h-4 w-4 text-cyan-400" />
                <span>{isMyanmar ? 'ဓာတ်ပုံ အနုပညာ စတိုင်လ် (၂၀ မျိုး)' : 'Photography Aesthetic Styles (20 Options)'}</span>
              </h3>
            </div>
            <PhotoStyleSelectionCarousel
              language={language}
              selection={selection}
              onUpdateSelection={onUpdateSelection}
            />
          </div>
        );

      case 'aspect_ratio_settings':
        return (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Maximize2 className="h-4 w-4 text-cyan-400" />
                <span>{isMyanmar ? 'ဓာတ်ပုံ အချိုးအစား နှင့် Target Resolution' : 'Aspect Ratio & Target Pixel Specs'}</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {ASPECT_RATIOS.map((ar) => {
                const currentRatio = selection.aspectRatio || '9:16';
                const isSelected = currentRatio === ar.ratio || currentRatio === ar.id;
                return (
                  <button
                    key={ar.id}
                    type="button"
                    onClick={() => onUpdateSelection({ aspectRatio: isSelected ? '9:16' : ar.ratio })}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-400 text-white font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                        : 'bg-black/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <span className="font-bold text-sm">{ar.ratio}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{ar.width}×{ar.height}</span>
                    <span className="text-[9px] text-cyan-400 mt-1 font-semibold truncate max-w-full">
                      {ar.ratio === '9:16' ? 'TikTok/Reels' : ar.ratio === '4:5' ? 'Instagram' : ar.ratio === '3:4' ? 'Portrait' : ar.ratio === '16:9' ? 'Cinematic' : ar.ratio === '1:1' ? 'Square' : 'Photo'}
                    </span>
                  </button>
                );
              })}
            </div>

            {(() => {
              const currentAr = ASPECT_RATIOS.find(ar => ar.ratio === (selection.aspectRatio || '9:16') || ar.id === selection.aspectRatio);
              if (!currentAr) return null;
              return (
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📐</span>
                    <div>
                      <span className="text-slate-400 mr-2">{isMyanmar ? 'အသုံးပြုမည့် ရုပ်ထွက် Pixel:' : 'Target Dimension:'}</span>
                      <strong className="text-cyan-300 font-mono text-sm">{currentAr.width} × {currentAr.height} px</strong>
                    </div>
                  </div>
                  <span className="text-[11px] text-cyan-400 font-medium">
                    {currentAr.label}
                  </span>
                </div>
              );
            })()}
          </div>
        );

      case 'quality_engine_settings':
        return (
          <div className="space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-cyan-400" />
                <span>{isMyanmar ? 'ရုပ်ထွက် အင်ဂျင် နှင့် Sliders ကန့်သတ်ချက်များ' : 'AI Quality Engines & Weight Sliders'}</span>
              </h3>
            </div>

            <QualityEngineSelectionCarousel
              language={language}
              selection={selection}
              onUpdateSelection={onUpdateSelection}
            />

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-200">{isMyanmar ? 'စတိုင်လ် ပြင်းအား (Style Strength)' : 'Style Strength'}</span>
                  <span className="text-cyan-400 font-mono tabular-nums">{Math.round((selection.styleStrength ?? 0.75) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={selection.styleStrength ?? 0.75}
                  onChange={(e) => onUpdateSelection({ styleStrength: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-200">{isMyanmar ? 'Prompt အလေးချိန် (Prompt Weight)' : 'Prompt Weight'}</span>
                  <span className="text-cyan-400 font-mono tabular-nums">{Math.round((selection.promptWeight ?? 0.8) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={selection.promptWeight ?? 0.8}
                  onChange={(e) => onUpdateSelection({ promptWeight: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                {isMyanmar ? 'အပိုဆောင်း စိတ်ကြိုက် ညွှန်ကြားချက် စာသား (Custom Directive):' : 'Additional Master Prompt Directives:'}
              </label>
              <PromptInputArea
                language={language}
                selection={selection}
                onUpdateSelection={onUpdateSelection}
                onGeneratePrompt={onGeneratePrompt}
                isGeneratingPrompt={isGeneratingPrompt}
                onResetAll={onResetAll}
                onModeChange={onModeChange}
                placeholder={isMyanmar ? "Prompt ရိုက်ထည့်ပါ သို့မဟုတ် Slash Command အတွက် '/' ကို ရိုက်ပါ (ဥပမာ- /back -> Background options, /light, /cam)..." : "Type custom prompt or '/' for commands (e.g., /back -> Background options, /light, /cam)..."}
              />
            </div>
          </div>
        );

      case 'template_gallery_all':
      case 'template_traditional':
      case 'template_festival':
      case 'template_fashion':
      case 'template_cinematic':
        return (
          <div className="space-y-4">
            <PresetGallery
              language={language}
              onSelectPreset={(preset) => {
                if (onSelectPreset) {
                  onSelectPreset(preset);
                } else {
                  onUpdateSelection(preset.selection);
                }
              }}
              activePresetId={activePresetId}
              initialCategory={
                activeSubMenuId === 'template_traditional'
                  ? 'traditional'
                  : activeSubMenuId === 'template_festival'
                  ? 'festival'
                  : activeSubMenuId === 'template_fashion'
                  ? 'fashion'
                  : activeSubMenuId === 'template_cinematic'
                  ? 'cinematic'
                  : 'all'
              }
              onGeneratePrompt={onGeneratePrompt}
            />
          </div>
        );

      default:
        if (activePillarId === 'box5') {
          return (
            <div className="space-y-4">
              <PresetGallery
                language={language}
                onSelectPreset={(preset) => {
                  if (onSelectPreset) {
                    onSelectPreset(preset);
                  } else {
                    onUpdateSelection(preset.selection);
                  }
                }}
                activePresetId={activePresetId}
                initialCategory="all"
                onGeneratePrompt={onGeneratePrompt}
              />
            </div>
          );
        }
        return (
          <div className="p-8 text-center text-slate-400">
            {isMyanmar ? 'ရွေးချယ်စရာ မရှိပါ' : 'Select an item from the side menu'}
          </div>
        );
    }
  };

  // -------------------------------------------------------------
  // FIRST INTERFACE (WELCOME TO SHOW AI STUDIO)
  // Matching user's exact reference wireframe layout:
  // - Large bold "Welcome To Show AI Studio"
  // - Top 3 pills: [Prompt] [Image] [Video]
  // - "Template" with expanding chevron ∨
  // - Action bar with [Prompt Generator] on left and [ ☰ ] on right
  // - 4 Core Boxes in a 2x2 grid: [ Box1 ] [ Box2 ] [ Box3 ] [ Box4 ]
  // -------------------------------------------------------------
  if (activePillarId === null) {
    return (
      <div className="w-full max-w-4xl mx-auto min-h-[calc(100vh-7.5rem)] flex flex-col justify-between py-1 sm:py-2 space-y-3 sm:space-y-4">
        
        {/* Hero Section: Welcome To Show AI Studio */}
        <div className="text-center space-y-3 pt-1">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-sans leading-tight">
            Welcome To<br />
            <span className="text-white">Show AI Studio</span>
          </h1>

          {/* Prompt pill with floating animation */}
          <div className="flex items-center justify-center pt-2 pb-2">
            <button
              type="button"
              onClick={() => {
                onModeChange('txt2img');
                setIsSummaryModalOpen(true);
              }}
              className="floating-btn-1 relative px-7 py-2.5 rounded-xl text-xs sm:text-sm font-black border border-cyan-400 bg-cyan-500 hover:bg-cyan-400 text-black shadow-md scale-105 transition-all cursor-pointer select-none flex items-center gap-2 group"
              title={isMyanmar ? 'Prompt ရွေးချယ်မှုများကို ကြည့်ရှု၊ ပြင်ဆင်၊ အသစ်ထည့်ပြီး ထုတ်ယူရန်' : 'Open Prompt Selection & Generation Session'}
            >
              <span>Prompt</span>
              <span className="px-2 py-0.5 rounded-full bg-black/20 text-black font-mono text-[11px] font-bold">
                {activeOptionChips.length}
              </span>
            </button>
          </div>
        </div>

        {/* Studio Prompt Input Area with Slash Commands & CommandPalette */}
        <div className="pt-1 pb-1">
          <PromptInputArea
            language={language}
            selection={selection}
            onUpdateSelection={onUpdateSelection}
            onGeneratePrompt={onGeneratePrompt}
            isGeneratingPrompt={isGeneratingPrompt}
            onResetAll={onResetAll}
            onModeChange={onModeChange}
            placeholder={isMyanmar ? "Prompt စာသား ရိုက်ထည့်ပါ သို့မဟုတ် Slash Command အတွက် '/' ကို ရိုက်ပါ (ဥပမာ- /back -> Background options, /light, /cam)..." : "Type custom prompt or '/' for commands (e.g., /back -> Background options, /light, /cam)..."}
          />
        </div>

        {/* Action Row: [Reset Prompt] on left, [ ☰ ] on right */}
        <div className="flex items-center justify-between pt-1 gap-2">
          {/* Reset Prompt Button */}
          <button
            type="button"
            onClick={onResetAll}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs sm:text-sm font-bold text-slate-300 hover:text-rose-300 hover:border-rose-500/50 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
            title={isMyanmar ? 'ရွေးချယ်ထားသော Prompt အချက်အလက်များ အားလုံးကို မူလအတိုင်း ပြန်လည်သတ်မှတ်မည် (Reset)' : 'Reset all prompt choices to default'}
          >
            <RotateCcw className="h-4 w-4 text-rose-400 group-hover:-rotate-90 transition-transform duration-300" />
            <span>{isMyanmar ? 'Reset Prompt' : 'Reset Prompt'}</span>
          </button>

          {/* Hamburger / Menu icon on the right */}
          <button
            type="button"
            onClick={() => {
              if (onOpenOutput) onOpenOutput();
            }}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all shadow-md cursor-pointer"
            title="View Prompt & Results / Output Studio"
          >
            <div className="flex flex-col gap-1 w-6 h-5 justify-center items-center">
              <span className="w-5 h-0.5 bg-white rounded-full"></span>
              <span className="w-5 h-0.5 bg-white rounded-full"></span>
              <span className="w-5 h-0.5 bg-white rounded-full"></span>
            </div>
          </button>
        </div>

        {/* The 5 Core Primary Boxes in a Responsive Grid with Crisp Modern UI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5 pb-1">
          {PILLARS.map((pillar) => {
            const PIcon = pillar.icon;
            const currentSummary = pillar.getCurrentSummary(selection, language);
            const isBox5 = pillar.id === 'box5';

            return (
              <div
                key={pillar.id}
                role="button"
                tabIndex={0}
                onClick={() => handleSelectPillar(pillar.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectPillar(pillar.id);
                  }
                }}
                className={`group relative flex flex-col justify-between min-h-[140px] sm:min-h-[155px] p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-400/50 shadow-lg transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/50 overflow-hidden ${
                  isBox5 ? 'sm:col-span-2 border-cyan-500/30 bg-slate-900' : ''
                }`}
              >
                {/* Header: Box Label [Box 1..5] & Icon */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans group-hover:text-cyan-300 transition-colors">
                      {pillar.boxLabel}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
                      ({isMyanmar ? pillar.titleMm.split(' ')[0] : pillar.titleEn.split(' ')[0]})
                    </span>
                    {isBox5 && (
                      <span className="ml-2 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-[10px] text-cyan-300 font-mono font-bold">
                        ⭐ 30 Ready-Made Presets
                      </span>
                    )}
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 group-hover:border-cyan-400/40 group-hover:bg-cyan-500/15 transition-all shadow-sm">
                    <PIcon className="h-4 w-4 text-slate-300 group-hover:text-cyan-300 transition-colors" />
                  </div>
                </div>

                {/* Body: Title & Micro-copy */}
                <div className="relative z-10 space-y-1 my-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-100 group-hover:text-white transition-colors">
                    {isMyanmar ? pillar.titleMm : pillar.titleEn}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {isMyanmar ? pillar.taglineMm : pillar.taglineEn}
                  </p>
                  {isBox5 && (
                    <div className="flex items-center gap-2 pt-1.5 flex-wrap text-[11px] text-slate-300">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700">👑 Royal & Ethnic</span>
                      <span className="px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700">💦 Festivals & Wedding</span>
                      <span className="px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700">👗 Modern & Cyber</span>
                      <span className="px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700">🎬 Cinematic Scenery</span>
                    </div>
                  )}
                </div>

                {/* Footer: Configured Summary */}
                <div className="relative z-10 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px] truncate max-w-[200px] sm:max-w-[320px]">
                    {currentSummary}
                  </span>
                  <span className="text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-mono text-[11px]">
                    <span>{isBox5 ? (isMyanmar ? 'Detail Prompt & Instructions ကြည့်ရန်' : 'Detail Prompt & Instructions') : (isMyanmar ? 'ပြင်ဆင်ရန်' : 'Configure')}</span>
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Options Summary Modal */}
        <SelectedOptionsSummaryModal
          isOpen={isSummaryModalOpen}
          onClose={() => setIsSummaryModalOpen(false)}
          selection={selection}
          language={language}
          onEditOption={handleSelectPillar}
          onDeleteOption={handleDeleteOption}
          onResetAll={onResetAll}
          onGeneratePrompt={onGeneratePrompt}
          isGeneratingPrompt={isGeneratingPrompt}
        />
      </div>
    );
  }

  // -------------------------------------------------------------
  // SECOND INTERFACE (MASTER-DETAIL SIDE PANEL WORKBENCH)
  // Matching user's exact second sketch in we.png:
  // - Left: Dedicated Black vertical panel:
  //   - Header: FIRST BOX (or BOX 1, BOX 2, etc.)
  //   - Stacked items with counts like '2'
  // - Center/Right:
  //   - Top: Search bar with magnifying glass 🔍 [________________________]
  //   - Top right: [ ☰ ]
  //   - Center: Neatly aligned cards in 2 columns
  //   - Bottom: [ Finished ] button
  // -------------------------------------------------------------
  return (
    <div className="w-full max-w-7xl mx-auto space-y-3.5 py-1">
      
      {/* Top Header / Breadcrumb Bar */}
      <div className="flex items-center justify-between px-1 text-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActivePillarId(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white transition-all shadow-sm cursor-pointer"
          >
            <Home className="h-3.5 w-3.5 text-cyan-400" />
            <span>{isMyanmar ? 'ပင်မ ၅ ကတ်' : 'All 5 Boxes'}</span>
          </button>

          <span className="text-slate-500 hidden sm:inline">/</span>

          <span className="text-slate-300 font-bold hidden sm:inline">
            {currentPillar?.boxLabel}: {isMyanmar ? currentPillar?.titleMm : currentPillar?.titleEn}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Selected Options Summary Button */}
          <button
            type="button"
            onClick={() => setIsSummaryModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-400/60 text-xs font-bold text-slate-300 hover:text-white transition-all shadow-sm cursor-pointer group"
            title={isMyanmar ? 'ရွေးချယ်ထားသော အချက်အလက်များ အကျဉ်းချုပ်' : 'View active options summary'}
          >
            <Sliders className="h-3.5 w-3.5 text-cyan-400 group-hover:rotate-90 transition-transform duration-300" />
            <span>{isMyanmar ? 'ရွေးချယ်မှုများ' : 'Selected Options'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-cyan-950 border border-cyan-800 text-[10px] text-cyan-300 font-mono font-bold">
              {activeOptionChips.length}
            </span>
          </button>

          {/* Menu icon on the right as drawn */}
          <button
            type="button"
            onClick={() => {
              if (onOpenOutput) onOpenOutput();
            }}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Open Output & Results"
          >
            <div className="flex flex-col gap-1 w-4 h-3.5 justify-center items-center">
              <span className="w-3.5 h-0.5 bg-white rounded-full"></span>
              <span className="w-3.5 h-0.5 bg-white rounded-full"></span>
              <span className="w-3.5 h-0.5 bg-white rounded-full"></span>
            </div>
          </button>
        </div>
      </div>

      {/* Main 2-Column / 2-Tab Layout:
          TAB 1 (Left): Sticky & Fixed — DOES NOT MOVE WHEN SCROLLING TAB 2
          TAB 2 (Right): Dedicated Scroll Container — ONLY THIS TAB SCROLLS
      */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        
        {/* FIRST TAB (LEFT COLUMN: 4 COLS) - STICKY & PINNED */}
        <aside className="md:col-span-4 md:sticky md:top-20 self-start md:max-h-[calc(100vh-5.5rem)] flex flex-col space-y-3 shrink-0">
          
          {/* SIDE MENU BAR */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-3.5 space-y-3 relative z-20 shadow-xl">
            
            {/* Navigation Header & Prev/Next Controls */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  {isMyanmar ? 'အဆင့်အလိုက် ရွေးချယ်ရန်' : 'PAGES / BOX WORKBENCH'}
                </span>
                
                {/* Prev / Next Box buttons */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrevBox}
                    disabled={!prevPillarId}
                    className="p-1.5 rounded-lg bg-black/60 border border-white/10 text-slate-300 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                    title={prevPillarId ? `Go back to ${PILLARS.find(p => p.id === prevPillarId)?.boxLabel}` : 'First Box'}
                  >
                    <ArrowLeft className="h-3.5 w-3.5 text-cyan-300" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextBox}
                    disabled={!nextPillarId}
                    className="p-1.5 rounded-lg bg-black/60 border border-white/10 text-slate-300 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                    title={nextPillarId ? `Next to ${PILLARS.find(p => p.id === nextPillarId)?.boxLabel}` : 'Last Box'}
                  >
                    <ArrowRight className="h-3.5 w-3.5 text-cyan-300" />
                  </button>
                </div>
              </div>

              {/* 5 Box Pills: [Box 1] [Box 2] [Box 3] [Box 4] [Box 5] */}
              {/* User can choose next box 1, box 2, box 3, box 4, box 5 and can go what they want page */}
              <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
                {PILLARS.map((p, idx) => {
                  const isActive = p.id === activePillarId;
                  const boxShortTitles = ['Subject', 'Wardrobe', 'Scene', 'Camera', 'Template'];
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectPillar(p.id)}
                      className={`px-1 py-1.5 sm:px-1.5 sm:py-2 rounded-xl text-center transition-all flex flex-col items-center justify-center border cursor-pointer ${
                        isActive
                          ? 'bg-cyan-500/18 border-cyan-400/50 text-white shadow-md shadow-cyan-950/40 ring-1 ring-cyan-400/30'
                          : 'bg-white/[0.03] border-white/08 text-slate-400 hover:text-white hover:border-white/15 hover:bg-white/[0.06]'
                      }`}
                      title={`${p.boxLabel}: ${p.titleEn}`}
                    >
                      <span className={`text-[10px] sm:text-[11px] font-black ${isActive ? 'text-cyan-300' : 'text-slate-200'}`}>
                        {p.boxLabel}
                      </span>
                      <span className="text-[8px] sm:text-[9px] font-mono opacity-80 truncate max-w-full">
                        {boxShortTitles[idx]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Picked Options Section inside Menu Bar */}
            {/* "move to menu bar ရွေးချယ်ထားချက်များ" */}
            <div className="pt-2 border-t border-white/10 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{isMyanmar ? 'ရွေးချယ်ထားချက်များ' : 'Picked Options'}</span>
                  <span className="text-[10px] text-cyan-300 font-mono font-bold bg-cyan-950/80 border border-cyan-800/60 px-1.5 py-0.2 rounded-full">
                    {activeOptionChips.length}
                  </span>
                </span>

                <div className="flex items-center gap-1.5">
                  {/* Reset All button */}
                  <button
                    type="button"
                    onClick={handleResetPrompt}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/60 border border-white/10 hover:border-rose-500/70 hover:bg-rose-950/40 text-[10px] font-bold text-slate-300 hover:text-rose-300 transition-all cursor-pointer group"
                    title={isMyanmar ? 'အချက်အလက်အားလုံးနှင့် Live Prompt ကို Reset ပြန်လုပ်မည်' : 'Reset all choices and live prompt'}
                  >
                    <RotateCcw className="h-2.5 w-2.5 text-rose-400 group-hover:-rotate-90 transition-transform duration-300" />
                    <span>Reset</span>
                  </button>

                  {/* + Add Option button */}
                  <button
                    type="button"
                    onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-cyan-500/20 border border-cyan-400/50 hover:bg-cyan-500/30 text-[10px] font-bold text-cyan-300 transition-all cursor-pointer"
                    title={isMyanmar ? 'အချက်အလက် အသစ်ထည့်ရန်' : 'Add or customize another option'}
                  >
                    <Plus className="h-3 w-3" />
                    <span>{isMyanmar ? 'ထည့်မည်' : '+ Add'}</span>
                  </button>

                  {/* View all summary modal */}
                  <button
                    type="button"
                    onClick={() => setIsSummaryModalOpen(true)}
                    className="text-[10px] font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Open Summary Modal"
                  >
                    <span>{isMyanmar ? 'စာရင်း' : 'Summary'}</span>
                  </button>
                </div>
              </div>

              {/* Reset Notification Badge */}
              {resetNotice && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-950/90 border border-emerald-500/80 text-[10px] font-bold text-emerald-300 shadow-md animate-in fade-in duration-150">
                  <Check className="h-3 w-3 text-emerald-400 shrink-0" />
                  <span>{isMyanmar ? '✓ ရွေးချယ်မှုနှင့် Live Prompt ကို Reset လုပ်ပြီးပါပြီ' : '✓ Options & Live Prompt Reset!'}</span>
                </div>
              )}

              {/* Quick Add Dropdown Popover */}
              {isAddMenuOpen && (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-cyan-500/50 shadow-2xl space-y-1.5 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between text-[11px] font-bold text-cyan-300 pb-1 border-b border-slate-800">
                    <span>{isMyanmar ? 'ထည့်သွင်းလိုသော အချက်ကို ရွေးပါ' : 'Select Option to Add / Customize:'}</span>
                    <button
                      type="button"
                      onClick={() => setIsAddMenuOpen(false)}
                      className="p-0.5 text-slate-400 hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1 max-h-48 overflow-y-auto custom-scrollbar pt-1">
                    {ADDABLE_CATEGORIES.map((cat) => (
                      <button
                        key={`${cat.pillarId}-${cat.subMenuId}`}
                        type="button"
                        onClick={() => {
                          handleSelectPillar(cat.pillarId, cat.subMenuId);
                          setIsAddMenuOpen(false);
                        }}
                        className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-400/60 hover:bg-slate-800/80 text-left transition-all cursor-pointer group"
                      >
                        <span className="text-xs shrink-0">{cat.emoji}</span>
                        <span className="text-[10px] font-medium text-slate-300 group-hover:text-white truncate">
                          {isMyanmar ? cat.labelMm : cat.labelEn}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Scrollable Picked Option Chips inside the Glass Menu Bar */}
              {activeOptionChips.length === 0 ? (
                <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-center text-[10px] text-slate-400">
                  {isMyanmar ? 'အချက်အလက်များ မရွေးချယ်ရသေးပါ (ကတ်များမှ ရွေးပါ)' : 'No custom options selected yet. Pick from cards.'}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar max-w-full">
                  {activeOptionChips.map((chip) => (
                    <div
                      key={chip.id}
                      className="group shrink-0 flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-lg bg-black/60 border border-white/10 hover:border-cyan-400/60 text-xs transition-all shadow-sm"
                    >
                      <span className="text-xs">{chip.emoji || '✨'}</span>
                      <button
                        type="button"
                        onClick={() => handleSelectPillar(chip.pillarId, chip.subMenuId)}
                        className="font-bold text-white hover:text-cyan-300 transition-colors text-[11px] truncate max-w-[100px] cursor-pointer"
                        title={`Edit ${chip.valueLabelEn}`}
                      >
                        {isMyanmar ? chip.valueLabelMm : chip.valueLabelEn}
                      </button>
                      {/* Remove Button */}
                      {chip.canDelete && (
                        <button
                          type="button"
                          onClick={() => handleDeleteOption(chip.id)}
                          className="p-0.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-all cursor-pointer"
                          title={isMyanmar ? 'ဖျက်မည်' : 'Remove option'}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submenus List for the Active Box */}
          <div className="rounded-2xl glass-panel p-3.5 flex-1 overflow-y-auto custom-scrollbar space-y-1.5 min-h-[300px] max-h-[calc(100vh-14rem)] md:max-h-[calc(100vh-15rem)] shadow-2xl overscroll-contain">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider font-bold">
                  {currentPillar?.boxLabel} SUBMENUS
                </span>
                <h3 className="text-xs font-black text-white tracking-tight uppercase">
                  {currentPillar ? (isMyanmar ? currentPillar.titleMm : currentPillar.titleEn) : 'SUBMENUS'}
                </h3>
              </div>
              <span className="text-[10px] font-bold text-slate-300 bg-white/[0.06] px-2 py-0.5 rounded border border-white/10">
                {filteredSubMenus.length} items
              </span>
            </div>

            <div className="space-y-1.5 pt-1">
              {filteredSubMenus.map((sub) => {
                const isSelected = sub.id === activeSubMenuId;
                const SubIcon = sub.icon;
                const currentSubSummary = sub.getCurrentSummary ? sub.getCurrentSummary(selection, language) : '';

                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setActiveSubMenuId(sub.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-400/40 text-white shadow-[0_4px_16px_rgba(6,182,212,0.14)] ring-1 ring-cyan-400/25 backdrop-blur-md'
                        : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.07] text-slate-300 hover:text-white hover:border-white/15 backdrop-blur-sm'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <SubIcon className={`h-4 w-4 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <div className="truncate">
                        <div className="text-xs font-bold truncate">
                          {isMyanmar ? sub.labelMm : sub.labelEn}
                        </div>
                        {currentSubSummary && (
                          <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                            {currentSubSummary}
                          </div>
                        )}
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                      isSelected ? 'bg-cyan-500 text-black' : 'bg-white/[0.06] text-slate-300 border border-white/10'
                    }`}>
                      {sub.countBadge || '2'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* SECOND TAB (RIGHT COLUMN: 8 COLS) - INDEPENDENT SCROLL AREA:
            "when moving a second tab don't move first tab only scroll second tab"
        */}
        <section
          ref={rightContentRef}
          className="md:col-span-8 md:max-h-[calc(100vh-5.5rem)] overflow-y-auto custom-scrollbar rounded-2xl glass-panel p-5 sm:p-6 shadow-2xl flex flex-col justify-between space-y-6 overscroll-contain"
        >
          
          <div className="space-y-4">
            {/* Prominent Enclosed Glass Search Bar */}
            <div className="relative">
              <div className="flex items-center rounded-2xl glass-input px-4 py-2.5 shadow-inner focus-within:ring-2 focus-within:ring-cyan-400/50 transition-all">
                <Search className="h-5 w-5 text-slate-400 shrink-0 mr-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isMyanmar ? "ရွေးချယ်စရာများ ရှာဖွေပါ (ဥပမာ- face, silk, portra)..." : "Search options, presets, or styles..."}
                  className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Render Active Content View */}
            <div className="pt-2">
              {renderContentView()}
            </div>

            {/* Studio Prompt Directive Box with Slash CommandPalette */}
            <div className="pt-4">
              <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                <span>{isMyanmar ? 'Prompt စာသား နှင့် အမိန့်ပေးစနစ် (Type / for commands):' : 'Prompt Directives & Slash Commands:'}</span>
                <span className="font-mono text-cyan-400 text-[10px]">/back · /light · /cam · /pose</span>
              </div>
              <PromptInputArea
                language={language}
                selection={selection}
                onUpdateSelection={onUpdateSelection}
                onGeneratePrompt={onGeneratePrompt}
                isGeneratingPrompt={isGeneratingPrompt}
                onResetAll={onResetAll}
                onModeChange={onModeChange}
                placeholder={isMyanmar ? "Prompt ရိုက်ထည့်ပါ သို့မဟုတ် '/' ဖြင့် အမိန့်ပေးပါ (ဥပမာ- /back -> Background options)..." : "Type prompt directive or '/' for commands (e.g. /back, /light, /cam)..."}
              />
            </div>
          </div>

          {/* Workbench Action Row */}
          <div className="rounded-2xl glass-ui-bar glass-sheen p-3.5 sm:p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {/* Reset Prompt Button */}
              <button
                type="button"
                onClick={handleResetPrompt}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl glass-button hover:border-rose-500/80 hover:bg-rose-950/40 text-xs font-bold text-slate-200 hover:text-rose-300 transition-all cursor-pointer shadow-sm group"
                title={isMyanmar ? 'ရွေးချယ်ထားသော အချက်အလက်များ အားလုံးကို မူလအတိုင်း Reset ပြန်လုပ်မည်' : 'Reset all prompt choices to default'}
              >
                <RotateCcw className="h-3.5 w-3.5 text-rose-400 group-hover:-rotate-90 transition-transform duration-300" />
                <span>{isMyanmar ? 'Reset Prompt' : 'Reset Prompt'}</span>
              </button>

              {/* View Summary Modal Button */}
              <button
                type="button"
                onClick={() => setIsSummaryModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl glass-button hover:border-cyan-400/60 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm"
                title="View All Selected Options Summary"
              >
                <Sliders className="h-3.5 w-3.5 text-cyan-400" />
                <span>{isMyanmar ? 'ရွေးချယ်မှုများ စာရင်း' : 'Selected Options'}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-cyan-950 border border-cyan-800 text-[10px] text-cyan-300 font-mono font-bold">
                  {activeOptionChips.length}
                </span>
              </button>
            </div>

            {/* Generate Master Prompt CTA */}
            <button
              type="button"
              onClick={onGeneratePrompt}
              disabled={isGeneratingPrompt}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-white to-cyan-300 hover:from-cyan-300 hover:to-white text-black font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isGeneratingPrompt ? (
                <>
                  <RefreshCcw className="h-4 w-4 animate-spin text-black" />
                  <span>{isMyanmar ? 'Prompt ရေးဆွဲနေပါသည်...' : 'Generating Prompt...'}</span>
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 text-black" />
                  <span>{isMyanmar ? '✨ Generate Master Prompt (ရလဒ် ထုတ်ယူမည်)' : '✨ Generate Master Prompt & Open Studio'}</span>
                </>
              )}
            </button>
          </div>

          {/* Bottom Action Row: Back to Boxes, Prev/Next Box & Generate Prompt */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActivePillarId(null)}
                className="px-3.5 py-2.5 rounded-xl glass-button text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4 text-cyan-400" />
                <span>{isMyanmar ? 'ပင်မ ၄ ကတ်' : '4 Boxes'}</span>
              </button>

              {prevPillarId && (
                <button
                  type="button"
                  onClick={handlePrevBox}
                  className="px-3 py-2.5 rounded-xl glass-button text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                  title="Previous Box"
                >
                  <ArrowLeft className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{PILLARS.find(p => p.id === prevPillarId)?.boxLabel}</span>
                </button>
              )}

              {nextPillarId && (
                <button
                  type="button"
                  onClick={handleNextBox}
                  className="px-3 py-2.5 rounded-xl glass-button text-xs font-bold text-cyan-300 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                  title="Next Box"
                >
                  <span>{PILLARS.find(p => p.id === nextPillarId)?.boxLabel}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-cyan-400" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={onGeneratePrompt}
              disabled={isGeneratingPrompt}
              className="px-6 sm:px-7 py-3 rounded-xl bg-white text-black font-black text-sm shadow-xl hover:bg-slate-200 active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isGeneratingPrompt ? (
                <>
                  <RefreshCcw className="h-4 w-4 animate-spin text-black" />
                  <span>{isMyanmar ? 'Prompt ရေးဆွဲနေပါသည်...' : 'Generating Prompt...'}</span>
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 text-black" />
                  <span>Generate Prompt</span>
                </>
              )}
            </button>
          </div>

        </section>

      </div>

      {/* Selected Options Summary Modal */}
      <SelectedOptionsSummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        selection={selection}
        language={language}
        onEditOption={handleSelectPillar}
        onDeleteOption={handleDeleteOption}
        onResetAll={onResetAll}
        onGeneratePrompt={onGeneratePrompt}
        isGeneratingPrompt={isGeneratingPrompt}
      />
    </div>
  );
};
