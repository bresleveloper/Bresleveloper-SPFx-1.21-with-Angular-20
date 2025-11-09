

import { ChatOpenAI } from "@langchain/openai";


export const chat_ollama = new ChatOpenAI({
    model:"qwen3:1.7b",
    //model:"qwen3:4b",
    temperature:0.8,
    streaming:false,
    configuration:{
        baseURL:"http://localhost:11434/v1",
        apiKey:""
    }
})