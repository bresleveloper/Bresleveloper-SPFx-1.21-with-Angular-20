# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a monorepo containing three interconnected projects that demonstrate how to integrate Angular 20 applications with SharePoint Framework (SPFx) 1.21 using Angular Elements (custom web components):

1. **Bresleveloper-SPFx-1.21-Angular-20-Host** - SPFx 1.21 wrapper web part that hosts Angular components
2. **Bresleveloper-Angular20-for-SPFX-Example** - Simple Angular 20 example with SharePoint integration
3. **Bresleveloper-AI-SPFx-Angular20-Langchain** - Advanced Angular 20 app with LangChain AI agents for SharePoint

**Key Technologies:**
- SharePoint Framework (SPFx) 1.21.x
- Angular 20 with zoneless change detection
- Node.js 22.x
- TypeScript 5.3.3
- LangChain 1.0.x (AI project only)

## Common Workflow

### Initial Setup
```bash
# Clone specific project using @bresleveloper/starter (recommended)
npm install @bresleveloper/starter
bresleveloper dup myNewProject https://github.com/bresleveloper/[repo-url]

# OR clone entire repository
git clone [repo-url]

# Navigate to desired project and install dependencies
cd Bresleveloper-Angular20-for-SPFX-Example
npm install
```

### Development Workflow

**1. SPFx Host Development:**
```bash
cd Bresleveloper-SPFx-1.21-Angular-20-Host

# Development build
gulp bundle

# Start local workbench (HTTPS port 4321)
gulp serve

# Production build and package
gulp clean && gulp build && gulp bundle --ship && gulp package-solution --ship
```

**2. Angular Development:**
```bash
cd Bresleveloper-Angular20-for-SPFX-Example  # or AI-SPFx-Angular20-Langchain

# Development server (port 4200)
npm start

# Production build (REQUIRED: no output hashing for SPFx integration)
ng build --output-hashing=none

# Watch mode
npm run watch
```

**3. SharePoint Deployment:**
- Upload compiled `.sppkg` from `Bresleveloper-SPFx-1.21-Angular-20-Host/sharepoint/solution/` to SharePoint App Catalog
- Create document library named `BresleveloperAngularSPFX` in target SharePoint site
- Build Angular project with `ng build --output-hashing=none`
- Upload Angular build output (from `dist/[project-name]/browser/`) to `BresleveloperAngularSPFX` library
- Add web part `bresleveloper-angular-20-wrapper` to SharePoint page
- Configure web part properties to point to Angular component

## Architecture: Global Service Pattern

All three projects share a **singleton global service pattern** where SharePoint and Microsoft Graph services are injected into the global scope on first render:

```typescript
window.bresleveloper: {
  pageContext: PageContext;           // SharePoint context (site, web, user, lists)
  SPService: SP_Service;              // SharePoint REST API wrapper
  GraphService: Graph_Service3;       // Microsoft Graph API client
  TermStoreService: SPTermStoreService; // Taxonomy/Term Store management
  ngElementsList: string[];           // Registry of available Angular Elements
}
```

**Why This Matters:**
- Angular components access SharePoint via `window.bresleveloper` (not via Angular services)
- Services are shared across multiple web part instances on the same page
- Debugging via browser console: `window.bresleveloper.SPService.getListItems("MyList")`
- SPFx host provides the services; Angular consumes them

## SPFx Web Part Configuration

The SPFx host web part has the following properties configurable via property pane:

- **`ng`** - Angular component selector (e.g., `app-my-component`)
- **`ngList`** - Dropdown of available components from `window.bresleveloper.ngElementsList`
- **`isDev`** - Toggle between dev (localhost:4200) and production mode
- **`isLocal`** - Use current SharePoint site vs. absolute URL
- **`docLib`** - Document library path for Angular assets
  - If `isLocal=true` and `isDev=false`: Uses `[current-site]/docLib` value
  - If `isLocal=false`: Must provide full URL path to document library
  - If `isDev=true`: Loads from `http://localhost:4200` (ignores docLib)

## Adding New Angular Components

When creating a new Angular component for SPFx integration:

1. **Generate component:**
   ```bash
   ng g c MyNewThing
   ```

2. **Register in main.ts:**
   ```typescript
   import { MyNewThingComponent } from './app/my-new-thing/my-new-thing';

   createApplication(appConfig).then((app) => {
     let a: string[] = window.bresleveloper.ngElementsList;

     const c_MyNewThingComponent = createCustomElement(MyNewThingComponent, { injector: app.injector });
     customElements.define('app-my-new-thing', c_MyNewThingComponent);
     a.push("app-my-new-thing");
   });
   ```

3. **Build with no hashing:**
   ```bash
   ng build --output-hashing=none
   ```

4. **Upload to SharePoint document library and configure web part**

## Angular + SharePoint Integration Patterns

### Accessing SharePoint Services

**1. Type the global interface:**
```typescript
export interface BresleveloperInterface {
  pageContext: PageContext;
  SPService: SP_Service;
  GraphService: Graph_Service3;
  TermStoreService: SPTermStoreService;
  ngElementsList: string[];
}
```

**2. Access in component:**
```typescript
//@ts-ignore
let b: BresleveloperDigitalServicesService = window.bresleveloper;

// Get list items
let items = await b.SPService.getListItems("MyList");

// Get with OData query
let filtered = await b.SPService.getListItems(
  "MyList",
  "$select=Title,Modified",
  "$filter=Status eq 'Active'",
  10  // $top
);

// Create item
await b.SPService.createListItem("MyList", { Title: "New Item" });

// Update item
await b.SPService.updateListItem("MyList", 5, { Title: "Updated" });

// Delete item
await b.SPService.deleteListItem("MyList", 5);
```

