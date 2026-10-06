import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Language, MatrixSelection, PresetTemplate } from '../types';
import {
  SUBJECT_OPTIONS,
  ETHNICITY_OPTIONS,
  POSE_EXPRESSION_OPTIONS,
  AGE_RANGE_OPTIONS,
  CHILD_AGE_OPTIONS,
  HEIGHT_OPTIONS,
  WEIGHT_OPTIONS,
  GARMENT_OPTIONS,
  CULTURAL_PROP_PRESETS,
  EVENT_OPTIONS,
  LOCATION_OPTIONS,
  LIGHTING_OPTIONS,
  TIME_OF_DAY_OPTIONS,
  MOOD_OPTIONS,
  CAMERA_OPTIONS,
  CAMERA_ANGLE_OPTIONS,
  PHOTO_STYLE_OPTIONS,
  RETOUCH_OPTIONS,
  MAKEUP_OPTIONS,
  COLOR_GRADE_OPTIONS,
  ASPECT_RATIOS,
  QUALITY_PROFILES,
  PRESET_TEMPLATES,
  IDENTITY_LOCK_OPTIONS,
  PET_OPTIONS,
  PRODUCT_OPTIONS,
  FASHION_OPTIONS
} from '../data/presetData';
import {
  Terminal,
  Sparkles,
  Wand2,
  Copy,
  Check,
  X,
  ChevronRight,
  User,
  MapPin,
  Shirt,
  ImageIcon,
  Layers,
  Sliders,
  Code,
  CheckCircle2,
  Sun,
  Clock,
  CloudRain,
  Smile,
  Zap,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Camera,
  Film,
  Palette,
  Globe,
  ShieldCheck,
  Ruler,
  Heart,
  Mountain,
  Maximize2,
  Settings2,
  SlidersHorizontal,
  Package
} from 'lucide-react';

export type BoxOrigin = 'box1' | 'box2' | 'box3' | 'box4' | 'box5';

export interface SlashCommandTypingBarProps {
  language: Language;
  onApplyAndGenerate: (customPrompt: string, updates?: Partial<MatrixSelection>) => void;
  isGeneratingPrompt?: boolean;
  onUpdateSelection?: (updates: Partial<MatrixSelection>) => void;
  initialValue?: string;
  placeholder?: string;
  className?: string;
  variant?: 'hero' | 'compact' | 'card';
}

export interface SubFeatureCategory {
  category: string;
  categoryMm: string;
  options: string[];
}

export interface PresetDef {
  name: string;
  tag: string;
  tagMm: string;
  description: string;
  descriptionMm: string;
  subFeatures: SubFeatureCategory[];
  fullRecipe?: string;
  matrixUpdates?: Partial<MatrixSelection>;
}

export interface CommandDef {
  cmd: string;
  canonical: string;
  aliases: string[];
  box: BoxOrigin;
  boxLabel: string;
  label: string;
  labelMm: string;
  icon: React.ElementType;
  purpose: string;
  purposeMm: string;
  presets: PresetDef[];
  nextSuggestions: {
    cmd: string;
    label: string;
    hint: string;
  }[];
}

