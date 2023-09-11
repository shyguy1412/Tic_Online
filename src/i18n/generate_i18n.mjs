import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";

// import file from "./i18n.json" assert { type: "json" };

const i18n = JSON.parse((await readFile('./src/i18n/i18n.json')).toString());

const output = { en: {} };
for (const [english, translations] of Object.entries(i18n)) {
  output['en'][english] = english;
  for (const [language, translation] of Object.entries(translations)) {
    output[language] ??= {};
    output[language][english] = translation;
  }
}

if (!existsSync('./src/public/i18n/')) {
  await mkdir('./src/public/i18n/');
}

for (const key in output) {
  await writeFile(`./src/public/i18n/${key}.json`, JSON.stringify(output[key], null, 2));
}