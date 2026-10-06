import React, { useState, useRef, useEffect } from 'react';
import {
  Language,
  MatrixSelection,
  AppMode,
} from '../types';
import { CommandPalette, CommandItem } from './CommandPalette';
import {
  Wand2,
  Command,
  RotateCcw,
  Sparkles,
  Check,
  X,
  Sliders,
  Maximize2,
  RefreshCcw,
} from 'lucide-react';

interface PromptInputAreaProps {
  language: Language;
  selection: MatrixSelection;
  onUpdateSelection: (updates: Partial<MatrixSelection>) => void;
  onGeneratePrompt: () => void;
  isGeneratingPrompt: boolean;
  onResetAll?: () => void;
  onModeChange?: (mode: AppMode) => void;
  className?: string;
  placeholder?: string;
  variant?: 'studio_dock' | 'card_directive';
}

export const PromptInputArea: React.FC<PromptInputAreaProps> = ({
  language,
  selection,
  onUpdateSelection,
  onGeneratePrompt,
  isGeneratingPrompt,
  onResetAll,
  onModeChange,
  className = '',
  placeholder,
  variant = 'studio_dock',
}) => {
  const isMyanmar = language === 'my';
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Prompt input text state, initialized from selection.customInstruction
  const [inputValue, setInputValue] = useState<string>(selection.customInstruction || '');

  // Keep synced if selection.customInstruction is updated externally
  useEffect(() => {
    if (selection.customInstruction !== undefined && selection.customInstruction !== inputValue) {
      setInputValue(selection.customInstruction);
    }
  }, [selection.customInstruction]);

  // Slash command state
  const [isPaletteOpen, setIsPaletteOpen] = useState<boolean>(false);
  const [slashQuery, setSlashQuery] = useState<string>('');
  const [slashTokenRange, setSlashTokenRange] = useState<{ start: number; end: number } | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Toast notification for user confirmation
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<any>(null);

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Detect slash command at current cursor position
  const evaluateSlashCommand = (text: string, cursorPos: number) => {
    const textBeforeCursor = text.slice(0, cursorPos);
    // Find the last slash before cursor that isn't preceded by non-whitespace (or is at start)
    const match = textBeforeCursor.match(/(?:^|\s)\/([a-zA-Z0-9_:-]*)$/);

    if (match) {
      const queryText = match[1]; // query after slash
      const slashIndex = textBeforeCursor.lastIndexOf('/' + queryText);
      setSlashQuery(queryText);
      setSlashTokenRange({
        start: slashIndex,
        end: cursorPos,
      });
      setIsPaletteOpen(true);
      setSelectedIndex(0);
    } else {
      setIsPaletteOpen(false);
      setSlashQuery('');
      setSlashTokenRange(null);
    }
  };

  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;
    setInputValue(newValue);
    onUpdateSelection({ customInstruction: newValue });

    evaluateSlashCommand(newValue, cursorPos);
  };

  // Handle explicit selection or cursor repositioning
  const handleSelectOrClick = () => {
    if (textareaRef.current) {
      const pos = textareaRef.current.selectionStart;
      evaluateSlashCommand(inputValue, pos);
    }
  };

  // Trigger slash command palette explicitly via button
  const handleTriggerSlash = () => {
    if (!textareaRef.current) return;
    textareaRef.current.focus();

    // If input already has a slash, evaluate it; otherwise insert '/'
    const cursorPos = textareaRef.current.selectionStart;
    const before = inputValue.slice(0, cursorPos);
    const after = inputValue.slice(cursorPos);

    // If already ending with slash or space, or empty
    let updatedText = inputValue;
    let newCursor = cursorPos;

    if (!inputValue.trim() || before.endsWith(' ') || before === '') {
      updatedText = before + '/' + after;
      newCursor = cursorPos + 1;
    } else {
      updatedText = before + ' /' + after;
      newCursor = cursorPos + 2;
    }

    setInputValue(updatedText);
    onUpdateSelection({ customInstruction: updatedText });

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = newCursor;
        textareaRef.current.selectionEnd = newCursor;
        evaluateSlashCommand(updatedText, newCursor);
      }
    }, 10);
  };

  // Insert quick category prefix like "/background"
  const handleQuickCommandClick = (cmdTrigger: string) => {
    if (!textareaRef.current) return;
    textareaRef.current.focus();

    const prefix = inputValue.trim() ? (inputValue.endsWith(' ') ? '' : ' ') : '';
    const updated = inputValue + prefix + cmdTrigger + ' ';
    setInputValue(updated);
    onUpdateSelection({ customInstruction: updated });

    setTimeout(() => {
      if (textareaRef.current) {
        const len = updated.length;
        textareaRef.current.selectionStart = len;
        textareaRef.current.selectionEnd = len;
        evaluateSlashCommand(updated, len);
      }
    }, 10);
  };

  // Execute selected command from CommandPalette
  const handleSelectCommand = (command: CommandItem) => {
    let updatedText = inputValue;

    // 1. If it was triggered from a slash token, replace the slash token in text
    if (slashTokenRange) {
      const before = inputValue.slice(0, slashTokenRange.start);
      const after = inputValue.slice(slashTokenRange.end);

      if (command.insertText) {
        updatedText = `${before}${command.insertText} ${after}`.replace(/\s+/g, ' ').trim();
      } else {
        updatedText = `${before}${after}`.replace(/\s+/g, ' ').trim();
      }
    } else if (command.insertText) {
      const prefix = inputValue.trim() ? `${inputValue.trim()} ` : '';
      updatedText = `${prefix}${command.insertText}`;
    }

    setInputValue(updatedText);
    onUpdateSelection({ customInstruction: updatedText });

    // 2. Apply matrix updates if specified
    if (command.matrixUpdate) {
      onUpdateSelection(command.matrixUpdate);
      const label = isMyanmar && command.labelMm ? command.labelMm : command.label;
      showToast(isMyanmar ? `✓ ${command.categoryLabelMm || command.categoryLabel}: ${label} ကို ရွေးချယ်ပြီးပါပြီ` : `✓ Set ${command.categoryLabel}: ${label}`);
    }

    // 3. Execute action callback if specified
    if (command.action) {
      command.action();
    }

    // 4. Close palette and refocus input
    setIsPaletteOpen(false);
    setSlashQuery('');
    setSlashTokenRange(null);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = updatedText.length;
        textareaRef.current.selectionEnd = updatedText.length;
      }
    }, 10);
  };

  // Keyboard navigation & Enter interception
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isPaletteOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => prev + 1);
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(0, prev - 1));
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        setIsPaletteOpen(false);
        return;
      }

      if (e.key === 'Tab') {
        // Tab triggers command selection
        e.preventDefault();
        // The CommandPalette handles the selected item when Enter or Tab is pressed
        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
        const listbox = document.querySelector('[role="listbox"]');
        const selectedBtn = listbox?.querySelector('[aria-selected="true"]') as HTMLButtonElement | null;
        if (selectedBtn) {
          selectedBtn.click();
        }
        return;
      }

      if (e.key === 'Enter' && !e.shiftKey) {
        // Intercept enter to pick selected command item
        e.preventDefault();
        const listbox = document.querySelector('[role="listbox"]');
        const selectedBtn = listbox?.querySelector('[aria-selected="true"]') as HTMLButtonElement | null;
        if (selectedBtn) {
          selectedBtn.click();
        } else {
          setIsPaletteOpen(false);
        }
        return;
      }
    } else {
      // If palette is closed and user presses Enter (without shift), generate prompt!
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onGeneratePrompt();
      }
    }
  };

  const defaultPlaceholder = isMyanmar
    ? "Prompt ရိုက်ထည့်ပါ သို့မဟုတ် Slash Command အတွက် '/' ကို ရိုက်ပါ (ဥပမာ- /back, /light, /cam)..."
    : "Type custom prompt or '/' for commands (e.g., /back, /light, /cam, /pose)...";

  return (
    <div className={`relative w-full ${className}`}>
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/90 border border-cyan-400/80 text-cyan-200 text-xs font-semibold shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="h-3 w-3 text-cyan-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating CommandPalette Component Positioned Above the Input Area */}
      <CommandPalette
        isOpen={isPaletteOpen}
        query={slashQuery}
        onSelect={handleSelectCommand}
        onClose={() => setIsPaletteOpen(false)}
        language={language}
        selection={selection}
        onGeneratePrompt={onGeneratePrompt}
        onResetAll={onResetAll}
        onClearInput={() => {
          setInputValue('');
          onUpdateSelection({ customInstruction: '' });
          setIsPaletteOpen(false);
        }}
        onModeChange={onModeChange}
        selectedIndex={selectedIndex}
        onSelectedIndexChange={setSelectedIndex}
        onQueryChange={(newQ) => {
          setSlashQuery(newQ);
          setSelectedIndex(0);
        }}
      />

      {/* Input Container Box with Clean Dark Theme */}
      <div className="group rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 focus-within:border-cyan-500/70 focus-within:ring-2 focus-within:ring-cyan-500/20 shadow-xl backdrop-blur-xl transition-all duration-200 overflow-hidden">
        
        {/* Main Textarea Area */}
        <div className="p-3 sm:p-3.5 flex items-start gap-2.5">
          {/* Slash Command Trigger Button */}
          <button
            type="button"
            onClick={handleTriggerSlash}
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${
              isPaletteOpen
                ? 'bg-cyan-500 text-black border-cyan-400 shadow-sm ring-2 ring-cyan-500/30'
                : 'bg-slate-950/80 border-slate-800 text-cyan-400 hover:border-cyan-500/60 hover:text-white'
            }`}
            title={isMyanmar ? "Slash Commands ဖွင့်ရန် ('/' နှိပ်ပါ)" : "Open Slash Command Palette (Type '/')" }
          >
            /
          </button>

          {/* Text Area */}
          <textarea
            ref={textareaRef}
            rows={2}
            value={inputValue}
            onChange={handleInputChange}
            onClick={handleSelectOrClick}
            onKeyUp={handleSelectOrClick}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || defaultPlaceholder}
            className="w-full resize-none bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none leading-relaxed custom-scrollbar"
          />

          {/* Clear button if text exists */}
          {inputValue && (
            <button
              type="button"
              onClick={() => {
                setInputValue('');
                onUpdateSelection({ customInstruction: '' });
                if (textareaRef.current) textareaRef.current.focus();
              }}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isMyanmar ? 'ရှင်းထုတ်မည်' : 'Clear text'}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Input Footer Bar: Quick Chips & Generate CTA */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-t border-slate-800/80 bg-slate-950/60">
          
          {/* Quick Slash Commands List */}
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-0.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider shrink-0 mr-0.5 hidden sm:inline">
              Commands:
            </span>

            {[
              { trigger: '/back', label: 'Background', emoji: '🏞️' },
              { trigger: '/light', label: 'Lighting', emoji: '💡' },
              { trigger: '/cam', label: 'Camera', emoji: '📷' },
              { trigger: '/sub', label: 'Subject', emoji: '👤' },
              { trigger: '/pose', label: 'Pose', emoji: '✨' },
              { trigger: '/style', label: 'Style', emoji: '🎨' },
              { trigger: '/ar', label: 'Aspect', emoji: '📐' },
            ].map((chip) => (
              <button
                key={chip.trigger}
                type="button"
                onClick={() => handleQuickCommandClick(chip.trigger)}
                className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 hover:border-cyan-400/60 text-[11px] text-slate-300 hover:text-white transition-all cursor-pointer group"
              >
                <span className="text-[10px]">{chip.emoji}</span>
                <span className="font-mono text-cyan-400 group-hover:text-cyan-300 font-bold">{chip.trigger}</span>
                <span className="text-[10px] text-slate-400 group-hover:text-slate-200 hidden md:inline">{chip.label}</span>
              </button>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            {/* Enter Shortcut Hint */}
            <span className="text-[10px] text-slate-400 hidden lg:inline font-mono">
              ↵ Enter to generate
            </span>

            {/* Generate CTA Button */}
            <button
              type="button"
              onClick={onGeneratePrompt}
              disabled={isGeneratingPrompt}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-[0.98] text-black text-xs font-black shadow-md hover:shadow-cyan-500/25 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isGeneratingPrompt ? (
                <>
                  <RefreshCcw className="h-3.5 w-3.5 animate-spin" />
                  <span>{isMyanmar ? 'ဖန်တီးနေသည်...' : 'Generating...'}</span>
                </>
              ) : (
                <>
                  <Wand2 className="h-3.5 w-3.5" />
                  <span>{isMyanmar ? 'Generate' : 'Generate'}</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
