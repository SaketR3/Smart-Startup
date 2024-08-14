import express from 'express';
const router = express.Router();

import "cheerio";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";

const template = `Use the following pieces of context to answer my question about my start-up at the end. 
Your response should be a couple of paragraphs. 
Don't give generic recommendations; be personalized. 
Mention how lenders view different aspects of my start-up. 
ONLY GIVE THE ADVICE - DO *NOT* INCLUDE AN INTRODUCTION AND DO *NOT* INCLUDE A CONCLUSION. 

{context}

Question: {question}

Helpful Answer:`;

const customRagPrompt = PromptTemplate.fromTemplate(template);

const loader = new CheerioWebBaseLoader(
    'https://www.startups.com/library/expert-advice/sba-small-business-startup-loans'
);

const docs = await loader.load();

const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
});

const splits = await textSplitter.splitDocuments(docs);

const vectorStore = await MemoryVectorStore.fromDocuments(
  splits,
  new OpenAIEmbeddings()
);

const llm = new ChatOpenAI({ model: "gpt-3.5-turbo", temperature: 0 });

const retriever = vectorStore.asRetriever();

const ragChain = await createStuffDocumentsChain({
    llm: llm,
    prompt: customRagPrompt,
    outputParser: new StringOutputParser(),
});

const stateMap = new Map([
    [0, 'Alaska'],
    [1, 'Alabama'],
    [2, 'Arkansas'],
    [3, 'Arizona'],
    [4, 'California'],
    [5, 'Colorado'],
    [6, 'Connecticut'],
    [7, 'District of Columbia'],
    [8, 'Delaware'],
    [9, 'Florida'],
    [10, 'Georgia'],
    [11, 'Hawaii'],
    [12, 'Iowa'],
    [13, 'Idaho'],
    [14, 'Illinois'],
    [15, 'Indiana'],
    [16, 'Kansas'],
    [17, 'Kentucky'],
    [18, 'Louisiana'],
    [19, 'Massachusetts'],
    [20, 'Maryland'],
    [21, 'Maine'],
    [22, 'Michigan'],
    [23, 'Minnesota'],
    [24, 'Missouri'],
    [25, 'Mississippi'],
    [26, 'Montana'],
    [27, 'North Carolina'],
    [28, 'North Dakota'],
    [29, 'Nebraska'],
    [30, 'New Hampshire'],
    [31, 'New Jersey'],
    [32, 'New Mexico'],
    [33, 'Nevada'],
    [34, 'New York'],
    [35, 'Ohio'],
    [36, 'Oklahoma'],
    [37, 'Oregon'],
    [38, 'Pennsylvania'],
    [39, 'Rhode Island'],
    [40, 'South Carolina'],
    [41, 'South Dakota'],
    [42, 'Tennessee'],
    [43, 'Texas'],
    [44, 'Utah'],
    [45, 'Virginia'],
    [46, 'Vermont'],
    [47, 'Washington'],
    [48, 'Wisconsin'],
    [49, 'West Virginia'],
    [50, 'Wyoming'],
]);

const cityMap = new Map([
    [0, 'Los Angeles'],
    [1, 'Houston'],
    [2, 'New York'],
    [3, 'Miami'],
    [4, 'Chicago'],
    [5, 'Dallas'],
    [6, 'San Diego'],
    [7, 'Las Vegas'],
    [8, 'Brooklyn'],
    [9, 'Phoenix'],
    [10, 'Atlanta'],
    [11, 'San Antonio'],
    [12, 'Denver'],
    [13, 'Philadelphia'],
    [14, 'Austin'],
    [15, 'Springfield'],
    [16, 'Salt Lake City'],
    [17, 'Seattle'],
    [18, 'Portland'],
    [19, 'San Francisco'],
    [20, 'Other'],
]);

const cityTypeMap = new Map([
    [1, 'Urban'],
    [2, 'Rural'],
    [0, 'Not sure'],
]); 

