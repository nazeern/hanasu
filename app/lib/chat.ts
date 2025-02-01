'use server'

import { createClient } from "@/utils/supabase/server";
import { TranslationServiceClient } from "@google-cloud/translate";
import { google } from "googleapis";
import OpenAI from "openai";
import { langInfo } from "@/app/lib/data";

const openai = new OpenAI()

const projectId = process.env.GOOGLE_PROJECT_ID;
const location = 'global';

const romanizeTextUrl = `https://translation.googleapis.com/v3/projects/${projectId}/locations/${location}:romanizeText`

// Instantiates a client
const translationClient = new TranslationServiceClient({
    projectId: process.env.GOOGLE_PROJECT_ID ?? "",
    credentials: {
        client_email: process.env.GOOGLE_TRANSLATE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_TRANSLATE_PRIVATE_KEY,
    }
});

export async function translateText(text: string, lang?: string): Promise<string> {
  // Construct request
  const request = {
    parent: `projects/${projectId}/locations/${location}`,
    contents: [text],
    mimeType: "text/plain", // mime types: text/plain, text/html
    sourceLanguageCode: lang,
    targetLanguageCode: "en",
  };

  // Run request
  const [response] = await translationClient.translateText(request);
  if (!response.translations) {
    alert("Translation failed.");
    return ""
  }

  for (const translation of response.translations) {
    return translation.translatedText ?? ""
  }

  return ""
}

export async function romanizeText(text: string, userId: string, lang?: string): Promise<string> {
    console.log("called romanizeText")

    console.log("QUERY ACCESS TOKEN")
    const supabase = await createClient()
    const { data } = await supabase
        .from("profiles")
        .select("google_access_token")
        .eq('id', userId)
        .single()
    if (!data) {
        return ""
    }
    const { google_access_token } = data

    console.log("FETCH ROMANIZE TEXT")
    const jsonBody = {
        "source_language_code": lang,
        "contents": [text],
    }
    try {
        let response;
        response = await fetch(romanizeTextUrl, {
            method: 'POST', // HTTP method
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + google_access_token
            },
            body: JSON.stringify(jsonBody), // Convert the JavaScript object to JSON
        });
        if (!response.ok) {
            console.log("Fetch romanize text failed.")
            const new_access_token = await newGoogleToken(userId, process.env.GOOGLE_REFRESH_TOKEN ?? "")
            response = await fetch(romanizeTextUrl, {
                method: 'POST', // HTTP method
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + new_access_token
                },
                body: JSON.stringify(jsonBody), // Convert the JavaScript object to JSON
            });
        }
        const jsonResponse = await response.json(); // Parse the JSON response
        console.log("RECEIVED JSON RESPONSE")
        console.log(jsonResponse)

        return jsonResponse?.romanizations?.[0]?.romanizedText ?? text
    } catch (error) {
        console.log(error)
        return text
    }
}

/** Given refresh token, (1) get new access token (2) write to DB and (3) return. */
export async function newGoogleToken(userId: string, refreshToken: string): Promise<string> {
    console.log("REFRESH GOOGLE ACCESS TOKEN")
    let access_token: string | null;
    try {
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
        )
    
        oauth2Client.setCredentials({
            refresh_token: refreshToken
        })
        const tokens = await oauth2Client.refreshAccessToken();
        access_token = tokens.credentials.access_token ?? null

    } catch (error) {
        console.log(error)
        console.log("Failed to refresh google access token.")
        return ""
    }

    // Attempt insert to DB
    console.log("SAVING GOOGLE ACCESS TOKENS")
    const supabase = await createClient()
    const saveTokensPromise = supabase
        .from("profiles")
        .update({ google_access_token: access_token })
        .eq('id', userId)
    saveTokensPromise.then(({ error }) => error && console.log("Failed to save google tokens to DB."))

    // Return
    return access_token ?? ""
}

/** Return grammar advice for the given SENTENCE. */
export async function grammarAssist(sentence: string, lang: string): Promise<string> {
    const langName = langInfo.find((info) => info.lang == lang)?.name
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {role: "system", content: `You are a helpful and polite ${langName} language assistant, helping users learn & improve.
            Analyze the text below for usage issues or unnatural phrases.
            If you see an improvement to be made, respond with a short and brief explanation or correction.
            If the sentence is reasonably correct, respond with an empty string.
            Do not provide any additional commentary or preamble. Do not provide pronunciation advice. Do not translate.
            Only respond in English, even if encountering a different language.
            ` },
            {
                role: "user",
                content: sentence,
            },
        ],
        store: true,
        temperature: 0,
        max_completion_tokens: 500,
    });

    const response = completion.choices[0].message.content?.trim() ?? ""
    if (response.length < 36) {
        return ""
    }

    return response
}