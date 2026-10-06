import React, { useState, useMemo } from 'react';
import { MatrixSelection, Language } from '../types';
import { PillarId } from './ExecutiveMasterDetailStudio';
import {
  X,
  Edit2,
  Trash2,
  RotateCcw,
  Sparkles,
  Search,
  CheckCircle2,
  Sliders,
  ChevronRight,
  ExternalLink,
  Wand2,
  Plus,
  ArrowLeft,
  Layers
} from 'lucide-react';
import {
  SUBJECT_OPTIONS,
  ETHNICITY_OPTIONS,
  GARMENT_OPTIONS,
  LOCATION_OPTIONS,
  LIGHTING_OPTIONS,
  EVENT_OPTIONS,
  CAMERA_OPTIONS,
  CAMERA_ANGLE_OPTIONS,
  COLOR_GRADE_OPTIONS,
  RETOUCH_OPTIONS,
  MAKEUP_OPTIONS,
  MOOD_OPTIONS,
  ASPECT_RATIOS,
  QUALITY_PROFILES,
  IDENTITY_LOCK_OPTIONS,
  POSE_EXPRESSION_OPTIONS
} from '../data/presetData';

export interface PickedOptionItem {
  id: string; // key matching selection
  pillarId: PillarId;
  subMenuId: string;
  boxNumber: string;
  boxLabel: string;
  categoryLabelMm: string;
  categoryLabelEn: string;
  valueLabelMm: string;
  valueLabelEn: string;
  emoji?: string;
  canDelete: boolean;
  canEdit: boolean;
  description?: string;
}

export interface AddableCategory {
  id: string;
  pillarId: PillarId;
  subMenuId: string;
  boxNumber: string;
  boxLabel: string;
  labelEn: string;
  labelMm: string;
  emoji: string;
  descriptionEn: string;
  descriptionMm: string;
}

