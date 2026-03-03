/**
 * 🏭 AI vs HUMAN FACTORY: MASTER SEEDER SCRIPT (ROBUST & RATE-LIMITED)
 * 
 * Usage: node scripts/seed.js
 * Stop: Press Ctrl + C to exit
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
dotenv.config({ path: '.env.local' });

// --- Dynamic Import for Gemini SDK ---
let GoogleGenAI;
try {
  const genai = await import("@google/genai");
  GoogleGenAI = genai.GoogleGenAI;
} catch (error) {
  console.error('\n\x1b[31m%s\x1b[0m', '❌ CRITICAL ERROR: Missing dependency "@google/genai"');
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY || process.env.VITE_API_KEY;

if (!API_KEY || API_KEY.includes("PLACEHOLDER")) {
  console.error("❌ ERROR: Valid API_KEY is missing in .env or .env.local");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const MODEL_NAME = 'gemini-2.5-flash'; 

// --- ⚙️ CONFIGURATION ---
const QUESTIONS_PER_BATCH = 5;
const TARGET_TOTAL = 5; 
// The first language is the MASTER. Others are translated from it.
const TARGET_LANGS = ["en", "ko", "ja", "zh", "es", "fr"]; 
const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"];

// ⚠️ IMPORTANT: Increased delay to avoid 429 Rate Limit (Free Tier: 15 RPM)
const DELAY_MS = 10000; 
// -------------------------

const TOPIC_MAP = {
  "HISTORY": ["Ancient Egypt", "Roman Empire", "World War II", "Cold War", "Renaissance", "Industrial Revolution", "French Revolution", "American Civil War", "Feudal Japan", "The Vikings", "Aztec Empire", "Mongol Empire", "The Crusades", "Victorian Era", "Prehistoric Era", "Decolonization"],
  "SCIENCE": ["Quantum Physics", "Genetics", "Organic Chemistry", "Neuroscience", "Botany", "Astronomy", "Geology", "Thermodynamics", "Marine Biology", "Evolution", "Particle Physics", "Immunology", "Paleontology", "Meteorology", "Robotics", "Ecology"],
  "ARTS": ["Impressionism", "Renaissance Art", "Cubism", "Surrealism", "Baroque", "Modernism", "Sculpture", "Graphic Design", "Fashion History", "Photography", "Theater", "Opera", "Abstract Expressionism", "Pottery", "Calligraphy", "Gothic Architecture"],
  "GENERAL": ["1980s Trivia", "1990s Trivia", "Inventions", "World Capitals", "Currencies", "Nobel Prizes", "Phobias", "Brand Logos", "Cryptocurrency", "Viral Trends", "Board Games", "Card Games", "Superheroes", "Classic Toys", "Cocktails", "Car Brands"],
  "GEOGRAPHY": ["Capitals", "Landmarks", "Mountains", "Rivers", "Deserts", "Islands", "Volcanos", "Flags", "Population Stats", "Climate Zones", "Oceans", "US States", "European Countries", "Asian Cities", "African Nations", "Borders"],
  "MOVIES": ["Oscars", "Sci-Fi", "Horror", "Marvel Cinematic Universe", "Star Wars", "Pixar", "80s Movies", "90s Movies", "Famous Directors", "Movie Soundtracks", "Cult Classics", "Anime Movies", "French Cinema", "Silent Era", "Special Effects", "Movie Villains"],
  "MUSIC": ["Rock & Roll", "Pop Music", "Jazz", "Classical", "Hip Hop", "K-Pop", "EDM", "Heavy Metal", "Blues", "Country", "Opera", "Musical Instruments", "90s Hits", "One Hit Wonders", "Music Theory", "Woodstock"],
  "GAMING": ["Nintendo", "PlayStation", "Xbox", "PC Gaming", "RPGs", "FPS", "Arcade Classics", "Retro Gaming", "Esports", "Minecraft", "Pokemon", "Zelda", "Mario", "Indie Games", "Speedrunning", "MMOs"],
  "SPORTS": ["Soccer", "Basketball", "Baseball", "Tennis", "Golf", "Formula 1", "Olympics", "Boxing", "MMA", "Cricket", "Rugby", "Swimming", "Winter Sports", "Skateboarding", "Wrestling", "World Cup"],
  "TECH": ["Artificial Intelligence", "Smartphones", "Internet History", "Social Media", "Coding", "Cybersecurity", "Space Tech", "VR/AR", "Blockchain", "Robots", "Computer Hardware", "Big Data", "Startups", "Hackers", "Gaming Tech", "5G"],
  "MYTHOLOGY": ["Greek Mythology", "Norse Mythology", "Egyptian Mythology", "Roman Mythology", "Japanese Folklore", "Chinese Mythology", "Celtic Mythology", "Aztec Mythology", "Hindu Mythology", "Native American", "Legendary Monsters", "Epic Heroes", "Underworlds", "Creation Myths", "Gods of War", "Tricksters"],
  "LITERATURE": ["Shakespeare", "Classic Novels", "Dystopian Fiction", "Fantasy", "Sci-Fi Books", "Poetry", "Horror", "Mystery", "Comics & Manga", "Nobel Laureates", "Fairy Tales", "Greek Epics", "Russian Literature", "American Literature", "British Literature", "Playwrights"],
  "NATURE": ["Mammals", "Birds", "Insects", "Marine Life", "Dinosaurs", "Rain Forests", "Deserts", "Weather", "Flowers", "Trees", "National Parks", "Survival Skills", "Evolution", "Endangered Species", "Fungi", "Gems & Minerals"],
  "FOOD": ["Italian Cuisine", "French Cuisine", "Mexican Food", "Japanese Food", "Chinese Food", "Indian Food", "Desserts", "Wine", "Coffee", "Cheese", "Spices", "Street Food", "Fast Food", "Baking", "Vegan", "Cocktails"],
  "SPACE": ["Solar System", "Black Holes", "Mars", "Moon Landing", "Constellations", "Stars", "Galaxies", "Astronauts", "Space Race", "Telescopes", "Exoplanets", "Gravity", "Rockets", "SETI", "International Space Station", "Big Bang"],
  "PHILOSOPHY": ["Ethics", "Logic", "Metaphysics", "Existentialism", "Stoicism", "Nihilism", "Political Philosophy", "Eastern Philosophy", "Ancient Greek", "Enlightenment", "Utilitarianism", "Aesthetics", "Epistemology", "Philosophy of Mind", "Famous Quotes", "Paradoxes"]
};

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const getDifficultyInstruction = (difficulty) => {
  switch (difficulty) {
    case "EASY": return `Target: General public. Focus: Definitions, famous facts.`;
    case "MEDIUM": return `Target: Enthusiasts. Focus: Context, 'How/Why'.`;
    case "HARD": return `Target: Experts. Focus: Nuance, specific dates, technical details.`;
    default: return "";
  }
};

/**
 * 🛡️ Sanitize Data to prevent TypeScript Errors
 * Ensures 'options' is string[] and 'context' is string.
 */
