import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function TestSupabasePage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Verify connection by fetching projects (might be empty)
  const { data: projects, error } = await supabase.from('projects').select('*').limit(5)

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Supabase Connection Error</h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Supabase Connection Successful!</h1>
      <p>Fetched {projects?.length || 0} projects.</p>
      <ul>
        {projects?.map((project) => (
          <li key={project.id}>{project.name}</li>
        ))}
      </ul>
      <hr />
      <p>This page uses the Supabase Server Client with Next.js App Router.</p>
    </div>
  )
}
