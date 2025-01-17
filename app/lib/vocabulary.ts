'use server'

import { Tables } from "@/database.types"
import { createClient } from "@/utils/supabase/server"

export async function selectVocabulary(userId: string, wordIds: number[], lang: string): Promise<Tables<'vocabulary'>[]> {
    if (!userId || !wordIds.length) {
        return []
    }
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('vocabulary')
        .select('*')
        .eq('user_id', userId)
        .eq('lang', lang)
        .in('word_id', wordIds)
    if (error) {
        console.log(error)
        return []
    } else {
        return data
    }
}

export async function insertVocabulary(userId: string, wordId: number, lang: string): Promise<boolean> {
    if (!userId || !wordId) {
        return false
    }
    const supabase = await createClient()
    const { error } = await supabase
        .from('vocabulary')
        .insert([{user_id: userId, word_id: wordId, lang: lang}])
    if (error) {
        console.log(error)
        return false
    } else {
        return true
    }
}

export async function deleteVocabulary(userId: string, wordId: number, lang: string): Promise<boolean> {
    if (!userId || !wordId) {
        return false
    }
    const supabase = await createClient()
    const { error } = await supabase
        .from('vocabulary')
        .delete()
        .eq('user_id', userId)
        .eq('word_id', wordId)
        .eq('lang', lang)
    if (error) {
        console.log(error)
        return false
    } else {
        return true
    }
}

export async function selectDueVocabulary(userId: string, lang: string): Promise<Tables<'vocabulary'> | null> {
    if (!userId) { return null }

    const now = new Date().toISOString()

    const supabase = await createClient()
    const { data } = await supabase
        .from('vocabulary')
        .select('*')
        .eq('user_id', userId)
        .eq('lang', lang)
        .lt('due', now)
        .limit(1)
        .single()
    if (data) {
        console.log("found due word")
        return data
    }

    return null
}

export async function selectWarmupVocabulary(userId: string, lang: string): Promise<Tables<'vocabulary'>[]> {
    const supabase = await createClient()
    const { data } = await supabase
        .from('vocabulary')
        .select('*')
        .eq('user_id', userId)
        .eq('lang', lang)
        .order('due', { ascending: true })
        .limit(10)
    if (data) {
        console.log("fetch random words")
        return data
    }
    return []
}

export async function updateVocabulary(record: Tables<'vocabulary'> | null): Promise<boolean> {
    if (!record) { return false }
    const supabase = await createClient()
    const { error } = await supabase
        .from('vocabulary')
        .update(record)
        .eq('id', record.id)
    if (error) {
        console.log(error)
        return false
    } else {
        return true
    }
}