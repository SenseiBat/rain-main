import xmltodict
import json

xml_path= "tours.xml"
json_path = "tours.json"

with open(xml_path, "r", encoding="utf-8") as f:
    xml_content = f.read()

data  = xmltodict.parse(xml_content)
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)