const categoryMap = new Map([
    [1, 'Agriculture, forestry, or fishing'],
    [2, 'Mining, quarrying, or oil and gas extraction'],
    [3, 'Utilities'],
    [4, 'Construction'],
    [5, 'Manufacturing'],
    [8, 'Wholesale trade'],
    [9, 'Retail trade'],
    [11, 'Transportation or warehousing'],
    [13, 'Information'],
    [14, 'Finance or insurance'],
    [15, 'Real estate, rental, or leasing'],
    [16, 'Professional, scientific, or technical services'],
    [17, 'Management of companies or enterprises'],
    [18, 'Administrative, support, waste management, or remediation services'],
    [19, 'Educational services'],
    [20, 'Health care or social assistance'],
    [21, 'Arts, entertainment, or recreation'],
    [22, 'Accommodation or food services'],
    [24, 'Public administration'],
    [23, 'Other'],
]);

const revolvingLineCreditMap = new Map([
    [0, 'No'],
    [2, 'Yes'],
    [1, 'Not sure or N/A'],
]); 

const lowDocMap = new Map([
    [0, 'No'],
    [1, 'Yes'],
    [2, 'Not sure or N/A'],
]);

const meaning = (prediction) => {
    if (prediction < 25) {
      return 'Very Unlikely';
    }
    if (prediction < 50) {
      return 'Moderately Unlikely';
    }
    if (prediction < 75) {
      return 'Moderately Likely';
    }
    return 'Very Likely'; 
}

console.log('RAG loaded'); 

router.post('/', async (req, res) => {
    const city = cityMap.get(req.body.data[0]);
    const state = stateMap.get(req.body.data[1]);
    const category = categoryMap.get(req.body.data[2]);
    const length = req.body.data[3] * 10;
    const employees = req.body.data[4];
    const cityType = cityTypeMap.get(req.body.data[7]);
    const revolvingLineCredit = revolvingLineCreditMap.get(req.body.data[8]);
    const lowDoc = lowDocMap.get(req.body.data[9]);
    const amount = req.body.data[10] * 10000000;
    const prediction = parseFloat((req.body.data[11] * 100).toFixed(2)); 
    const predictionMeaning = meaning(prediction);

    let prompt = "My start-up is looking for an SBA loan. "; 
    prompt += `It is ${prediction}% to get the loan, `; 
    prompt += `which is ${predictionMeaning}. `;
    prompt += "Please provide advice on what my start-up can do to get the loan it's looking for, and tell me how lenders view the different aspects of my start-up. "; 
    prompt += "My start-up is based in "; 

    if (city != 'Other') {
        prompt += `${city}, `;
    }
    prompt += state; 

    if (cityType == "Urban") {
        prompt += " in an urban location. "; 
    } else if (cityType == "Rural") {
        prompt += " in a rural location. ";
    } else {
        prompt += ". "
    }

    prompt += `Its category is ${category}. `;

    if (revolvingLineCredit == "No") {
        prompt += "It's not a revolving line of credit loan"; 
    } else if (revolvingLineCredit == "Yes") {
        prompt += "It's a revolving line of credit loan";
    } else {
        prompt += "I'm not sure or it's N/A whether it's a revolving line of credit loan"
    }
    prompt += ", and ";

    if (lowDoc == "No") {
        prompt += "it's not a low-doc loan. "; 
    } else if (lowDoc == "Yes") {
        prompt += "it's a low-doc loan. ";
    } else {
        prompt += "I'm not sure or it's N/A whether it's a low-doc loan. "
    }

    prompt += `The start-up has ${employees} employees. `;
    prompt += `The loan amount is $${amount} and `; 
    prompt += `the loan term is ${length} months.`;

    const context = await retriever.invoke(prompt);

    const advice = await ragChain.invoke({
        question: prompt,
        context: context,
    });

    return res.json({ prompt: prompt, advice: advice }); 
});

export default router 
