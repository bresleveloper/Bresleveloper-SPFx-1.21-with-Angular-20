


import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { appConfig } from './app/app.config';
import { UseSPToolsComp } from './app/Components/use-sptools-comp/use-sptools-comp';

createApplication(appConfig)
  .then((app) => {


    //@ts-ignore
    let a:string[] = window.bresleveloper.ngElementsList

    const c_UseSPToolsComp = createCustomElement(UseSPToolsComp, { injector: app.injector });
    customElements.define('app-use-sptools-comp', c_UseSPToolsComp);
    a.push("app-use-sptools-comp")


  })
  .catch((err) => console.error(err));