### Zoneless Change Detection (Angular 20)

All Angular projects use zoneless change detection. **Must explicitly trigger UI updates:**

```typescript
import { signal, ChangeDetectorRef } from '@angular/core';

// PREFERRED: Using signals (reactive)
myItemsSignal = signal<MySPListItem[]>([]);

ngOnInit() {
  b.SPService.getListItems("MyList").then(data => {
    this.myItemsSignal.set(data.value);  // Automatically triggers UI update
  });
}

// ALTERNATIVE: Using ChangeDetectorRef (imperative)
constructor(private cdr: ChangeDetectorRef) {}

ngOnInit() {
  b.SPService.getListItems("MyList").then(data => {
    this.myItems = data.value;
    this.cdr.markForCheck();  // Manually trigger change detection
  });
}
```

## SharePoint Service Layer

All projects share common service interfaces (located in `src/sp-services/`):

**SPService.ts** - SharePoint REST API wrapper:
- `getListItems(listName, $select?, $filter?, $top?, skipTokenIdValue?)`
- `getListItemsFromWeb(web, listName, ...)` - Query different site collections
- `createListItem(listName, body)`, `updateListItem(listName, id, body)`, `deleteListItem(listName, id)`
- `search(query, selectproperties, sortlist, rowlimit)` - SharePoint search
- Uses `SPHttpClient` with OData v1/v3

**GraphService.ts** - Microsoft Graph API client:
- Generic GET/POST methods
- Planner task integration
- Uses `MSGraphClientV3`

**SPTermStoreService.ts** - Taxonomy management:
- `getTermsFromTermSet(termSetId)`
- Supports hierarchical terms (parent/child)

**PageContext.ts** - Complete TypeScript type definitions for SPFx API

## AI Integration (Langchain Project Only)

The `Bresleveloper-AI-SPFx-Angular20-Langchain` project demonstrates AI agents that can query SharePoint data using natural language.

### LangChain 1.0.x Browser Compatibility

**CRITICAL IMPORT RULES:**

✅ **Allowed:**
```typescript
import { ChatOpenAI } from "@langchain/openai"
import { tool } from "@langchain/core/tools"
import { AgentExecutor, createToolCallingAgent } from "@langchain/classic/agents"
import { ChatPromptTemplate } from "@langchain/core/prompts"
```

❌ **Forbidden:**
```typescript
import { createAgent } from "langchain"  // NOT browser-compatible
import { ... } from "langchain"          // DO NOT use root package
```

### AI Architecture Layers

1. **AI Models** (`src/app/AI Models/`):
   - `chat_ollama.ts` - Local Ollama models via OpenAI-compatible endpoint (`http://localhost:11434/v1`)
   - `chat_openrouter.ts` - Cloud models via OpenRouter API
   - Both use `ChatOpenAI` with custom `baseURL`

2. **AI Tools** (`src/app/AI Tools/`):
   - Tools defined with `tool()` from `@langchain/core/tools` and Zod schemas
   - `SPTools.ts` - General SharePoint operations (GetSPListItems, GetSPSitePageContent)
   - `SPMetaListTools.ts` - Specialized project management queries
   - All tools access SharePoint via `window.bresleveloper.SPService`

3. **AI Agents** (`src/app/AI Agents/`):
   - `SPAgent.ts` - General SharePoint agent
   - `SPMetaListAgent.ts` - Specialized meta-list agent
   - Use `createToolCallingAgent()` with `AgentExecutor`

### Ollama Local AI Setup

```bash
# Set CORS environment variable (required for browser access)
# CMD:
set OLLAMA_ORIGINS=*

# PowerShell:
$env:OLLAMA_ORIGINS="*"

# Restart Ollama
taskkill /IM ollama.exe /F
ollama serve
```

**Model Recommendations:**
- Small models (llama3.2:3b, qwen3:1.7b) struggle with tool calling
- Use 20b+ parameter models for reliable SharePoint tool usage

## Common Build Issues

### SPFx Build Suppression

**Suppress gulp warnings** - Add to `gulpfile.js`:
```javascript
build.addSuppression(/Warning/gi);
```

**Suppress TypeScript errors** - Add to `tsconfig.json`:
```json
{
  "compilerOptions": {
    "noUnusedLocals": false,
    "strictNullChecks": false
  }
}
```

### Angular Build Requirements

- **ALWAYS** use `ng build --output-hashing=none` for SPFx integration
- Hashed file names break SPFx dynamic script loading
- Build output goes to `dist/[project-name]/browser/`

## Project-Specific Documentation

Each sub-project has its own `CLAUDE.md` with detailed information:

- **Bresleveloper-SPFx-1.21-Angular-20-Host/CLAUDE.md** - SPFx wrapper internals, service layer, property pane
- **Bresleveloper-Angular20-for-SPFX-Example/CLAUDE.md** - Angular Elements integration, component patterns
- **Bresleveloper-AI-SPFx-Angular20-Langchain/CLAUDE.md** - LangChain setup, AI tools, agent configuration

## Requirements

- Node.js 22.x (>= 22.14.0, < 23.0.0)
- Angular CLI 20.x
- SPFx 1.21.x compatible toolchain
- SharePoint Online tenant (for deployment)
- Ollama (optional, for local AI development)
