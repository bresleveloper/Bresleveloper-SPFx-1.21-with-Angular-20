import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneCheckbox,
  PropertyPaneDropdown,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { PageContext } from '@microsoft/sp-page-context';
import SP_Service from '../../sp-services/SPService';
import Graph_Service3 from '../../sp-services/GraphService';
import { SPTermStoreService } from '../../sp-services/SPTermStoreService';


export interface IBresleveloperAngular20WrapperWebPartProps {
  ng: string;
  isDev: boolean;
  isLocal:boolean
  docLib:string
  ngList:string
  year:any
}

export interface BresleveloperInterface {
  pageContext: PageContext;
  SPService: SP_Service;
  GraphService: Graph_Service3;
  TermStoreService: SPTermStoreService;
  ngElementsList:string[]
}


export default class BresleveloperAngular20WrapperWebPart extends BaseClientSideWebPart<IBresleveloperAngular20WrapperWebPartProps> {

  private baseUrl:string

  public render(): void {
    this.properties.docLib = this.properties.docLib ? this.properties.docLib : "BresleveloperAngularSPFX"
    this.properties.ng = this.properties.ngList ? this.properties.ngList : this.properties.ng
    this.properties.isLocal = this.properties.isLocal === undefined ? true : this.properties.isLocal

    this.properties.year = 
      this.properties.year && !isNaN( parseInt(this.properties.year) ) ? 
      parseInt(this.properties.year) : new Date().getFullYear();

    console.log("BAngularWebPart v1.0.0.1 START, properties : ", this.properties);
    this.baseUrl = (this.properties.isLocal ? this.context.pageContext.site.absoluteUrl : location.origin) + "/";

    //@ts-ignore
    //let nga = window.bresleveloper && window.bresleveloper.ngElementsList ? window.bresleveloper.ngElementsList : [];

    let b:BresleveloperInterface;
    //@ts-ignore
    if ( ! window.bresleveloper) {
      b = {
        pageContext     : this.context.pageContext,
        SPService       : new SP_Service(this.context),
        GraphService    : new Graph_Service3(this.context),
        TermStoreService: new SPTermStoreService( { 
            spHttpClient    : this.context.spHttpClient, 
            siteAbsoluteUrl : this.baseUrl
        }),
        ngElementsList  : []
      };
    } else {
      //@ts-ignore
      b = window.bresleveloper
    }

    let isAngularHere = b && b.ngElementsList && b.ngElementsList.length && b.ngElementsList.length > 0

    if (isAngularHere == false) {
      if (this.properties.isDev) {
        console.log("BAngularWebPart DEBUG MODE" );
        this.addCss("http://localhost:4200/styles.css", true);
        //this.addJsPromise("http://localhost:4200/polyfills.js", true).then(()=>
          this.addJsPromise("http://localhost:4200/main.js", true).then(()=>
            console.log("ANGULAR import done")
          )
        //);
      } else {
        let u = this.properties.docLib + "/";
        console.log("BAngularWebPart RELEASE MODE, docLib", u );
        this.addCss(u + "styles.css");
        //this.addJsPromise(u + "polyfills.js").then(()=>
          this.addJsPromise(u + "main.js").then(()=>
            console.log("ANGULAR import done")
          )
        //);
      }
    }//end if isAngularHere

    //@ts-ignore
    window.bresleveloper = b;
    //@ts-ignore
    console.log("BAngularWebPart END, window.bresleveloper : ", window.bresleveloper);
    if (this.properties.ng) {
      this.domElement.innerHTML = `<${this.properties.ng} year=${this.properties.year}></${this.properties.ng}>`;
    } else {
      this.domElement.innerHTML = `<h1>use properties pane to define me ♥</h1>`;
    }
  }

  private addCss(u:string, noBase = false){
    const head: any = document.getElementsByTagName("head")[0] || document.documentElement;
    let customStyle: HTMLLinkElement = document.createElement("link");
    customStyle.href = (noBase ? "" : this.baseUrl) + u;
    customStyle.rel = "stylesheet";
    customStyle.type = "text/css";
    head.insertAdjacentElement("beforeEnd", customStyle);
    console.log("addCss Added " + u);
  }

  private addJsPromise(u:string, noBase = false, noModule = false){
    return new Promise((resolve, reject) =>{
      let myScriptTag: HTMLScriptElement = document.createElement("script");
      myScriptTag.src = (noBase ? "" : this.baseUrl) + u;
      myScriptTag.type = (noModule ? "text/javascript" : "module" );
      myScriptTag.onload = ()=>{
        console.log("addJsPromise " + u);
        resolve(null);
      };
      document.body.appendChild(myScriptTag);
    })
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }


  private tryGetNgOptions():{key:string, text:string}[]{
    //@ts-ignore
    let b:BresleveloperInterface = window.bresleveloper
    let options:{key:string, text:string}[] = [ { key : '', text : "" } ];
    if (b && b.ngElementsList && b.ngElementsList.length && b.ngElementsList.length > 0) {
      //{ key: '1', text: 'One'},
      b.ngElementsList.forEach((ngEL, i) => options.push({key:ngEL, text:ngEL}))
    }
    return options;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: "Bresleveloper Digital Angular WebPart"
          },
          groups: [
            {
              groupName: "WebPart Settings",
              groupFields: [
                PropertyPaneDropdown("ngList", { label: 'ng comps',
                  options: this.tryGetNgOptions(), 
                }),
                PropertyPaneTextField('ng', { label: "angular element selector" }),
                PropertyPaneCheckbox('isDev', { text: "is dev mode? (use files from http://localhost:4200)" }),
                PropertyPaneCheckbox('isLocal', { text: "is local? (use docLib from current web)" }),
                PropertyPaneTextField('docLib', { 
                  label:  "document library url value. for sub-folder use full relative url value. " + 
                          "for another web use isLocal=false and here start from sites/<site>/<web>/<docLib>/<folder>"
                }),
                PropertyPaneTextField('year', { label: "defaul is current year" }),
              ]
            }
          ]
        }
      ]
    };
  }
}