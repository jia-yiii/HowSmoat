// upload.js
import dotenv from 'dotenv';
import fs from 'fs';
import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

dotenv.config();
console.log('Working dir:', process.cwd());
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);
// 1. 初始化客戶端
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pinecone.index(process.env.PINECONE_INDEX_NAME);

// 2. Helper：取得 embedding
async function getEmbedding(text) {
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('getEmbedding: 請傳入非空字串');
  }
  const resp = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text
  });
  return resp.data[0].embedding;
}

// 3. 批次上傳並重試機制
async function upsertBatch(batch, retries = 3, delayMs = 1000) {
  try {
    await index.upsert(batch);
  } catch (err) {
    if (retries > 0) {
      console.warn(`Batch upsert failed, retrying in ${delayMs}ms...`, err.message);
      await new Promise(r => setTimeout(r, delayMs));
      return upsertBatch(batch, retries - 1, delayMs * 2);
    }
    throw err;
  }
}

async function main() {
  // 4. 讀入問答 JSON (knowledge.json)
  const qaList = JSON.parse(fs.readFileSync('./knowledge.json', 'utf8'));

  // 5. 產生所有向量記錄
  const records = [];
  for (let i = 0; i < qaList.length; i++) {
    const { question, answer } = qaList[i];
    const vector = await getEmbedding(answer);
    records.push({
      id: `qa-${i}`,
      values: vector,
      metadata: { question, answer }
    });
  }

  // 6. 按批次上傳
  const BATCH_SIZE = 50;
  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    console.log(`Uploading batch ${i / BATCH_SIZE + 1} (${batch.length} records)...`);
    await upsertBatch(batch);
    // 避免瞬間流量過大，可稍作延遲
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('✅ All batches uploaded.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});