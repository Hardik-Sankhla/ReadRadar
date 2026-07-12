import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resourcesPath = path.join(__dirname, '../src/data/resources.json');
const journeysPath = path.join(__dirname, '../src/data/journeys.json');

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const mapTagsToSkills = (tags: string[]) => {
  const skillIds: string[] = [];
  const map: Record<string, string> = {
    'python': 'KA-SKIL-PYTHON',
    'pytorch': 'KA-SKIL-PYTORCH',
    'machine-learning': 'KA-SKIL-CLASSICAL-ML',
    'deep-learning': 'KA-SKIL-DEEP-LEARNING',
    'llm': 'KA-SKIL-TRANSFORMERS',
    'nlp': 'KA-SKIL-NLP-BASICS',
    'rag': 'KA-SKIL-RAG'
  };

  if (!tags) return [];
  for (const tag of tags) {
    const slug = slugify(tag);
    if (map[slug]) {
      if (!skillIds.includes(map[slug])) skillIds.push(map[slug]);
    }
  }
  return skillIds;
};

if (fs.existsSync(resourcesPath)) {
  const resources = JSON.parse(fs.readFileSync(resourcesPath, 'utf8'));
  let updated = 0;
  resources.forEach((res: any) => {
    if (!res.edges) res.edges = {};
    const extractedSkills = mapTagsToSkills(res.tags);
    res.edges.TEACHES = Array.from(new Set([...(res.edges.TEACHES || []), ...extractedSkills]));
    updated++;
  });
  fs.writeFileSync(resourcesPath, JSON.stringify(resources, null, 2));
  console.log(`Updated ${updated} resources with TEACHES edges.`);
}

if (fs.existsSync(journeysPath)) {
  const journeys = JSON.parse(fs.readFileSync(journeysPath, 'utf8'));
  let updated = 0;
  journeys.forEach((jurn: any) => {
    if (!jurn.edges) jurn.edges = {};
    if (!jurn.edges.TEACHES) jurn.edges.TEACHES = [];
    updated++;
  });
  fs.writeFileSync(journeysPath, JSON.stringify(journeys, null, 2));
  console.log(`Updated ${updated} journeys with TEACHES edges.`);
}