// =============================================================================
// COMPREHENSIVE COMMAND CATALOG MAPPED TO BOX 1 THROUGH BOX 5
// =============================================================================
export const ALL_BOX_COMMANDS: CommandDef[] = [
  // ---------------------------------------------------------------------------
  // BOX 1: SUBJECT & IDENTITY ARCHITECTURE
  // ---------------------------------------------------------------------------
  {
    cmd: '/box1',
    canonical: '/Box1',
    aliases: ['/box1', '/subject', '/character'],
    box: 'box1',
    boxLabel: 'Box 1: Subject & Identity',
    label: '/Box1 (Subject & Identity)',
    labelMm: '/Box1 (ဇာတ်ကောင်နှင့် ကိုယ်ပိုင်ဟန်)',
    icon: User,
    purpose: 'Box 1: Subject, ethnicity, stature, signature pose, and facial identity lock',
    purposeMm: 'Box 1: ဇာတ်ကောင်၊ အသက်၊ လူမျိုး၊ ဟန်ပန် နှင့် မူရင်းရုပ် ထိန်းသိမ်းခြင်း',
    nextSuggestions: [
      { cmd: '/box2', label: '/Box2', hint: 'Wardrobe & Outfit' },
      { cmd: '/box3', label: '/Box3', hint: 'Scene & Lighting' },
      { cmd: '/box4', label: '/Box4', hint: 'Camera & Optics' }
    ],
    presets: [
      {
        name: 'Photorealistic Human Woman',
        tag: 'Box 1: Subject',
        tagMm: 'အမျိုးသမီး ပုံတူ',
        description: 'Lifelike portrait of a woman with natural skin texture, depth of field & studio fidelity',
        descriptionMm: 'အသားအရေ အသေးစိတ်ပါဝင်သော သဘာဝကျ အမျိုးသမီး ပုံတူ',
        matrixUpdates: { subject: 'woman', identityLock: 'face_preserve_strict' },
        subFeatures: [
          {
            category: 'Expression',
            categoryMm: 'အမူအရာ (Expression)',
            options: ['Gentle Royal Smile', 'Confident Intense Gaze', 'Calm Stoic Thoughtful Look', 'High-Fashion Editorial Neutral Look', 'Warm Welcoming Eyes']
          },
          {
            category: 'Ethnicity',
            categoryMm: 'လူမျိုးနွယ် (Ethnicity)',
            options: ['Burmese Heritage', 'Shan Ethnic Heritage', 'Kachin Traditional', 'East Asian Fine Features', 'Universal Human']
          },
          {
            category: 'Stature & Age',
            categoryMm: 'အရပ်နှင့် အသက်',
            options: ['Young Adult (22yo)', 'Teenager (18-19yo)', 'Mature Dignified (30s)', 'Graceful Stature (165cm)']
          }
        ]
      },
      {
        name: 'Photorealistic Human Man',
        tag: 'Box 1: Subject',
        tagMm: 'အမျိုးသား ပုံတူ',
        description: 'Charismatic portrait of a man with defined features and masculine presence',
        descriptionMm: 'ခန့်ညားထည်ဝါသော အမျိုးသား ပုံတူ ဖန်တီးမှု',
        matrixUpdates: { subject: 'man', identityLock: 'face_preserve_strict' },
        subFeatures: [
          {
            category: 'Expression',
            categoryMm: 'အမူအရာ (Expression)',
            options: ['Confident Focused Smirk', 'Warm Gentle Grin', 'Stoic Heroic Gaze', 'Thoughtful Analytical Look']
          },
          {
            category: 'Stature',
            categoryMm: 'ခန္ဓာကိုယ် တည်ဆောက်ပုံ',
            options: ['Tall Athletic Build (180cm)', 'Lean Tailored Model Silhouette', 'Distinguished Broad Shoulders']
          }
        ]
      },
      {
        name: 'Anime / Manga Style Hero',
        tag: 'Box 1: Subject',
        tagMm: 'အန်နီမေး စတိုင်',
        description: 'Expressive 2D anime hero/heroine with dynamic lines, cel-shading & Makoto Shinkai glow',
        descriptionMm: 'တက်ကြွသော ၂D အန်နီမေး သရုပ်ဖော် စတိုင်',
        matrixUpdates: { photoStyle: 'anime_cel_shade' },
        subFeatures: [
          {
            category: 'Archetype',
            categoryMm: 'ရုပ်သွင် (Archetype)',
            options: ['Anime Hero / Heroine Archetype', 'Fantasy Elf with Pointed Ears', 'Magical Academy Scholar', 'Cyberpunk Rebel Hero']
          },
          {
            category: 'Pose',
            categoryMm: 'ပိုစ့် (Pose)',
            options: ['Spellcasting Dynamic Action Pose', 'Windblown Hair Dramatic Stance', 'Leaning Gently Against Wall', 'Looking Up at Starlit Sky']
          }
        ]
      },
      {
        name: 'Cyberpunk Futuristic Persona',
        tag: 'Box 1: Subject',
        tagMm: 'ဆိုက်ဘာပန့်ခ် ဇာတ်ကောင်',
        description: 'High-tech urban persona with glowing fiber-optics, chrome bionics & neon glare',
        descriptionMm: 'အဆင့်မြင့် ဆိုက်ဘာ အစိတ်အပိုင်းများနှင့် ခေတ်လွန် ဇာတ်ကောင်',
        subFeatures: [
          {
            category: 'Cybernetic Details',
            categoryMm: 'ဆိုက်ဘာ အသေးစိတ်',
            options: ['Subtle Glowing Fiber-Optic Temples', 'Chrome Bionic Cybernetic Arm', 'Holographic AR Eye Implant', 'Subdermal Nano-Carbon Veins']
          },
          {
            category: 'Pose',
            categoryMm: 'ပိုစ့် (Pose)',
            options: ['Holding Cyber Katana at Rest', 'Typing on Floating Holographic Display', 'Crouched on Rain-Slicked Roof', 'Casual Streetwise Lean']
          }
        ]
      },
      {
        name: 'Commercial Product Photoshoot',
        tag: 'Box 1: Product',
        tagMm: 'ကုန်ပစ္စည်း ဓာတ်ပုံ',
        description: 'High-end commercial product photography on polished podium with studio lighting',
        descriptionMm: 'ကြော်ငြာ ကုန်ပစ္စည်း စတူဒီယို ဓာတ်ပုံ',
        matrixUpdates: { subject: 'product' },
        subFeatures: [
          {
            category: 'Product Type',
            categoryMm: 'ကုန်ပစ္စည်း အမျိုးအစား',
            options: ['Luxury Skincare Dropper Bottle', 'Flagship Glass Smartphone', 'Designer Quilted Leather Handbag', 'Artisanal Coffee Cup on Slate Board']
          }
        ]
      }
    ]
  },

  {
    cmd: '/identity',
    canonical: '/Identity',
    aliases: ['/identity', '/facelock', '/lock'],
    box: 'box1',
    boxLabel: 'Box 1: Identity Lock',
    label: '/Identity (Face & Body Lock)',
    labelMm: '/Identity (မူရင်းရုပ် ထိန်းချုပ်မှု)',
    icon: ShieldCheck,
    purpose: 'Box 1: 100% Facial Identity Lock, Body Structure Lock & photo preservation',
    purposeMm: 'Box 1: မူရင်းရုပ် ၁၀၀% မပြောင်းလဲစေရန် မျက်နှာနှင့် ခန္ဓာကိုယ် ထိန်းချုပ်ခြင်း',
    nextSuggestions: [
      { cmd: '/pose', label: '/Pose', hint: 'Pose & expression' },
      { cmd: '/clothes', label: '/Clothes', hint: 'Wardrobe styling' }
    ],
    presets: [
      {
        name: '100% Face Lock (Strict Preservation)',
        tag: 'Identity: Strict',
        tagMm: 'မျက်နှာ ၁၀၀% ထိန်းသိမ်း',
        description: 'Locks facial geometry, eye shape, nose, lips and cheekbones with 1:1 fidelity',
        descriptionMm: 'မူရင်းဓာတ်ပုံမှ မျက်နှာသွင်ပြင်ကို တစ်ထေရာတည်း တိကျစွာ ထိန်းသိမ်းခြင်း',
        matrixUpdates: { identityLock: 'face_preserve_strict' },
        subFeatures: [
          {
            category: 'Preservation Directives',
            categoryMm: 'ထိန်းချုပ်မှု ညွှန်ကြားချက်များ',
            options: ['100% facial likeness lock, identical eyes, nose, lips and facial structure', 'Maintain exact skin undertone and natural moles without modification', 'Preserve facial identity across multi-angle camera views']
          }
        ]
      },
      {
        name: 'Face & Hair Structure Lock',
        tag: 'Identity: Hair & Face',
        tagMm: 'မျက်နှာနှင့် ဆံပင် ထိန်းသိမ်း',
        description: 'Preserves both facial likeness and exact hairstyle length and texture',
        descriptionMm: 'မျက်နှာအပြင် မူရင်းဆံပင်ပုံစံနှင့် အရောင်ကိုပါ ထိန်းသိမ်းခြင်း',
        matrixUpdates: { identityLock: 'face_hair_preserve' },
        subFeatures: [
          {
            category: 'Preservation Directives',
            categoryMm: 'ညွှန်ကြားချက်များ',
            options: ['Retain exact natural hairstyle and hairline shape', 'Zero alteration to facial bone proportions', 'Match reference image eye color and iris pattern']
          }
        ]
      }
    ]
  },

  {
    cmd: '/ethnicity',
    canonical: '/Ethnicity',
    aliases: ['/ethnicity', '/culture', '/heritage'],
    box: 'box1',
    boxLabel: 'Box 1: Ethnicity',
    label: '/Ethnicity (Heritage & Culture)',
    labelMm: '/Ethnicity (လူမျိုးနှင့် ရိုးရာ)',
    icon: Globe,
    purpose: 'Box 1: Burmese, Shan, Karen, Kachin, Thai, Korean, East Asian & Western heritage',
    purposeMm: 'Box 1: မြန်မာ၊ ရှမ်း၊ ကရင်၊ ကချင်၊ မွန်၊ ရခိုင် နှင့် နိုင်ငံတကာ လူမျိုးနွယ်',
    nextSuggestions: [
      { cmd: '/clothes', label: '/Clothes', hint: 'Cultural attire' },
      { cmd: '/background', label: '/Background', hint: 'Heritage locations' }
    ],
    presets: [
      {
        name: 'Burmese Heritage (မြန်မာ)',
        tag: 'Ethnicity: Burmese',
        tagMm: 'မြန်မာ ရိုးရာ',
        description: 'Classic Myanmar facial features, warm golden undertone & graceful royal poise',
        descriptionMm: 'မြန်မာဆန်သော မျက်နှာသွင်ပြင်နှင့် နူးညံ့ပြေပြစ်သော ရုပ်သွင်',
        matrixUpdates: { ethnicity: 'burmese' },
        subFeatures: [
          {
            category: 'Heritage Details',
            categoryMm: 'ရိုးရာ အသေးစိတ်',
            options: ['Natural warm golden skin undertone', 'Subtle elegant Thanaka on cheeks', 'Deep dark eyes with expressive warmth', 'Traditional Burmese royal poise']
          }
        ]
      },
      {
        name: 'Shan Ethnic Heritage (ရှမ်း)',
        tag: 'Ethnicity: Shan',
        tagMm: 'ရှမ်း တိုင်းရင်းသား',
        description: 'Shan highland heritage with fair porcelain skin, graceful eyes & traditional royal charisma',
        descriptionMm: 'ရှမ်း တောင်တန်းဒေသ ရိုးရာ ရုပ်သွင်နှင့် အသားအရေ',
        matrixUpdates: { ethnicity: 'shan' },
        subFeatures: [
          {
            category: 'Heritage Details',
            categoryMm: 'ရိုးရာ အသေးစိတ်',
            options: ['Fair porcelain skin with highland blush', 'Shan noble facial contour', 'Gentle bright eyes with natural charm']
          }
        ]
      },
      {
        name: 'East Asian / International',
        tag: 'Ethnicity: Asian',
        tagMm: 'အရှေ့အာရှ / နိုင်ငံတကာ',
        description: 'Contemporary East Asian refined facial symmetry with high-fashion appeal',
        descriptionMm: 'ခေတ်မီ အရှေ့အာရှ စတိုင် ရုပ်သွင် သန့်သန့်',
        matrixUpdates: { ethnicity: 'east_asian' },
        subFeatures: [
          {
            category: 'Aesthetic Focus',
            categoryMm: 'စတိုင် ဦးတည်ချက်',
            options: ['Refined modern jawline and high cheekbones', 'Clean glowing glass skin texture', 'Editorial international magazine likeness']
          }
        ]
      }
    ]
  },

  {
    cmd: '/pose',
    canonical: '/Pose',
    aliases: ['/pose', '/stance', '/expression'],
    box: 'box1',
    boxLabel: 'Box 1: Pose & Expression',
    label: '/Pose (Stance & Expression)',
    labelMm: '/Pose (ဟန်ပန်နှင့် မျက်နှာအမူအရာ)',
    icon: Smile,
    purpose: 'Box 1: 25 signature editorial, portrait, and dynamic action pose selections',
    purposeMm: 'Box 1: စတူဒီယို ပရော်ဖက်ရှင်နယ် ဓာတ်ပုံဟန်ပန် ၂၅ မျိုးနှင့် မျက်နှာအမူအရာ',
    nextSuggestions: [
      { cmd: '/camera', label: '/Camera', hint: 'Camera angles & lens' },
      { cmd: '/clothes', label: '/Clothes', hint: 'Outfit drapery' }
    ],
    presets: [
      {
        name: 'Standing Heroic Eye-Level Pose',
        tag: 'Pose: Heroic',
        tagMm: 'မတ်တပ် ရပ်ဟန်',
        description: 'Confident poised stance directly facing the camera with royal dignity',
        descriptionMm: 'ယုံကြည်မှု အပြည့်ဖြင့် ကင်မရာသို့ တည့်တည့်ကြည့်နေသော မတ်တပ်ဟန်',
        matrixUpdates: { poseExpression: 'standing_straight_looking' },
        subFeatures: [
          {
            category: 'Stance Variations',
            categoryMm: 'ဟန်ပန် အမျိုးမျိုး',
            options: ['Standing Graceful Eye-Level Looking at Camera', 'Hands resting naturally at sides with relaxed shoulders', 'One hand gently holding traditional sash or garment', 'Slight head tilt with serene warm smile']
          }
        ]
      },
      {
        name: 'Over the Shoulder Dramatic Turn',
        tag: 'Pose: Over-Shoulder',
        tagMm: 'ပခုံးကျော် လှည့်ကြည့်ဟန်',
        description: 'Dynamic 45-degree silhouette turn looking back toward camera with captivating gaze',
        descriptionMm: 'ဆွဲဆောင်မှုရှိသော ပခုံးကျော် လှည့်ကြည့်ဟန်ပန်',
        matrixUpdates: { poseExpression: 'turn_around_look_back' },
        subFeatures: [
          {
            category: 'Stance Variations',
            categoryMm: 'ဟန်ပန် အမျိုးမျိုး',
            options: ['Over the shoulder dramatic turn with windblown hair', 'Mysterious intense half-profile glance', 'Elegant back-contour silhouette highlighting garment']
          }
        ]
      },
      {
        name: 'Candid Mid-Stride Walking Pose',
        tag: 'Pose: Motion',
        tagMm: 'လမ်းလျှောက် လှုပ်ရှားဟန်',
        description: 'Spontaneous street style walking in motion with natural garment flow',
        descriptionMm: 'သဘာဝကျကျ လမ်းလျှောက်နေသော လှုပ်ရှားဟန်ပန်',
        matrixUpdates: { poseExpression: 'walking_mid_stride' },
        subFeatures: [
          {
            category: 'Motion Dynamics',
            categoryMm: 'လှုပ်ရှားမှု',
            options: ['Captured mid-stride with fluid fabric movement', 'Casual sidewalk stroll looking off-camera', 'Dynamic fashion runway stride']
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // BOX 2: WARDROBE & CLOTHES SWAP STUDIO
  // ---------------------------------------------------------------------------
  {
    cmd: '/box2',
    canonical: '/Box2',
    aliases: ['/box2', '/clothes', '/garment', '/wardrobe'],
    box: 'box2',
    boxLabel: 'Box 2: Wardrobe & Fashion',
    label: '/Box2 (Wardrobe & Clothes Swap)',
    labelMm: '/Box2 (ဖက်ရှင်၊ အဝတ်အစားနှင့် ဝတ်စုံလဲ)',
    icon: Shirt,
    purpose: 'Box 2: 32 traditional longyi, modern streetwear, suits, gowns, fabrics & cultural props',
    purposeMm: 'Box 2: မဂ္ဂဇင်း ဖက်ရှင် ဝတ်စုံလဲ၊ ရိုးရာ ပိုးလုံချည်၊ ညနေခင်းဝတ်စုံနှင့် အသုံးအဆောင်များ',
    nextSuggestions: [
      { cmd: '/box3', label: '/Box3', hint: 'Scene & Backdrop' },
      { cmd: '/box4', label: '/Box4', hint: 'Camera & Optics' },
      { cmd: '/box1', label: '/Box1', hint: 'Character & Pose' }
    ],
    presets: [
      {
        name: 'Traditional Royal Acheik Silk Longyi',
        tag: 'Box 2: Cultural Silk',
        tagMm: 'ရိုးရာ အချိတ် ပိုးထည်',
        description: 'Authentic hand-woven Acheik longyi with gold thread embroidery & royal sash',
        descriptionMm: 'ရွှေချည်ထိုး မြန်မာ့ရိုးရာ အချိတ်ပိုးလုံချည်နှင့် တော်ဝင်ဝတ်စုံ',
        matrixUpdates: { garmentStyle: 'traditional_acheik', garmentFabric: 'Pure Woven Heavy Acheik Silk with Gold Thread' },
        subFeatures: [
          {
            category: 'Fabric Texture',
            categoryMm: 'အထည်အသား (Fabric)',
            options: ['Pure Woven Heavy Acheik Silk with Gold Thread', 'Delicate Hand-Embroidered Lace & Chiffon', 'Lustrous Velvet with Royal Pearls', 'Raw Organic Hand-Spun Cotton']
          },
          {
            category: 'Color Palette',
            categoryMm: 'အရောင် (Palette)',
            options: ['Royal Gold & Ruby Crimson', 'Emerald Jade & Champagne Gold', 'Sapphire Blue & Silver Thread', 'Pastel Lotus Pink & Cream Pearl']
          },
          {
            category: 'Cultural Props',
            categoryMm: 'ရိုးရာ အသုံးအဆောင်',
            options: ['Traditional Pathein Painted Umbrella', 'Solid Gold Earplugs & Jasmine Flower Garland', 'Ornate Silver Water Bowl', 'Golden Crested Headdress / Tiara']
          }
        ]
      },
      {
        name: 'Streetwear / Modern Casual',
        tag: 'Box 2: Streetwear',
        tagMm: 'ခေတ်ပေါ် လမ်းလျှောက်',
        description: 'Heavyweight 500GSM boxy hoodie, relaxed cargo trousers, tech straps & sneakers',
        descriptionMm: 'ခေတ်မီ အထာကျသော လမ်းလျှောက် အဝတ်အစားများ',
        matrixUpdates: { garmentStyle: 'streetwear_casual', garmentFabric: 'Heavy 500GSM Loopback French Terry Cotton' },
        subFeatures: [
          {
            category: 'Fabric Texture',
            categoryMm: 'အထည်အသား (Fabric)',
            options: ['Heavy 500GSM Loopback French Terry Cotton', 'Ripstop Nylon & Weatherproof GORE-TEX', 'Washed Vintage Distressed Denim', 'Technical Ripstop Mesh']
          },
          {
            category: 'Color Palette',
            categoryMm: 'အရောင် (Palette)',
            options: ['Monochromatic Black & Slate Charcoal', 'Earthy Sage Green & Sand Beige', 'Cyber Neon Orange Accents on Matte Grey', 'Off-White & Cream Tone-on-Tone']
          },
          {
            category: 'Accessories',
            categoryMm: 'အသုံးအဆောင်',
            options: ['Chunky Designer Sneakers & Silver Cuban Chain', 'Matte Black Sunglasses & Leather Crossbody Bag', 'Minimalist Beanie & Wireless Earbuds']
          }
        ]
      },
      {
        name: 'High Fantasy Mythril Armor / Robes',
        tag: 'Box 2: High Fantasy',
        tagMm: 'မှော်ဝင် ချပ်ဝတ်',
        description: 'Engraved mythril plate armor, celestial silk enchanted robes & glowing rune staff',
        descriptionMm: 'မှော်ဝင် သံချပ်ကာနှင့် ရွှေချည်ထိုး မှော်ဆရာ ဝတ်ရုံ',
        subFeatures: [
          {
            category: 'Material',
            categoryMm: 'ပစ္စည်းအမျိုးအစား',
            options: ['Weathered Battle-Worn Mythril & Hardened Leather', 'Glow-Embroidered Velvet & Celestial Silk', 'Damascus Folded Steel & Dragon Leather']
          },
          {
            category: 'Accessories & Weapons',
            categoryMm: 'အဆောင်အယောင်',
            options: ['Flowing Fur-Lined Velvet Cape', 'Carved Ancient Rune Staff with Floating Crystal', 'Engraved Sheathed Broadsword with Gemmed Hilt']
          }
        ]
      },
      {
        name: 'Sci-Fi Suit / Mech Gear',
        tag: 'Box 2: Sci-Fi Mech',
        tagMm: 'ဆိုက်ဘာ မက်ခ်',
        description: 'Form-fitting nanotech carbon exo-suit with glowing LED trim & HUD gauntlets',
        descriptionMm: 'ကာဗွန်ဖိုင်ဘာ နာနိုနည်းပညာနှင့် ခေတ်လွန် ဝတ်စုံ',
        subFeatures: [
          {
            category: 'Fabric & Material',
            categoryMm: 'အသား (Texture)',
            options: ['Matte Black Carbon Fiber with Hexagonal Weave', 'High-Gloss Titanium Alloys with Pressure Seams', 'Flexible Ballistic Polymer with Fiber-Optic Lines']
          },
          {
            category: 'Color & Lighting',
            categoryMm: 'အရောင်နှင့် မီးရောင်',
            options: ['Matte Stealth Black with Cyan LED Trim', 'Arctic White with Hazard Orange Highlights', 'Gunmetal Grey with Hot Magenta Accents']
          }
        ]
      },
      {
        name: 'Formal Wear / Black-Tie Tuxedo & Gown',
        tag: 'Box 2: Formal Red Carpet',
        tagMm: 'ဂုဏ်သရေရှိ ပွဲတက်',
        description: 'Floor-sweeping silk evening gown with dramatic train or Italian tailored tuxedo',
        descriptionMm: 'အဆင့်မြင့် ပိုးထည် ပွဲတက်ဂါဝန်နှင့် ကုတ်အင်္ကျီ',
        subFeatures: [
          {
            category: 'Fabric',
            categoryMm: 'အထည် (Fabric)',
            options: ['Heavy Mulberry Silk Satin with Fluid Drape', 'Midnight Black Deep Silk Velvet', 'Super 160s Fine Italian Wool']
          },
          {
            category: 'Accessories',
            categoryMm: 'ရတနာ & အသုံးအဆောင်',
            options: ['Diamond Tennis Necklace & Drop Earrings', 'Luxury Swiss Timepiece with Crocodile Strap', 'Silk Pocket Square & Onyx Cufflinks']
          }
        ]
      }
    ]
  },

  {
    cmd: '/props',
    canonical: '/Props',
    aliases: ['/props', '/accessories', '/cultural'],
    box: 'box2',
    boxLabel: 'Box 2: Cultural Props',
    label: '/Props (Cultural Accessories & Jewelry)',
    labelMm: '/Props (ရိုးရာ အသုံးအဆောင်နှင့် ရတနာ)',
    icon: Sparkles,
    purpose: 'Box 2: Pathein umbrella, jasmine flower garland, Thanaka, jewelry & ornaments',
    purposeMm: 'Box 2: ပုသိမ်ထီး၊ စပယ်ပန်းကုံး၊ သနပ်ခါး၊ ရွှေဆွဲကြိုးနှင့် ကျောက်မျက်များ',
    nextSuggestions: [
      { cmd: '/clothes', label: '/Clothes', hint: 'Select matching garment' },
      { cmd: '/background', label: '/Background', hint: 'Match scenery' }
    ],
    presets: [
      {
        name: 'Royal Heritage Jewelry & Umbrella',
        tag: 'Props: Royal Heritage',
        tagMm: 'နန်းတွင်း အသုံးအဆောင်',
        description: 'Traditional gold Pathein silk umbrella, jasmine garland, gold earplugs & Thanaka',
        descriptionMm: 'ရွှေရောင် ပုသိမ်ထီး၊ စပယ်ပန်းကုံး၊ နန်းတွင်းရတနာများနှင့် သနပ်ခါး',
        matrixUpdates: { includeCulturalProps: true },
        subFeatures: [
          {
            category: 'Cultural Props List',
            categoryMm: 'အသုံးအဆောင် စာရင်း',
            options: ['Traditional Pathein Painted Umbrella in hand', 'Solid Gold Earplugs (နားကပ်) with Ruby Inlay', 'Fragrant Fresh Jasmine Flower Garland around neck', 'Subtle Elegant Thanaka Paste on Cheeks']
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // BOX 3: SCENE, ENVIRONMENT & LIGHTING
  // ---------------------------------------------------------------------------
  {
    cmd: '/box3',
    canonical: '/Box3',
    aliases: ['/box3', '/scene', '/background', '/environment'],
    box: 'box3',
    boxLabel: 'Box 3: Scene & Environment',
    label: '/Box3 (Scene, Environment & Lighting)',
    labelMm: '/Box3 (နောက်ခံ၊ ပွဲတော်နှင့် အလင်းအမှောင်)',
    icon: MapPin,
    purpose: 'Box 3: 36 locations, 30 festivals, studio Rembrandt, neon rim, golden hour & moods',
    purposeMm: 'Box 3: သင်္ကြန်၊ သီတင်းကျွတ်၊ ဆိုက်ဘာရန်ကုန်၊ ပုဂံဘုရားများနှင့် စတူဒီယို အလင်းအမှောင်',
    nextSuggestions: [
      { cmd: '/box4', label: '/Box4', hint: 'Camera & Optics' },
      { cmd: '/box2', label: '/Box2', hint: 'Wardrobe & Styling' },
      { cmd: '/box5', label: '/Box5', hint: 'Full Presets' }
    ],
    presets: [
      {
        name: 'Historical Bagan Ancient Pagodas Setting',
        tag: 'Box 3: Bagan Heritage',
        tagMm: 'ပုဂံ ရှေးဟောင်း စေတီများ',
        description: 'Ancient red-brick Bagan pagodas under dramatic warm golden hour sunset rays',
        descriptionMm: 'ပုဂံခေတ် ရှေးဟောင်း စေတီပုထိုးများနှင့် ညနေခင်း ရွှေရောင်ဆည်းဆာ',
        matrixUpdates: { location: 'bagan_pagodas', timeAndLighting: 'golden_hour' },
        subFeatures: [
          {
            category: 'Lighting',
            categoryMm: 'အလင်းအမှောင် (Lighting)',
            options: ['Golden Hour Ancient Temple Sunbeams', 'Warm Oil Lamp & Candlelight Glow', 'Dusty Window Light Rays', 'Sepia Tone Warm Natural Light']
          },
          {
            category: 'Atmosphere & Weather',
            categoryMm: 'လေထု & ရာသီဥတု',
            options: ['Atmospheric Ancient Dust Motes', 'Gentle Temple Breeze', 'Sun-Baked Dry Air', 'Volumetric Sunset Haze']
          }
        ]
      },
      {
        name: 'Cyberpunk Neon Megacity Alley',
        tag: 'Box 3: Cyber City',
        tagMm: 'ဆိုက်ဘာ ရန်ကုန်',
        description: 'Towering holographic billboards, dense cyber canyons, wet reflective asphalt & neon mist',
        descriptionMm: 'နီယွန်မီးရောင်စုံ၊ မိုးစက်များနှင့် စိုစွတ်သော ခေတ်လွန် လမ်းမကြီးများ',
        matrixUpdates: { location: 'cyber_yangon', timeAndLighting: 'neon_practical' },
        subFeatures: [
          {
            category: 'Lighting',
            categoryMm: 'အလင်းအမှောင် (Lighting)',
            options: ['Dual-Tone Cyan & Magenta Neon Rim', 'Moody Dark Volumetric Lighting', 'Reflective Wet Pavement Glow', 'Flickering Holographic Signs']
          },
          {
            category: 'Atmosphere',
            categoryMm: 'လေထု (Atmosphere)',
            options: ['Rain with Wet Reflections', 'Thick Smog & Steam Vents', 'Clear Cyber Starlight', 'Acid Rain Mist']
          }
        ]
      },
      {
        name: 'Fantasy Bioluminescent Enchanted Forest',
        tag: 'Box 3: Fantasy Nature',
        tagMm: 'မှော်ဝင် တောအုပ် သဘာဝ',
        description: 'Luminous ancient canopies, glowing flora, ethereal mist & floating spores',
        descriptionMm: 'မှော်ဆန်သော သစ်ပင်ကြီးများနှင့် တောအုပ် သဘာဝ',
        matrixUpdates: { location: 'inle_floating_gardens', timeAndLighting: 'natural_sunlight' },
        subFeatures: [
          {
            category: 'Lighting',
            categoryMm: 'အလင်းအမှောင် (Lighting)',
            options: ['Ethereal Bioluminescent Glow', 'Sunbeams Filtering Through Canopy', 'Moonlit Foggy Rim', 'Firefly Ambient Soft Light']
          },
          {
            category: 'Weather Conditions',
            categoryMm: 'ရာသီဥတု (Weather)',
            options: ['Floating Bioluminescent Spores', 'Light Gentle Rain & Dew', 'Mystical Rolling Fog', 'Falling Cherry Blossoms']
          }
        ]
      },
      {
        name: 'Modern Minimalist Cyclorama Studio',
        tag: 'Box 3: Studio Clean',
        tagMm: 'ခေတ်မီ စတူဒီယို သန့်သန့်',
        description: 'Pristine architectural cyclorama backdrop with sculpted studio softbox & fill lights',
        descriptionMm: 'စတူဒီယို အလင်းအမှောင် သန့်ပြန့်သော နောက်ခံ',
        matrixUpdates: { location: 'modern_minimalist_studio', timeAndLighting: 'studio_rembrandt' },
        subFeatures: [
          {
            category: 'Lighting',
            categoryMm: 'အလင်းအမှောင် (Lighting)',
            options: ['Diffused High-Key Softbox', 'Dramatic Split Lighting', 'Cinematic Rembrandt Lighting', 'Warm Tungsten Rim Light']
          },
          {
            category: 'Atmosphere',
            categoryMm: 'ပတ်ဝန်းကျင်',
            options: ['Clean Seamless Backdrop', 'Controlled Studio Atmosphere', 'Subtle Smoke Haze', 'Polished Concrete Texture']
          }
        ]
      },
      {
        name: 'Thingyan Water Festival Celebration',
        tag: 'Box 3: Festival',
        tagMm: 'သင်္ကြန် ရေသဘင် ပွဲတော်',
        description: 'Festive Thingyan water festival with glistening water splashes, Padauk flowers & joyous atmosphere',
        descriptionMm: 'ရေပက်ဖျန်းသံများနှင့် ရွှင်လန်းတက်ကြွသော သင်္ကြန် ရေသဘင် ပွဲတော်',
        matrixUpdates: { event: 'thingyan', timeAndLighting: 'natural_sunlight' },
        subFeatures: [
          {
            category: 'Festival Dynamics',
            categoryMm: 'ပွဲတော် အခိုက်အတန့်',
            options: ['Water splashes frozen mid-air with glistening bokeh', 'Vibrant yellow Padauk blossoms in hair and backdrop', 'Festive traditional bamboo water stage (မဏ္ဍပ်)']
          }
        ]
      }
    ]
  },

  {
    cmd: '/lighting',
    canonical: '/Lighting',
    aliases: ['/lighting', '/light', '/illumination'],
    box: 'box3',
    boxLabel: 'Box 3: Lighting',
    label: '/Lighting (Studio & Natural Light)',
    labelMm: '/Lighting (စတူဒီယို အလင်းအမှောင်)',
    icon: Sun,
    purpose: 'Box 3: Studio Rembrandt, Neon practical, Volumetric rim light, Golden hour & Softbox',
    purposeMm: 'Box 3: ရမ်ဘရန့် စတူဒီယိုမီး၊ နီယွန်မီးရောင်၊ ရွှေရောင်ဆည်းဆာနှင့် သဘာဝအလင်း',
    nextSuggestions: [
      { cmd: '/camera', label: '/Camera', hint: 'Optics & sensor' },
      { cmd: '/film', label: '/Film', hint: 'Color stocks & LUTs' }
    ],
    presets: [
      {
        name: 'Golden Hour Sunset Warm Rim Light',
        tag: 'Lighting: Golden Hour',
        tagMm: 'ရွှေရောင်ဆည်းဆာ အလင်း',
        description: 'Low-angle golden sunlight creating warm halo rim along hair and shoulders',
        descriptionMm: 'ဆည်းဆာချိန် ရွှေရောင်နေရောင်ခြည် အနားသတ် အလင်း',
        matrixUpdates: { timeAndLighting: 'golden_hour' },
        subFeatures: [
          {
            category: 'Light Qualities',
            categoryMm: 'အလင်း ဂုဏ်သတ္တိ',
            options: ['Low-angle 3200K warm golden sunlight', 'Crisp luminous hair rim lighting', 'Soft diffused warm bounce fill', 'Volumetric atmospheric sunbeams']
          }
        ]
      },
      {
        name: 'Dual-Tone Cyberpunk Neon Rim Light',
        tag: 'Lighting: Cyber Neon',
        tagMm: 'နီယွန် နှစ်ရောင်စပ် အလင်း',
        description: 'Electric cyan key light contrasting with hot magenta rim light against dark backdrop',
        descriptionMm: 'အပြာရောင်နှင့် ပန်းရောင်စပ် နီယွန် အလင်းအမှောင် စတိုင်',
        matrixUpdates: { timeAndLighting: 'neon_practical' },
        subFeatures: [
          {
            category: 'Color Channels',
            categoryMm: 'အရောင် လိုင်းများ',
            options: ['Dual-Tone Cyan & Magenta Neon Rim', 'Moody Dark Volumetric Lighting', 'Reflective Wet Pavement Glow', 'Flickering Holographic Signs']
          }
        ]
      },
      {
        name: 'Cinematic Rembrandt Studio Lighting',
        tag: 'Lighting: Rembrandt',
        tagMm: 'ရမ်ဘရန့် စတူဒီယိုမီး',
        description: 'Classic triangular highlight on the shadow-side cheek with soft falloff',
        descriptionMm: 'ဂန္ထဝင် စတူဒီယို ရမ်ဘရန့် အလင်းအမှောင် စတိုင်',
        matrixUpdates: { timeAndLighting: 'studio_rembrandt' },
        subFeatures: [
          {
            category: 'Light Setup',
            categoryMm: 'မီးထိုးနည်း',
            options: ['Classic 45-degree key light softbox', 'Characteristic triangle highlight on opposite cheek', 'Subtle dark velvet negative fill for depth']
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // BOX 4: OPTICS, CAMERA & STUDIO MATRIX
  // ---------------------------------------------------------------------------
  {
    cmd: '/box4',
    canonical: '/Box4',
    aliases: ['/box4', '/camera', '/optics', '/studio'],
    box: 'box4',
    boxLabel: 'Box 4: Camera & Optics',
    label: '/Box4 (Optics, Camera & Studio Matrix)',
    labelMm: '/Box4 (ကင်မရာ၊ ဖလင်နှင့် စတူဒီယို မက်ထရစ်)',
    icon: Camera,
    purpose: 'Box 4: Sony A7R V, Hasselblad, Kodak Portra 400, 8K UHD, 9:16 aspect ratio & sliders',
    purposeMm: 'Box 4: ပရော်ဖက်ရှင်နယ် မှန်ဘီလူးများ၊ ဖလင်အရောင်၊ အသားအရေ၊ ဓာတ်ပုံအချိုးနှင့် အင်ဂျင်',
    nextSuggestions: [
      { cmd: '/box5', label: '/Box5', hint: 'Studio Templates' },
      { cmd: '/box1', label: '/Box1', hint: 'Subject & Identity' },
      { cmd: '/box3', label: '/Box3', hint: 'Scene & Lighting' }
    ],
    presets: [
      {
        name: 'Sony A7R V with 85mm f/1.2 Lens',
        tag: 'Box 4: Camera',
        tagMm: 'Sony 85mm f/1.2 ပုံတူ',
        description: 'Ultra-high resolution 61MP sensor with shallow depth of field & creamy spherical bokeh',
        descriptionMm: 'အလွန်ကြည်လင်ပြတ်သားသော ၆၁MP ဆင်ဆာနှင့် နောက်ခံဝါး ပုံတူ မှန်ဘီလူး',
        matrixUpdates: { camera: 'sony_a7r5', photoStyle: 'cinematic_movie' },
        subFeatures: [
          {
            category: 'Optical Characteristics',
            categoryMm: 'မှန်ဘီလူး အင်္ဂါရပ်',
            options: ['Shot on 85mm f/1.2 portrait prime lens', 'Creamy circular background bokeh discs', 'Tack-sharp eye focus with fine eyelash fidelity', 'Natural optical perspective compression']
          }
        ]
      },
      {
        name: 'Hasselblad H6D-100c Medium Format',
        tag: 'Box 4: Medium Format',
        tagMm: 'Hasselblad 100MP ကင်မရာ',
        description: '100-megapixel medium format sensor with unmatched dynamic range & true color depth',
        descriptionMm: 'ကမ္ဘာ့အဆင့်မီ ၁၀၀MP မီဒီယမ်ဖောမက် စတူဒီယို ကင်မရာ',
        matrixUpdates: { camera: 'hasselblad_h6d' },
        subFeatures: [
          {
            category: 'Sensor Fidelity',
            categoryMm: 'ဆင်ဆာ အရည်အသွေး',
            options: ['100MP Medium Format sensor with 16-bit color depth', 'Ultra-wide 15-stop dynamic range', 'Micro-contrast rendering of skin pores and textile weaves']
          }
        ]
      },
      {
        name: 'Leica M11 Rangefinder Natural 50mm',
        tag: 'Box 4: Leica M',
        tagMm: 'Leica M11 ဂန္ထဝင်',
        description: 'Legendary Leica color rendition, organic micro-contrast and street photography soul',
        descriptionMm: 'ဂန္ထဝင် လိုင်ကာ အရောင်နှင့် သဘာဝကျသော အနုပညာ စတိုင်',
        matrixUpdates: { camera: 'leica_m11' },
        subFeatures: [
          {
            category: 'Optics Feel',
            categoryMm: 'အနုပညာ အထိအတွေ့',
            options: ['Shot on Leica Summilux-M 50mm f/1.4 ASPH', 'Signature Leica 3D pop and micro-contrast', 'Natural documentary color fidelity']
          }
        ]
      }
    ]
  },

  {
    cmd: '/film',
    canonical: '/Film',
    aliases: ['/film', '/color', '/lut'],
    box: 'box4',
    boxLabel: 'Box 4: Film Stocks',
    label: '/Film (Film Stocks & Color LUTs)',
    labelMm: '/Film (ဖလင် အရောင်တိုနင်)',
    icon: Film,
    purpose: 'Box 4: Kodak Portra 400, Fujifilm Pro 400H, Cyber Neon, CineModern Teal & Orange',
    purposeMm: 'Box 4: ပရော်ဖက်ရှင်နယ် ဖလင်အရောင်နှင့် ရုပ်ရှင်ဆန်သော Color LUTs ၁၉ မျိုး',
    nextSuggestions: [
      { cmd: '/aspect', label: '/Aspect', hint: 'Aspect ratio' },
      { cmd: '/camera', label: '/Camera', hint: 'Camera body' }
    ],
    presets: [
      {
        name: 'Kodak Portra 400 Warm Fine Grain',
        tag: 'Film: Kodak Portra',
        tagMm: 'Kodak Portra ဖလင်',
        description: 'World-renowned portrait film stock with warm golden skin tones & smooth grain',
        descriptionMm: 'အသားအရေ နွေးထွေးလှပစေသော နာမည်ကျော် ပုံတူဖလင် အရောင်',
        matrixUpdates: { colorGrade: 'kodak_portra_400' },
        subFeatures: [
          {
            category: 'Film Characteristics',
            categoryMm: 'ဖလင် သွင်ပြင်',
            options: ['Warm golden yellow-red highlight tones', 'Soft pastel greens and gentle sky cyan', 'Subtle organic 35mm analog film grain', 'Smooth skin highlight rolloff']
          }
        ]
      },
      {
        name: 'CineModern Teal & Orange Blockbuster LUT',
        tag: 'Film: Teal & Orange',
        tagMm: 'ရုပ်ရှင်ကားကြီး အရောင်',
        description: 'Hollywood cinematic color grading with warm amber skin and deep teal shadows',
        descriptionMm: 'ဟောလိဝုဒ် ရုပ်ရှင်ကားကြီးများ၏ အရောင် ဆက်တင် စတိုင်',
        matrixUpdates: { colorGrade: 'cinematic_teal_orange' },
        subFeatures: [
          {
            category: 'Color Science',
            categoryMm: 'အရောင် ညှိနှိုင်းမှု',
            options: ['Complementary warm orange skin against deep teal shadows', 'High contrast cinematic black levels', 'Rich color separation for subject pop']
          }
        ]
      },
      {
        name: 'Cyber Neon Teal & Magenta LUT',
        tag: 'Film: Cyber Neon',
        tagMm: 'ဆိုက်ဘာ နီယွန် အရောင်',
        description: 'Futuristic color LUT accentuating electric cyan, hot magenta and deep obsidian blacks',
        descriptionMm: 'ခေတ်လွန် နီယွန် အရောင်များ ပေါ်လွင်စေသော LUT',
        matrixUpdates: { colorGrade: 'cyber_neon' },
        subFeatures: [
          {
            category: 'Color Science',
            categoryMm: 'အရောင် လိုင်းများ',
            options: ['Vibrant dual-tone cyan and magenta mapping', 'Deep crushed obsidian shadow levels', 'Glowing specular highlight blooming']
          }
        ]
      }
    ]
  },

  {
    cmd: '/aspect',
    canonical: '/Aspect',
    aliases: ['/aspect', '/ratio', '/ar', '/resolution'],
    box: 'box4',
    boxLabel: 'Box 4: Aspect Ratio',
    label: '/Aspect (Aspect Ratio & Resolution)',
    labelMm: '/Aspect (ဓာတ်ပုံ အချိုးအစား)',
    icon: Maximize2,
    purpose: 'Box 4: 9:16 (TikTok/Reels), 4:5 (Instagram), 16:9 (Widescreen), 1:1 (Square), 3:4',
    purposeMm: 'Box 4: ဆိုရှယ်မီဒီယာနှင့် ရုပ်ရှင်အတွက် ဓာတ်ပုံ အချိုးအစား သတ်မှတ်ရန်',
    nextSuggestions: [
      { cmd: '/quality', label: '/Quality', hint: 'Quality profile' },
      { cmd: '/camera', label: '/Camera', hint: 'Camera body' }
    ],
    presets: [
      {
        name: '16:9 Cinematic Widescreen (--ar 16:9)',
        tag: 'Aspect: 16:9',
        tagMm: '၁၆:၉ ရုပ်ရှင်မျက်နှာပြင်',
        description: 'Standard cinematic widescreen landscape ratio (1920×1080) for horizontal impact',
        descriptionMm: 'ရုပ်ရှင်ဆန်သော အလျားလိုက် မျက်နှာပြင်ကျယ် အချိုးအစား',
        matrixUpdates: { aspectRatio: '16:9' },
        subFeatures: [
          {
            category: 'Flag & Pixels',
            categoryMm: 'အချိုးနှင့် ပစ်ဇယ်',
            options: ['--ar 16:9 (1920×1080)', 'Cinematic landscape presentation', 'Ideal for master environmental showcases and wallpapers']
          }
        ]
      },
      {
        name: '9:16 Vertical Story / Reels (--ar 9:16)',
        tag: 'Aspect: 9:16',
        tagMm: '၉:၁၆ ဒေါင်လိုက်',
        description: 'Full-screen vertical mobile portrait (1080×1920) for TikTok, Reels & Stories',
        descriptionMm: 'ဖုန်းမျက်နှာပြင်အပြည့် ဒေါင်လိုက် အချိုးအစား',
        matrixUpdates: { aspectRatio: '9:16' },
        subFeatures: [
          {
            category: 'Flag & Pixels',
            categoryMm: 'အချိုးနှင့် ပစ်ဇယ်',
            options: ['--ar 9:16 (1080×1920)', 'Full-screen mobile story format', 'Perfect for full-length fashion and traditional longyi presentation']
          }
        ]
      },
      {
        name: '4:5 Instagram Portrait (--ar 4:5)',
        tag: 'Aspect: 4:5',
        tagMm: '၄:၅ အင်စတာဂရမ်',
        description: 'Classic vertical feed ratio (1080×1350) for maximum Instagram feed presence',
        descriptionMm: 'အင်စတာဂရမ် ဖိဒ်အတွက် အကောင်းဆုံး ဒေါင်လိုက် အချိုးအစား',
        matrixUpdates: { aspectRatio: '4:5' },
        subFeatures: [
          {
            category: 'Flag & Pixels',
            categoryMm: 'အချိုးနှင့် ပစ်ဇယ်',
            options: ['--ar 4:5 (1080×1350)', 'Maximum vertical feed real estate', 'Classic high-end portrait framing']
          }
        ]
      },
      {
        name: '1:1 Square Feed (--ar 1:1)',
        tag: 'Aspect: 1:1',
        tagMm: '၁:၁ လေးထောင့်ညီ',
        description: 'Balanced square ratio (1080×1080) for profile pictures and clean product showcases',
        descriptionMm: 'ပရိုဖိုင်နှင့် ကုန်ပစ္စည်းအတွက် လေးထောင့်ညီ အချိုးအစား',
        matrixUpdates: { aspectRatio: '1:1' },
        subFeatures: [
          {
            category: 'Flag & Pixels',
            categoryMm: 'အချိုးနှင့် ပစ်ဇယ်',
            options: ['--ar 1:1 (1080×1080)', 'Balanced symmetrical square presentation']
          }
        ]
      }
    ]
  },

  {
    cmd: '/retouch',
    canonical: '/Retouch',
    aliases: ['/retouch', '/makeup', '/skin'],
    box: 'box4',
    boxLabel: 'Box 4: Retouch & Makeup',
    label: '/Retouch (Skin Texture & Makeup)',
    labelMm: '/Retouch (အသားအရေ နှင့် မိတ်ကပ်)',
    icon: Sparkles,
    purpose: 'Box 4: Ultra-Realism skin pores, Traditional Thanaka, Glamour editorial makeup',
    purposeMm: 'Box 4: ချွေးပေါက်ပါမြင်ရသော သဘာဝအသားအရေနှင့် မြန်မာ့ရိုးရာ သနပ်ခါး',
    nextSuggestions: [
      { cmd: '/camera', label: '/Camera', hint: 'Optics lens' },
      { cmd: '/film', label: '/Film', hint: 'Film stock' }
    ],
    presets: [
      {
        name: 'Ultra-Realism Natural Skin Pores',
        tag: 'Retouch: Ultra-Real',
        tagMm: 'သဘာဝ အသားအရေ',
        description: 'Micro-pores, authentic skin translucency, subsurface scattering without plastic blur',
        descriptionMm: 'ဝါးခြင်းမရှိဘဲ ချွေးပေါက်လေးများပါ ထင်ရှားသော သဘာဝ အသားအရေ',
        matrixUpdates: { retouching: 'ultra_realism' },
        subFeatures: [
          {
            category: 'Skin Details',
            categoryMm: 'အသေးစိတ် အချက်အလက်',
            options: ['Authentic natural micro-pores and fine skin texture', 'Subsurface light scattering with warm undertone', 'Crisp catchlights in iris without artificial smoothing']
          }
        ]
      },
      {
        name: 'Traditional Myanmar Thanaka Paste (သနပ်ခါး)',
        tag: 'Retouch: Thanaka',
        tagMm: 'မြန်မာ့ သနပ်ခါး',
        description: 'Authentic circular or leaf-shaped Thanaka paste on cheeks with natural bark fragrance',
        descriptionMm: 'ပါးပြင်ထက်တွင် လှပစွာ လိမ်းကျံထားသော မြန်မာ့ရိုးရာ သနပ်ခါး',
        matrixUpdates: { retouching: 'thanaka_natural' },
        subFeatures: [
          {
            category: 'Thanaka Patterns',
            categoryMm: 'သနပ်ခါး ပုံစံများ',
            options: ['Subtle circular brushed Thanaka on cheekbones', 'Delicate traditional leaf-stencil Thanaka pattern', 'Natural sun-protecting organic tree-bark texture']
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // BOX 5: TEMPLATES & PRESETS (30 Curated Studio Presets)
  // ---------------------------------------------------------------------------
  {
    cmd: '/box5',
    canonical: '/Box5',
    aliases: ['/box5', '/preset', '/template', '/recipe'],
    box: 'box5',
    boxLabel: 'Box 5: Templates & Presets',
    label: '/Box5 (30 Curated Studio Presets)',
    labelMm: '/Box5 (Templates & Presets ၃၀ မျိုး)',
    icon: Layers,
    purpose: 'Box 5: 30 Curated Studio Templates with full prompt recipes & multi-box configurations',
    purposeMm: 'Box 5: အသင့်သုံး 30 Studio Templates များ (Bagan Queen, Thingyan, Cyberpunk, etc.)',
    nextSuggestions: [
      { cmd: '/box1', label: '/Box1', hint: 'Customize subject' },
      { cmd: '/box2', label: '/Box2', hint: 'Tweak wardrobe' },
      { cmd: '/box3', label: '/Box3', hint: 'Adjust lighting' }
    ],
    presets: [
      {
        name: 'Cinematic Portrait (Bagan Golden Hour Masterpiece)',
        tag: 'Box 5: Full Preset',
        tagMm: 'ပုဂံ ဆည်းဆာ ပုံတူ',
        description: 'Full Multi-Box Recipe: Royal Acheik Silk + Bagan Ancient Pagodas + Golden Hour 85mm Bokeh',
        descriptionMm: 'ဇာတ်ကောင် + ရိုးရာဝတ်စုံ + ရွှေရောင်ဆည်းဆာ + ပုဂံနောက်ခံ စုံတွဲ ဖန်တီးချက်',
        fullRecipe: '[Photorealistic Human, Young Adult 22yo, Burmese Heritage, Gentle Royal Smile, Standing Graceful] + [Traditional Cultural Attire, Woven Heavy Acheik Silk with Gold Thread, Crimson & Gold, Gold Headdress & Earplugs] + [Historical Ancient Temple Setting, Golden Hour Sunset, Gentle Temple Breeze] + [8K UHD Studio Portrait, Golden Hour Warm Rim Light] + [100% Facial Likeness Consistency] --ar 16:9 --v 6.0',
        matrixUpdates: {
          subject: 'woman',
          ethnicity: 'burmese',
          garmentStyle: 'traditional_acheik',
          location: 'bagan_pagodas',
          timeAndLighting: 'golden_hour',
          camera: 'sony_a7r5',
          aspectRatio: '16:9'
        },
        subFeatures: [
          {
            category: 'Configured Boxes',
            categoryMm: 'ပါဝင်သော Box များ',
            options: [
              'Box 1: Photorealistic Human (Burmese Heritage, Gentle Royal Smile)',
              'Box 2: Royal Woven Acheik Silk with Pure Gold Thread Embroidery',
              'Box 3: Historical Ancient Temple Pagodas at Golden Hour',
              'Box 4: Sony A7R V 85mm f/1.2 Lens Bokeh, Golden Hour Sunbeams',
              'Box 5: Midjourney v6.0 Standard 16:9 Layout'
            ]
          }
        ]
      },
      {
        name: 'Thingyan Water Festival Euphoria',
        tag: 'Box 5: Thingyan',
        tagMm: 'သင်္ကြန် ရေသဘင် စုံတွဲ',
        description: 'Full Multi-Box Recipe: Casual Padauk Floral Outfit + Water Splashes Frozen in Air + Golden Sun',
        descriptionMm: 'သင်္ကြန် ရေကစားပွဲတော်၊ ရေစက်ကလေးများနှင့် ပိတောက်ရွှေဝါ ရောင်စုံဖန်တီးချက်',
        fullRecipe: '[Photorealistic Human Woman, 20yo, Radiantly Joyful Laughter, Natural Pores with Water Droplets] + [Festive Yellow Padauk Floral Casual Blouse & Indigo Silk Longyi] + [Thingyan Water Festival Mandat Pavilion, Crystal Clear Water Droplets Frozen Mid-Air] + [Fast Shutter 1/8000s, Natural Sunlight, Warm Monsoonal Air] + [Identity Lock Active] --ar 16:9 --v 6.0',
        matrixUpdates: {
          subject: 'woman',
          event: 'thingyan',
          timeAndLighting: 'natural_sunlight',
          aspectRatio: '16:9'
        },
        subFeatures: [
          {
            category: 'Configured Boxes',
            categoryMm: 'ပါဝင်သော အချက်အလက်များ',
            options: [
              'Box 1: Joyful Laughing Pose with Glistening Skin Catchlights',
              'Box 2: Festive Yellow Padauk Blossom Blouse & Water Goggles',
              'Box 3: Thingyan Festival Street with Splashing Water Droplets',
              'Box 4: High-Speed Sports Shutter Freezing Water in Air'
            ]
          }
        ]
      },
      {
        name: 'Cyberpunk Neo-Yangon Street Canyons',
        tag: 'Box 5: Cyberpunk',
        tagMm: 'ဆိုက်ဘာ ရန်ကုန် စတိုင်',
        description: 'Full Multi-Box Recipe: Cybernetic Persona + Nanotech Mech Suit + Rain-Slicked Neon Alley',
        descriptionMm: 'ခေတ်လွန် နီယွန်မီးများနှင့် ဆိုက်ဘာပန့်ခ် ဇာတ်ကောင် စတိုင်အပြည့်',
        fullRecipe: '[Cyberpunk / Futuristic Persona, Young Adult, Cybernetic Asian Archetype, Intense Rebellious Smirk, Holding Cyber Katana Ready Stance] + [Sci-Fi Suit / Mech Gear, Matte Black Carbon Fiber, Stealth Black with Cyan Trim, Holographic Visor Gauntlet] + [Cyberpunk Neon City, Neon Midnight, Rain with Wet Pavement Reflections] + [Cinematic Movie Still, Dual-Tone Cyan & Magenta Neon Rim Light] + [Character Sheet Consistency Reference] --ar 16:9 --v 6.0',
        matrixUpdates: {
          location: 'cyber_yangon',
          timeAndLighting: 'neon_practical',
          colorGrade: 'cyber_neon',
          aspectRatio: '16:9'
        },
        subFeatures: [
          {
            category: 'Configured Boxes',
            categoryMm: 'ပါဝင်သော အချက်အလက်များ',
            options: [
              'Box 1: Cybernetic Eye Implant & Rebellious Smirk',
              'Box 2: Nanotech Carbon Fiber Exo-Armor with Cyan Trim',
              'Box 3: Cyberpunk Megacity with Rain & Wet Pavement Reflections',
              'Box 4: Dual-Tone Neon Rim Light with Volumetric Haze'
            ]
          }
        ]
      },
      {
        name: 'Anime Concept Art Keyframe',
        tag: 'Box 5: Anime',
        tagMm: 'အန်နီမေး မှော်ဝင် မြင်ကွင်း',
        description: 'Full Multi-Box Recipe: Anime Protagonist + High Fantasy Robes + Bioluminescent Forest',
        descriptionMm: 'အန်နီမေး ဇာတ်ကောင် + မှော်ဝတ်ရုံ + မှော်ဝင် တောအုပ် သဘာဝ',
        fullRecipe: '[Anime / Manga Style, Youthful Protagonist, Ethereal Elf Archetype, Determined Heroic Gaze, Spellcasting Dynamic Pose] + [High Fantasy Armor / Robes, Enchanted Velvet & Celestial Silk, Starlight Silver & Azure, Glowing Rune Staff] + [Fantasy Forest / Nature, Enchanted Twilight, Floating Bioluminescent Spores] + [Makoto Shinkai High-End Anime Keyframe, Ethereal Bioluminescent Glow] + [Kyoto Animation Style Reference] --ar 16:9 --v 6.0',
        matrixUpdates: {
          photoStyle: 'anime_cel_shade',
          aspectRatio: '16:9'
        },
        subFeatures: [
          {
            category: 'Configured Boxes',
            categoryMm: 'ပါဝင်သော အချက်အလက်များ',
            options: [
              'Box 1: Anime Keyframe Hero with Flowing Hair & Spellcasting Stance',
              'Box 2: Celestial Silk Robes with Glowing Rune Inscriptions',
              'Box 3: Bioluminescent Enchanted Forest with Floating Spores',
              'Box 4: Makoto Shinkai Shimmering Lighting & Clean Lineart'
            ]
          }
        ]
      },
      {
        name: 'Vogue Haute Couture Model Studio',
        tag: 'Box 5: Editorial',
        tagMm: 'ခေတ်ပေါ် မော်ဒယ် စတူဒီယို',
        description: 'Full Multi-Box Recipe: International Model + Oversized Streetwear + Modern Minimalist Studio',
        descriptionMm: 'ခေတ်မီ မော်ဒယ် + လမ်းလျှောက် ဝတ်စုံ + စတူဒီယို သန့်သန့်',
        fullRecipe: '[Photorealistic Human, Young Adult 24yo, Modern International Likeness, High-Fashion Editorial Neutral Look, Candid Walking Stance] + [Streetwear / Modern Casual, Heavy 500GSM Loopback Cotton Hoodie, Monochromatic Slate & Off-White, Designer Sneakers & Chain] + [Modern Minimalist Studio, Clean Seamless Backdrop, Daylight Studio] + [Natural Hasselblad 85mm Realism, Diffused High-Key Softbox Lighting] + [Editorial Paris Fashion Week Pose Reference] --ar 16:9 --v 6.0',
        matrixUpdates: {
          subject: 'fashion',
          location: 'modern_minimalist_studio',
          timeAndLighting: 'studio_rembrandt',
          aspectRatio: '16:9'
        },
        subFeatures: [
          {
            category: 'Configured Boxes',
            categoryMm: 'ပါဝင်သော အချက်အလက်များ',
            options: [
              'Box 1: High-Fashion Photorealistic Model with Neutral Gaze',
              'Box 2: Oversized Heavyweight Boxy Hoodie & Tailored Trousers',
              'Box 3: Modern Minimalist Cyclorama Studio Backdrop',
              'Box 4: Hasselblad Softbox Studio Lighting'
            ]
          }
        ]
      }
    ]
  },

  {
    cmd: '/reference',
    canonical: '/Reference',
    aliases: ['/reference', '/ref'],
    box: 'box5',
    boxLabel: 'Box 5: Reference Modifiers',
    label: '/Reference (Consistency & Style Transfer)',
    labelMm: '/Reference (ရည်ညွှန်းချက်နှင့် မူရင်းထိန်းသိမ်းမှု)',
    icon: ImageIcon,
    purpose: 'Box 5: Pose reference, art style transfer, color palette reference, and 100% face likeness',
    purposeMm: 'Box 5: ပိုစ့်၊ စတိုင်၊ အရောင်နှင့် မျက်နှာ ထိန်းသိမ်းမှု ရည်ညွှန်းချက် သတ်မှတ်ရန်',
    nextSuggestions: [
      { cmd: '/box1', label: '/Box1', hint: 'Apply to subject' },
      { cmd: '/box2', label: '/Box2', hint: 'Wardrobe matching' }
    ],
    presets: [
      {
        name: 'Face / Character Sheet Consistency Reference',
        tag: 'Ref: Face 100%',
        tagMm: 'မျက်နှာ ၁၀၀% မပြောင်းလဲစေရန်',
        description: '100% exact facial match, identical eyes, nose, lips lock from uploaded portrait',
        descriptionMm: 'မူလဓာတ်ပုံမှ မျက်နှာသွင်ပြင်ကို တစ်ထေရာတည်း ထိန်းသိမ်းခြင်း',
        matrixUpdates: { identityLock: 'face_preserve_strict' },
        subFeatures: [
          {
            category: 'Directives',
            categoryMm: 'လမ်းညွှန်ချက် (Guidance)',
            options: ['100% facial likeness lock, identical eyes, nose, lips and cheekbones', 'Maintain exact skin undertone and natural moles without modification', 'Preserve facial identity across multi-angle camera views']
          }
        ]
      },
      {
        name: 'Pose Reference (URL/Description)',
        tag: 'Ref: Pose',
        tagMm: 'ပိုစ့် ရည်ညွှန်းချက်',
        description: 'Replicate body posture and precise hand placement from reference photo',
        descriptionMm: 'ဓာတ်ပုံ သို့မဟုတ် လင့်ခ်မှ ကိုယ်ဟန်အနေအထားကို ကူးယူခြင်း',
        subFeatures: [
          {
            category: 'Directives',
            categoryMm: 'လမ်းညွှန်ချက် (Guidance)',
            options: ['Replicate body posture and precise hand placement from reference photo', 'Exact head tilt, eye-contact angle and shoulder roll from reference']
          }
        ]
      },
      {
        name: 'Style Reference (Art style transfer)',
        tag: 'Ref: Style',
        tagMm: 'စတိုင် ကူးယူခြင်း',
        description: 'Transfer painterly brushstrokes, color LUT, lighting mood and rendering medium',
        descriptionMm: 'အနုပညာ လက်ရာ၊ အရောင်နှင့် အလင်းအမှောင် စတိုင်ကို လွှဲပြောင်းခြင်း',
        subFeatures: [
          {
            category: 'Directives',
            categoryMm: 'လမ်းညွှန်ချက် (Guidance)',
            options: ['Transfer lighting mood, color temperature and shadow contrast from reference', 'Replicate painterly impasto brushstrokes and fine canvas texture', 'Match 35mm cinematic film grain and organic color palette']
          }
        ]
      }
    ]
  }
];

export const SlashCommandTypingBar: React.FC<SlashCommandTypingBarProps> = ({
  language,
  onApplyAndGenerate,
  isGeneratingPrompt = false,
  onUpdateSelection,
  initialValue = '',
  placeholder,
  className = '',
  variant = 'hero'
}) => {
  const isMyanmar = language === 'my';
  const [inputText, setInputText] = useState<string>(initialValue);
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedApi, setCopiedApi] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [showOpenRouterModal, setShowOpenRouterModal] = useState<boolean>(false);

  // Active command & filtering states
  const [selectedBoxFilter, setSelectedBoxFilter] = useState<'all' | BoxOrigin>('all');
  const [selectedCmd, setSelectedCmd] = useState<CommandDef | null>(null);
  const [selectedPresetName, setSelectedPresetName] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync initial value changes
  useEffect(() => {
    if (initialValue && initialValue !== inputText && !inputText) {
      setInputText(initialValue);
    }
  }, [initialValue]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Parse what the user is currently typing to detect slash commands and search queries across Box 1 to 5
  const parsedTypingState = useMemo(() => {
    const text = inputText;
    const lastSlashIdx = text.lastIndexOf('/');

    if (lastSlashIdx === -1) {
      return {
        hasSlash: false,
        activeCommand: null as CommandDef | null,
        matchingCommands: [] as CommandDef[],
        queryAfterCmd: '',
        isJustSlash: false
      };
    }

    const afterSlash = text.slice(lastSlashIdx); // e.g. "/box3 neon" or "/camera sony" or "/background" or "/"
    const tokens = afterSlash.trim().split(/\s+/);
    const cmdToken = tokens[0].toLowerCase(); // e.g. "/box1", "/lighting", "/"
    const query = tokens.slice(1).join(' ').trim().toLowerCase(); // e.g. "neon"

    // Exact command match (checking cmd, canonical, or aliases)
    const exactCmd = ALL_BOX_COMMANDS.find(
      (c) =>
        c.cmd.toLowerCase() === cmdToken ||
        c.canonical.toLowerCase() === cmdToken ||
        c.aliases.some((a) => a.toLowerCase() === cmdToken)
    );

    if (exactCmd) {
      return {
        hasSlash: true,
        activeCommand: exactCmd,
        matchingCommands: [exactCmd],
        queryAfterCmd: query,
        isJustSlash: false
      };
    }

    if (cmdToken === '/') {
      return {
        hasSlash: true,
        activeCommand: null,
        matchingCommands: ALL_BOX_COMMANDS,
        queryAfterCmd: '',
        isJustSlash: true
      };
    }

    // Partial command match or keyword match (e.g. user typed /box, /cam, /ligh, /bagan, /sony)
    const partials = ALL_BOX_COMMANDS.filter((c) => {
      const matchCmd = c.cmd.toLowerCase().startsWith(cmdToken) || c.canonical.toLowerCase().startsWith(cmdToken);
      const matchAlias = c.aliases.some((a) => a.toLowerCase().startsWith(cmdToken));
      const matchBox = c.box.toLowerCase().startsWith(cmdToken.replace('/', ''));
      const matchKeywords =
        c.label.toLowerCase().includes(cmdToken.replace('/', '')) ||
        c.purpose.toLowerCase().includes(cmdToken.replace('/', ''));
      return matchCmd || matchAlias || matchBox || matchKeywords;
    });

    return {
      hasSlash: true,
      activeCommand: partials.length === 1 ? partials[0] : null,
      matchingCommands: partials,
      queryAfterCmd: query,
      isJustSlash: false
    };
  }, [inputText]);

  // Keep selectedCmd in sync with parsed typing
  useEffect(() => {
    if (parsedTypingState.activeCommand) {
      setSelectedCmd(parsedTypingState.activeCommand);
      setSelectedBoxFilter(parsedTypingState.activeCommand.box);
      setFilterQuery(parsedTypingState.queryAfterCmd);
    } else if (parsedTypingState.isJustSlash) {
      setSelectedCmd(null);
      setFilterQuery('');
    }
  }, [parsedTypingState]);

  // Filter commands by the active Box tab (All, Box 1, Box 2, Box 3, Box 4, Box 5)
  const displayedCommands = useMemo(() => {
    const list = parsedTypingState.matchingCommands.length > 0 ? parsedTypingState.matchingCommands : ALL_BOX_COMMANDS;
    if (selectedBoxFilter === 'all') return list;
    return list.filter((c) => c.box === selectedBoxFilter);
  }, [parsedTypingState.matchingCommands, selectedBoxFilter]);

  // Determine which presets match the active command and query
  const filteredPresets = useMemo(() => {
    if (!selectedCmd) return [];
    const query = filterQuery.trim().toLowerCase();
    if (!query) return selectedCmd.presets;

    return selectedCmd.presets.filter((p) => {
      const matchName = p.name.toLowerCase().includes(query);
      const matchDesc = p.description.toLowerCase().includes(query);
      const matchTag = p.tag.toLowerCase().includes(query);
      const matchSub = p.subFeatures.some((sf) =>
        sf.options.some((opt) => opt.toLowerCase().includes(query))
      );
      return matchName || matchDesc || matchTag || matchSub;
    });
  }, [selectedCmd, filterQuery]);

  // Active preset definition
  const activePresetDef = useMemo(() => {
    if (!selectedCmd) return null;
    if (selectedPresetName) {
      const found = selectedCmd.presets.find((p) => p.name === selectedPresetName);
      if (found) return found;
    }
    for (const p of selectedCmd.presets) {
      if (inputText.toLowerCase().includes(`[${p.name.toLowerCase()}]`)) {
        return p;
      }
    }
    return filteredPresets[0] || selectedCmd.presets[0] || null;
  }, [selectedCmd, selectedPresetName, inputText, filteredPresets]);

  // Assemble Master Prompt strictly following the requested layout:
  // [Subject / Character Details] + [Outfit / Clothes] + [Environment / Background] + [Art Style & Lighting] + [Reference Modifiers] --ar 16:9 --v 6.0
  const compiledMasterPrompt = useMemo(() => {
    const trimmed = inputText.trim();
    if (!trimmed) {
      return '[Photorealistic Human, Young Adult 22yo, Burmese Heritage, Gentle Royal Smile] + [Traditional Cultural Attire, Woven Pure Acheik Silk, Royal Crimson & Gold] + [Historical Ancient Temple Pagodas, Golden Hour Sunset] + [8K Studio Portrait Photography, Volumetric Warm Rim Light] + [100% Facial Likeness Consistency Lock] --ar 16:9 --v 6.0';
    }

    let subject = 'Photorealistic Human, expressive royal features';
    let outfit = 'Traditional Cultural Attire with gold filigree';
    let env = 'Historical / Vintage Bagan Setting at Golden Hour';
    let style = '8K UHD Studio Portrait Photography, volumetric rim light';
    let reference = '100% facial likeness preservation';

    const lower = trimmed.toLowerCase();

    // Check for full recipes
    for (const cmd of ALL_BOX_COMMANDS) {
      for (const p of cmd.presets) {
        if (p.fullRecipe && lower.includes(p.name.toLowerCase())) {
          return p.fullRecipe;
        }
      }
    }

    // Parse commands from user input
    const charMatch = trimmed.match(/(\/(?:box1|character|subject))\s*(\[[^\]]+\]|[^\/]+)/i);
    if (charMatch && charMatch[2]) {
      subject = charMatch[2].replace(/[\[\]]/g, '').trim();
    }

    const clothesMatch = trimmed.match(/(\/(?:box2|clothes|wardrobe|garment))\s*(\[[^\]]+\]|[^\/]+)/i);
    if (clothesMatch && clothesMatch[2]) {
      outfit = clothesMatch[2].replace(/[\[\]]/g, '').trim();
    }

    const bgMatch = trimmed.match(/(\/(?:box3|scene|background|location|environment))\s*(\[[^\]]+\]|[^\/]+)/i);
    if (bgMatch && bgMatch[2]) {
      env = bgMatch[2].replace(/[\[\]]/g, '').trim();
    }

    const lightMatch = trimmed.match(/(\/(?:lighting|light|box4|camera|film))\s*(\[[^\]]+\]|[^\/]+)/i);
    if (lightMatch && lightMatch[2]) {
      style = lightMatch[2].replace(/[\[\]]/g, '').trim();
    }

    const refMatch = trimmed.match(/(\/(?:box5|reference|ref))\s*(\[[^\]]+\]|[^\/]+)/i);
    if (refMatch && refMatch[2]) {
      reference = refMatch[2].replace(/[\[\]]/g, '').trim();
    }

    // Check for aspect ratio flag in input
    const arMatch = trimmed.match(/--ar\s+([0-9:]+)/i);
    const arFlag = arMatch ? arMatch[0] : '--ar 16:9';

    return `[${subject}] + [${outfit}] + [${env}] + [${style}] + [${reference}] ${arFlag} --v 6.0`;
  }, [inputText]);

  // OpenRouter JSON API Payload formatted
  const openRouterPayload = useMemo(() => {
    return JSON.stringify(
      {
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert AI Prompt Engineer and Assistant designed to run inside an application with a slash command System. Your goal is to help users build detailed, structured, and highly accurate prompts step-by-step using presets and reference inputs across Box 1 to Box 5.'
          },
          {
            role: 'user',
            content: `Generate and optimize final visual image prompt in layout:\n\`\`\`prompt\n${compiledMasterPrompt}\n\`\`\``
          }
        ],
        temperature: 0.7,
        max_tokens: 1024
      },
      null,
      2
    );
  }, [compiledMasterPrompt]);

  // Handle selecting a command pill
  const handleSelectCommand = (cmdDef: CommandDef) => {
    setSelectedCmd(cmdDef);
    setSelectedBoxFilter(cmdDef.box);
    setSelectedPresetName(null);
    setFilterQuery('');

    // Append cleanly or replace trailing slash
    setInputText((prev) => {
      const trimmed = prev.trim();
      if (!trimmed || trimmed === '/') {
        return `${cmdDef.canonical} `;
      }
      if (trimmed.endsWith('/')) {
        return `${trimmed.slice(0, -1)}${cmdDef.canonical} `;
      }
      if (!trimmed.toLowerCase().includes(cmdDef.cmd.toLowerCase())) {
        return `${trimmed} ${cmdDef.canonical} `;
      }
      return prev;
    });

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle selecting a preset box & sync with studio matrix selection
  const handleSelectPreset = (preset: PresetDef) => {
    setSelectedPresetName(preset.name);

    // Apply matrix updates to the application state if provided
    if (preset.matrixUpdates && onUpdateSelection) {
      onUpdateSelection(preset.matrixUpdates);
    }

    if (preset.fullRecipe) {
      setInputText(preset.fullRecipe);
      if (onUpdateSelection) {
        onUpdateSelection({ customInstruction: preset.fullRecipe });
      }
      if (inputRef.current) inputRef.current.focus();
      return;
    }

    setInputText((prev) => {
      const activeCmd = selectedCmd?.canonical || '/Box1';
      const cmdRegex = new RegExp(`${activeCmd}\\s*(\\[[^\\]]*\\]|[^/\\s]*)?`, 'i');
      if (cmdRegex.test(prev)) {
        return prev.replace(cmdRegex, `${activeCmd} [${preset.name}] `);
      }
      const trimmed = prev.trim();
      return trimmed ? `${trimmed} ${activeCmd} [${preset.name}] ` : `${activeCmd} [${preset.name}] `;
    });

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle clicking a sub-feature option chip
  const handleSelectSubFeature = (optionText: string) => {
    setInputText((prev) => {
      const trimmed = prev.trim();
      if (trimmed.includes(optionText)) return prev;
      return `${trimmed} + [${optionText}]`;
    });

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle keyboard events in input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsFocused(false);
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredPresets.length > 0 && isFocused) {
        const target = filteredPresets[highlightedIndex % filteredPresets.length];
        if (target && target.name !== selectedPresetName) {
          handleSelectPreset(target);
          return;
        }
      }
      handleGenerate();
    }

    if (e.key === 'ArrowDown') {
      if (filteredPresets.length > 0) {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % filteredPresets.length);
      }
    }

    if (e.key === 'ArrowUp') {
      if (filteredPresets.length > 0) {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + filteredPresets.length) % filteredPresets.length);
      }
    }
  };

  const handleCopy = () => {
    if (!compiledMasterPrompt) return;
    navigator.clipboard.writeText(compiledMasterPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyApi = () => {
    navigator.clipboard.writeText(openRouterPayload);
    setCopiedApi(true);
    setTimeout(() => setCopiedApi(false), 2000);
  };

  const handleClear = () => {
    setInputText('');
    setSelectedCmd(null);
    setSelectedPresetName(null);
    setFilterQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleGenerate = () => {
    const finalPrompt = compiledMasterPrompt;
    if (onUpdateSelection) {
      onUpdateSelection({ customInstruction: finalPrompt });
    }
    onApplyAndGenerate(finalPrompt);
  };

  const showPopup = isFocused || inputText.includes('/');

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* =========================================================================
          TOP COMMAND QUICK BAR (Pills for Box 1 to Box 5 fast calling)
      ========================================================================= */}
      <div className="flex items-center justify-between gap-2 pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
            <Terminal className="h-3 w-3" />
            <span>Box 1–5 Cmds:</span>
          </span>

          {[
            { cmd: '/box1', label: '/Box1', box: 'box1', icon: User, hint: 'Subject & Identity' },
            { cmd: '/box2', label: '/Box2', box: 'box2', icon: Shirt, hint: 'Wardrobe & Swap' },
            { cmd: '/box3', label: '/Box3', box: 'box3', icon: MapPin, hint: 'Scene & Lighting' },
            { cmd: '/box4', label: '/Box4', box: 'box4', icon: Camera, hint: 'Camera & Optics' },
            { cmd: '/box5', label: '/Box5', box: 'box5', icon: Layers, hint: '30 Presets' }
          ].map((item) => {
            const Icon = item.icon;
            const isCurrent =
              selectedCmd?.box === item.box ||
              inputText.toLowerCase().includes(item.cmd);

            return (
              <button
                key={item.cmd}
                type="button"
                onClick={() => {
                  const target = ALL_BOX_COMMANDS.find((c) => c.box === item.box);
                  if (target) handleSelectCommand(target);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer border flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-cyan-500/25 border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400/40'
                    : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-850'
                }`}
                title={item.hint}
              >
                <Icon className="h-3 w-3 text-cyan-300" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowOpenRouterModal(true)}
            className="text-[11px] font-mono text-cyan-300 hover:text-white flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 transition-colors cursor-pointer"
            title="View OpenRouter API format payload"
          >
            <Code className="h-3 w-3 text-cyan-400" />
            <span className="hidden sm:inline">OpenRouter API</span>
          </button>

          {inputText && (
            <button
              type="button"
              onClick={handleClear}
              className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors cursor-pointer shrink-0 font-medium"
            >
              {isMyanmar ? 'ရှင်းမည်' : 'Clear'}
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          MAIN COMMAND INPUT BOX (Typing Bar)
      ========================================================================= */}
      <div className="relative flex items-center rounded-2xl bg-slate-950/95 border border-cyan-500/50 hover:border-cyan-400/90 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/30 shadow-2xl transition-all p-1.5 backdrop-blur-2xl">
        {/* Terminal Indicator */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 mr-2 shadow-inner">
          <Terminal className="h-4 w-4 animate-pulse" />
        </div>

        {/* Real-time Typing Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={
            placeholder ||
            (isMyanmar
              ? 'စာရိုက်ပါ - "/box1", "/box2", "/box3", "/box4", "/box5", "/lighting", "/camera" စသဖြင့် Box 1 မှ Box 5 အားလုံးကို တိုက်ရိုက် ခေါ်ယူနိုင်ပါသည်...'
              : 'Type /box1, /box2, /box3, /box4, /box5, /camera, /lighting, /clothes, /preset...')
          }
          className="flex-1 min-w-0 bg-transparent text-xs sm:text-sm font-mono text-cyan-100 placeholder-slate-400 focus:outline-none selection:bg-cyan-900 selection:text-white pr-2"
        />

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0 pl-1 border-l border-slate-800">
          <button
            type="button"
            onClick={handleCopy}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 hover:border-cyan-500/40 transition-colors cursor-pointer shadow-sm"
            title="Copy Formatted Master Prompt"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-cyan-400" />}
          </button>

          {/* Generate CTA Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGeneratingPrompt}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 via-white to-cyan-300 hover:from-cyan-300 hover:to-white text-black font-black text-xs shadow-md active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
            title="Compile & Generate Master Prompt"
          >
            <Wand2 className="h-3.5 w-3.5 text-black" />
            <span className="hidden xs:inline">{isMyanmar ? 'Generate' : 'Generate'}</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          DYNAMIC AUTOCOMPLETE & PRESET OPTIONS BOX (Box 1 to Box 5 Unified)
      ========================================================================= */}
      {showPopup && (
        <div className="absolute left-0 right-0 top-full mt-2.5 z-50 rounded-2xl bg-slate-950/98 border border-cyan-500/50 shadow-2xl p-3 sm:p-4 space-y-3.5 backdrop-blur-2xl animate-fadeIn max-h-[78vh] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-slate-900">
          
          {/* Header of Options Box */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.9)] animate-pulse" />
              <div className="flex items-baseline gap-2">
                <span className="text-xs sm:text-sm font-bold text-white font-mono">
                  {selectedCmd ? `${selectedCmd.canonical} · ${selectedCmd.boxLabel}` : 'Box 1 to Box 5 Command Engine (/cmd)'}
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  {selectedCmd?.purpose || 'Call anything from Box 1 to Box 5 directly via slash command'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsFocused(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
              title="Close options"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* =====================================================================
              BOX FILTER TABS (All, Box 1, Box 2, Box 3, Box 4, Box 5)
          ===================================================================== */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 border-b border-slate-800/60">
            {[
              { id: 'all', label: isMyanmar ? 'အားလုံး' : 'All (Box 1–5)', count: ALL_BOX_COMMANDS.length },
              { id: 'box1', label: 'Box 1: Subject', count: ALL_BOX_COMMANDS.filter(c => c.box === 'box1').length },
              { id: 'box2', label: 'Box 2: Wardrobe', count: ALL_BOX_COMMANDS.filter(c => c.box === 'box2').length },
              { id: 'box3', label: 'Box 3: Scene', count: ALL_BOX_COMMANDS.filter(c => c.box === 'box3').length },
              { id: 'box4', label: 'Box 4: Camera', count: ALL_BOX_COMMANDS.filter(c => c.box === 'box4').length },
              { id: 'box5', label: 'Box 5: Templates', count: ALL_BOX_COMMANDS.filter(c => c.box === 'box5').length }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setSelectedBoxFilter(tab.id as 'all' | BoxOrigin);
                  if (tab.id !== 'all') {
                    const firstCmdInBox = ALL_BOX_COMMANDS.find(c => c.box === tab.id);
                    if (firstCmdInBox && !selectedCmd) {
                      setSelectedCmd(firstCmdInBox);
                    }
                  }
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all whitespace-nowrap cursor-pointer border ${
                  selectedBoxFilter === tab.id
                    ? 'bg-cyan-500/25 border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400/40'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                <span>{tab.label}</span>
                <span className="ml-1 opacity-70">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* =====================================================================
              VIEW 1: Commands Listing across Box 1 to Box 5
          ===================================================================== */}
          {(!selectedCmd || parsedTypingState.isJustSlash) && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-300 block">
                {isMyanmar
                  ? 'အောက်ပါ Command များထဲမှ တစ်ခုကို ရွေးပါ သို့မဟုတ် ရိုက်ထည့်ပါ:'
                  : 'Select any command from Box 1 to Box 5 to reveal options & presets:'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {displayedCommands.map((c) => {
                  const Icon = c.icon;
                  return (
                    <div
                      key={c.cmd}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSelectCommand(c)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSelectCommand(c);
                        }
                      }}
                      className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/90 hover:border-cyan-400 hover:bg-slate-850 transition-all flex items-center justify-between gap-3 cursor-pointer group text-left shadow-sm"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 shrink-0 mt-0.5">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-mono font-bold text-white group-hover:text-cyan-200">
                              {c.canonical}
                            </span>
                            <span className="text-[9px] text-cyan-400 font-mono px-1 rounded bg-slate-950 border border-slate-800">
                              {c.box.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {isMyanmar ? c.purposeMm : c.purpose}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =====================================================================
              VIEW 2: Presets & Option Boxes for Selected Command (Box 1 to 5)
          ===================================================================== */}
          {selectedCmd && (
            <div className="space-y-4">
              {/* Presets Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 font-mono">
                      <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                      <span>
                        {isMyanmar
                          ? `${selectedCmd.canonical} အတွက် Presets ရွေးချယ်စရာများ (${filteredPresets.length})`
                          : `${selectedCmd.canonical} Presets Box (${filteredPresets.length} available)`}
                      </span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                      {selectedCmd.boxLabel}
                    </span>
                  </div>
                  {filterQuery && (
                    <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                      Filtering: &quot;{filterQuery}&quot;
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {filteredPresets.map((preset, idx) => {
                    const isSelected = activePresetDef?.name === preset.name;
                    const isHighlighted = idx === highlightedIndex;

                    return (
                      <div
                        key={preset.name}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleSelectPreset(preset)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSelectPreset(preset);
                          }
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                          isSelected
                            ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-md ring-1 ring-cyan-400/50'
                            : isHighlighted
                            ? 'bg-slate-900 border-cyan-500/40 text-slate-200'
                            : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-850'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1.5 mb-1">
                            <span className="text-xs font-bold text-white group-hover:text-cyan-200 line-clamp-1">
                              {preset.name}
                            </span>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800 shrink-0">
                              {isMyanmar ? preset.tagMm : preset.tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                            {isMyanmar ? preset.descriptionMm : preset.description}
                          </p>
                        </div>

                        <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                          <span className="text-slate-400">
                            {preset.subFeatures.length} sub-feature {preset.subFeatures.length === 1 ? 'box' : 'boxes'}
                          </span>
                          <span className={`font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-400 group-hover:text-cyan-400'}`}>
                            {isSelected ? '✓ Active Option' : '+ Select Box'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ===================================================================
                  SUB-FEATURE / RECOMMENDATION OPTION BOXES
              =================================================================== */}
              {activePresetDef && activePresetDef.subFeatures.length > 0 && (
                <div className="rounded-2xl bg-slate-900/90 border border-cyan-500/30 p-3.5 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-cyan-400" />
                      <span className="text-xs font-bold text-white font-mono">
                        {isMyanmar
                          ? `[${activePresetDef.name}] အတွက် ရွေးချယ်နိုင်သော Option Boxes များ:`
                          : `Option Boxes for [${activePresetDef.name}] (Click chip to append to prompt):`}
                      </span>
                    </div>
                    <span className="text-[10px] text-cyan-300 font-mono bg-cyan-950/60 px-2 py-0.5 rounded">
                      Box 1–5 Sync Engine
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {activePresetDef.subFeatures.map((sf, sfIdx) => {
                      return (
                        <div
                          key={sfIdx}
                          className="rounded-xl bg-slate-950/80 border border-slate-800/80 p-2.5 flex flex-col justify-between space-y-2 hover:border-cyan-500/40 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-cyan-300 font-mono flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                              <span>{isMyanmar ? sf.categoryMm : sf.category}</span>
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono uppercase">
                              {sf.options.length} options
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {sf.options.map((opt, optIdx) => {
                              const isAppended = inputText.includes(opt);
                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() => handleSelectSubFeature(opt)}
                                  className={`px-2 py-1 rounded-lg text-[10px] font-mono transition-all text-left cursor-pointer border ${
                                    isAppended
                                      ? 'bg-cyan-500/25 border-cyan-400 text-cyan-100 font-bold'
                                      : 'bg-slate-900 border-slate-800 hover:border-cyan-400/60 hover:bg-slate-850 text-slate-300 hover:text-white'
                                  }`}
                                  title={`Append "${opt}" to prompt`}
                                >
                                  {isAppended ? '✓ ' : '+ '}
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ===================================================================
                  AUTOMATIC CROSS-BOX FOLLOW-UP RECOMMENDATION TRIGGERS
              =================================================================== */}
              {selectedCmd.nextSuggestions && selectedCmd.nextSuggestions.length > 0 && (
                <div className="rounded-xl bg-slate-900/60 border border-slate-800/90 p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                    <span className="font-semibold text-[11px]">
                      {isMyanmar ? 'အကြံပြုချက် နောက်တစ်ဆင့် သတ်မှတ်ရန်:' : 'Cross-Box Next Step Recommendations:'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedCmd.nextSuggestions.map((sug) => {
                      const targetCmd = ALL_BOX_COMMANDS.find(
                        (c) =>
                          c.canonical.toLowerCase() === sug.cmd.toLowerCase() ||
                          c.cmd.toLowerCase() === sug.cmd.toLowerCase()
                      );
                      return (
                        <button
                          key={sug.cmd}
                          type="button"
                          onClick={() => {
                            if (targetCmd) handleSelectCommand(targetCmd);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-cyan-950/70 border border-cyan-500/40 hover:border-cyan-400 hover:bg-cyan-900 text-cyan-300 hover:text-white text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <span>{sug.cmd}</span>
                          <span className="text-slate-400 font-normal">({sug.hint})</span>
                          <ArrowRight className="h-2.5 w-2.5 text-cyan-400" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =====================================================================
              MASTER PROMPT OUTPUT CARD (Layout Verification & Copy)
              Layout: [Subject] + [Outfit] + [Environment] + [Art Style] + [Reference] --ar 16:9 --v 6.0
          ===================================================================== */}
          <div className="rounded-xl bg-black/90 border border-slate-800 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Code className="h-3.5 w-3.5 text-cyan-400" />
                <span className="text-[11px] font-mono font-bold text-cyan-300">
                  Compiled Master Prompt (Box 1–5 Assembled):
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Midjourney v6.0 Standard
              </span>
            </div>

            <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800/80 font-mono text-[11px] text-cyan-200 break-words leading-relaxed select-all">
              {compiledMasterPrompt}
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Copy Master Prompt</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowOpenRouterModal(true)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Code className="h-3 w-3 text-cyan-400" />
                  <span>OpenRouter API</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGeneratingPrompt}
                className="px-4 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs font-mono transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <Wand2 className="h-3.5 w-3.5 text-black" />
                <span>Apply & Generate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          OPENROUTER API FORMAT MODAL
      ========================================================================= */}
      {showOpenRouterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl rounded-2xl bg-slate-950 border border-cyan-500/40 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-cyan-400" />
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">
                    OpenRouter API Format (Standard Request)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Ready-to-use OpenAI-compatible payload for OpenRouter completion/image generation
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowOpenRouterModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative rounded-xl bg-black border border-slate-800 p-3.5 overflow-x-auto max-h-[50vh]">
              <pre className="font-mono text-xs text-cyan-300 leading-relaxed">
                {openRouterPayload}
              </pre>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400 font-mono">
                Endpoint: https://openrouter.ai/api/v1/chat/completions
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyApi}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400 text-cyan-200 hover:bg-cyan-500/30 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {copiedApi ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied Payload!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Copy API JSON</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowOpenRouterModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
