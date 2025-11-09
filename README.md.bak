# Bresleveloper SPFx 1.21 with Angular 20


* [Watch the Youtube Tutorial (Hebrew)](TBD)
* [Based on my spfx angular tutorial](https://github.com/bresleveloper/angular-spfx) - UPDATED VERSION, READ FOREWARD
* [SPFx Angular Langchain Local AI](https://github.com/bresleveloper/Bresleveloper-SPFx-1.21-with-Angular-20/tree/master/Bresleveloper-AI-SPFx-Angular20-Langchain) - sub project for using local AI to query SP



## This REPO Contains 3 Projects:

* SPFx project (with compiled `.sppgk`) that auto-host angular seamlessly 
* Simple angular project with `Hello World` + `getSPListItems` as example 
* AI Agent angular project that demonstrate how-to use AI Agents with `langchain` easy-peasy, with cloud or local models

**Notes**
* spfx project just download the [bresleveloper-spfx-1-21-angular-20.sppkg]() and upload to [SharePoint AppCatalog](https://learn.microsoft.com/en-us/sharepoint/use-app-catalog)
* easiet way to clone the angular projects is to use my [@bresleveloper/starter](https://github.com/bresleveloper/npm-starter) (see below) and delete the other projects
* i prefer to leave it all as 1 repo for ease of access to full eco-system

**@bresleveloper/starter**
* `npm install @bresleveloper/starter`
* `bresleveloper dup myNewProject https://github.com/bresleveloper/TBD`
* goto relevant project (delete the rest) and `npm install` 




## Requirements:

* NodeJS 22 ([node download page](https://nodejs.org/en/download))
* spfx version is 1.21.x, compatible with node v22. [Set up SPFx dev env](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-development-environment)   ---    [spfx compatibility](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/compatibility)
* angular 20 [install angular](https://angular.dev/installation)



**usage**
* create document library in your SharePoint Site `BresleveloperAngularSPFX` 
* build with `ng build --output-hashing=none`
* upload angular files to `BresleveloperAngularSPFX` 
* add webpart `bresleveloper-angular-20-wrapper` and define properties

## SPFx webpart properties:

* `"ngList", label: 'ng comps'` - ease of life pre-compiled list of available angular components (see Angular section)
* `'ng',     label: "angular element selector"` - the actual Angular selector for component to be rendered (no `<>` just name in selector in `component.ts`)
* `'isDev',  text:  "is dev mode? (use files from http://localhost:4200)"` - set to use `ng serve` for easy dev time
* `'isLocal' text:  "is local? (use docLib from current web)" }),` - use `docLib` value from local SharePoint Site
* `'docLib'  label: "document library url value.....` - 
  * DEFAULT for production just check `isLocal` and use `BresleveloperAngularSPFX` as above (**usage**)
  * IF `isLocal` is checked you can put here ANY `doclib/folder` you want
  * IF `isLocal` is NOT checked you can put here any FULL PATH to any `doclib/folder` you want




## Angular

### Dependencies for new project

**default settings**
* `ng new <projectName>`
* is automatically standalone 
* say NO to SSR (server side rendering)
* say YES to zoneless [learn how to zoneless](https://angularexperts.io/blog/zoneless-angular)
* `npm install @angular/elements --save`
* build with `ng build --output-hashing=none`

**see Angular AI Agents project for his additional dependencies**

### main.js

**for each new component**

* for example `MyNewThingComponent` - `ng g c MyNewThing`
* must import to `main.js` file `import { MyNewThingComponent } from './app/my-new-thing/my-new-thing';`
* create angular element `const c_MyNewThingComponent = createCustomElement(MyNewThingComponent, { injector: app.injector });`
* create custom element `customElements.define('app-my-new-thing', c_MyNewThingComponent);`
* push to dictionary for SPFx webpart  `a.push("app-my-new-thing")`


**Edit main.js to this**

```
import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { appConfig } from './app/app.config';
import { TestStandAlone } from './app/c/test-stand-alone/test-stand-alone';

createApplication(appConfig)
  .then((app) => {


    //@ts-ignore
    let a:string[] = window.bresleveloper.ngElementsList

    const c_TestStandAlone = createCustomElement(TestStandAlone, { injector: app.injector });
    customElements.define('app-test-stand-alone', c_TestStandAlone);
    a.push("app-test-stand-alone")


  })
  .catch((err) => console.error(err));
```



### Access SharePoint / O365 services via Angular

**1. copy models**

copy files from spfx project to angular project:
* `src/sp-services/bresleveloper-digital-services.service.ts`
* `src/sp-services/PageContext.ts`

**NOTE** 
* IF you want to use `GraphService`and `TermStoreService`, either reference them to via the SPFx node_modules folders or `npm install` the required modules. 
* otherwise if you nees just SP you can delete references 
* TBD - make them interfaces as well


**2. add interface**
```
export interface BresleveloperInterface {
  pageContext: PageContext;
  SPService: SP_Service;
  GraphService: Grapth_Service3;          //can remove
  TermStoreService: SPTermStoreService;   //can remove
}
```

**3. reference in component**
```
  //@ts-ignore
  let b:BresleveloperDigitalServicesService = window.bresleveloper;
  let items = await b.SPService.getListItems("MyAwesomeListTitle");
```





## Other Tips


**build spfx**
* PS -  `gulp clean && gulp build && gulp bundle --ship && gulp package-solution --ship`
* CMD - `gulp clean ; gulp build ; gulp bundle --ship ; gulp package-solution --ship`



**suppress errors on gulp build**
in `gulpfile.js` add `build.addSuppression(/Warning/gi);` (no need for compilerOptions stuff)



**suppress ts errors**
```
  "compilerOptions": {
    "noUnusedLocals": false,
    "strictNullChecks":false,
```

