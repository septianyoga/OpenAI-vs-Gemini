import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from 'openai'
import * as dotenv from 'dotenv'
dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
})

const count = true;
let iteration = 0;
var initMessage = 'halo apa kabar?'


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const main = async () => {
    console.log(initMessage);
    while (count) {
        if (iteration % 2 === 1) {
            const response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'user', content: initMessage },
                ],
            })
            console.log('\x1b[92mOpenAI: ' + response.choices[0].message.content + '\x1b[0m')
            initMessage = response.choices[0].message.content
        } else {
            const model = genAI.getGenerativeModel({ model: "gemini-pro", maxOutputTokens: 50 })
            const result = await model.generateContent(initMessage);
            const response = await result.response;
            const text = response.text();
            console.log('\x1b[93mGemini: ' + text + '\x1b[0m');
            initMessage = text
        }

        await delay(1000);

        iteration++;

        if (iteration === 16) {
            break;
        }
    }
};

main();