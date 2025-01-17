import csv
from dataclasses import dataclass


U8_FILEPATH = "/Users/nitinnazeer/Downloads/cedict_ts.u8"
CSV_FILEPATH = "/Users/nitinnazeer/Downloads/zh-CN.csv"
LIMIT = float('inf')

@dataclass
class Entry:
    word: str
    pinyin: str
    definition: str

def parse_line(line) -> Entry:
    parsed = {}
    if line == '':
        return None

    line = line.rstrip('/')
    line = line.split('/')
    if len(line) <= 1:
        return None
    english = line[1]
    char_and_pinyin = line[0].split('[')
    characters = char_and_pinyin[0]
    characters = characters.split()
    traditional = characters[0]
    simplified = characters[1]
    pinyin = char_and_pinyin[1]
    pinyin = pinyin.rstrip()
    pinyin = pinyin.rstrip("]")
    parsed['word'] = simplified
    parsed['pinyin'] = pinyin
    parsed['definition'] = english
    return Entry(**parsed)

if __name__ == "__main__":
    with open(U8_FILEPATH) as u8_file, open(CSV_FILEPATH, mode='w', newline='', encoding='utf-8') as csv_file:
        writer = csv.writer(csv_file)
        header = ["word", "pinyin", "definition"]
        writer.writerow(header)

        for i, line in enumerate(u8_file):
            if i >= LIMIT:
                break
            entry = parse_line(line)
            if entry:
                writer.writerow([
                    entry.word,
                    entry.pinyin,
                    entry.definition,
                ])
            if i % 1000 == 0:
                print(entry)


# list_of_dicts = []
# parsed_dict = main()