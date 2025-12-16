import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') })
dotenv.config({ path: path.resolve(process.cwd(), 'studio/.env') })

const client = createClient({
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'ylk0tk34',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
    apiVersion: '2024-03-11',
    token: process.env.SANITY_AUTH_TOKEN, // Trying auth token which usually has admin rights
    useCdn: false,
})

const homepageData = {
    _type: 'homepage',
    title: "Forge Your Legend",
    subtitle: "Enter the archives of power. Build legendary heroes. Master the ancient arts of Dungeons & Dragons.",
    features: [
        {
            _key: 'feat1',
            title: "30+",
            description: "Classes",
            icon: "Swords"
        },
        {
            _key: 'feat2',
            title: "50+",
            description: "Races",
            icon: "User"
        },
        {
            _key: 'feat3',
            title: "300+",
            description: "Spells",
            icon: "Wand2"
        }
    ],
    footer: {
        text: "Educational Demo",
        disclaimer: "Not affiliated with Wizards of the Coast",
        credits: "POWERED BY REACT & TAILWIND"
    }
}

async function migrate() {
    try {
        console.log('Migrating Homepage data...')

        // Check if homepage exists
        const existing = await client.fetch('*[_type == "homepage"][0]')

        if (existing) {
            console.log('Homepage document already exists. Patching...')
            await client.patch(existing._id).set(homepageData).commit()
        } else {
            console.log('Creating new Homepage document...')
            await client.create(homepageData)
        }

        console.log('Migration successful!')
    } catch (err) {
        console.error('Migration failed:', err)
        process.exit(1)
    }
}

migrate()
