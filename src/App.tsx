import React, { useState } from 'react';
import {
  AppMode,
  Language,
  MatrixSelection,
  PromptResult,
  PresetTemplate,
  UserProfile
} from './types';
import { Header } from './components/Header';
import { ExecutiveMasterDetailStudio } from './components/ExecutiveMasterDetailStudio';
import { PromptOutputCard } from './components/PromptOutputCard';
import { UserDashboardModal } from './components/dashboard/UserDashboardModal';
import { AdminDashboardModal } from './components/dashboard/AdminDashboardModal';
import { SlashCommandStudioModal } from './components/SlashCommandStudioModal';
import { StorageService } from './utils/storageService';
import { buildComprehensiveMasterPrompt } from './utils/promptBuilder';
import { RefreshCcw, ChevronLeft } from 'lucide-react';

const DEFAULT_SELECTION: MatrixSelection = {
  subject: 'woman',
  customSubjectDetails: '',
  event: 'thingyan',
  customEventDetails: '',
  location: 'cyber_yangon',
  customLocationDetails: '',
  timeAndLighting: 'neon_midnight',
  customLightingDetails: '',
  camera: 'sony_a7rv',
  cameraAngle: 'eye_level',
  retouching: 'ultra_realism',
  makeup: 'traditional_myanmar',
  colorGrade: 'cyber_neon',
  aspectRatio: '9:16',
  qualityProfile: '8k_uhd',
  garmentStyle: 'silk_longyi',
  garmentFabric: 'Woven Silk with Water Droplets',
  identityLock: 'face_100',
  referenceImage: null,
  referenceImageMale: null,
  referenceImageFemale: null,
  poseExpression: 'looking_at_camera',
  customPoseDetails: '',
  ethnicity: 'burmese',
  customEthnicityDetails: '',
  includeCulturalProps: false,
  culturalPropsDetails: '',
  clothesSwapOption: 'in_app_preset',
  customGarmentImage: null,
  customGarmentDescription: '',
  moodEmotion: 'cinematic_dramatic',
  styleStrength: 0.75,
  promptWeight: 0.8,
  customInstruction: ''
};

