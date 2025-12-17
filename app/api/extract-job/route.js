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

    console.log('Extracting job from email, content length:', emailContent.length)
    
    const jobData = await extractJobFromEmail(emailContent)
    
    console.log('Job data extracted:', jobData)

    return NextResponse.json(jobData)
  } catch (error) {
    console.error('Error in extract-job API:', error)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    
    return NextResponse.json(
      { error: error.message || 'Failed to extract job details' },
      { status: 500 }
    )
  }
}
