'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { themes, Theme } from '@/components/3d-code-visualization'

interface ControlsPanelProps {
  prompt: string
  setPrompt: (prompt: string) => void
  isGenerating: boolean
  onGenerate: () => void
  currentTheme: number
  setCurrentTheme: (theme: number) => void
  shape: 'cube' | 'sphere'
  setShape: (shape: 'cube' | 'sphere') => void
  effects: {
    glow: boolean
    particles: boolean
    wireframe: boolean
  }
  setEffects: (effects: { glow: boolean; particles: boolean; wireframe: boolean }) => void
  rotationSpeed: number
  setRotationSpeed: (speed: number) => void
  materialType: 'glass' | 'reflective' | 'matte' | 'glowing' | 'crystal' | 'metallic'
  setMaterialType: (type: 'glass' | 'reflective' | 'matte' | 'glowing' | 'crystal' | 'metallic') => void
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  prompt,
  setPrompt,
  isGenerating,
  onGenerate,
  currentTheme,
  setCurrentTheme,
  shape,
  setShape,
  effects,
  setEffects,
  rotationSpeed,
  setRotationSpeed,
  materialType,
  setMaterialType
}) => {
  const handleEffectToggle = (effect: keyof typeof effects) => {
    setEffects({
      ...effects,
      [effect]: !effects[effect]
    })
  }

  const materialOptions = [
    { value: 'glass', label: 'Glass', color: 'rgba(100, 200, 255, 0.3)' },
    { value: 'reflective', label: 'Reflective', color: 'rgba(192, 192, 192, 0.8)' },
    { value: 'matte', label: 'Matte', color: 'rgba(128, 128, 128, 0.9)' },
    { value: 'glowing', label: 'Glowing', color: 'rgba(255, 255, 100, 0.8)' },
    { value: 'crystal', label: 'Crystal', color: 'rgba(200, 150, 255, 0.4)' },
    { value: 'metallic', label: 'Metallic', color: 'rgba(180, 180, 180, 0.9)' }
  ]

  return (
    <div className="w-full max-w-md space-y-4 p-4 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10">
      {/* Prompt Input */}
      <Card className="bg-black/30 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Code Generation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt" className="text-white/80">Describe your application</Label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Build me a portfolio website with animations'"
              className="w-full p-3 bg-black/50 border border-white/20 rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              disabled={isGenerating}
            />
          </div>
          <Button 
            onClick={onGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating...' : 'Generate Code'}
          </Button>
        </CardContent>
      </Card>

      {/* Material Selection */}
      <Card className="bg-black/30 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Material Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {materialOptions.map((option) => (
              <Button
                key={option.value}
                variant={materialType === option.value ? "default" : "outline"}
                className="text-xs h-10 p-2 flex items-center gap-2"
                onClick={() => setMaterialType(option.value as any)}
                style={{
                  backgroundColor: materialType === option.value ? option.color : 'transparent',
                  borderColor: option.color,
                  color: materialType === option.value ? 'white' : option.color.replace('0.', '1')
                }}
              >
                <div 
                  className="w-3 h-3 rounded-full border border-white/30" 
                  style={{ backgroundColor: option.color }}
                />
                {option.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Theme Selection */}
      <Card className="bg-black/30 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Themes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {themes.map((theme, index) => (
              <Button
                key={theme.name}
                variant={currentTheme === index ? "default" : "outline"}
                className="text-xs h-8 p-2"
                onClick={() => setCurrentTheme(index)}
                style={{
                  backgroundColor: currentTheme === index ? theme.primary : 'transparent',
                  borderColor: theme.primary,
                  color: currentTheme === index ? 'white' : theme.primary
                }}
              >
                {theme.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shape Selection */}
      <Card className="bg-black/30 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">3D Shape</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={shape === 'cube' ? "default" : "outline"}
              className="flex-1"
              onClick={() => setShape('cube')}
            >
              <CubeIcon className="w-4 h-4 mr-2" />
              Cube
            </Button>
            <Button
              variant={shape === 'sphere' ? "default" : "outline"}
              className="flex-1"
              onClick={() => setShape('sphere')}
            >
              <SphereIcon className="w-4 h-4 mr-2" />
              Sphere
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Effects */}
      <Card className="bg-black/30 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Effects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="glow" className="text-white/80">Glow Effect</Label>
            <Switch
              id="glow"
              checked={effects.glow}
              onCheckedChange={() => handleEffectToggle('glow')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="particles" className="text-white/80">Particles</Label>
            <Switch
              id="particles"
              checked={effects.particles}
              onCheckedChange={() => handleEffectToggle('particles')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="wireframe" className="text-white/80">Wireframe</Label>
            <Switch
              id="wireframe"
              checked={effects.wireframe}
              onCheckedChange={() => handleEffectToggle('wireframe')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Rotation Speed */}
      <Card className="bg-black/30 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Rotation Speed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRotationSpeed(Math.max(0, rotationSpeed - 0.5))}
            >
              -
            </Button>
            <Badge variant="secondary" className="flex-1 text-center">
              {rotationSpeed}x
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRotationSpeed(Math.min(3, rotationSpeed + 0.5))}
            >
              +
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Simple icons for the UI
const CubeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
)

const SphereIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)