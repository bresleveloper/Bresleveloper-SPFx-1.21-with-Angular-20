import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { BresleveloperDigitalServicesService } from '../../sp-services/bresleveloper-digital-services.service';
import { SPListItem } from '../../sp-services/PageContext';

import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';


export interface MySPListItem extends SPListItem{
  //hyperlink column
  projectsite:{
    Description:string,
    Url:string,
  },
  //date column => return as ISO date => "2037-11-19T08:00:00Z"
  actualdate:string
}


@Component({
  selector: 'app-example-get-list-items',
  imports: [AsyncPipe],
  templateUrl: './example-get-list-items.html',
  styleUrl: './example-get-list-items.css',
})
export class ExampleGetListItems implements OnInit {

  myItemsByMark:MySPListItem[] = [];
  myItemsSignal = signal<MySPListItem[]>([]);
  //myItemsTo_Signal;
  //myItemsAsync:Promise<MySPListItem>;

  constructor(private cdr:ChangeDetectorRef) {
    //async example
    //@ts-ignore
    let bresleveloper = window.bresleveloper;
    let b:BresleveloperDigitalServicesService = bresleveloper;
    
    //IF had getListItems would return Observable
    //this.myItemsAsync = b.SPService.getListItems("SampleMetaProjects");
    //this.myItemsTo_Signal = toSignal(b.SPService.getListItems("SampleMetaProjects"));
  }

  ngOnInit(): void {
    //@ts-ignore
    let bresleveloper = window.bresleveloper;
    let b:BresleveloperDigitalServicesService = bresleveloper;
    
    b.SPService.getListItems("SampleMetaProjects").then(data=>{
      console.log(`myItemsSignal getListItems("SampleMetaProjects")`, data.value);
      this.myItemsSignal.set(data.value)
    })

    b.SPService.getListItems("SampleMetaProjects").then(data=>{
      console.log(`markForCheck getListItems("SampleMetaProjects")`, data.value);
      this.myItemsByMark = data.value
      this.cdr.markForCheck();
    })


  }

}
