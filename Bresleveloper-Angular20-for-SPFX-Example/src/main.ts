

import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { appConfig } from './app/app.config';
import { ExampleGetListItems } from './app/component/example-get-list-items/example-get-list-items';


createApplication(appConfig)
  .then((app) => {


    //@ts-ignore
    let a:string[] = window.bresleveloper.ngElementsList

    const c_ExGetListItems = createCustomElement(ExampleGetListItems, { injector: app.injector });
    customElements.define('ex-get-list-items', c_ExGetListItems);
    a.push("ex-get-list-items")



  })
  .catch((err) => console.error(err));