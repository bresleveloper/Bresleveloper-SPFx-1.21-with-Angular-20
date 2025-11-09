

import { ChatOpenAI } from "@langchain/openai";
import { environment } from "../../environments/environment";


export const chat_openrouter = new ChatOpenAI({
    model:"x-ai/grok-4-fast",
    temperature:0.8,
    //streaming:false,
    configuration:{
        baseURL:"https://openrouter.ai/api/v1",
        apiKey:environment.openrouterkey
    }
})