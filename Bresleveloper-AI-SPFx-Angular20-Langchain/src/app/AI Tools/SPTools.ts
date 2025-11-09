
import { tool } from "@langchain/core/tools";
import * as z from "zod";
import { BresleveloperDigitalServicesService } from "../sp-services/bresleveloper-digital-services.service";




const GetSPListItems = tool(
    async (input) => {
        //@ts-ignore
        let b:BresleveloperDigitalServicesService = window.bresleveloper;
        
        let items = await b.SPService.getListItems(input.ListTitle)
        console.log("GetSPListItems tool", input.ListTitle, items);
        return JSON.stringify(items.value)
    },
    {
        name: "GetSPListItems",
        description: "Get All SharePoint Items from a SharePoint List",
        schema: z.object({
            ListTitle: z.string().describe("the name of the SharePoint List")
        })
    }
)



const GetSPSitePageContent = tool(
  async (input) => {  
    //@ts-ignore
    let b:BresleveloperDigitalServicesService = window.bresleveloper;

    let $select = `$select=Title,CanvasContent1`
    let $filter = `$filter=ID eq 1`
    let itemRes = await b.SPService.getListItemsFromWeb(input.url, 'Site Pages', $select, $filter);

    let itemCanvasContent1 = itemRes?.value[0]?.CanvasContent1;
    console.log("getSPProjectPage tool", itemRes);
    return itemCanvasContent1
  },
  {
    name: "GetSPSitePageContent",
    description: "Get content from sharepoint team site home page , BY URL " + 
    " (returns as complex xml->json->text, must extract)",
    schema: z.object({
      url: z.string().describe("The url for the sharepoint team site"),
    }),
  }
);




export const SPTools = [GetSPListItems, GetSPSitePageContent];