import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://cwijbprkkzxydvagilos.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3aWpicHJra3p4eWR2YWdpbG9zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzc0Nzc4NCwiZXhwIjoyMDkzMzIzNzg0fQ.qnJbqfl39OsNpn_cGyrU-RfLHOFJl0NUdEiAu7Ky8Wg'
)

async function check() {
  const { data, error } = await supabase.from('standalone_links').insert([{ invalid_column: 'test' }])
  console.log('Error', error)
}

check()
