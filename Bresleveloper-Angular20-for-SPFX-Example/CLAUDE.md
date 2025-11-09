# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Angular 20 application designed to be embedded within SharePoint Framework (SPFx) 1.21 web parts as Angular Elements (custom elements). The Angular components compile to web components that can be consumed by SPFx solutions.

## Build Commands

### Development
- `npm install` - Install dependencies (required after cloning)
- `npm start` - Start development server with `ng serve`
- `npm run watch` - Build in watch mode with development configuration

### Build
- `npm run build` - Standard production build
- `ng build --output-hashing=none` - **Required build command for SPFx integration** (disables hash suffixes for predictable file names)

### Testing
- `npm test` - Run unit tests with Karma and Jasmine

## Architecture

### Angular Elements Integration

This project uses `@angular/elements` to create custom web components that can be embedded in SharePoint:

1. **main.ts**: Entry point that registers Angular components as custom elements
   - Uses `createApplication()` and `createCustomElement()` to define web components
   - Registers elements with the global `window.bresleveloper.ngElementsList` array
   - Example: `customElements.define('ex-get-list-items', c_ExGetListItems)`

2. **Global Window Interface**: SPFx host provides services via `window.bresleveloper`:
   - `pageContext`: SharePoint context (site, web, user, list info)
   - `SPService`: SharePoint REST API wrapper service
   - `ngElementsList`: Array tracking registered Angular Elements

### SharePoint Services Bridge

**BresleveloperDigitalServicesService** (`src/app/sp-services/bresleveloper-digital-services.service.ts`):
- Provides typed access to SharePoint services injected by the SPFx host
- **SPService Interface** offers methods like:
  - `getListItems(listName, $select, $filter, $top, skipTokenIdValue)`
  - `getListItemsFromWeb(web, listName, ...)`
  - `createListItem(listName, body)`, `updateListItem(listName, id, body)`, `deleteListItem(listName, id)`
  - `search(query, selectproperties, sortlist, rowlimit)`
- All SharePoint data operations return Promises

**PageContext.ts** (`src/app/sp-services/PageContext.ts`):
- Contains TypeScript type definitions for SharePoint Framework classes
- Includes SPFx context types: `WebPartContext`, `PageContext`, `SPList`, `SPListItem`, `SPUser`, `SPWeb`, `SPSite`
- Microsoft Graph API types: `MSGraphClientFactory`, `GraphRequest`
- HTTP client types: `SPHttpClient`, `HttpClient`
- Permission and utility types: `SPPermission`, `Guid`

### Angular Configuration

**Zoneless Change Detection**:
- Configured with `provideZonelessChangeDetection()` in `app.config.ts`
- Components must explicitly trigger change detection using:
  - `signal()` for reactive state (preferred)
  - `ChangeDetectorRef.markForCheck()` for imperative updates
  - `async` pipe for Observable/Promise handling

**Example Component Pattern** (`src/app/component/example-get-list-items/example-get-list-items.ts`):
```typescript
// Using signals (reactive)
myItemsSignal = signal<MySPListItem[]>([]);
b.SPService.getListItems("SampleMetaProjects").then(data => {
  this.myItemsSignal.set(data.value)
})

// Using ChangeDetectorRef (imperative)
constructor(private cdr: ChangeDetectorRef) {}
b.SPService.getListItems("SampleMetaProjects").then(data => {
  this.myItemsByMark = data.value
  this.cdr.markForCheck();
})
```

### Component Structure

Components should follow this pattern:
- Located in `src/app/component/[component-name]/`
- Files: `[name].ts`, `[name].html`, `[name].css`, `[name].spec.ts`
- Use standalone components (Angular 20 default)
- Import required modules directly in component decorator

## Important Notes

### SPFx Integration Requirements
- Build output must use `--output-hashing=none` to generate consistent file names for SPFx consumption
- The SPFx host application will load the compiled Angular bundles and provide the global `window.bresleveloper` interface
- New components must be registered in `main.ts` using `customElements.define()`

### Working with SharePoint Data
- Access SharePoint context via `window.bresleveloper.pageContext`
- Use `window.bresleveloper.SPService` for all SharePoint REST API calls
- All SPService methods return Promises (not Observables)
- Define custom interfaces extending `SPListItem` for type-safe list data access

### Zoneless Change Detection
- Always use `signal()` for component state that needs to trigger UI updates
- Use `ChangeDetectorRef.markForCheck()` when updating properties outside signals
- The `async` pipe automatically handles change detection for Observables/Promises
