'use client';

import React, { memo, useCallback, useState } from 'react';
import useEditorStore from '@/store/editor-store';
import { cn } from '@/lib/utils';
import { 
  Minus, 
  Move, 
  ZoomIn, 
  ZoomOut, 
  Trash2, 
  Square,
  Copy,
  Scissors,
  ClipboardPaste,
  PaintBucket,
  Lasso,
  MousePointer2,
  Pipette,
  Undo2,
  Redo2,
  Save,
  Upload,
  Download,
  Grid3x3,
  Hand,
  Eraser,
  Crop,
  Expand,
  Shrink,
  Palette,
  Layers,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  AlignStartHorizontal,
  AlignCenterHorizontal,
  AlignEndHorizontal,
  AlignHorizontalDistributeCenter,
  AlignVerticalDistributeCenter,
  Group,
  Ungroup,
  BringToFront,
  SendToBack,
  MoveUp,
  MoveDown
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  shortcut?: string;
}

const ToolButton = memo(({ icon, label, active, onClick, disabled, shortcut }: ToolButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={`${label}${shortcut ? ` (${shortcut})` : ''}`}
    className={cn(
      'relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-150',
      'hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50',
      'disabled:opacity-30 disabled:cursor-not-allowed',
      active && 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30'
    )}
  >
    {icon}
    {shortcut && (
      <span className="absolute bottom-0.5 right-1 text-[8px] text-white/30 font-mono">
        {shortcut}
      </span>
    )}
  </button>
));

ToolButton.displayName = 'ToolButton';

