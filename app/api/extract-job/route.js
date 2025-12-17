import { NextResponse } from 'next/server'
import { extractJobFromEmail } from '@/lib/gemini'

export async function POST(request) {
  try {
    const { emailContent } = await request.json()

    if (!emailContent) {
      return NextResponse.json(
        { error: 'Email content is required' },
        { status: 400 }
      )
    }

    const jobData = await extractJobFromEmail(emailContent)

    return NextResponse.json(jobData)
  } catch (error) {
    console.error('Error in extract-job API:', error)
    return NextResponse.json(
      { error: 'Failed to extract job details' },
      { status: 500 }
    )
  }
}
