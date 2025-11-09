import { Component, ElementRef, ViewChild } from '@angular/core';
import { agentSPExec } from '../../AI Agents/SPAgent';
import { agentMetaItemsExec } from '../../AI Agents/SPMetaListAgent';

@Component({
  selector: 'app-use-sptools-comp',
  imports: [],
  templateUrl: './use-sptools-comp.html',
  styleUrl: './use-sptools-comp.css',
})
export class UseSPToolsComp {


  @ViewChild('result_SP', { static: false }) result_SP!: ElementRef;
  // get the items for sharepoint list named "SampleMetaProjects"
  async askSP(userQuery:string){
    console.log("UseSPToolsComp start", userQuery);
    let agentResult = await agentSPExec.invoke({
      input:userQuery
    })
    console.log("UseSPToolsComp askSP end", userQuery, agentResult);
    // let el = this.result_SP.nativeElement as HTMLDivElement;
    // el.innerHTML
    this.result_SP.nativeElement.innerHTML = agentResult['output'];
  }


  
  @ViewChild('result_meta', { static: false }) result_meta!: ElementRef;
  // give me details about the stairs project, what is the last update, as short as possible
  async askMetaSPList(userQuery:string){
    console.log("askMetaSPList start", userQuery);
    let agentResult = await agentMetaItemsExec.invoke({
      input:userQuery
    })
    console.log("askMetaSPList askSP end", userQuery, agentResult);
    this.result_meta.nativeElement.innerHTML = agentResult['output'];
  }

}
