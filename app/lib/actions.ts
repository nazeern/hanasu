'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { AuthApiError } from '@supabase/supabase-js'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  const params = new URLSearchParams();
  if (error) {
    const errorString = "Incorrect username or password. Please try again.";
    params.set('error', errorString)
    redirect(`/login?${params.toString()}`)
  }

  revalidatePath('/', 'layout')

  const redirectTo = formData.get('redirectTo') as string
  if (redirectTo) {
    redirect(redirectTo)
  } else {
    redirect('/app')
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const nameInput = formData.get('name') as string
  const loginData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // attempt login, existing users redirect to /projects
  const { error: loginError } = await supabase.auth.signInWithPassword(loginData)
  if (!loginError) {
    redirect('/app')
  }

  // signup
  const signUpData = {
    ...loginData,
    options: {
      data: {
        name: nameInput,
      }
    }
  }
  const { error } = await supabase.auth.signUp(signUpData)


  const params = new URLSearchParams();
  // on error, return with message
  if (error instanceof AuthApiError) {
    console.log(error)
    const errorString = "Oops, account creation failed!"
    params.set('error', errorString)
    redirect(`/sign-up?${params.toString()}`)
  }
  revalidatePath('/', 'layout')

  // new user, redirect to login with message
  const redirectTo = formData.get('redirectTo') as string
  if (redirectTo) {
    redirect(redirectTo)
  } else {
    params.set('success', 'Congrats! Check your inbox for a confirmation email.')
    params.set('redirectTo', '/pricing')
    redirect(`/login?${params.toString()}`)
  }
}


/** Ask OpenAI for an ephemeral token.
 * We can use the ephemeral token on the client to create a session. */
export async function mintEphemeralToken() {
  const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-realtime-preview-2024-12-17",
      voice: "verse",
      input_audio_transcription: {
        model: "whisper-1",
      },
      max_response_output_tokens: 200,
    }),
  })
  const data = await r.json()

  return data.client_secret.value
}