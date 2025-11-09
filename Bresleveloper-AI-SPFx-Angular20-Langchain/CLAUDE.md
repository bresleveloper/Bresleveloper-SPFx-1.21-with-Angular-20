# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Angular 20 application that integrates LangChain AI agents with SharePoint Framework (SPFx). It demonstrates how to use LangChain 1.0.x agents with browser-compatible tools to interact with SharePoint data through AI-powered queries.

The project is designed to work as an Angular Elements component that can be embedded in SharePoint sites, leveraging a host SPFx solution that provides SharePoint context and services via a global `window.bresleveloper` object.

## Common Commands

### Development
- `npm start` - Start development server
- `npm run build` - Production build
- `npm run watch` - Build in watch mode for development
- `npm test` - Run tests with Karma

### Installation
After cloning, run `npm install` to install all dependencies including:
- `@angular/elements` (for SPFx integration)
- `langchain` and `@langchain/openai`
- `@langchain/classic` (required for browser-compatible agents)

## Architecture

### AI Integration Layer

The application uses a three-tier AI architecture:

1. **AI Models** (`src/app/AI Models/`)
   - `chat_ollama.ts` - Local Ollama model configuration (uses OpenAI-compatible endpoint at `http://localhost:11434/v1`)
   - `chat_openrouter.ts` - OpenRouter API configuration for cloud-based models
   - Both use `ChatOpenAI` from `@langchain/openai` with custom baseURL configurations

2. **AI Tools** (`src/app/AI Tools/`)
   - Tools are defined using `tool()` from `@langchain/core/tools` with Zod schemas
   - `SPTools.ts` - General SharePoint tools (GetSPListItems, GetSPSitePageContent)
   - `SPMetaListTools.ts` - Specialized meta-list tools for project management scenarios
   - All tools access SharePoint via the global `window.bresleveloper` service interface

3. **AI Agents** (`src/app/AI Agents/`)
   - Agents use `createToolCallingAgent()` from `@langchain/classic/agents`
   - `SPAgent.ts` - General SharePoint agent using SPTools
   - `SPMetaListAgent.ts` - Specialized agent for meta-list queries
   - Each agent has an `AgentExecutor` that handles the agent loop automatically

### SharePoint Integration

**Critical:** This Angular app does not directly access SharePoint. It relies on a host SPFx web part that:
- Provides SharePoint context via `window.bresleveloper.pageContext`
- Exposes SharePoint REST API wrapper via `window.bresleveloper.SPService`
- Registers Angular elements via `window.bresleveloper.ngElementsList`

The service interface is defined in `src/app/sp-services/bresleveloper-digital-services.service.ts` and includes methods like:
- `getListItems(listName, $select, $filter, $top, skipTokenIdValue)`
- `getListItemsFromWeb(web, listName, ...)` - Query different site collections
- `createListItem()`, `updateListItem()`, `deleteListItem()`
- `search()` - SharePoint search queries

### Component Structure

Components invoke AI agents and display results:
- `UseSPToolsComp` (`src/app/Components/use-sptools-comp/`) demonstrates agent invocation patterns
- Agents are invoked via `agentSPExec.invoke({ input: userQuery })` or `agentMetaItemsExec.invoke({ input: userQuery })`
- Results are rendered to DOM elements via ViewChild references

## LangChain 1.0.x Browser Compatibility Rules

**CRITICAL IMPORT RULES:**

LangChain 1.0.x has browser compatibility issues. Follow these import rules strictly:

### ✅ ALLOWED Imports
- Models/Chat: `import { ChatOpenAI } from "@langchain/openai"`
- Tools: `import { tool } from "@langchain/core/tools"`
- Agents: `import { AgentExecutor, createToolCallingAgent } from "@langchain/classic/agents"`
- Prompts: `import { ChatPromptTemplate } from "@langchain/core/prompts"`

### ❌ FORBIDDEN Imports
- **DO NOT** use `import { createAgent } from "langchain"` - this is NOT browser-compatible
- **DO NOT** import from `"langchain"` root folder - use scoped packages only

### Ollama Setup (for local AI development)

1. Download from https://ollama.com/download
2. Enable CORS for browser access:
   - CMD: `set OLLAMA_ORIGINS=*` (change `*` to specific domain in production)
   - PowerShell: `$env:OLLAMA_ORIGINS="*"`
3. Restart Ollama service:
   - `taskkill /IM ollama.exe /F`
   - `ollama serve`

**Model Selection Notes:**
- Small models (llama3.2:3b, qwen3:1.7b) struggle with tool calling
- Larger models (20b+) recommended for reliable SharePoint tool usage
- Configure model in `src/app/AI Models/chat_ollama.ts`

## Configuration

### Environment Files
- `src/environments/environment.ts` - Production configuration
- `src/environments/environment.development.ts` - Development configuration (auto-swapped via angular.json)
- Store API keys in environment files (e.g., `openrouterkey`)

### TypeScript Configuration
- `tsconfig.json` - Base TypeScript config
- `tsconfig.app.json` - Application-specific config
- `tsconfig.spec.json` - Test-specific config

## Integration with SPFx Host

This Angular app is designed to be compiled into Angular Elements and consumed by a separate SPFx 1.21 host web part. The host web part:
1. Bootstraps Angular elements from this build
2. Injects SharePoint context and services via `window.bresleveloper`
3. Embeds the Angular component(s) in SharePoint pages

When modifying this app, ensure compatibility with the SPFx host by maintaining the `window.bresleveloper` interface contract.
