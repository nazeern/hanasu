'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { AuthApiError } from '@supabase/supabase-js'
import { sentenceCase } from '@/app/lib/utils'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      captchaToken: formData.get('captchaToken') as string,
    }
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  const params = new URLSearchParams();
  if (error) {
    console.log(error)
    const errorString = "Incorrect username or password. Please try again.";
    params.set('error', errorString)
    redirect(`/login?${params.toString()}`)
  }

  revalidatePath('/', 'layout')

  const redirectTo = formData.get('redirectTo') as string
  if (redirectTo) {
    redirect(redirectTo)
  } else {
    redirect('/dashboard')
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const nameInput = formData.get('name') as string
  const langInput = formData.get('lang') as string
  const captchaToken = formData.get('captchaToken') as string
  const loginData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      captchaToken: captchaToken,
    }
  }

  // attempt login, existing users redirect to /dashboard
  const { error: loginError } = await supabase.auth.signInWithPassword(loginData)
  if (!loginError) {
    console.log(loginError)
    redirect('/dashboard')
  }

  // signup
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const emailRedirectTo = baseUrl ? `${baseUrl}/dashboard` : undefined
  const signUpData = {
    ...loginData,
    options: {
      data: {
        name: nameInput,
        lang: langInput,
      },
      emailRedirectTo: emailRedirectTo,
      captchaToken: captchaToken,
    }
  }
  const { error } = await supabase.auth.signUp(signUpData)


  const params = new URLSearchParams();
  // on error, return with message
  if (error instanceof AuthApiError) {
    console.log(error)
    params.set('error', sentenceCase(error.message))
    redirect(`/sign-up?${params.toString()}`)
  }
  revalidatePath('/', 'layout')

  // new user, redirect to login with message
  params.set('success', 'Congrats! Check your inbox for a confirmation email.')
  params.set('redirectTo', '/dashboard')
  redirect(`/login?${params.toString()}`)
}


export async function anonSignup(captchaToken?: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInAnonymously({
    options: {
      captchaToken: captchaToken,
      data: {
        name: "Guest",
      }
    }
  })
  const params = new URLSearchParams()
  if (error) {
    console.log(error)
    params.set('error', sentenceCase(error.message))
    redirect(`/sign-up?${params.toString()}`)
  }
  revalidatePath('/', 'layout')
  redirect("/dashboard")
}


/** Ask OpenAI for an ephemeral token.
 * We can use the ephemeral token on the client to create a session. */
export async function mintEphemeralToken(lang: string) {
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
        language: lang.slice(0, 2),
      },
      max_response_output_tokens: 300,
    }),
  })
  const data = await r.json()
  console.log(data)

  return data.client_secret.value
}