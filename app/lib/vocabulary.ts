'use server'

import { Tables } from "@/database.types"
import { createClient } from "@/utils/supabase/server"

export async function selectVocabulary(userId: string, wordIds: number[]): Promise<Tables<'vocabulary'>[]> {
    if (!userId || !wordIds.length) {
        return []
    }
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('vocabulary')
        .select('*')
        .eq('user_id', userId)
        .in('word_id', wordIds)
    if (error) {
        console.log(error)
        return []
    } else {
        return data
    }
}

export async function insertVocabulary(userId: string, wordId: number): Promise<boolean> {
    if (!userId || !wordId) {
        return false
    }
    const supabase = await createClient()
    const { error } = await supabase
        .from('vocabulary')
        .insert([{user_id: userId, word_id: wordId}])
    if (error) {
        console.log(error)
        return false
    } else {
        return true
    }
}

export async function deleteVocabulary(userId: string, wordId: number): Promise<boolean> {
    if (!userId || !wordId) {
        return false
    }
    const supabase = await createClient()
    const { error } = await supabase
        .from('vocabulary')
        .delete()
        .eq('user_id', userId)
        .eq('word_id', wordId)
    if (error) {
        console.log(error)
        return false
    } else {
        return true
    }
}

export async function selectLowestScoreVocabulary(userId: string, exclude: number = -1): Promise<Tables<'vocabulary'> | null> {
    if (!userId) { return null }
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('vocabulary')
        .select('*')
        .eq('user_id', userId)
        .neq('word_id', exclude)
        .order('score')
        .limit(1)
        .single()
    if (!data) {
        console.log(error)
        return null
    } else {
        return data
    }
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