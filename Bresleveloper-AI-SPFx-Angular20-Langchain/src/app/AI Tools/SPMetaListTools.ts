
// import { tool } from "langchain";
import { tool } from "@langchain/core/tools";
import * as z from "zod";
import { BresleveloperDigitalServicesService } from "../sp-services/bresleveloper-digital-services.service";


const getSPMetaList = tool(
  async (input) => {  // ✅ Add input parameter (unused but required)
    //@ts-ignore
    let b:BresleveloperDigitalServicesService = window.bresleveloper;
    let items = await b.SPService.getListItems("SampleMetaProjects");
    console.log("getSPMetaList tool", items);
    return JSON.stringify(items);  // ✅ Return as string
  },
  {
    name: "getSPMetaList",
    description: "Get ALL the SharePoint Project's Meta List Items (including project site url)",
    schema: z.object({}),  // ✅ Empty schema for no parameters
  }
);

const getSPProjectPage = tool(
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
    name: "getSPProjectPage",
    description: "Get Project's Detail from sharepoint team site for this project, BY URL " + 
    " (returns as complex xml->json->text, must extract)",
    schema: z.object({
      url: z.string().describe("The url for the sharepoint team site"),
    }),
  }
);


export const SPMetaListTools = [getSPMetaList, getSPProjectPage];
