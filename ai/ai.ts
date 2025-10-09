"use server"

import { GoogleGenAI } from '@google/genai';


const  GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
    throw new Error('GOOGLE_API_KEY is not defined');
}

const ai = new GoogleGenAI({
    apiKey: GOOGLE_API_KEY,
    //apiVersion: 'v1alpha',
});

export async function runAi(prompt: string) {
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-001',
            contents: prompt,
        });

        const text = response.text;

        return text;
    } catch (error) {
        console.error('AI generation error:', error);
        throw new Error('Failed to generate AI content');
  }
}