export const ALL_ADDABLE_CATEGORIES: AddableCategory[] = [
  // Box 1: Subject, Identity & Heritage
  {
    id: 'subject_type',
    pillarId: 'box1',
    subMenuId: 'subject_type',
    boxNumber: '1',
    boxLabel: 'Box 1',
    labelEn: 'Subject Character & Demographics',
    labelMm: 'ဇာတ်ကောင် အမျိုးအစားနှင့် ရုပ်သွင်',
    emoji: '👤',
    descriptionEn: 'Woman, man, couple, monk, child, elder, fashion model',
    descriptionMm: 'အမျိုးသမီး၊ အမျိုးသား၊ စုံတွဲ၊ ကလေး၊ ဖက်ရှင်မော်ဒယ်'
  },
  {
    id: 'identity_lock',
    pillarId: 'box1',
    subMenuId: 'identity_lock',
    boxNumber: '1',
    boxLabel: 'Box 1',
    labelEn: 'Facial Identity Lock & Photo Upload',
    labelMm: 'မျက်နှာထိန်းချုပ်မှုနှင့် ဓာတ်ပုံ တင်ရန်',
    emoji: '🔒',
    descriptionEn: '100% facial preservation from reference photo',
    descriptionMm: 'မူရင်းဓာတ်ပုံမှ မျက်နှာသွင်ပြင် ၁၀၀% ထိန်းသိမ်းခြင်း'
  },
  {
    id: 'ethnicity_culture',
    pillarId: 'box1',
    subMenuId: 'ethnicity_culture',
    boxNumber: '1',
    boxLabel: 'Box 1',
    labelEn: 'Cultural Ethnicity & Heritage',
    labelMm: 'တိုင်းရင်းသား လူမျိုးနှင့် ယဉ်ကျေးမှု',
    emoji: '🇲🇲',
    descriptionEn: 'Burmese, Shan, Kachin, Karen, Chin, Rakhine, Mon, Pa-O',
    descriptionMm: 'ဗမာ၊ ရှမ်း၊ ကချင်၊ ကရင်၊ ချင်း၊ ရခိုင်၊ မွန်၊ ပအိုဝ်း'
  },
  {
    id: 'pose_expression',
    pillarId: 'box1',
    subMenuId: 'pose_expression',
    boxNumber: '1',
    boxLabel: 'Box 1',
    labelEn: 'Body Pose & Expression',
    labelMm: 'ကိုယ်ဟန် အနေအထားနှင့် ရိုက်ကွင်း ပိုစ့်',
    emoji: '🧘',
    descriptionEn: 'Natural stance, looking at camera, sitting, candid action',
    descriptionMm: 'သဘာဝကျသော ပိုစ့်၊ အလှပိုစ့်၊ ကင်မရာသို့ စိုက်ကြည့်'
  },

  // Box 2: Wardrobe, Styling & Cultural Props
  {
    id: 'garment_catalog',
    pillarId: 'box2',
    subMenuId: 'garment_catalog',
    boxNumber: '2',
    boxLabel: 'Box 2',
    labelEn: 'Garments & Traditional Attire',
    labelMm: 'ဝတ်စုံနှင့် ရိုးရာ အဆင်တန်ဆာ',
    emoji: '👗',
    descriptionEn: 'Silk longyi, royal court gown, tailored suit, lace blouse',
    descriptionMm: 'ပိုးလုံချည်၊ တော်ဝင်ဝတ်စုံ၊ ဇာအင်္ကျီ၊ ခေတ်ပေါ်ဝတ်စုံ'
  },
  {
    id: 'cultural_accessories',
    pillarId: 'box2',
    subMenuId: 'cultural_accessories',
    boxNumber: '2',
    boxLabel: 'Box 2',
    labelEn: 'Cultural & Heritage Props',
    labelMm: 'ရိုးရာ ယဉ်ကျေးမှု အသုံးအဆောင်များ',
    emoji: '🪷',
    descriptionEn: 'Pathein umbrella, silver bowl, lotus flowers, gold ornaments',
    descriptionMm: 'ပုသိမ်ထီး၊ ငွေဖလား၊ သပြေခက်၊ ကြာပန်း၊ ရတနာ'
  },

  // Box 3: Scene, Location & Lighting
  {
    id: 'locations_environments',
    pillarId: 'box3',
    subMenuId: 'locations_environments',
    boxNumber: '3',
    boxLabel: 'Box 3',
    labelEn: 'Location & Scenic Background',
    labelMm: 'တည်နေရာနှင့် နောက်ခံ ရှုခင်း',
    emoji: '🏙️',
    descriptionEn: 'Bagan temples, Inle Lake, Cyberpunk Yangon, modern studio',
    descriptionMm: 'ပုဂံဘုရားများ၊ အင်းလေးကန်၊ ရန်ကုန်ညရှုခင်း၊ စတူဒီယို'
  },
  {
    id: 'lighting_ambiance',
    pillarId: 'box3',
    subMenuId: 'lighting_ambiance',
    boxNumber: '3',
    boxLabel: 'Box 3',
    labelEn: 'Lighting & Atmospheric Ambiance',
    labelMm: 'အလင်းအမှောင်နှင့် ရိုက်ကွင်း အလင်း',
    emoji: '💡',
    descriptionEn: 'Golden hour sunset, cinematic rim light, neon midnight',
    descriptionMm: 'ရွှေရောင်ဆည်းဆာ၊ စတူဒီယိုအလင်း၊ နီယွန်ညအလင်း'
  },
  {
    id: 'events_festivals',
    pillarId: 'box3',
    subMenuId: 'events_festivals',
    boxNumber: '3',
    boxLabel: 'Box 3',
    labelEn: 'Cultural Events & Celebrations',
    labelMm: 'ပွဲတော်နှင့် အခမ်းအနားများ',
    emoji: '🎪',
    descriptionEn: 'Thingyan Water Festival, Thadingyut Lights, Tazaungdaing',
    descriptionMm: 'သင်္ကြန်ရေသဘင်၊ သီတင်းကျွတ်မီးထွန်းပွဲ၊ တန်ဆောင်တိုင်'
  },

  // Box 4: Camera Optics & Color Science
  {
    id: 'camera_lens',
    pillarId: 'box4',
    subMenuId: 'camera_lens',
    boxNumber: '4',
    boxLabel: 'Box 4',
    labelEn: 'Camera Model & Optics',
    labelMm: 'ကင်မရာနှင့် မှန်ဘီလူး အမျိုးအစား',
    emoji: '📷',
    descriptionEn: 'Hasselblad medium format, Sony A7R V, Leica 85mm f/1.2',
    descriptionMm: 'ဟာဆဲလ်ဘလဒ်၊ ဆိုနီ A7R V၊ လိုက်ကာ ပုံတူမှန်ဘီလူး'
  },
  {
    id: 'camera_angles',
    pillarId: 'box4',
    subMenuId: 'camera_angles',
    boxNumber: '4',
    boxLabel: 'Box 4',
    labelEn: 'Camera Angle & Composition Framing',
    labelMm: 'ကင်မရာထောင့်နှင့် ရိုက်ကွက်အချိုး',
    emoji: '📐',
    descriptionEn: 'Eye level portrait, low angle heroic, close-up macro',
    descriptionMm: 'မျက်လုံးတစ်ပြေးညီ၊ အောက်ခြေရှုထောင့်၊ အနီးကပ်ပုံတူ'
  },
  {
    id: 'color_film',
    pillarId: 'box4',
    subMenuId: 'color_film',
    boxNumber: '4',
    boxLabel: 'Box 4',
    labelEn: 'Color Grading & Film Simulation',
    labelMm: 'အရောင်ဖော်ပြချက်နှင့် ဖလင်အရောင်',
    emoji: '🎨',
    descriptionEn: 'Kodak Portra warm, cinematic teal & orange, black & white',
    descriptionMm: 'ဖိုဒက်ခ် ပေါ်ထရာ၊ စီနီမက်တစ် အရောင်ဆန်း၊ အဖြူအမဲ'
  },
  {
    id: 'retouch_makeup',
    pillarId: 'box4',
    subMenuId: 'retouch_makeup',
    boxNumber: '4',
    boxLabel: 'Box 4',
    labelEn: 'Skin Retouching & Makeup Styling',
    labelMm: 'အသားအရေ Retouch နှင့် မိတ်ကပ်',
    emoji: '✨',
    descriptionEn: 'Ultra-realistic skin pores, natural glow, Thanaka motifs',
    descriptionMm: 'သဘာဝကျသော အသားအရေ၊ သနပ်ခါးပါးကွက်၊ မင်္ဂလာမိတ်ကပ်'
  },
  {
    id: 'aspect_ratio_settings',
    pillarId: 'box4',
    subMenuId: 'aspect_ratio_settings',
    boxNumber: '4',
    boxLabel: 'Box 4',
    labelEn: 'Aspect Ratio & Framing Dimensions',
    labelMm: 'ဓာတ်ပုံ အချိုးအစား (Aspect Ratio)',
    emoji: '📏',
    descriptionEn: '9:16 Portrait, 16:9 Landscape, 1:1 Square, 4:5 Social',
    descriptionMm: '၉:၁၆ ဒေါင်လိုက်၊ ၁၆:၉ အလျားလိုက်၊ ၁:၁ စတုရန်း'
  },
  {
    id: 'quality_engine_settings',
    pillarId: 'box4',
    subMenuId: 'quality_engine_settings',
    boxNumber: '4',
    boxLabel: 'Box 4',
    labelEn: 'Quality Profile & Resolution Engine',
    labelMm: 'အရည်အသွေး အင်ဂျင်နှင့် ရုပ်ထွက်',
    emoji: '⚡',
    descriptionEn: '8K UHD Master, Raw High Precision, Studio Master',
    descriptionMm: '၈K အထူးကြည်လင်ပြတ်သားမှု၊ မာစတာရုပ်ထွက်'
  },

  // Box 5: Ready-Made Template Presets
  {
    id: 'template_traditional',
    pillarId: 'box5',
    subMenuId: 'template_traditional',
    boxNumber: '5',
    boxLabel: 'Box 5',
    labelEn: 'Royal Court & Ethnic Heritage Presets',
    labelMm: 'တော်ဝင်နန်းတွင်းနှင့် တိုင်းရင်းသား Presets',
    emoji: '👑',
    descriptionEn: 'Bagan Queen, Mandalay Court, Shan Royal Prince',
    descriptionMm: 'ပုဂံခေတ်မိဖုရား၊ ရတနာပုံခေတ်၊ ရှမ်းစော်ဘွားဝတ်စုံ'
  },
  {
    id: 'template_festival',
    pillarId: 'box5',
    subMenuId: 'template_festival',
    boxNumber: '5',
    boxLabel: 'Box 5',
    labelEn: 'Festivals & Celebrations Presets',
    labelMm: 'ပွဲတော်နှင့် ရိုးရာ ပွဲလမ်းသဘင် Presets',
    emoji: '💦',
    descriptionEn: 'Thingyan splashing, Lantern festival, Wedding celebration',
    descriptionMm: 'သင်္ကြန်ရေကစားပွဲ၊ မီးထွန်းပွဲတော်၊ မင်္ဂလာအခမ်းအနား'
  },
  {
    id: 'template_fashion',
    pillarId: 'box5',
    subMenuId: 'template_fashion',
    boxNumber: '5',
    boxLabel: 'Box 5',
    labelEn: 'Modern Haute Couture & Street Style Presets',
    labelMm: 'ခေတ်မီ ဖက်ရှင်နှင့် စတိုင်ကျ Presets',
    emoji: '👠',
    descriptionEn: 'Cyberpunk Neo-Burma, modern silk fusion, high fashion',
    descriptionMm: 'ခေတ်လွန် ဆိုက်ဘာစတိုင်၊ ခေတ်ပေါ်ပိုးထည်ဖက်ရှင်'
  },
  {
    id: 'template_cinematic',
    pillarId: 'box5',
    subMenuId: 'template_cinematic',
    boxNumber: '5',
    boxLabel: 'Box 5',
    labelEn: 'Cinematic Scenery & Dramatic Story Presets',
    labelMm: 'ရုပ်ရှင်ဆန်သော ရှုခင်းနှင့် အငွေ့အသက် Presets',
    emoji: '🎬',
    descriptionEn: 'Misty sunrise, dramatic twilight, ancient ruins',
    descriptionMm: 'နှင်းမြူဆိုင်းသော မနက်ခင်း၊ ရှေးဟောင်းအမွေအနှစ်'
  }
];

