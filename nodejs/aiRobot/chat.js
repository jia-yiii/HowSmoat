const express = require('express');
const OpenAI = require('openai');
const axios = require('axios');
const { Pinecone } = require('@pinecone-database/pinecone');

const router = express.Router();

// 這裡就直接用 process.env
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pinecone.index(process.env.PINECONE_INDEX_NAME);

// 定義 GPT 可以呼叫的 function
const functions = [
  {
    name: 'search_products',
    description: '根據關鍵字搜尋商品',
    parameters: {
      type: 'object',
      properties: {
        keyword: {
          type: 'string',
          description: '要搜尋的關鍵字'
        }
      },
      required: ['keyword']
    }
  },
  {
    name: 'get_hot_ranking',
    description: '取得前三名熱銷商品，包括 pid、商品名稱、價格、銷售數與圖片 URL',
    parameters: {
      type: 'object',
      properties: {

      },
      required: []
    }
  }
];

async function HOTRANKING(limit) {
  let result = await axios.get(`http://localhost:8000/get/hot-ranking`)
  console.log(result.data);
  return result.data;

}


async function searchProducts(keyword) {
  let result = await axios.post('http://localhost:8000/post/productsreach/new', { 'keyword': keyword })
  if (result.data.length !== 0) {
    let res_json = []
    result.data.map(pd => {
      res_json.push({
        url: `http://localhost:3000/product/${pd.id}`,
        pd_name: pd.name,
        price: pd.price,
        img: `http://localhost:3000/${JSON.parse(pd.images)[0].img_path}`
      })

    })
    return res_json
  }
  else {
    return '查無商品'
  }

}

async function embed(text) {
  const resp = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text
  });
  return resp.data[0].embedding;
}

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    const userVec = await embed(message);
    const queryRes = await index.query({
      vector: userVec,
      topK: 3,
      includeMetadata: true
    });
    const contexts = queryRes.matches
      .map(m => `Q: ${m.metadata.question}\nA: ${m.metadata.answer}`)
      .join('\n----\n');
    console.log(contexts);

    const messages = [
      {
        role: 'system', content: `
        你是一位寵物用品購物網站【好拾毛】的客服助理。
        我們是賣全新、二手商品的購物網站,動物種類有貓、狗、鳥、鼠
        如果他只輸入【尋找商品】,提示他要在後面輸入關鍵字
        • 只有當使用者問題中明確提到「請查詢商品庫存」或尋找熱門商品等動作時，才返回 function_call；
        •如果使用者問{怎麼養狗}回答,前面可以簡短回答她,告訴她我們網站設有小知識專區,下面的連結顯示給使用者
         '<a href='http://localhost:3000/Novicefeeding/dog'> 寵物小知識 </a>' 
        也跟她說可以使用我們的寵物知識小問答來了解寵物
        •如果使用者問{怎麼養貓}回答,前面可以簡短回答她,告訴她我們網站設有小知識專區,下面的{兩個}連結顯示給使用者
          '<a href='http://localhost:3000/Novicefeeding/cat'> 寵物小知識 </a>' 
          '<a href='http://localhost:3000/PartTouch/Touch'>部位好發疾病</a> '
        也跟她說可以使用我們的寵物知識小問答來了解寵物
        • 其他情況，一律以純文字形式回答。以下是知識庫範例：\n${contexts}`
      },
      { role: 'user', content: message }
    ];
    const chatResp = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      functions,
      function_call: 'auto',  // 讓模型自動決定要不要 call
      temperature: 0.8,
      max_tokens: 512
    });
    let answer = chatResp.choices[0].message
    if (answer.function_call) {
      const { name, arguments: argsJson } = answer.function_call;
      const args = JSON.parse(argsJson);

      let resultData;
      if (name === 'search_products') {
        // 執行你自己的搜尋邏輯
        resultData = await searchProducts(args.keyword);

      }
      else if (name === 'get_hot_ranking') {
        resultData = await HOTRANKING();

      }
      else {
        resultData = { error: `Unknown function ${name}` };
      }

      return res.json({ functions: name, answer: resultData });

    }

    else {
      res.json({ functions: "text", answer: answer.content });

    }
    console.log('ai');

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

