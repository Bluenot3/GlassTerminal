'use client'

import React, { useState, useEffect, useRef } from 'react'
import { CodeVisualization, themes } from '@/components/3d-code-visualization'
import { ControlsPanel } from '@/components/controls-panel'
import { CodeGenerator, GeneratedCode } from '@/lib/code-generator'

const HomePage = () => {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentTheme, setCurrentTheme] = useState(0)
  const [shape, setShape] = useState<'cube' | 'sphere'>('cube')
  const [materialType, setMaterialType] = useState<'glass' | 'reflective' | 'matte' | 'glowing' | 'crystal' | 'metallic'>('glass')
  const [effects, setEffects] = useState({
    glow: true,
    particles: true,
    wireframe: false
  })
  const [rotationSpeed, setRotationSpeed] = useState(1)
  const [codes, setCodes] = useState<string[]>(['', '', '', '', '', ''])
  const [error, setError] = useState<string | null>(null)
  
  const streamingIntervals = useRef<NodeJS.Timeout[]>([])
  const maxChars = 200 // Maximum characters to display per face

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      streamingIntervals.current.forEach(clearInterval)
    }
  }, [])

  const handleGenerate = async () => {
    if (isGenerating || !prompt.trim()) return

    setIsGenerating(true)
    setError(null)
    setCodes(['', '', '', '', '', ''])
    
    // Clear any existing intervals
    streamingIntervals.current.forEach(clearInterval)
    streamingIntervals.current = []

    try {
      const codeGenerator = await CodeGenerator.getInstance()
      let generatedCode: GeneratedCode

      try {
        // Try to generate code using AI
        generatedCode = await codeGenerator.generateCode(prompt)
      } catch (aiError) {
        console.warn('AI generation failed, using fallback:', aiError)
        // Fallback to predefined code
        generatedCode = CodeGenerator.generateFallbackCode(prompt)
      }

      // Prepare code files for streaming
      const codeFiles = [
        generatedCode.html,
        generatedCode.css,
        generatedCode.javascript,
        generatedCode.html, // Repeat for opposite faces of cube
        generatedCode.css,
        generatedCode.javascript
      ]

      // Stream each file character by character
      codeFiles.forEach((file, faceIndex) => {
        let charIndex = 0
        
        const interval = setInterval(() => {
          if (charIndex < file.length) {
            setCodes(prev => {
              const newTexts = [...prev]
              newTexts[faceIndex] = (newTexts[faceIndex] + file[charIndex]).slice(-maxChars)
              return newTexts
            })
            charIndex++
          } else {
            clearInterval(interval)
            streamingIntervals.current[faceIndex] = null as unknown as NodeJS.Timeout
            
            // Check if all faces are done streaming
            if (streamingIntervals.current.every(int => int === null)) {
              setIsGenerating(false)
            }
          }
        }, 15) // Fast streaming for code effect
        
        streamingIntervals.current[faceIndex] = interval
      })

    } catch (error) {
      console.error('Generation error:', error)
      setError('Failed to generate code. Please try again.')
      setIsGenerating(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleGenerate()
    }
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Header */}
      <header className="relative z-10 p-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">3D</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                3D Code Generator
              </h1>
              <p className="text-sm text-gray-400">Visualize code on 3D shapes in real-time</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-400">Current Theme</div>
              <div className="text-sm font-semibold" style={{ color: themes[currentTheme].primary }}>
                {themes[currentTheme].name}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Material</div>
              <div className="text-sm font-semibold capitalize" style={{ color: themes[currentTheme].accent }}>
                {materialType}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto p-4">
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-300">
            {error}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 h-screen">
          {/* 3D Visualization Area */}
          <div className="lg:col-span-3 relative">
            <CodeVisualization
              codes={codes}
              currentTheme={currentTheme}
              shape={shape}
              effects={effects}
              materialType={materialType}
            />
            
            {/* Overlay Instructions */}
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-sm text-white/80">
              <p>🖱️ Drag to rotate • Scroll to zoom</p>
              <p>⌨️ Ctrl+Enter to generate</p>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="lg:col-span-1 border-l border-white/10 overflow-y-auto">
            <ControlsPanel
              prompt={prompt}
              setPrompt={setPrompt}
              isGenerating={isGenerating}
              onGenerate={handleGenerate}
              currentTheme={currentTheme}
              setCurrentTheme={setCurrentTheme}
              shape={shape}
              setShape={setShape}
              effects={effects}
              setEffects={setEffects}
              rotationSpeed={rotationSpeed}
              setRotationSpeed={setRotationSpeed}
              materialType={materialType}
              setMaterialType={setMaterialType}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-gray-400">
          <div>
            Powered by Three.js & React Three Fiber
          </div>
          <div>
            {isGenerating ? (
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>Generating code...</span>
              </span>
            ) : (
              <span>Ready to generate</span>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage