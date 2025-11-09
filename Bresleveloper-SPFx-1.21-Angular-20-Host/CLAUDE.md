# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a SharePoint Framework (SPFx) 1.21 wrapper web part designed to host Angular 20 components. It can also be used as a general SPFx 1.21 starter with comprehensive SharePoint and Microsoft Graph service abstractions in `/src/sp-services`.

**Key Technologies:**
- SPFx 1.21.1
- TypeScript 5.3.3
- Node.js >= 22.14.0 < 23.0.0
- Gulp 4.0.2
- Fluent UI React 8.106.4

## Build Commands

```bash
# Development build
gulp bundle

# Production build (ship mode)
gulp bundle --ship
gulp package-solution --ship

# Development server (HTTPS on port 4321)
gulp serve

# Clean build artifacts
gulp clean

# Run tests
gulp test
```

**Build Output:**
- `lib/` - Compiled TypeScript
- `dist/` - Bundled assets
- `solution/` - `.sppkg` package for SharePoint deployment

## Architecture Overview

### Global Service Pattern

This project uses a **singleton global service pattern** where all SharePoint and Graph services are injected into `window.bresleveloper` on first render. This enables:
- Shared service instances across multiple web part instances
- Direct access from Angular components
- Debugging via browser console

**Global Interface:**
```typescript
window.bresleveloper: {
  pageContext: PageContext;
  SPService: SP_Service;
  GraphService: Graph_Service3;
  TermStoreService: SPTermStoreService;
  ngElementsList: string[];
}
```

### Dual-Mode Angular Integration

The web part supports two operational modes controlled via property pane:

1. **Development Mode** (`isDev: true`)
   - Loads Angular assets from `http://localhost:4200`
   - Expects Angular dev server running on port 4200
   - Hot reload during development

2. **Production Mode** (`isDev: false`)
   - Loads Angular assets from SharePoint document library
   - Path configured via `docLib` property
   - Supports sub-folders and different webs

### Service Layer (`/src/sp-services`)

**SPService.ts** - SharePoint REST API wrapper
- List CRUD operations (create, read, update, delete)
- File operations
- Search API
- User lookups
- Pagination via skip tokens
- Uses `SPHttpClient` with OData v1/v3

**GraphService.ts** - Microsoft Graph API client
- Generic GET/POST methods
- Planner task integration
- Uses `MSGraphClientV3`
- UUID generation utility

**SPTermStoreService.ts** - Taxonomy/Term Store management
- Async term set retrieval
- Hierarchical term support (parent/child)
- Uses Client.svc ProcessQuery pattern
- Returns strongly-typed `ISPTermObject[]`

**PageContext.ts** - Type declarations
- Complete SPFx API type definitions
- WebPartContext, PageContext interfaces
- SPUser, SPWeb, SPSite, SPList classes
- SPPermission enum (30+ permission constants)

### Web Part Structure

**Main Entry:** `src/webparts/bresleveloperAngular20Wrapper/BresleveloperAngular20WrapperWebPart.ts`

**Key Responsibilities:**
- Dynamically loads Angular CSS and JS modules
- Injects services into global scope
- Renders Angular component as custom element
- Manages configuration via property pane

**Property Pane Options:**
- `ng` - Angular component selector
- `isDev` - Dev/production mode toggle
- `isLocal` - Use local site URL vs origin
- `docLib` - Document library path for Angular assets
- `ngList` - Dropdown selection of components
- `year` - Custom property (example parameter)

**Rendering Pattern:**
```typescript
// Dynamic custom element rendering
this.domElement.innerHTML =
  `<${this.properties.ng} year=${this.properties.year}></${this.properties.ng}>`;
```


## Code Patterns and Conventions

### Naming Conventions
- Service classes: `PascalCase` + "Service" suffix (e.g., `SP_Service`)
- Interfaces: `I` prefix + `PascalCase` (e.g., `ISP_Service`)
- Web parts: `PascalCase` + "WebPart" suffix
- Private methods: `camelCase`
- OData parameters: `$select`, `$filter`, `$top`

### Debug-Friendly Globals
For development debugging, services are accessible via:
- `window._spService` - SP_Service instance
- `window._pageContext` - SPFx PageContext
- `window.bresleveloper` - Main service container

### Promise-Based Async Operations
All service methods return Promises for async operations:
```typescript
this.SPService.getListItems('Documents', '$select=Title,Modified')
  .then(data => console.log(data));
```

### HTTP Headers for SharePoint REST
- **UPDATE**: Uses `MERGE` with `IF-MATCH: '*'`
- **DELETE**: Uses `X-HTTP-Method: DELETE`
- **OData**: Supports v1 and v3 headers


## Extension Points

When adding new functionality:

1. **New Services** - Add to `/src/sp-services/`
2. **Update Global Interface** - Modify `BresleveloperInterface` to include new service
3. **Web Part Initialization** - Add service instantiation in `render()` method
4. **New Bundles** - Update `config/config.json`
5. **New Properties** - Extend `IBresleveloperAngular20WrapperWebPartProps` interface

## ESLint Rules

Project follows `@microsoft/eslint-config-spfx` with:
- Discouraged use of `any` type (warnings)
- Required explicit function return types (warnings)
- Security checks for unsafe RegExp patterns
- Prefer `undefined` over `null`
