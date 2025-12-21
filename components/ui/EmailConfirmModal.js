'use client'

import { Mail, CheckCircle, X } from 'lucide-react'

export default function EmailConfirmModal({ email, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Mail className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold">Check Your Email!</h2>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Verification Email Sent
          </h3>
          
          <p className="text-gray-600 mb-4">
            We've sent a confirmation link to:
          </p>
          
          <p className="font-medium text-primary-600 bg-primary-50 px-4 py-2 rounded-lg inline-block mb-4">
            {email}
          </p>
          
          <p className="text-sm text-gray-500 mb-6">
            Click the link in the email to verify your account and start using EmpleoAI.
          </p>

          <div className="bg-gray-50 rounded-xl p-4 text-left">
            <p className="text-sm font-medium text-gray-700 mb-2">Didn't receive the email?</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Check your spam/junk folder</li>
              <li>• Make sure the email address is correct</li>
              <li>• Wait a few minutes and try again</li>
            </ul>
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full btn-primary"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  )
}