function sanitizeQuestions(data) {
  if (!Array.isArray(data)) return [];
  return data.map((q, idx) => {
    // Force ID to be a number
    const id = Number(q.id) || Date.now() + idx;

    // Force Options to be array of strings
    let options = [];
    if (Array.isArray(q.options)) {
      options = q.options.map(opt => (typeof opt === 'object' ? JSON.stringify(opt) : String(opt)));
    } else {
      options = ["Error A", "Error B", "Error C", "Error D"];
    }

    // Force strings
    const question = String(q.question || "Error Question");
    const correctAnswer = String(q.correctAnswer || options[0]);
    const context = q.context ? (typeof q.context === 'object' ? JSON.stringify(q.context) : String(q.context)) : "No context provided.";

    return { id, question, options, correctAnswer, context };
  });
}

/**
 * GENERATE (Master Data)
 */
async function generateQuestions(topic, difficulty, count) {
  const diffInstruction = getDifficultyInstruction(difficulty);
  const prompt = `
    Generate ${count} multiple-choice questions about "${topic}".
    DIFFICULTY: ${difficulty}. ${diffInstruction}
    Constraints:
    - STRICTLY OBJECTIVE FACTS ONLY.
    - Language: English (Master Data)
    - JSON Format: Array of objects { id, question, options (4 simple strings), correctAnswer, context }.
    - IMPORTANT: 'options' must be an array of STRINGS, not objects.
    - ID: Use a random integer.
  `;

  try {
    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: [{ parts: [{ text: prompt }] }],
        config: { responseMimeType: "application/json" }
    });
    const raw = JSON.parse(response.text.replace(/```json|```/g, "").trim());
    return sanitizeQuestions(raw);
  } catch (e) {
    console.error(`      ⚠️ Gen Error: ${e.message}`);
    if (e.message.includes("429")) console.log("      ⏳ Rate limit hit. Sleeping extra...");
    await sleep(20000); // Extra sleep on error
    return [];
  }
}

/**
 * TRANSLATE (Mirroring)
 */
