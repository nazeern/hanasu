'use server'

import { createClient } from "@/utils/supabase/server"
import kuromoji from "kuromoji";
import { Interval } from "@/app/ui/rtc-main-app";
import path from "path";

const featureRanking = ['ichi1', 'news1', 'spec1', 'ichi2', 'news2', 'spec2']

export type Definition = {
    parts_of_speech: string[]
    tags: string[]
    meanings: string[]
    see_also: string

    example_ja: string
    example_en: string
}

export type Entry = {
    definitions: Definition[];
    featured: string[];
    id: number;
    readings: string[];
    word: string;
    saved?: boolean;
}

/** Positive if a > b, negative if b > a, else 0 */
function compareEntries(a: Entry, b: Entry, word: string): number {
    if (a.word == word) {
        return -1
    }
    if (b.word == word) {
        return 1
    }

    if (!a.featured || !b.featured) { return 0 }
    if (!a.featured.length && !b.featured.length) { return 0 }
    if (!a.featured.length) { return 1 }
    if (!b.featured.length) { return -1 }
    const aRank = Math.max(...a.featured.map((f) => featureRanking.indexOf(f)))
    const bRank = Math.max(...b.featured.map((f) => featureRanking.indexOf(f)))

    if (aRank == bRank) {
        const aKana = a.definitions[0].tags[0]?.includes('kana')
        const bKana = b.definitions[0].tags[0]?.includes('kana')
        if (!aKana && !bKana) { return 0 }
        if (!aKana) { return 1 }
        if (!bKana) { return -1 }
    }

    return aRank - bRank
}

const tokenizer = new Promise((resolve, reject) => {
    kuromoji.builder({ dicPath: path.join(process.cwd(), 'public/dict/') }).build((err: any, tokenizer: any) => {  // eslint-disable-line
      if (err) reject(err);
      else resolve(tokenizer);
    });
  });

export async function selectJa(sentence: string, tap: number): Promise<[Entry[] | null, Interval | null]> {
    console.log(sentence, tap)
    const tokens = (await tokenizer as any).tokenize(sentence)  // eslint-disable-line
    if (!tokens) { return [null, null] }
    const token = tokens.find((t: any, i: number) => {  // eslint-disable-line
        const pos = t.word_position - 1  // off by one
        const parsed = t.surface_form
        return pos <= tap && tap < pos + parsed.length
    })
    if (!token) { return [null, null] }
    console.log(token)
    const pos = token.word_position - 1
    const parsed = token.surface_form

    const supabase = await createClient()
    const {data, error} = await supabase
        .from('ja_dict')
        .select('*')
        .or(`word.eq.${token.surface_form}, readings.cs.{${token.basic_form}}`)
    if (!data) {
        console.log(error)
        return [null, null]
    } else {
        return [
            (data as Entry[]).sort((a, b) => compareEntries(a, b, token.surface_form)),
            {start: pos, end: pos + parsed.length},
        ]
    }
}

export async function selectIdJa(wordId?: number): Promise<Entry | null> {
    if (!wordId) { return null }
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('ja_dict')
        .select()
        .eq('id', wordId)
        .single()
    if (!data) {
        console.log(error)
        return null
    } else {
        return (data as Entry)
    }
}