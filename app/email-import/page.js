import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EmailImportClient from '@/components/email/EmailImportClient'

export default async function EmailImportPage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/auth/login')
  }

  return <EmailImportClient user={user} />
}
