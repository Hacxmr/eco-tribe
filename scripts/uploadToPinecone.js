const { PineconeClient } = require("@pinecone-database/pinecone");
const loadEnv = require('./loadEnv');
loadEnv();

const fetch = require('node-fetch');
const fs = require('fs').promises;
const path = require('path');
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_ENVIRONMENT = process.env.PINECONE_ENVIRONMENT;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME;

console.log("Environment variables:");
console.log("PINECONE_API_KEY:", PINECONE_API_KEY ? "Set" : "Not set");
console.log("PINECONE_ENVIRONMENT:", PINECONE_ENVIRONMENT);
console.log("PINECONE_INDEX_NAME:", PINECONE_INDEX_NAME);

async function initPinecone() {
  console.log("Initializing Pinecone...");
  const pinecone = new PineconeClient();
  try {
    console.log("Pinecone init params:", {
      apiKey: PINECONE_API_KEY ? "Set" : "Not set",
      environment: PINECONE_ENVIRONMENT
    });
    await pinecone.init({
      apiKey: PINECONE_API_KEY,
      environment: PINECONE_ENVIRONMENT,
    });
    console.log("Pinecone initialized successfully");
    return pinecone;
  } catch (error) {
    console.error("Error initializing Pinecone:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Full error object:", JSON.stringify(error, null, 2));
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    throw error;
  }
}

async function loadJSONFiles(directory) {
  console.log(`Loading JSON files from ${directory}...`);
  const files = await fs.readdir(directory);
  const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');
  console.log(`Found ${jsonFiles.length} JSON files`);
  
  const data = [];
  for (const file of jsonFiles) {
    const filePath = path.join(directory, file);
    console.log(`Reading file: ${filePath}`);
    const content = await fs.readFile(filePath, 'utf-8');
    const jsonContent = JSON.parse(content);
    console.log(`Loaded ${jsonContent.length} items from ${file}`);
    data.push(...jsonContent);
  }
  
  console.log(`Total items loaded: ${data.length}`);
  return data;
}

async function uploadToPinecone(data) {
  console.log("Starting upload to Pinecone...");
  const pinecone = await initPinecone();
  const index = pinecone.Index(PINECONE_INDEX_NAME);
  const embeddings = new OpenAIEmbeddings();

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    console.log(`Processing item ${i + 1} of ${data.length}`);
    const fullText = `Description: ${item.description}\n\nConversation:\n${item.utterances.join('\n')}`;
    console.log("Generating embedding...");
    const embedding = await embeddings.embedQuery(fullText);
    
    console.log("Upserting to Pinecone...");
    await index.upsert({
      upsertRequest: {
        vectors: [{
          id: `item-${i}`,
          values: embedding,
          metadata: { 
            description: item.description,
            utterances: item.utterances
          }
        }],
      }
    });
    
    console.log(`Uploaded item ${i + 1} of ${data.length}`);
  }
  
  console.log('Upload complete!');
}

const https = require('https');

function testPineconeConnection() {
  return new Promise((resolve, reject) => {
    https.get('https://api.pinecone.io', (res) => {
      console.log('Pinecone API response status:', res.statusCode);
      resolve(res.statusCode);
    }).on('error', (e) => {
      console.error('Error reaching Pinecone API:', e);
      reject(e);
    });
  });
}

async function main() {
  try {
    console.log("Testing Pinecone API connection...");
    await testPineconeConnection();
    const data = await loadJSONFiles('./data');
    await uploadToPinecone(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

console.log("Script started");
main().then(() => console.log("Script finished"));