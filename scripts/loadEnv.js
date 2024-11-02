const fs = require('fs');
const path = require('path');

function loadEnv() {
  console.log('Starting to load environment variables...');
  const envPath = path.resolve(process.cwd(), '.env.local');
  console.log('Looking for .env.local file at:', envPath);
  
  if (!fs.existsSync(envPath)) {
    console.error('.env.local file not found');
    return;
  }

  console.log('.env.local file found. Reading contents...');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const envVars = envContent.split('\n');

  console.log('Parsing environment variables...');
  envVars.forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
      console.log(`Set ${key.trim()} in process.env`);
    }
  });

  console.log('Environment variables loaded:');
  console.log('PINECONE_API_KEY:', process.env.PINECONE_API_KEY ? 'Set' : 'Not set');
  console.log('PINECONE_ENVIRONMENT:', process.env.PINECONE_ENVIRONMENT);
  console.log('PINECONE_INDEX_NAME:', process.env.PINECONE_INDEX_NAME);
}

module.exports = loadEnv;