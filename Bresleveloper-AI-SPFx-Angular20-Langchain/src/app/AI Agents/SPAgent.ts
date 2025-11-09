


import { AgentExecutor, createToolCallingAgent } from "@langchain/classic/agents";
import { SPTools } from "../AI Tools/SPTools";
import { chat_ollama } from "../AI Models/chat_ollama";
import { chat_openrouter } from "../AI Models/chat_openrouter";
import { ChatPromptTemplate } from "@langchain/core/prompts";



// Create prompt
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant."],
  ["human", "{input}. use SharePoint tools to complete task."],
  ["placeholder", "{agent_scratchpad}"],
]);



// Create agent
const agentSP = await createToolCallingAgent({
  //llm: chat_openrouter,
  llm:chat_ollama,
  tools: SPTools,
  prompt,
});



// Create executor (handles the loop automatically)
export const agentSPExec = new AgentExecutor({
  agent:agentSP,
  tools: SPTools,
});
