//import { Injectable } from '@angular/core';
import Grapth_Service3 from './GraphService';
import { SPTermStoreService } from './SPTermStoreService';
import { PageContext } from './PageContext';

export interface BresleveloperDigitalServicesInterface {
  pageContext: PageContext;
  SPService: ISP_Service;
  GraphService: Grapth_Service3;
  TermStoreService: SPTermStoreService;
  ngElementsList:string[]

}

//@Injectable({ providedIn: 'root' })
export class BresleveloperDigitalServicesService implements BresleveloperDigitalServicesInterface {

  private _ref:BresleveloperDigitalServicesInterface;

  constructor() {
    //@ts-ignore
    this._ref = window.bresleveloper;
  }

  public get ngElementsList(): string[]{
    return this._ref.ngElementsList
  }
  
  public get pageContext(): PageContext{
    return this._ref.pageContext
  }
  public get SPService(): ISP_Service{
    return this._ref.SPService
  }
  public get GraphService(): Grapth_Service3{
    return this._ref.GraphService
  }
  public get TermStoreService(): SPTermStoreService{
    return this._ref.TermStoreService
  }
}


export interface ISP_Service {
    getListItems(listName: string, $select?: string, $filter?: string, 
      $top?: number, skipTokenIdValue?: number): Promise<any>;

    getListItemsFromWeb(web: string, listName: string, $select?: string, $filter?: string, 
        $top?: number, skipTokenIdValue?: number): Promise<any>;

    getListFields(listName: string, $filter?: string): Promise<any>;

    getListItem(listName: string, id: number): Promise<any>;

    getListItemFromWeb(web: string, listName: string, id: number): Promise<any>;

    getFiles(listName: string, $select?: string, $filter?: string): Promise<any>;

    createListItem(listName: string, body: object): Promise<any>;

    updateListItem(listName: string, id: number, body: object): Promise<any>;

    deleteListItem(listName: string, id: number): Promise<any>;

    getUserId(): Promise<any>;

    toDate_ddMMMyyyy(s: string): string;

    search(query: string, selectproperties?: string, sortlist?: string, rowlimit?: number): Promise<any>;

    addAttachment(web:string, listName: string, id: number, file: File): Promise<any>;

    deleteAttachment(odata_id:string): Promise<any>

    createFileItem(web:string, docLib:string, subfolders:string, 
                    fileName:string, fileContent:Blob, metadataBody:object): Promise<any>
}