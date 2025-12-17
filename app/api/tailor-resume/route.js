import { NextResponse } from 'next/server'
import { tailorResume } from '@/lib/gemini'
import { createClient } from '@/lib/supabase/server'

export async function POST(request) {
  try {
    const { resumeId, applicationId } = await request.json()

    if (!resumeId || !applicationId) {
      return NextResponse.json(
        { error: 'Resume ID and Application ID are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get resume content
    const { data: resume } = await supabase
      .from('resumes')
      .select('content')
      .eq('id', resumeId)
      .single()

    // Get job description
    const { data: application } = await supabase
      .from('applications')
      .select('description, requirements, role')
      .eq('id', applicationId)
      .single()

    if (!resume || !application) {
      return NextResponse.json(
        { error: 'Resume or application not found' },
        { status: 404 }
      )
    }

    const jobDescription = `${application.role}\n\n${application.description}\n\nRequirements: ${application.requirements}`

    // Get AI suggestions
    const analysis = await tailorResume(resume.content, jobDescription)

    // Save tailored resume metadata (not the full content to save storage)
    const { data: { user } } = await supabase.auth.getUser()
    
    await supabase.from('tailored_resumes').insert({
      user_id: user.id,
      application_id: applicationId,
      resume_id: resumeId,
      score: analysis.score,
      keywords: analysis.keywords,
      suggestions: analysis.suggestions,
    })

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error in tailor-resume API:', error)
    return NextResponse.json(
      { error: 'Failed to tailor resume' },
      { status: 500 }
    )
  }
}
