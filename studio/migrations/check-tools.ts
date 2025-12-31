import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const client = createClient({
    projectId: 'ylk0tk34',
    dataset: 'production',
    useCdn: false,
    token: process.env.SANITY_AUTH_TOKEN,
    apiVersion: '2024-01-01',
});

async function check() {
    console.log('Checking for tools...');
    const tools = await client.fetch(`*[_type == "item" && type == "Tool"]{name}`);
    console.log(`Found ${tools.length} tools.`);
    tools.forEach((t: any) => console.log(` - ${t.name}`));
}

check().catch(console.error);
