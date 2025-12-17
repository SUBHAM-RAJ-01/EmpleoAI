import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ApplicationsClient from '@/components/applications/ApplicationsClient'

export default async function ApplicationsPage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/auth/login')
  }

  const { data: applications } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return <ApplicationsClient user={user} initialApplications={applications || []} />
}
