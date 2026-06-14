import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
)

async function check() {
  const { data, error } = await supabase.from('deployed_projects').insert([{
    project_name: 'test',
    local_url: 'http://localhost',
    web_url: 'http://test.com',
    default_user: 'admin',
    account_info: 'test account',
    created_at: new Date().toISOString()
  }]).select()
  if (error) {
    console.error("Error inserting:", error)
  } else {
    console.log("Success inserting:", data)
    await supabase.from('deployed_projects').delete().eq('id', data[0].id)
    console.log("Cleaned up")
  }
}
check()
