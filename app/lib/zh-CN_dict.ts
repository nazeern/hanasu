'use server'

import { createClient } from "@/utils/supabase/server"
import { Interval } from "../ui/rtc-main-app"
import { Entry } from "./data"
import { Jieba } from '@node-rs/jieba'
import { dict } from '@node-rs/jieba/dict'

const jieba = Jieba.withDict(dict)

export async function selectZh(sentence: string, tap: number): Promise<[Entry[] | null, Interval | null]> {
    const tokens = jieba.cut(sentence, false)
    if (!tokens) { return [null, null] }
    let parsed: Interval = {};
    let start = 0;
    let end;
    for (const t of tokens) {
        end = start + t.length;
        if (start <= tap && tap < end) {
            parsed = { start, end }
            break;
        }
        start = end
    }
    if (parsed.start == undefined || !parsed.end == undefined) { return [null, null] }
    const token = sentence.slice(parsed.start, parsed.end)

    const supabase = await createClient()
    const {data, error} = await supabase
        .from('zh-CN_dict')
        .select('*')
        .eq('word', token)
    if (!data) {
        console.log(error)
        return [null, null]
    } else {
        return [
            data.map((entry) => ({
                definitions: [{
                    parts_of_speech: [],
                    tags: [],
                    meanings: [entry.definition],
                    see_also: "",
                    example_ja: "",
                    example_en: "",
                }],
                featured: [],
                id: entry.id,
                readings: [entry.pinyin],
                word: entry.word,
            })),
            parsed,
        ]
    }
}

export async function idSelectZh(wordId?: number): Promise<Entry | null> {
    if (!wordId) { return null }
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('zh-CN_dict')
        .select()
        .eq('id', wordId)
        .single()
    if (!data) {
        console.log(error)
        return null
    } else {
        return {
            definitions: [{
                parts_of_speech: [],
                tags: [],
                meanings: [data.definition],
                see_also: "",
                example_ja: "",
                example_en: "",
            }],
            featured: [],
            id: data.id,
            readings: [data.pinyin],
            word: data.word,
        }
    }
}