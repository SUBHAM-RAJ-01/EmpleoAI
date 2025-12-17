import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NewApplicationClient from '@/components/applications/NewApplicationClient'

export default async function NewApplicationPage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/auth/login')
  }

  return <NewApplicationClient user={user} />
}
