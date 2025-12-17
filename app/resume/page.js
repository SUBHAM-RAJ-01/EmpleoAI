import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ResumeClient from '@/components/resume/ResumeClient'

export default async function ResumePage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/auth/login')
  }

  const { data: resumes } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: tailoredResumes } = await supabase
    .from('tailored_resumes')
    .select('*, applications(company, role)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  return <ResumeClient user={user} resumes={resumes || []} tailoredResumes={tailoredResumes || []} />
}
