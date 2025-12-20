'use client'

import { useState, useEffect } from 'react'
import { X, ChevronRight, ChevronLeft, Mail, FileText, Sparkles, LayoutGrid } from 'lucide-react'

const TOUR_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to EmpleoAI! 🎉',
    description: 'Your AI-powered placement assistant. Let me show you around in 30 seconds.',
    icon: Sparkles,
    color: 'from-primary-500 to-blue-500',
  },
  {
    id: 'email-import',
    title: 'Import from Email',
    description: 'Paste placement emails and AI will automatically extract company, role, package, and deadlines.',
    icon: Mail,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'resume',
    title: 'Smart Resume Tailoring',
    description: 'Upload your resume once. AI analyzes it against each job and suggests improvements.',
    icon: FileText,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'kanban',
    title: 'Track Applications',
    description: 'Drag and drop applications through stages: Discovered → Applied → Interview → Offer',
    icon: LayoutGrid,
    color: 'from-orange-500 to-red-500',
  },
]

export default function FeatureTour({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    setIsVisible(false)
    localStorage.setItem('empleoai_tour_completed', 'true')
    onComplete?.()
  }

  const handleSkip = () => {
    handleComplete()
  }

  if (!isVisible) return null

  const step = TOUR_STEPS[currentStep]
  const Icon = step.icon

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-scale-in overflow-hidden">
        {/* Header with gradient */}
        <div className={`bg-gradient-to-r ${step.color} p-8 text-white text-center`}>
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold">{step.title}</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 text-center text-lg leading-relaxed mb-6">
            {step.description}
          </p>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-6">
            {TOUR_STEPS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-primary-600 w-8'
                    : index < currentStep
                    ? 'bg-primary-300'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
            >
              Skip tour
            </button>

            <div className="flex gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-xl border-2 border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <button
                onClick={handleNext}
                className="btn-primary flex items-center gap-2 px-6"
              >
                {currentStep === TOUR_STEPS.length - 1 ? (
                  "Let's Go!"
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function useTour() {
  const [showTour, setShowTour] = useState(false)

  useEffect(() => {
    const tourCompleted = localStorage.getItem('empleoai_tour_completed')
    if (!tourCompleted) {
      // Small delay to let the page load first
      const timer = setTimeout(() => setShowTour(true), 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const completeTour = () => {
    setShowTour(false)
    localStorage.setItem('empleoai_tour_completed', 'true')
  }

  const resetTour = () => {
    localStorage.removeItem('empleoai_tour_completed')
    setShowTour(true)
  }

  return { showTour, completeTour, resetTour }
}
