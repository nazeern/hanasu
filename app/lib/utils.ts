import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";


export function makeid(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function nestedListAt(index: number, lists: any[][]): [number, any] { // eslint-disable-line
  let curr: number = 0;
  while (curr < lists.length && index >= lists[curr].length) {
    index -= lists[curr].length
    curr++
  }
  return [curr, lists[curr][index]]
}

export function delay(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

export function range(start: number = 0, end: number): number[] {
  if (Number.isNaN(start) || Number.isNaN(end)) {
    return []
  }
  const vals = []
  for (let i = start; i <= end; i++) {
    vals.push(i)
  }
  return vals
}

export function changeExtension(filename: string, to: string): string {
  const dotIndex = filename.lastIndexOf(".");
  if (dotIndex === -1) {
    // If there is no extension, just append .mp3
    return filename + "." + to;
  } else {
    // Replace the current extension with .mp3
    return filename.substring(0, dotIndex) + "." + to;
  }
}

export function closeTo(a: number, b: number, dist: number) {
  return Math.abs(b - a) < dist
}

export function timeString(totalSeconds: number): string {
  if (totalSeconds == 0) {
    return "0s"
  }
  const rounded = round(totalSeconds, 1)
  const minutes = Math.floor(rounded / 60)
  const seconds = totalSeconds <= 0.94 ? round(rounded % 60, 1) : round(rounded % 60, 0)

  const output = []
  if (minutes) {
    output.push(minutes.toString() + "m")
  }
  if (seconds) {
    output.push(seconds.toString() + "s")
  }
  return output.join(' ')
}

export function timestampString(dateString: string) {
  const date = new Date(dateString)
  return date.toDateString()
}

const PER_MINUTE_RATE = 0.08
export function calculateCost(totalMinutesTranscribed: number) {
  return round(PER_MINUTE_RATE * totalMinutesTranscribed)
}

export function round(value: number, n: number = 2) {
  return parseFloat(value.toFixed(n))
}

export function currencyString(value: number) {
  return "$" + round(value / 100).toString()
}

export function extractFilename(filename: string): string {
  return filename.slice(filename.indexOf("_") + 1)
}

export function bound(low: number = -Infinity, val: number, high: number = Infinity): number {
  return Math.min(Math.max(low, val), high)
}

export function sentenceCase(val: string): string {
  return val.charAt(0).toUpperCase() + val.slice(1)
}