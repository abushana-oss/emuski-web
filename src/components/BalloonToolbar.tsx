'use client';

import { PenLine, Circle, Square, Diamond, Palette, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BalloonToolbarProps {
  isAnnotating: boolean;
  onToggleAnnotating: (annotating: boolean) => void;
  selectedStyle: 'circle' | 'square' | 'diamond';
  onStyleChange: (style: 'circle' | 'square' | 'diamond') => void;
  selectedColor: string;
  onColorChange: (color: string) => void;
  balloonCounter: number;
  balloonSize: number;
  onSizeChange: (size: number) => void;
}

const PRESET_COLORS = [
  '#3B82F6', // Blue
  '#EF4444', // Red  
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#6B7280'  // Gray
];

export const BalloonToolbar = ({
  isAnnotating,
  onToggleAnnotating,
  selectedStyle,
  onStyleChange,
  selectedColor,
  onColorChange,
  balloonCounter,
  balloonSize,
  onSizeChange
}: BalloonToolbarProps) => {
  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-4">
        {/* Annotation Toggle */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onToggleAnnotating(!isAnnotating)}
            variant={isAnnotating ? "default" : "outline"}
            className={isAnnotating ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            <PenLine className="h-4 w-4 mr-2" />
            {isAnnotating ? 'Stop Annotating' : 'Add Balloons'}
          </Button>
          {isAnnotating && (
            <span className="text-sm text-gray-600">
              Next: {balloonCounter}
            </span>
          )}
        </div>

        <div className="h-6 border-l border-gray-300"></div>

        {/* Balloon Style */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Shape:</span>
          <div className="flex gap-1">
            <Button
              variant={selectedStyle === 'circle' ? "default" : "outline"}
              size="sm"
              onClick={() => onStyleChange('circle')}
              className="p-2"
            >
              <Circle className="h-4 w-4" />
            </Button>
            <Button
              variant={selectedStyle === 'square' ? "default" : "outline"}
              size="sm"
              onClick={() => onStyleChange('square')}
              className="p-2"
            >
              <Square className="h-4 w-4" />
            </Button>
            <Button
              variant={selectedStyle === 'diamond' ? "default" : "outline"}
              size="sm"
              onClick={() => onStyleChange('diamond')}
              className="p-2"
            >
              <Diamond className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="h-6 border-l border-gray-300"></div>

        {/* Color Picker */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Color:</span>
          <div className="flex items-center gap-1">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
                  selectedColor === color 
                    ? 'border-gray-800 ring-2 ring-gray-300' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => onColorChange(color)}
                title={`Select ${color}`}
              />
            ))}
            
            {/* Custom color input */}
            <div className="relative ml-2">
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => onColorChange(e.target.value)}
                className="w-6 h-6 rounded-full border-2 border-gray-300 cursor-pointer opacity-0 absolute inset-0"
                title="Custom color"
              />
              <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center pointer-events-none">
                <Palette className="h-3 w-3 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="h-6 border-l border-gray-300"></div>

        {/* Size Control */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Size:</span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSizeChange(Math.max(1, balloonSize - 1))}
              disabled={balloonSize <= 1}
              className="p-1"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-sm font-mono w-8 text-center">{balloonSize}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSizeChange(Math.min(5, balloonSize + 1))}
              disabled={balloonSize >= 5}
              className="p-1"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="h-6 border-l border-gray-300"></div>

        {/* Preview */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Preview:</span>
          <div className="relative">
            <div
              className={`flex items-center justify-center text-white font-bold border-2 border-white shadow-lg transition-all ${
                selectedStyle === 'circle' 
                  ? 'rounded-full' 
                  : selectedStyle === 'square' 
                    ? 'rounded-none' 
                    : 'rounded-none transform rotate-45'
              }`}
              style={{ 
                backgroundColor: selectedColor,
                width: `${12 + (balloonSize - 1) * 4}px`,
                height: `${12 + (balloonSize - 1) * 4}px`,
                fontSize: `${6 + (balloonSize - 1) * 2}px`
              }}
            >
              <span className={selectedStyle === 'diamond' ? 'transform -rotate-45' : ''}>
                {balloonCounter}
              </span>
            </div>
          </div>
        </div>
      </div>

      {isAnnotating && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Annotation Mode:</strong> Click anywhere on the PDF to add balloon #{balloonCounter}. 
            Drag existing balloons to reposition them. Double-click balloons to remove them.
          </p>
        </div>
      )}
    </div>
  );
};