'use server'

import { createClient } from "@/utils/supabase/server";
import { TranslationServiceClient } from "@google-cloud/translate";
import { google } from "googleapis";

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