interface SelectedOptionsSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selection: MatrixSelection;
  language: Language;
  onEditOption: (pillarId: PillarId, subMenuId: string) => void;
  onDeleteOption: (optionId: string) => void;
  onResetAll: () => void;
  onGeneratePrompt: () => void;
  isGeneratingPrompt?: boolean;
}

export const SelectedOptionsSummaryModal: React.FC<SelectedOptionsSummaryModalProps> = ({
  isOpen,
  onClose,
  selection,
  language,
  onEditOption,
  onDeleteOption,
  onResetAll,
  onGeneratePrompt,
  isGeneratingPrompt
}) => {
  const isMyanmar = language === 'my';
  const [filterBox, setFilterBox] = useState<'all' | 'box1' | 'box2' | 'box3' | 'box4' | 'box5'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddMenuOpen, setIsAddMenuOpen] = useState<boolean>(false);
  const [addCategorySearch, setAddCategorySearch] = useState<string>('');
  const [addCategoryBoxFilter, setAddCategoryBoxFilter] = useState<'all' | 'box1' | 'box2' | 'box3' | 'box4' | 'box5'>('all');

  // Assemble all active picked options
  const pickedOptions = useMemo<PickedOptionItem[]>(() => {
    const list: PickedOptionItem[] = [];

    // --- Box 1: Subject & Identity ---
    // 1. Subject Type
    const subOpt = SUBJECT_OPTIONS.find(s => s.id === selection.subject);
    list.push({
      id: 'subject',
      pillarId: 'box1',
      subMenuId: 'subject_type',
      boxNumber: '1',
      boxLabel: 'Box1',
      categoryLabelMm: 'ဇာတ်ကောင် အမျိုးအစား',
      categoryLabelEn: 'Subject Category',
      valueLabelMm: subOpt?.labelMm || selection.subject,
      valueLabelEn: subOpt?.labelEn || selection.subject,
      emoji: subOpt?.emoji || '👤',
      canDelete: selection.subject !== 'woman' || Boolean(selection.customSubjectDetails),
      canEdit: true,
      description: selection.customSubjectDetails ? `Custom: ${selection.customSubjectDetails}` : undefined
    });

    // 2. Identity Lock
    const lockOpt = IDENTITY_LOCK_OPTIONS.find(l => l.id === selection.identityLock);
    list.push({
      id: 'identityLock',
      pillarId: 'box1',
      subMenuId: 'identity_lock',
      boxNumber: '1',
      boxLabel: 'Box1',
      categoryLabelMm: 'မျက်နှာထိန်းချုပ်မှု',
      categoryLabelEn: 'Identity Lock',
      valueLabelMm: lockOpt?.labelMm || '100% Face Lock',
      valueLabelEn: lockOpt?.labelEn || '100% Face Lock',
      emoji: lockOpt?.emoji || '🔒',
      canDelete: selection.identityLock !== 'face_100',
      canEdit: true
    });

    // 3. Reference Image
    if (selection.referenceImage) {
      list.push({
        id: 'referenceImage',
        pillarId: 'box1',
        subMenuId: 'identity_lock',
        boxNumber: '1',
        boxLabel: 'Box1',
        categoryLabelMm: 'ရည်ညွှန်း ဓာတ်ပုံ',
        categoryLabelEn: 'Reference Photo',
        valueLabelMm: 'ဓာတ်ပုံ တင်ထားသည်',
        valueLabelEn: 'User Reference Photo Attached',
        emoji: '🖼️',
        canDelete: true,
        canEdit: true
      });
    }

    // 4. Ethnicity
    if (selection.ethnicity) {
      const ethOpt = ETHNICITY_OPTIONS.find(e => e.id === selection.ethnicity);
      list.push({
        id: 'ethnicity',
        pillarId: 'box1',
        subMenuId: 'ethnicity_culture',
        boxNumber: '1',
        boxLabel: 'Box1',
        categoryLabelMm: 'လူမျိုးနှင့် ယဉ်ကျေးမှု',
        categoryLabelEn: 'Ethnicity & Culture',
        valueLabelMm: ethOpt?.labelMm || selection.ethnicity,
        valueLabelEn: ethOpt?.labelEn || selection.ethnicity,
        emoji: ethOpt?.emoji || '🇲🇲',
        canDelete: selection.ethnicity !== 'burmese',
        canEdit: true
      });
    }

    // 5. Pose & Expression
    if (selection.poseExpression) {
      const poseOpt = POSE_EXPRESSION_OPTIONS.find(p => p.id === selection.poseExpression);
      list.push({
        id: 'pose',
        pillarId: 'box1',
        subMenuId: 'pose_expression',
        boxNumber: '1',
        boxLabel: 'Box1',
        categoryLabelMm: 'ဟန်ပန်နှင့် အမူအရာ',
        categoryLabelEn: 'Pose & Expression',
        valueLabelMm: poseOpt?.labelMm || selection.poseExpression,
        valueLabelEn: poseOpt?.labelEn || selection.poseExpression,
        emoji: poseOpt?.emoji || '🧘',
        canDelete: selection.poseExpression !== 'looking_at_camera',
        canEdit: true
      });
    }

    // 6. Stature / Age
    if (selection.ageRange || selection.heightRange) {
      list.push({
        id: 'stature',
        pillarId: 'box1',
        subMenuId: 'physical_profile',
        boxNumber: '1',
        boxLabel: 'Box1',
        categoryLabelMm: 'အသက်နှင့် အရပ်အမောင်း',
        categoryLabelEn: 'Age & Physical Stature',
        valueLabelMm: `${selection.ageRange || 'Adult'} · ${selection.heightRange || 'Standard'}`,
        valueLabelEn: `${selection.ageRange || 'Adult'} · ${selection.heightRange || 'Standard'}`,
        emoji: '📏',
        canDelete: true,
        canEdit: true
      });
    }

    // --- Box 2: Wardrobe & Clothes ---
    // 7. Garment Style
    if (selection.garmentStyle) {
      const gOpt = GARMENT_OPTIONS.find(g => g.id === selection.garmentStyle);
      list.push({
        id: 'garment',
        pillarId: 'box2',
        subMenuId: 'garment_catalog',
        boxNumber: '2',
        boxLabel: 'Box2',
        categoryLabelMm: 'ဝတ်စုံ စတိုင်လ်',
        categoryLabelEn: 'Garment & Outfit',
        valueLabelMm: gOpt?.labelMm || selection.garmentStyle,
        valueLabelEn: gOpt?.labelEn || selection.garmentStyle,
        emoji: gOpt?.emoji || '👗',
        canDelete: selection.garmentStyle !== 'silk_longyi',
        canEdit: true
      });
    }

    // 8. Fabric Material
    if (selection.garmentFabric) {
      list.push({
        id: 'fabric',
        pillarId: 'box2',
        subMenuId: 'fabric_texture',
        boxNumber: '2',
        boxLabel: 'Box2',
        categoryLabelMm: 'ပိတ်စ အမျိုးအစား',
        categoryLabelEn: 'Fabric & Material',
        valueLabelMm: selection.garmentFabric,
        valueLabelEn: selection.garmentFabric,
        emoji: '🧵',
        canDelete: selection.garmentFabric !== 'Woven Silk with Water Droplets',
        canEdit: true
      });
    }

    // 9. Cultural Props
    if (selection.includeCulturalProps || selection.culturalPropsDetails) {
      list.push({
        id: 'culturalProps',
        pillarId: 'box2',
        subMenuId: 'cultural_accessories',
        boxNumber: '2',
        boxLabel: 'Box2',
        categoryLabelMm: 'ရိုးရာ အသုံးအဆောင်',
        categoryLabelEn: 'Cultural Props & Ornaments',
        valueLabelMm: selection.culturalPropsDetails || 'သနပ်ခါး၊ စပယ်ပန်းကုံးနှင့် ရိုးရာရတနာ',
        valueLabelEn: selection.culturalPropsDetails || 'Thanaka, Jasmine Garland & Traditional Jewelry',
        emoji: '🌸',
        canDelete: true,
        canEdit: true
      });
    }

    // 10. Custom Garment Upload
    if (selection.customGarmentImage) {
      list.push({
        id: 'customGarment',
        pillarId: 'box2',
        subMenuId: 'clothes_swap_studio',
        boxNumber: '2',
        boxLabel: 'Box2',
        categoryLabelMm: 'ကိုယ်ပိုင်ဝတ်စုံ ဓာတ်ပုံ',
        categoryLabelEn: 'Custom Garment Photo',
        valueLabelMm: selection.customGarmentDescription || 'ဝတ်စုံ ပုံတင်ထားသည်',
        valueLabelEn: selection.customGarmentDescription || 'Custom Reference Attire Attached',
        emoji: '👚',
        canDelete: true,
        canEdit: true
      });
    }

    // --- Box 3: Scene, Environment & Lighting ---
    // 11. Event / Festival
    if (selection.event) {
      const evOpt = EVENT_OPTIONS.find(e => e.id === selection.event);
      list.push({
        id: 'event',
        pillarId: 'box3',
        subMenuId: 'events_festivals',
        boxNumber: '3',
        boxLabel: 'Box3',
        categoryLabelMm: 'ပွဲတော်နှင့် အခမ်းအနား',
        categoryLabelEn: 'Festival & Event',
        valueLabelMm: evOpt?.labelMm || selection.event,
        valueLabelEn: evOpt?.labelEn || selection.event,
        emoji: evOpt?.emoji || '🎉',
        canDelete: selection.event !== 'thingyan' || Boolean(selection.customEventDetails),
        canEdit: true,
        description: selection.customEventDetails ? `Custom: ${selection.customEventDetails}` : undefined
      });
    }

    // 12. Location Backdrop
    if (selection.location) {
      const locOpt = LOCATION_OPTIONS.find(l => l.id === selection.location);
      list.push({
        id: 'location',
        pillarId: 'box3',
        subMenuId: 'locations_environments',
        boxNumber: '3',
        boxLabel: 'Box3',
        categoryLabelMm: 'နောက်ခံ ရှုခင်း',
        categoryLabelEn: 'Location Backdrop',
        valueLabelMm: locOpt?.labelMm || selection.location,
        valueLabelEn: locOpt?.labelEn || selection.location,
        emoji: locOpt?.emoji || '📍',
        canDelete: selection.location !== 'cyber_yangon' || Boolean(selection.customLocationDetails),
        canEdit: true,
        description: selection.customLocationDetails ? `Custom: ${selection.customLocationDetails}` : undefined
      });
    }

    // 13. Studio Lighting
    if (selection.timeAndLighting) {
      const litOpt = LIGHTING_OPTIONS.find(li => li.id === selection.timeAndLighting);
      list.push({
        id: 'lighting',
        pillarId: 'box3',
        subMenuId: 'lighting_ambiance',
        boxNumber: '3',
        boxLabel: 'Box3',
        categoryLabelMm: 'စတူဒီယို အလင်းအမှောင်',
        categoryLabelEn: 'Lighting Ambiance',
        valueLabelMm: litOpt?.labelMm || selection.timeAndLighting,
        valueLabelEn: litOpt?.labelEn || selection.timeAndLighting,
        emoji: litOpt?.emoji || '💡',
        canDelete: selection.timeAndLighting !== 'neon_midnight',
        canEdit: true
      });
    }

    // 14. Mood & Emotion
    if (selection.moodEmotion) {
      const moodOpt = MOOD_OPTIONS.find(m => m.id === selection.moodEmotion);
      list.push({
        id: 'mood',
        pillarId: 'box3',
        subMenuId: 'mood_emotion',
        boxNumber: '3',
        boxLabel: 'Box3',
        categoryLabelMm: 'ခံစားချက် ရသ',
        categoryLabelEn: 'Mood & Emotion',
        valueLabelMm: moodOpt?.labelMm || selection.moodEmotion,
        valueLabelEn: moodOpt?.labelEn || selection.moodEmotion,
        emoji: moodOpt?.emoji || '✨',
        canDelete: selection.moodEmotion !== 'cinematic_dramatic',
        canEdit: true
      });
    }

    // --- Box 4: Camera & Optics Matrix ---
    // 15. Camera Body & Lens
    if (selection.camera) {
      const camOpt = CAMERA_OPTIONS.find(c => c.id === selection.camera);
      list.push({
        id: 'camera',
        pillarId: 'box4',
        subMenuId: 'camera_lens',
        boxNumber: '4',
        boxLabel: 'Box4',
        categoryLabelMm: 'ကင်မရာနှင့် မှန်ဘီလူး',
        categoryLabelEn: 'Camera & Lens',
        valueLabelMm: camOpt?.label || selection.camera,
        valueLabelEn: camOpt?.label || selection.camera,
        emoji: '📷',
        canDelete: selection.camera !== 'sony_a7rv',
        canEdit: true
      });
    }

    // 16. Camera Angle
    if (selection.cameraAngle) {
      const angOpt = CAMERA_ANGLE_OPTIONS.find(a => a.id === selection.cameraAngle);
      list.push({
        id: 'cameraAngle',
        pillarId: 'box4',
        subMenuId: 'camera_angles',
        boxNumber: '4',
        boxLabel: 'Box4',
        categoryLabelMm: 'ကင်မရာ ရှုထောင့်',
        categoryLabelEn: 'Camera Angle',
        valueLabelMm: angOpt?.labelMm || selection.cameraAngle,
        valueLabelEn: angOpt?.labelEn || selection.cameraAngle,
        emoji: angOpt?.emoji || '📐',
        canDelete: selection.cameraAngle !== 'eye_level',
        canEdit: true
      });
    }

    // 17. Color Film / LUT
    if (selection.colorGrade) {
      const colOpt = COLOR_GRADE_OPTIONS.find(c => c.id === selection.colorGrade);
      list.push({
        id: 'colorGrade',
        pillarId: 'box4',
        subMenuId: 'color_film',
        boxNumber: '4',
        boxLabel: 'Box4',
        categoryLabelMm: 'ဖလင် အရောင် LUT',
        categoryLabelEn: 'Color Film Stock',
        valueLabelMm: colOpt?.labelMm || selection.colorGrade,
        valueLabelEn: colOpt?.labelEn || selection.colorGrade,
        emoji: '🎞️',
        canDelete: selection.colorGrade !== 'cyber_neon',
        canEdit: true
      });
    }

    // 18. Skin Retouching
    if (selection.retouching) {
      const retOpt = RETOUCH_OPTIONS.find(r => r.id === selection.retouching);
      list.push({
        id: 'retouching',
        pillarId: 'box4',
        subMenuId: 'retouch_makeup',
        boxNumber: '4',
        boxLabel: 'Box4',
        categoryLabelMm: 'အသားအရေ ပြင်ဆင်မှု',
        categoryLabelEn: 'Skin Retouching',
        valueLabelMm: retOpt?.labelMm || selection.retouching,
        valueLabelEn: retOpt?.labelEn || selection.retouching,
        emoji: '✨',
        canDelete: selection.retouching !== 'ultra_realism',
        canEdit: true
      });
    }

    // 19. Makeup
    if (selection.makeup) {
      const makOpt = MAKEUP_OPTIONS.find(m => m.id === selection.makeup);
      list.push({
        id: 'makeup',
        pillarId: 'box4',
        subMenuId: 'retouch_makeup',
        boxNumber: '4',
        boxLabel: 'Box4',
        categoryLabelMm: 'မိတ်ကပ် စတိုင်လ်',
        categoryLabelEn: 'Makeup Styling',
        valueLabelMm: makOpt?.labelMm || selection.makeup,
        valueLabelEn: makOpt?.labelEn || selection.makeup,
        emoji: '💄',
        canDelete: selection.makeup !== 'traditional_myanmar',
        canEdit: true
      });
    }

    // 20. Aspect Ratio
    if (selection.aspectRatio) {
      const arOpt = ASPECT_RATIOS.find(a => a.ratio === selection.aspectRatio);
      list.push({
        id: 'aspectRatio',
        pillarId: 'box4',
        subMenuId: 'camera_lens',
        boxNumber: '4',
        boxLabel: 'Box4',
        categoryLabelMm: 'ဓာတ်ပုံ အချိုးအစား',
        categoryLabelEn: 'Aspect Ratio',
        valueLabelMm: `${selection.aspectRatio} (${arOpt?.label || 'Portrait'})`,
        valueLabelEn: `${selection.aspectRatio} (${arOpt?.label || 'Portrait'})`,
        emoji: '📐',
        canDelete: selection.aspectRatio !== '9:16',
        canEdit: true
      });
    }

    // 21. Quality Profile
    if (selection.qualityProfile) {
      const qOpt = QUALITY_PROFILES.find(q => q.id === selection.qualityProfile);
      list.push({
        id: 'qualityProfile',
        pillarId: 'box4',
        subMenuId: 'quality_engine_settings',
        boxNumber: '4',
        boxLabel: 'Box4',
        categoryLabelMm: 'အရည်အသွေး အင်ဂျင်',
        categoryLabelEn: 'Quality Profile',
        valueLabelMm: qOpt?.label || selection.qualityProfile,
        valueLabelEn: qOpt?.label || selection.qualityProfile,
        emoji: '⚡',
        canDelete: selection.qualityProfile !== '8k_uhd',
        canEdit: true
      });
    }

    return list;
  }, [selection]);

  // Filter items by box and search
  const filteredOptions = useMemo(() => {
    return pickedOptions.filter(item => {
      const matchBox = filterBox === 'all' || item.pillarId === filterBox;
      if (!matchBox) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.categoryLabelEn.toLowerCase().includes(q) ||
        item.categoryLabelMm.toLowerCase().includes(q) ||
        item.valueLabelEn.toLowerCase().includes(q) ||
        item.valueLabelMm.toLowerCase().includes(q)
      );
    });
  }, [pickedOptions, filterBox, searchQuery]);

  const filteredAddableCategories = useMemo(() => {
    return ALL_ADDABLE_CATEGORIES.filter(cat => {
      const matchBox = addCategoryBoxFilter === 'all' || cat.pillarId === addCategoryBoxFilter;
      if (!matchBox) return false;
      if (!addCategorySearch.trim()) return true;
      const q = addCategorySearch.toLowerCase().trim();
      return (
        cat.labelEn.toLowerCase().includes(q) ||
        cat.labelMm.toLowerCase().includes(q) ||
        cat.descriptionEn.toLowerCase().includes(q) ||
        cat.descriptionMm.toLowerCase().includes(q) ||
        cat.boxLabel.toLowerCase().includes(q)
      );
    });
  }, [addCategoryBoxFilter, addCategorySearch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/20 border border-cyan-400/40 shadow-sm shrink-0">
              {isAddMenuOpen ? (
                <Plus className="h-5 w-5 text-cyan-400" />
              ) : (
                <Sliders className="h-5 w-5 text-cyan-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  {isAddMenuOpen
                    ? (isMyanmar ? '+ နောက်ထပ် အချက်အလက် ထည့်ရန် ရွေးချယ်ပါ' : '+ Add Another Option / Category')
                    : (isMyanmar ? 'Prompt Selection & Generate Session' : 'Prompt Selection & Generate Session')}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
                  {pickedOptions.length} Picked
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isAddMenuOpen
                  ? (isMyanmar
                      ? 'မည်သည့် Pillar/အမျိုးအစားကိုမဆို ရွေးချယ်၍ အချက်အလက်များ အသစ်ထည့်နိုင်ပါသည်'
                      : 'Select any category from Box 1 to Box 5 to configure and add new parameters')
                  : (isMyanmar
                      ? 'ရွေးချယ်ထားသော အချက်အလက်များကို ပြင်ဆင် (Edit)၊ ဖြုတ်ပယ် (Remove) သို့မဟုတ် အသစ်ထပ်ထည့် (Add Another) နိုင်ပါသည်'
                      : 'Review, edit, remove, or add another option before generating your master prompt')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!isAddMenuOpen ? (
              <button
                type="button"
                onClick={() => setIsAddMenuOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/60 text-xs font-bold text-cyan-300 hover:text-white transition-all shadow-sm cursor-pointer"
                title={isMyanmar ? 'နောက်ထပ် ရွေးချယ်မှု အသစ်ထည့်မည်' : 'Add Another Option'}
              >
                <Plus className="h-4 w-4" />
                <span>{isMyanmar ? '+ Add Another' : '+ Add Another'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddMenuOpen(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer"
                title="Back to picked list"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>{isMyanmar ? '← ပြန်သွားမည်' : '← Back'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* VIEW 1: ADD ANOTHER CATEGORY VIEW */}
        {isAddMenuOpen ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Filter Tabs & Search for Addable Categories */}
            <div className="px-6 py-3 border-b border-slate-800 bg-slate-950/40 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none py-1">
                {[
                  { id: 'all', label: isMyanmar ? 'အားလုံး' : 'All', count: ALL_ADDABLE_CATEGORIES.length },
                  { id: 'box1', label: 'Box 1: Subject', count: ALL_ADDABLE_CATEGORIES.filter(c => c.pillarId === 'box1').length },
                  { id: 'box2', label: 'Box 2: Wardrobe', count: ALL_ADDABLE_CATEGORIES.filter(c => c.pillarId === 'box2').length },
                  { id: 'box3', label: 'Box 3: Scene', count: ALL_ADDABLE_CATEGORIES.filter(c => c.pillarId === 'box3').length },
                  { id: 'box4', label: 'Box 4: Camera', count: ALL_ADDABLE_CATEGORIES.filter(c => c.pillarId === 'box4').length },
                  { id: 'box5', label: 'Box 5: Templates', count: ALL_ADDABLE_CATEGORIES.filter(c => c.pillarId === 'box5').length },
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setAddCategoryBoxFilter(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 border cursor-pointer ${
                      addCategoryBoxFilter === tab.id
                        ? 'bg-cyan-500/25 text-white border-cyan-400/80 shadow-sm'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      addCategoryBoxFilter === tab.id ? 'bg-cyan-400 text-black font-extrabold' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64 shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={addCategorySearch}
                  onChange={(e) => setAddCategorySearch(e.target.value)}
                  placeholder={isMyanmar ? 'အမျိုးအစား ရှာဖွေရန်...' : 'Search categories to add...'}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/70 transition-colors"
                />
              </div>
            </div>

            {/* Addable Categories Grid */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredAddableCategories.map((cat) => (
                  <div
                    key={cat.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      onEditOption(cat.pillarId, cat.subMenuId);
                      onClose();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onEditOption(cat.pillarId, cat.subMenuId);
                        onClose();
                      }
                    }}
                    className="group relative p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-400/70 hover:bg-slate-900 transition-all flex flex-col justify-between gap-2 shadow-md cursor-pointer text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{cat.emoji}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                          {cat.boxLabel}
                        </span>
                      </div>
                      <span className="text-[10px] text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center font-bold">
                        <span>{isMyanmar ? 'ရွေးမည်' : 'Select'}</span>
                        <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-200 transition-colors">
                        {isMyanmar ? cat.labelMm : cat.labelEn}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                        {isMyanmar ? cat.descriptionMm : cat.descriptionEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* VIEW 2: ACTIVE PICKED OPTIONS VIEW */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Filter Tabs & Search Bar */}
            <div className="px-6 py-3 border-b border-slate-800 bg-slate-950/40 flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Box Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none py-1">
                {[
                  { id: 'all', label: isMyanmar ? 'အားလုံး' : 'All', count: pickedOptions.length },
                  { id: 'box1', label: 'Box 1: Subject', count: pickedOptions.filter(o => o.pillarId === 'box1').length },
                  { id: 'box2', label: 'Box 2: Wardrobe', count: pickedOptions.filter(o => o.pillarId === 'box2').length },
                  { id: 'box3', label: 'Box 3: Scene', count: pickedOptions.filter(o => o.pillarId === 'box3').length },
                  { id: 'box4', label: 'Box 4: Camera', count: pickedOptions.filter(o => o.pillarId === 'box4').length },
                  { id: 'box5', label: 'Box 5: Templates', count: pickedOptions.filter(o => o.pillarId === 'box5').length },
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilterBox(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 border cursor-pointer ${
                      filterBox === tab.id
                        ? 'bg-cyan-500/25 text-white border-cyan-400/80 shadow-sm'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      filterBox === tab.id ? 'bg-cyan-400 text-black font-extrabold' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-56 shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isMyanmar ? 'အချက်အလက် ရှာဖွေရန်...' : 'Search options...'}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/70 transition-colors"
                />
              </div>
            </div>

            {/* Options List Grid */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
              {filteredOptions.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Sliders className="h-8 w-8 text-slate-500 mx-auto" />
                  <p className="text-sm font-semibold text-slate-400">
                    {isMyanmar ? 'ရှာဖွေတွေ့ရှိသော အချက်အလက် မရှိပါ' : 'No matching options found'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsAddMenuOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{isMyanmar ? '+ နောက်ထပ် အချက်အလက် ထည့်မည်' : '+ Add Options Now'}</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredOptions.map((item) => (
                    <div
                      key={item.id}
                      className="group relative p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-400/50 transition-all flex items-start justify-between gap-3 shadow-md"
                    >
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        {/* Emoji / Icon Badge */}
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-base shadow-inner">
                          {item.emoji || '✨'}
                        </div>

                        <div className="min-w-0 flex-1">
                          {/* Box badge + Category name */}
                          <div className="flex items-center gap-1.5 pb-0.5">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                              {item.boxLabel}
                            </span>
                            <span className="text-xs font-bold text-slate-300 truncate">
                              {isMyanmar ? item.categoryLabelMm : item.categoryLabelEn}
                            </span>
                          </div>

                          {/* Picked Value */}
                          <p className="text-xs sm:text-sm font-extrabold text-white truncate group-hover:text-cyan-200 transition-colors">
                            {isMyanmar ? item.valueLabelMm : item.valueLabelEn}
                          </p>

                          {item.description && (
                            <p className="text-[11px] text-slate-400 truncate mt-0.5">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions: Edit & Delete buttons */}
                      <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                        {item.canEdit && (
                          <button
                            type="button"
                            onClick={() => {
                              onEditOption(item.pillarId, item.subMenuId);
                              onClose();
                            }}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-cyan-300 transition-all shadow-sm cursor-pointer"
                            title={isMyanmar ? 'ဤအချက်ကို ပြင်ဆင်မည်' : 'Edit this option'}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">{isMyanmar ? 'Edit' : 'Edit'}</span>
                          </button>
                        )}

                        {item.canDelete && (
                          <button
                            type="button"
                            onClick={() => onDeleteOption(item.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/70 text-slate-400 hover:text-rose-300 transition-all shadow-sm cursor-pointer"
                            title={isMyanmar ? 'ဤအချက်ကို ဖြုတ်မည် (Default ပြန်ထားမည်)' : 'Remove this option'}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add Another Option Card at the end of the list */}
                  <button
                    type="button"
                    onClick={() => setIsAddMenuOpen(true)}
                    className="p-3.5 rounded-2xl border-2 border-dashed border-cyan-500/30 hover:border-cyan-400 bg-cyan-950/20 hover:bg-cyan-950/40 text-cyan-300 transition-all flex items-center justify-center gap-3 group cursor-pointer min-h-[70px]"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 group-hover:bg-cyan-500/30 text-cyan-300 shrink-0">
                      <Plus className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <span className="block text-xs font-bold text-white group-hover:text-cyan-200">
                        {isMyanmar ? '+ နောက်ထပ် ရွေးချယ်မှု ထည့်မည်' : '+ Add Another Option'}
                      </span>
                      <span className="block text-[11px] text-slate-400">
                        {isMyanmar ? 'Box 1 မှ 5 အထိ အချက်အလက်များ ထပ်မံရွေးရန်' : 'Choose more categories from Box 1 to Box 5'}
                      </span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Bottom Footer */}
        <div className="px-5 sm:px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onResetAll();
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-rose-600/60 text-xs font-bold text-slate-300 hover:text-rose-300 transition-all cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 text-rose-400" />
            <span>{isMyanmar ? 'အားလုံးကို မူလအတိုင်း ပြန်ထားမည် (Reset All)' : 'Reset All to Defaults'}</span>
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition-all cursor-pointer"
            >
              {isMyanmar ? 'ပြီးပါပြီ (Done)' : 'Close'}
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onGeneratePrompt();
              }}
              disabled={isGeneratingPrompt}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-white to-cyan-300 hover:from-cyan-300 hover:to-white text-black font-black text-xs shadow-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              <Wand2 className="h-4 w-4 text-black" />
              <span>{isMyanmar ? '✨ Prompt ထုတ်ယူမည် (Generate)' : '✨ Generate Master Prompt'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
