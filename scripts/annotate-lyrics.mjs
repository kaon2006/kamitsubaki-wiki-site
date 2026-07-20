import fs from 'fs';
import path from 'path';
import KuroshiroDefault from 'kuroshiro';
const Kuroshiro = KuroshiroDefault.default || KuroshiroDefault;
import KuromojiAnalyzerDefault from 'kuroshiro-analyzer-kuromoji';
const KuromojiAnalyzer = KuromojiAnalyzerDefault.default || KuromojiAnalyzerDefault;
import { translate } from '@vitalets/google-translate-api';
import * as wanakana from 'wanakana';

async function initKuroshiro() {
  const kuroshiro = new Kuroshiro();
  await kuroshiro.init(new KuromojiAnalyzer({ dictPath: "node_modules/kuromoji/dict" }));
  return kuroshiro;
}

// Function to generate the custom ruby HTML structure
async function generateRuby(text, kuroshiro) {
  // We can use kuroshiro's analyzer to get tokens
  const tokens = await kuroshiro._analyzer.parse(text);
  let html = '';
  
  for (const token of tokens) {
    const surface = token.surface_form;
    if (!token.reading || token.word_type === 'UNKNOWN') {
      // no reading, just add characters (e.g. punctuation, space)
      // wait, we still need romaji for hiragana/katakana!
      if (wanakana.isKana(surface)) {
        const roma = wanakana.toRomaji(surface);
        html += `<ruby>${surface}<rt class="roma">${roma}</rt></ruby>`;
      } else {
        html += surface;
      }
    } else {
      // It has a reading
      // if it's all kana, just add roma
      if (wanakana.isKana(surface)) {
        const roma = wanakana.toRomaji(surface);
        html += `<ruby>${surface}<rt class="roma">${roma}</rt></ruby>`;
      } else {
        // It contains Kanji!
        const readingHiragana = wanakana.toHiragana(token.reading);
        const roma = wanakana.toRomaji(token.reading);
        html += `<ruby>${surface}<rt class="furi">${readingHiragana}</rt><rt class="roma">${roma}</rt></ruby>`;
      }
    }
  }
  return html;
}

async function processFile(filePath, kuroshiro) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const isZh = filePath.endsWith('zh.md');
  const isEn = filePath.endsWith('en.md');
  
  if (!content.includes('my-lyric-box')) return;
  
  // Find lines inside jp-lyric
  const regex = /<div class="jp-lyric">\s*([\s\S]*?)\s*<\/div>/g;
  
  const matches = [...content.matchAll(regex)];
  let newContent = content;
  
  for (const match of matches) {
    const originalText = match[1].trim();
    if (!originalText || originalText.includes('<ruby>')) continue; // Skip if empty or already processed
    
    // 1. Generate Furigana/Romaji
    const rubyHtml = await generateRuby(originalText, kuroshiro);
    
    // 2. Generate Translation (if not Japanese document)
    // Wait, if it's ja.md, no translation.
    // If zh.md, translate to Chinese. If en.md, translate to English.
    let transHtml = '';
    if (isZh) {
      try {
        const res = await translate(originalText, { to: 'zh-CN' });
        transHtml = `\n<div class="cn-lyric">${res.text}</div>`;
      } catch(e) {
        transHtml = `\n<div class="cn-lyric">[AI Translation Placeholder]</div>`;
      }
    } else if (isEn) {
      try {
        const res = await translate(originalText, { to: 'en' });
        transHtml = `\n<div class="trans-lyric">${res.text}</div>`;
      } catch(e) {
        transHtml = `\n<div class="trans-lyric">[AI Translation Placeholder]</div>`;
      }
    }
    
    // Replace the old div with the new one
    const oldBlock = `<div class="jp-lyric">\n${originalText}\n</div>`;
    let newBlock = `<div class="jp-lyric">\n${rubyHtml}\n</div>${transHtml}`;
    // Indentation fixing
    if (originalText.includes('\n')) {
        // basic handling for multiline (though typically it's single line per div)
    }
    
    newContent = newContent.replace(oldBlock, newBlock);
  }
  
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`Processed: ${filePath}`);
}

async function findMdFiles(dir, fileList = []) {
  const files = await fs.promises.readdir(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.promises.stat(filePath);
    if (stat.isDirectory()) {
      await findMdFiles(filePath, fileList);
    } else if (file.endsWith('.md') && file !== 'README.md') {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.log('Initializing Kuroshiro...');
  const kuroshiro = await initKuroshiro();
  
  const SONGS_DIR = path.join(process.cwd(), 'src/content/songs');
  const files = await findMdFiles(SONGS_DIR);
  console.log(`Found ${files.length} markdown files to process.`);
  
  let processedCount = 0;
  for (const filePath of files) {
    let content = await fs.promises.readFile(filePath, 'utf-8');
    const isZh = filePath.endsWith('zh.md') || filePath.endsWith('zh-tw.md');
    const isEn = filePath.endsWith('en.md');
    const isKo = filePath.endsWith('ko.md');
    
    if (!content.includes('my-lyric-box') || content.includes('<ruby>')) continue;
    
    console.log(`Processing: ${filePath}`);
    const regex = /<div class="jp-lyric">\s*([\s\S]*?)\s*<\/div>/g;
    const matches = [...content.matchAll(regex)];
    let newContent = content;
    
    for (const match of matches) {
      const originalText = match[1].trim();
      if (!originalText || originalText.includes('<ruby>')) continue;
      
      const rubyHtml = await generateRuby(originalText, kuroshiro);
      let transHtml = '';
      
      if (isZh) {
        try {
          const res = await translate(originalText, { to: 'zh-CN' });
          transHtml = `\n<div class="cn-lyric">${res.text}</div>`;
          await delay(1000); // Prevent rate limiting
        } catch(e) {
          transHtml = `\n<div class="cn-lyric">[AI Translation Placeholder]</div>`;
        }
      } else if (isEn) {
        try {
          const res = await translate(originalText, { to: 'en' });
          transHtml = `\n<div class="trans-lyric">${res.text}</div>`;
          await delay(1000);
        } catch(e) {
          transHtml = `\n<div class="trans-lyric">[AI Translation Placeholder]</div>`;
        }
      } else if (isKo) {
        try {
          const res = await translate(originalText, { to: 'ko' });
          transHtml = `\n<div class="kr-lyric">${res.text}</div>`;
          await delay(1000);
        } catch(e) {
          transHtml = `\n<div class="kr-lyric">[AI Translation Placeholder]</div>`;
        }
      }
      
      const oldBlock = `<div class="jp-lyric">\n${originalText}\n</div>`;
      let newBlock = `<div class="jp-lyric">\n${rubyHtml}\n</div>${transHtml}`;
      newContent = newContent.replace(oldBlock, newBlock);
    }
    
    if (content !== newContent) {
      await fs.promises.writeFile(filePath, newContent, 'utf-8');
      processedCount++;
    }
  }
  console.log(`Done! Processed ${processedCount} files.`);
}

main().catch(console.error);
