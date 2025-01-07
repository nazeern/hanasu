'use server'

import { createClient } from "@/utils/supabase/server"
import { ChatMessageData } from "../ui/chat"
import { decodeBase64UUID } from "./string"
import { Session, TokenUsage } from "@/app/ui/rtc-main-app";

const startingTokenUsage: TokenUsage = {
  audio: {
    input: 0,
    output: 0,
    input_cached: 0,
  },
  text: {
    input: 0,
    output: 0,
    input_cached: 0,
  },
};

/** Create a record in the `sessions` table. Returns the session `id` of the record. */
export async function insertSession(userId: string, lang: string): Promise<string> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('sessions')
        .insert([{ 
            user_id: userId,
            lang: lang,
        }])
        .select()
    if (!data) {
        console.log(error)
        return ""
    } else {
        return data[0].id
    }
}

/** Update the matching record in the `sessions` table. */
export async function updateSession(session: Session, chatMessages: ChatMessageData[]): Promise<boolean> {
    if (!session.id) {
        return false
    }
    const supabase = await createClient()

    const { error } = await supabase
        .from('sessions')
        .update({
            topic: session.topic,
            token_usage: session.tokenUsage,
            n_responses: session.nResponses,
            avg_response_duration_ms: Math.round(session.avgResponseDurationMs),
            chat_messages: chatMessages.map(({id, from, content}) => ({id, from, content})),
            duration: session.duration,
        })
        .eq('id', session.id)
        .select()
    
    if (error) {
        console.log(error)
        return false
    } else {
        return true
    }
}

export async function querySession(sessionId: string): Promise<[Session | null, ChatMessageData[]]> {
    if (!sessionId) {
        return [null, []]
    }
    const sessionUuid = decodeBase64UUID(sessionId)

    const supabase = await createClient()
    const {data, error} = await supabase
        .from('sessions')
        .select('*')
        .eq('id', sessionUuid)
        .single()

    if (!data) {
        console.log(error)
        return [null, []]
    } else {
        return [{
            id: data.id,
            userId: data.user_id,
            topic: data.topic ?? undefined,
            tokenUsage: (data.token_usage as TokenUsage | null) ?? startingTokenUsage,
            nResponses: data.n_responses ?? 0,
            avgResponseDurationMs: data.avg_response_duration_ms ?? 0,
            duration: data.duration ?? 0,
            lang: data.lang,
        }, (data.chat_messages ?? []) as ChatMessageData[]]
    }
}

export async function querySessions(userId: string): Promise<Session[]> {
    if (!userId) {
        return []
    }

    const supabase = await createClient()
    const {data, error} = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', userId)

    if (!data) {
        console.log(error)
        return []
    } else {
        return data.map((s) => ({
            id: s.id,
            userId: s.user_id,
            topic: s.topic ?? undefined,
            tokenUsage: (s.token_usage as TokenUsage | null) ?? startingTokenUsage,
            nResponses: s.n_responses ?? 0,
            avgResponseDurationMs: s.avg_response_duration_ms ?? 0,
            duration: s.duration ?? 0,
            lang: s.lang,
        }))
    }
}

const oaiPricePerMil: TokenUsage = {
    audio: {
        input: 10000,
        output: 20000,
        input_cached: 2000,
    },
    text: {
        input: 500,
        output: 2000,
        input_cached: 250,
    },
}

export async function totalCost(sessions: Session[]): Promise<number | null> {
    return sessions.reduce((acc, { tokenUsage }) => {
        return acc + 
        tokenUsage.audio.input * oaiPricePerMil.audio.input +
        tokenUsage.audio.output * oaiPricePerMil.audio.output +
        tokenUsage.audio.input_cached * oaiPricePerMil.audio.input_cached +
        tokenUsage.text.input * oaiPricePerMil.text.input +
        tokenUsage.text.output * oaiPricePerMil.text.output +
        tokenUsage.text.input_cached * oaiPricePerMil.text.input_cached
    }, 0) / 1_000_000
}