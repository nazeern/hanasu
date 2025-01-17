import csv
from dataclasses import dataclass
import json
import xml.etree.ElementTree as ET
from pydantic import BaseModel

VERBOSE = True

XML_PATH = "/Users/nitinnazeer/Documents/hanashi/JMdict_e_examp.xml"
CSV_PATH = "/Users/nitinnazeer/Documents/hanashi/ja.csv"

class Definition(BaseModel):
    parts_of_speech: list[str]
    tags: list[str]
    meanings: list[str]
    see_also: str

    example_ja: str
    example_en: str

class WordRecord(BaseModel):
    id: int
    word: str
    featured: set[str]
    readings: list[str]
    definitions: list[Definition]

def xml_to_csv(xml_path):
    xml = ET.parse(xml_path)
    root = xml.getroot()

    with open(CSV_PATH, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        header = ["id", "word", "featured", "readings", "definitions"]
        writer.writerow(header)

        for i, entry in enumerate(root):

            record = WordRecord(
                id=-1,
                word="",
                featured=set(),
                readings=[],
                definitions=[]
            )

            # The unique id of the record
            record.id = int(entry.find('ent_seq').text)

            # The word that defines the record
            for k_ele in entry.findall('k_ele'):
                keb = k_ele.find('keb')
                ke_pri = k_ele.find('ke_pri')
                if keb is not None:
                    record.readings.append(keb.text)
                if ke_pri is not None:
                    record.featured.add(ke_pri.text)

            for r_ele in entry.findall('r_ele'):
                reb = r_ele.find('reb')
                re_pri = r_ele.find('re_pri')
                if reb is not None:
                    record.readings.append(reb.text)
                if re_pri is not None:
                    record.featured.add(re_pri.text)

            record.word = record.readings[0]


            for sense in entry.findall('sense'):
                definition = Definition(
                    parts_of_speech=[],
                    tags=[],
                    meanings=[],
                    see_also="",
                    example_ja="",
                    example_en=""
                )
                for pos in sense.findall('pos'):
                    definition.parts_of_speech.append(pos.text)
                for misc in sense.findall('misc'):
                    definition.tags.append(misc.text)
                for gloss in sense.findall('gloss'):
                    definition.meanings.append(gloss.text)
                example = sense.find('example')
                if example is not None:
                    definition.example_ja = example.findall('ex_sent')[0].text
                    definition.example_en = example.findall('ex_sent')[1].text
                xref = sense.find('xref')
                if xref is not None:
                    definition.see_also = xref.text

                record.definitions.append(definition)

            if i % 100 == 0:
                print(f"Processed {i} entries")
                print(record)
            
            writer.writerow([
                record.id,
                record.word,
                json.dumps(list(record.featured)),
                json.dumps(record.readings),
                json.dumps([d.model_dump() for d in record.definitions])
            ])


if __name__ == "__main__":
    xml_to_csv(XML_PATH)