const SidebarSection = memo(({ 
  title, 
  children, 
  defaultOpen = true 
}: { 
  title: string; 
  children: React.ReactNode; 
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-white/10 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-white/60 hover:text-white/80 transition-colors"
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <svg
          className={cn('w-3 h-3 transition-transform', isOpen && 'rotate-90')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      {isOpen && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
});

SidebarSection.displayName = 'SidebarSection';

const Sidebar = memo(({ className }: SidebarProps) => {
  const [activeTool, setActiveTool] = useState<string>('select');
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);

  const handleToolChange = useCallback((tool: string) => {
    setActiveTool(tool);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 10, 500));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 10, 10));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoom(100);
  }, []);

  return (
    <aside 
      className={cn(
        'w-64 bg-gray-900/95 backdrop-blur-sm border-r border-white/10',
        'flex flex-col overflow-y-auto',
        'scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent',
        className
      )}
      role="complementary"
      aria-label="Editor tools"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10">
        <h2 className="text-sm font-semibold text-white">Zeus Icon Editor</h2>
        <p className="text-xs text-white/40 mt-0.5">Professional icon design</p>
      </div>

      {/* Tools */}
      <SidebarSection title="Tools" defaultOpen>
        <div className="grid grid-cols-4 gap-1">
          <ToolButton 
            icon={<img src="/uploads/BugAntIcon.png" alt="icon" width={24} height={24} className="inline-block" />} 
            label="Select" 
            active={activeTool === 'select'}
            onClick={() => handleToolChange('select')}
            shortcut="V"
          />
          <ToolButton
            icon={<Lasso className="w-4 h-4" />}
            label="Lasso Select"
            active={activeTool === 'lasso'}
            onClick={() => handleToolChange('lasso')}
            shortcut="P"
          />
          <ToolButton 
            icon={<Square className="w-4 h-4" />} 
            label="Rectangle" 
            active={activeTool === 'rectangle'}
            onClick={() => handleToolChange('rectangle')}
            shortcut="R"
          />
          <ToolButton 
            icon={<img src="/uploads/terminal.png" alt="icon" width={24} height={24} className="inline-block" />} 
            label="Ellipse" 
            active={activeTool === 'ellipse'}
            onClick={() => handleToolChange('ellipse')}
            shortcut="E"
          />
          <ToolButton 
            icon={<Minus className="w-4 h-4" />} 
            label="Line" 
            active={activeTool === 'line'}
            onClick={() => handleToolChange('line')}
            shortcut="L"
          />
          <ToolButton 
            icon={<PaintBucket className="w-4 h-4" />} 
            label="Fill" 
            active={activeTool === 'fill'}
            onClick={() => handleToolChange('fill')}
            shortcut="G"
          />
          <ToolButton 
            icon={<Pipette className="w-4 h-4" />} 
            label="Eyedropper" 
            active={activeTool === 'eyedropper'}
            onClick={() => handleToolChange('eyedropper')}
            shortcut="I"
          />
          <ToolButton 
            icon={<Eraser className="w-4 h-4" />} 
            label="Eraser" 
            active={activeTool === 'eraser'}
            onClick={() => handleToolChange('eraser')}
            shortcut="E"
          />
        </div>
      </SidebarSection>

      {/* Navigation */}
      <SidebarSection title="Navigation" defaultOpen>
        <div className="grid grid-cols-4 gap-1">
          <ToolButton 
            icon={<Hand className="w-4 h-4" />} 
            label="Hand" 
            active={activeTool === 'hand'}
            onClick={() => handleToolChange('hand')}
            shortcut="H"
          />
          <ToolButton 
            icon={<ZoomIn className="w-4 h-4" />} 
            label="Zoom In" 
            onClick={handleZoomIn}
            shortcut="+"
          />
          <ToolButton 
            icon={<ZoomOut className="w-4 h-4" />} 
            label="Zoom Out" 
            onClick={handleZoomOut}
            shortcut="-"
          />
          <ToolButton 
            icon={<Expand className="w-4 h-4" />} 
            label="Fit to Screen" 
            onClick={handleZoomReset}
            shortcut="0"
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-white/60">
          <span>Zoom</span>
          <span className="font-mono">{zoom}%</span>
        </div>
        <input
          type="range"
          min={10}
          max={500}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full mt-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full"
          aria-label="Zoom level"
        />
      </SidebarSection>

      {/* Grid */}
      <SidebarSection title="Grid" defaultOpen>
        <div className="space-y-2">
          <label className="flex items-center justify-between text-xs text-white/60">
            <span>Show Grid</span>
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={cn(
                'w-8 h-4 rounded-full transition-colors relative',
                showGrid ? 'bg-blue-500' : 'bg-white/10'
              )}
              role="switch"
              aria-checked={showGrid}
            >
              <span className={cn(
                'absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform',
                showGrid && 'translate-x-4'
              )} />
            </button>
          </label>
          <label className="flex items-center justify-between text-xs text-white/60">
            <span>Snap to Grid</span>
            <button
              onClick={() => setSnapToGrid(!snapToGrid)}
              className={cn(
                'w-8 h-4 rounded-full transition-colors relative',
                snapToGrid ? 'bg-blue-500' : 'bg-white/10'
              )}
              role="switch"
              aria-checked={snapToGrid}
            >
              <span className={cn(
                'absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform',
                snapToGrid && 'translate-x-4'
              )} />
            </button>
          </label>
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>Grid Size</span>
            <select className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white/80">
              <option>8x8</option>
              <option>16x16</option>
              <option>24x24</option>
              <option>32x32</option>
              <option>48x48</option>
              <option>64x64</option>
            </select>
          </div>
        </div>
      </SidebarSection>

      {/* Edit */}
      <SidebarSection title="Edit" defaultOpen>
        <div className="grid grid-cols-4 gap-1">
          <ToolButton icon={<Undo2 className="w-4 h-4" />} label="Undo" shortcut="Z" />
          <ToolButton icon={<Redo2 className="w-4 h-4" />} label="Redo" shortcut="Z" />
          <ToolButton icon={<Copy className="w-4 h-4" />} label="Copy" shortcut="C" />
          <ToolButton icon={<Scissors className="w-4 h-4" />} label="Cut" shortcut="X" />
          <ToolButton icon={<ClipboardPaste className="w-4 h-4" />} label="Paste" shortcut="V" />
          <ToolButton icon={<Trash2 className="w-4 h-4" />} label="Delete" shortcut="Del" />
          <ToolButton icon={<Crop className="w-4 h-4" />} label="Crop" shortcut="C" />
          <ToolButton icon={<Group className="w-4 h-4" />} label="Group" shortcut="G" />
        </div>
      </SidebarSection>

      {/* Transform */}
      <SidebarSection title="Transform" defaultOpen>
        <div className="grid grid-cols-4 gap-1">
          <ToolButton icon={<RotateCcw className="w-4 h-4" />} label="Rotate Left" />
          <ToolButton icon={<RotateCw className="w-4 h-4" />} label="Rotate Right" />
          <ToolButton icon={<FlipHorizontal className="w-4 h-4" />} label="Flip Horizontal" />
          <ToolButton icon={<FlipVertical className="w-4 h-4" />} label="Flip Vertical" />
        </div>
      </SidebarSection>

      {/* Align */}
      <SidebarSection title="Align" defaultOpen>
        <div className="grid grid-cols-4 gap-1">
          <ToolButton icon={<AlignStartVertical className="w-4 h-4" />} label="Align Top" />
          <ToolButton icon={<AlignCenterVertical className="w-4 h-4" />} label="Align Middle" />
          <ToolButton icon={<AlignEndVertical className="w-4 h-4" />} label="Align Bottom" />
          <ToolButton icon={<AlignStartHorizontal className="w-4 h-4" />} label="Align Left" />
          <ToolButton icon={<AlignCenterHorizontal className="w-4 h-4" />} label="Align Center" />
          <ToolButton icon={<AlignEndHorizontal className="w-4 h-4" />} label="Align Right" />
          <ToolButton icon={<AlignVerticalDistributeCenter className="w-4 h-4" />} label="Distribute Vertically" />
          <ToolButton icon={<AlignHorizontalDistributeCenter className="w-4 h-4" />} label="Distribute Horizontally" />
        </div>
      </SidebarSection>

      {/* Order */}
      <SidebarSection title="Order" defaultOpen>
        <div className="grid grid-cols-4 gap-1">
          <ToolButton icon={<BringToFront className="w-4 h-4" />} label="Bring to Front" />
          <ToolButton icon={<MoveUp className="w-4 h-4" />} label="Bring Forward" />
          <ToolButton icon={<MoveDown className="w-4 h-4" />} label="Send Backward" />
          <ToolButton icon={<SendToBack className="w-4 h-4" />} label="Send to Back" />
        </div>
      </SidebarSection>

      {/* File Operations */}
      <SidebarSection title="File" defaultOpen>
        <div className="grid grid-cols-4 gap-1">
          <ToolButton icon={<Save className="w-4 h-4" />} label="Save" shortcut="S" />
          <ToolButton icon={<Upload className="w-4 h-4" />} label="Import PNG" />
          <ToolButton icon={<Download className="w-4 h-4" />} label="Export PNG" shortcut="E" />
        </div>
      </SidebarSection>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-white/40">
          <span>Canvas: 64x64</span>
          <span>Objects: 0</span>
        </div>
      </div>
    </aside>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;