async function translateQuestions(questions, targetLang) {
  const prompt = `
    Translate the following JSON quiz data into language code "${targetLang}".
    RULES:
    1. Preserve all IDs exactly.
    2. Translate 'question', 'options', 'correctAnswer', and 'context'.
    3. Return valid JSON array matching the input structure.
    4. Options must remain an array of strings.
    INPUT DATA:
    ${JSON.stringify(questions)}
  `;

  try {
    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: [{ parts: [{ text: prompt }] }],
        config: { responseMimeType: "application/json" }
    });
    const raw = JSON.parse(response.text.replace(/```json|```/g, "").trim());
    return sanitizeQuestions(raw);
  } catch (e) {
    console.error(`      ⚠️ Trans Error (${targetLang}): ${e.message}`);
    await sleep(20000); // Extra sleep on error
    return [];
  }
}

/**
 * FILE SYSTEM HELPER
 */
function getQuestionsFromFile(filePath, key) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf-8');
  const regex = new RegExp(`"${key}":\\s*\\[([\\s\\S]*?)\\]`, 'm');
  const match = content.match(regex);
  if (match) {
    try {
      return JSON.parse(`[${match[1]}]`);
    } catch(e) { return null; }
  }
  return null;
}

function saveQuestionsToFile(filePath, key, questions) {
  let fileContent = fs.readFileSync(filePath, 'utf-8');
  const jsonStr = JSON.stringify(questions, null, 2);

  if (fileContent.includes(`"${key}"`)) {
    console.log(`      ⚠️ Key ${key} already exists (skipping overwrite).`);
    return;
  }

  const newEntry = `\n  "${key}": ${jsonStr},`;
  const lastBrace = fileContent.lastIndexOf('};');
  fileContent = fileContent.slice(0, lastBrace) + newEntry + "\n};";
  fs.writeFileSync(filePath, fileContent);
}

async function runSeeder() {
  console.log(`\n🏭 AI vs HUMAN PROTOCOL: MULTI-LINGUAL DATA FACTORY`);
  console.log(`🎯 Target: ${TARGET_TOTAL} questions per topic`);
  console.log(`🌍 Languages: [${TARGET_LANGS.join(', ')}]`);
  console.log(`⏱️  Delay: ${DELAY_MS}ms per request to avoid rate limits.`);
  console.log(`🛑 Press Ctrl + C to stop anytime.\n`);

  for (const [category, subtopics] of Object.entries(TOPIC_MAP)) {
    console.log(`\n📂 CATEGORY: ${category}`);
    
    // Ensure File Exists
    const filename = `${category.toLowerCase()}.ts`;
    const filePath = path.resolve(__dirname, '../data/questions', filename);
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, `import { QuizQuestion } from '../../types';\n\nexport const ${category}_DB: Record<string, QuizQuestion[]> = {\n};`);
    }

    for (const topic of subtopics) {
      process.stdout.write(`   👉 ${topic.padEnd(20)} `);

      for (const difficulty of DIFFICULTIES) {
        
        // 1. Check/Generate MASTER Data (English)
        const masterLang = TARGET_LANGS[0]; // 'en'
        const masterKey = `${topic}_${difficulty}_${masterLang}`;
        let masterData = getQuestionsFromFile(filePath, masterKey);
        
        if (!masterData || masterData.length < TARGET_TOTAL) {
          const needed = TARGET_TOTAL - (masterData ? masterData.length : 0);
          const newQs = await generateQuestions(topic, difficulty, needed);
          
          if (newQs.length > 0) {
            saveQuestionsToFile(filePath, masterKey, newQs);
            masterData = newQs;
            process.stdout.write(`[EN:GEN] `);
            await sleep(DELAY_MS); // Sleep after generation
          } else {
            process.stdout.write(`[EN:ERR] `);
          }
        } else {
          process.stdout.write(`[EN:✔] `);
        }

        if (!masterData || masterData.length === 0) continue;

        // 2. Mirror to Other Languages
        for (let i = 1; i < TARGET_LANGS.length; i++) {
          const lang = TARGET_LANGS[i];
          const targetKey = `${topic}_${difficulty}_${lang}`;
          const existingData = getQuestionsFromFile(filePath, targetKey);

          if (!existingData || existingData.length < masterData.length) {
             const translatedQs = await translateQuestions(masterData, lang);
             if (translatedQs.length > 0) {
                saveQuestionsToFile(filePath, targetKey, translatedQs);
                process.stdout.write(`[${lang.toUpperCase()}:TR] `);
                await sleep(DELAY_MS); // Sleep after translation
             } else {
                process.stdout.write(`[${lang.toUpperCase()}:ERR] `);
             }
          } else {
             // process.stdout.write(`[${lang.toUpperCase()}:✔] `);
          }
        }
      }
      console.log(""); 
    }
  }
  console.log("\n✨ FACTORY SHUTDOWN.");
}

// Handle Safe Exit
process.on('SIGINT', () => {
  console.log("\n\n🛑 Process interrupted by user. Exiting safely...");
  process.exit(0);
});

runSeeder();