export default function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('img2img');
  const [language, setLanguage] = useState<Language>('my');
  const [selection, setSelection] = useState<MatrixSelection>(DEFAULT_SELECTION);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState<boolean>(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [promptResult, setPromptResult] = useState<PromptResult | null>(null);
  const [activePresetId, setActivePresetId] = useState<string | undefined>('thingyan_cyber_queen');

  // Executive Workspace View Modes: 'studio' (master-detail) or 'output' (prompt result & AI renderer)
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'studio' | 'output'>('studio');

  // User & Dashboard States
  const [currentUser, setCurrentUser] = useState<UserProfile>(StorageService.getCurrentUser());
  const [isUserDashboardOpen, setIsUserDashboardOpen] = useState<boolean>(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState<boolean>(false);
  const [isSlashCommandModalOpen, setIsSlashCommandModalOpen] = useState<boolean>(false);

  // Session Prompt Version History States
  const [sessionHistory, setSessionHistory] = useState<PromptResult[]>([]);
  const [activeHistoryIndex, setActiveHistoryIndex] = useState<number>(-1);

  const handleUpdateSelection = (updates: Partial<MatrixSelection>) => {
    setSelection((prev) => ({ ...prev, ...updates }));
  };

  const handleModeChange = (mode: AppMode) => {
    setCurrentMode(mode);
    setSelection((prev) => ({
      ...prev,
      garmentStyle: mode === 'clothes-swap' ? 'evening_gown' : prev.garmentStyle
    }));
  };

  // Local prompt builder fallback in case of network issue or server restart
  const createLocalFallbackPrompt = (sel: MatrixSelection, mode: AppMode): PromptResult => {
    const built = buildComprehensiveMasterPrompt(sel, mode);

    return {
      id: Date.now().toString(),
      ...built,
      aspectRatio: sel.aspectRatio || '9:16',
      mode: mode,
      timestamp: new Date().toLocaleTimeString(),
      optionsSummary: {
        subject: sel.subject,
        event: sel.event,
        location: sel.location,
        lighting: sel.timeAndLighting
      }
    };
  };

  const handleGeneratePrompt = async () => {
    setIsGeneratingPrompt(true);

    try {
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selection,
          mode: currentMode,
          language,
          customInstruction: selection.customInstruction
        })
      });

      if (!response.ok) {
        throw new Error(`Server status ${response.status}`);
      }

      const data = await response.json();

      if (data && data.success && data.promptData) {
        const result: PromptResult = {
          id: Date.now().toString(),
          masterPrompt: data.promptData.masterPrompt || '',
          negativePrompt: data.promptData.negativePrompt || '',
          midjourneyFormat: data.promptData.midjourneyFormat || '',
          fluxFormat: data.promptData.fluxFormat || '',
          sdxlFormat: data.promptData.sdxlFormat || '',
          descriptionMm: data.promptData.descriptionMm || '',
          descriptionEn: data.promptData.descriptionEn || '',
          cameraNotes: data.promptData.cameraNotes || '',
          aspectRatio: data.promptData.aspectRatio || selection.aspectRatio || '9:16',
          mode: currentMode,
          timestamp: new Date().toLocaleTimeString(),
          optionsSummary: {
            subject: selection.subject,
            event: selection.event,
            location: selection.location,
            lighting: selection.timeAndLighting
          }
        };

        setPromptResult(result);
        setSessionHistory((prev) => {
          const vNum = prev.length + 1;
          const stamped = {
            ...result,
            versionNumber: vNum,
            versionLabel: prev.length === 0 ? 'Initial Generation' : `Generation #${vNum}`
          };
          const next = [...prev, stamped];
          setActiveHistoryIndex(next.length - 1);
          return next;
        });
        setActiveWorkspaceTab('output');

        StorageService.saveToHistory({
          masterPrompt: result.masterPrompt,
          negativePrompt: result.negativePrompt,
          midjourneyFormat: result.midjourneyFormat,
          fluxFormat: result.fluxFormat,
          sdxlFormat: result.sdxlFormat,
          mode: currentMode,
          aspectRatio: result.aspectRatio,
          optionsSummary: result.optionsSummary
        });
      } else {
        const fallback = createLocalFallbackPrompt(selection, currentMode);
        setPromptResult(fallback);
        setSessionHistory((prev) => {
          const vNum = prev.length + 1;
          const stamped = {
            ...fallback,
            versionNumber: vNum,
            versionLabel: prev.length === 0 ? 'Initial Generation' : `Generation #${vNum}`
          };
          const next = [...prev, stamped];
          setActiveHistoryIndex(next.length - 1);
          return next;
        });
        setActiveWorkspaceTab('output');

        StorageService.saveToHistory({
          masterPrompt: fallback.masterPrompt,
          negativePrompt: fallback.negativePrompt,
          midjourneyFormat: fallback.midjourneyFormat,
          fluxFormat: fallback.fluxFormat,
          sdxlFormat: fallback.sdxlFormat,
          mode: currentMode,
          aspectRatio: fallback.aspectRatio,
          optionsSummary: fallback.optionsSummary
        });
      }
    } catch (err) {
      console.warn('API connection or response issue, using local prompt fallback:', err);
      const fallback = createLocalFallbackPrompt(selection, currentMode);
      setPromptResult(fallback);
      setSessionHistory((prev) => {
        const vNum = prev.length + 1;
        const stamped = {
          ...fallback,
          versionNumber: vNum,
          versionLabel: prev.length === 0 ? 'Initial Generation' : `Generation #${vNum}`
        };
        const next = [...prev, stamped];
        setActiveHistoryIndex(next.length - 1);
        return next;
      });
      setActiveWorkspaceTab('output');

      StorageService.saveToHistory({
        masterPrompt: fallback.masterPrompt,
        negativePrompt: fallback.negativePrompt,
        midjourneyFormat: fallback.midjourneyFormat,
        fluxFormat: fallback.fluxFormat,
        sdxlFormat: fallback.sdxlFormat,
        mode: currentMode,
        aspectRatio: fallback.aspectRatio,
        optionsSummary: fallback.optionsSummary
      });
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!promptResult) return;

    setIsGeneratingImage(true);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptResult.masterPrompt,
          aspectRatio: selection.aspectRatio,
          referenceImage: selection.referenceImage
        })
      });

      if (!response.ok) {
        throw new Error(`Server status ${response.status}`);
      }

      const data = await response.json();

      if (data && data.success && data.imageUrl) {
        setPromptResult((prev) => {
          if (!prev) return null;
          const updated = { ...prev, generatedImageUrl: data.imageUrl };
          setSessionHistory((hPrev) =>
            hPrev.map((item) => (item.id === prev.id ? { ...item, generatedImageUrl: data.imageUrl } : item))
          );
          return updated;
        });
      } else {
        const seed = Math.floor(Math.random() * 100000);
        const placeholder = `https://picsum.photos/seed/infinity_${seed}/1024/1024`;
        setPromptResult((prev) => {
          if (!prev) return null;
          const updated = { ...prev, generatedImageUrl: placeholder };
          setSessionHistory((hPrev) =>
            hPrev.map((item) => (item.id === prev.id ? { ...item, generatedImageUrl: placeholder } : item))
          );
          return updated;
        });
      }
    } catch (err) {
      console.warn('Image Gen API issue, using visual placeholder fallback:', err);
      const seed = Math.floor(Math.random() * 100000);
      const placeholder = `https://picsum.photos/seed/infinity_${seed}/1024/1024`;
      setPromptResult((prev) => {
        if (!prev) return null;
        const updated = { ...prev, generatedImageUrl: placeholder };
        setSessionHistory((hPrev) =>
          hPrev.map((item) => (item.id === prev.id ? { ...item, generatedImageUrl: placeholder } : item))
        );
        return updated;
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleUpdatePromptResult = (updated: PromptResult) => {
    setPromptResult(updated);
    setSessionHistory((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === updated.id);
      if (existingIdx !== -1) {
        const copy = [...prev];
        copy[existingIdx] = updated;
        return copy;
      }
      const vNum = prev.length + 1;
      const stamped = {
        ...updated,
        versionNumber: vNum,
        versionLabel: updated.versionLabel || (updated.refinementInstruction ? `Refined: ${updated.refinementInstruction.slice(0, 30)}...` : `Version ${vNum}`)
      };
      const next = [...prev, stamped];
      setActiveHistoryIndex(next.length - 1);
      return next;
    });

    StorageService.saveToHistory({
      masterPrompt: updated.masterPrompt,
      negativePrompt: updated.negativePrompt,
      midjourneyFormat: updated.midjourneyFormat,
      fluxFormat: updated.fluxFormat,
      sdxlFormat: updated.sdxlFormat,
      mode: updated.mode,
      aspectRatio: updated.aspectRatio,
      optionsSummary: updated.optionsSummary
    });
  };

  const handleNavigateHistory = (index: number) => {
    if (index >= 0 && index < sessionHistory.length) {
      setActiveHistoryIndex(index);
      setPromptResult(sessionHistory[index]);
    }
  };

  const handleSelectPreset = (preset: PresetTemplate) => {
    setActivePresetId(preset.id);
    setCurrentMode(preset.mode);
    setSelection({
      ...DEFAULT_SELECTION,
      ...preset.selection
    });
  };

  const handleResetAll = () => {
    setSelection({ ...DEFAULT_SELECTION });
    setActivePresetId(undefined);
    setPromptResult(null);
    setSessionHistory([]);
    setActiveHistoryIndex(-1);
  };

  const handleUsePromptFromHistory = (promptText: string) => {
    const result: PromptResult = {
      id: Date.now().toString(),
      masterPrompt: promptText,
      negativePrompt: 'low quality, blurry, deformed, bad anatomy, bad lighting, watermark, oversaturated',
      midjourneyFormat: `/imagine prompt: ${promptText} --ar 9:16 --v 6.0 --style raw`,
      fluxFormat: `${promptText}, photorealistic 8k Hasselblad`,
      sdxlFormat: `${promptText}, masterpiece, best quality`,
      descriptionMm: 'History မှ ရွေးချယ်ထားသော Prompt ဖြစ်ပါသည်',
      descriptionEn: 'Selected prompt from History / Favorites',
      cameraNotes: 'Hasselblad H6D-100c, 85mm f/1.4 lens, natural lighting',
      aspectRatio: '9:16',
      mode: currentMode,
      timestamp: new Date().toLocaleTimeString(),
      optionsSummary: {
        subject: 'Custom History Prompt',
        event: 'Custom Prompt',
        location: 'Custom Location',
        lighting: 'Natural / Studio'
      },
      versionLabel: 'Imported from History'
    };
    setPromptResult(result);
    setSessionHistory((prev) => {
      const vNum = prev.length + 1;
      const stamped = { ...result, versionNumber: vNum };
      const next = [...prev, stamped];
      setActiveHistoryIndex(next.length - 1);
      return next;
    });
    setActiveWorkspaceTab('output');
  };

  const isMyanmar = language === 'my';

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-900 selection:text-cyan-200 overflow-x-clip">
      
      {/* Top Fixed Header */}
      <Header
        currentMode={currentMode}
        onModeChange={handleModeChange}
        language={language}
        onLanguageChange={setLanguage}
        currentUser={currentUser}
        onOpenUserDashboard={() => setIsUserDashboardOpen(true)}
        onOpenSlashCommands={() => setIsSlashCommandModalOpen(true)}
      />

      {/* Main Workspace Body */}
      <main className="relative z-10 flex-1 mx-auto max-w-7xl w-full px-3 sm:px-6 py-2 flex flex-col justify-start">
        


        {/* View Tab 1: Studio Mode */}
        {activeWorkspaceTab === 'studio' && (
          <div className="w-full">
            <ExecutiveMasterDetailStudio
              currentMode={currentMode}
              onModeChange={handleModeChange}
              language={language}
              selection={selection}
              onUpdateSelection={handleUpdateSelection}
              onGeneratePrompt={handleGeneratePrompt}
              isGeneratingPrompt={isGeneratingPrompt}
              onResetAll={handleResetAll}
              onOpenOutput={() => setActiveWorkspaceTab('output')}
              promptResult={promptResult}
              onSelectPreset={handleSelectPreset}
              activePresetId={activePresetId}
              onOpenSlashCommands={() => setIsSlashCommandModalOpen(true)}
            />
          </div>
        )}

        {/* View Tab 2: Prompt Output Card & Live Generation Studio */}
        {activeWorkspaceTab === 'output' && (
          <div className="w-full max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-2">
              <button
                type="button"
                onClick={() => setActiveWorkspaceTab('studio')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-bold text-white hover:border-cyan-400/50 backdrop-blur-md transition-all shadow-[0_4px_20px_rgba(0,0,0,0.4)] cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4 text-cyan-400" />
                <span>{isMyanmar ? '← စတူဒီယို ဘုတ်သို့ ပြန်သွားမည်' : '← Back to Studio Matrix'}</span>
              </button>
              
              {promptResult && (
                <span className="text-xs text-slate-300 font-mono px-3 py-1 rounded-lg bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-sm">
                  {promptResult.timestamp}
                </span>
              )}
            </div>

            <PromptOutputCard
              language={language}
              promptResult={promptResult}
              isGeneratingPrompt={isGeneratingPrompt}
              onGenerateImage={handleGenerateImage}
              isGeneratingImage={isGeneratingImage}
              onResetAll={handleResetAll}
              onUpdatePromptResult={handleUpdatePromptResult}
              sessionHistory={sessionHistory}
              activeHistoryIndex={activeHistoryIndex}
              onNavigateHistory={handleNavigateHistory}
              onOpenSlashCommands={() => setIsSlashCommandModalOpen(true)}
            />
          </div>
        )}

      </main>

      {/* Slash Command Studio Modal */}
      <SlashCommandStudioModal
        isOpen={isSlashCommandModalOpen}
        onClose={() => setIsSlashCommandModalOpen(false)}
        language={language}
        selection={selection}
        onUpdateSelection={handleUpdateSelection}
        onGeneratePrompt={handleGeneratePrompt}
        isGeneratingPrompt={isGeneratingPrompt}
      />

      {/* User Dashboard Modal */}
      <UserDashboardModal
        isOpen={isUserDashboardOpen}
        onClose={() => setIsUserDashboardOpen(false)}
        currentUser={currentUser}
        onUserUpdate={setCurrentUser}
        language={language}
        onSelectPromptToUse={handleUsePromptFromHistory}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
      />

      {/* Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        currentUser={currentUser}
        language={language}
        onUserUpdate={setCurrentUser}
      />

      {/* Footer */}
      <footer id="app-footer" className="relative z-10 border-t border-white/10 bg-slate-950/70 backdrop-blur-xl py-3 px-6 text-center text-xs text-slate-400 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-slate-400 text-xs">
            © 2026 Show AI Studio. • Powered by Gemini AI
          </div>
          <span className="text-slate-400 text-[11px]">
            {isMyanmar ? 'အဆင့်မြင့် ဓာတ်ပုံ Prompt ဖန်တီးနည်းပညာ' : 'Masterpiece AI Photography Prompt Engineering'}
          </span>
        </div>
      </footer>

    </div>
  );
}
