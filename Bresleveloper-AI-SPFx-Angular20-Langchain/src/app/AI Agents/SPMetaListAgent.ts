import { AgentExecutor, createToolCallingAgent } from "@langchain/classic/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { chat_ollama } from "../AI Models/chat_ollama";
import { SPMetaListTools } from "../AI Tools/SPMetaListTools";
import { chat_openrouter } from "../AI Models/chat_openrouter";


// Create prompt
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant."],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);

// Create agent
const agentMetaItems = await createToolCallingAgent({
  llm: chat_openrouter,
  //llm:chat_ollama,
  tools: SPMetaListTools,
  prompt,
});

// Create executor (handles the loop automatically)
export const agentMetaItemsExec = new AgentExecutor({
  agent:agentMetaItems,
  tools: SPMetaListTools,
});



