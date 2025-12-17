import { NextResponse } from 'next/server'
import { tailorResume } from '@/lib/gemini'
import { createClient } from '@/lib/supabase/server'

export async function POST(request) {
  try {
    const { resumeId, applicationId } = await request.json()

    console.log('📝 Tailor request:', { resumeId, applicationId })

    if (!resumeId || !applicationId) {
      return NextResponse.json(
        { error: 'Resume ID and Application ID are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get resume content
    const { data: resume, error: resumeError } = await supabase
      .from('resumes')
      .select('id, name, content')
      .eq('id', resumeId)
      .single()

    if (resumeError) {
      console.error('❌ Resume fetch error:', resumeError)
      return NextResponse.json(
        { error: 'Failed to fetch resume' },
        { status: 500 }
      )
    }

    // Get job description
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select('description, requirements, role, company')
      .eq('id', applicationId)
      .single()

    if (appError) {
      console.error('❌ Application fetch error:', appError)
      return NextResponse.json(
        { error: 'Failed to fetch application' },
        { status: 500 }
      )
    }

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      )
    }

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    // Check if resume has actual content
    const resumeContent = resume.content || ''
    console.log('📄 Resume:', resume.name, '- Content length:', resumeContent.length)

    if (!resumeContent || resumeContent.length < 50) {
      return NextResponse.json(
        { error: 'Resume content is empty or too short. Please upload a resume with actual content (use .txt file for best results).' },
        { status: 400 }
      )
    }

    // Check if content looks like actual resume text
    if (resumeContent.includes('PDF content extraction requires additional setup')) {
      return NextResponse.json(
        { error: 'This resume was uploaded before PDF parsing was enabled. Please delete it and upload again.' },
        { status: 400 }
      )
    }

    // Build job description
    const jobDescription = [
      `Company: ${application.company || 'Unknown'}`,
      `Role: ${application.role || 'Unknown'}`,
      '',
      'Description:',
      application.description || 'No description provided',
      '',
      'Requirements:',
      application.requirements || 'No requirements provided'
    ].join('\n')

    console.log('📋 Job description length:', jobDescription.length)

    // Get AI suggestions
    const analysis = await tailorResume(resumeContent, jobDescription)

    console.log('✅ Analysis complete:', { score: analysis.score })

    // Save tailored resume metadata
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      await supabase.from('tailored_resumes').insert({
        user_id: user.id,
        application_id: applicationId,
        resume_id: resumeId,
        score: analysis.score,
        keywords: analysis.keywords,
        suggestions: analysis.suggestions,
      })
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('❌ Error in tailor-resume API:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to tailor resume. Please try again.' },
      { status: 500 }
    )
  }
}
