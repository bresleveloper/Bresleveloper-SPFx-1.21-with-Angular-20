import {    SPHttpClient,SPHttpClientResponse, 
            SPHttpClientConfiguration, ISPHttpClientConfiguration, 
            ODataVersion } from '@microsoft/sp-http';

import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ISP_Service } from './bresleveloper-digital-services.service';


export default class SP_Service implements ISP_Service {
    //usage in spfx component : 
    // private _spService: SP_Service  = new SP_Service(this.context)
    constructor(public context: WebPartContext) {
        console.log("SP_Service for SPFx 1.21, _v : 1.0.0.0 / 4 ");
        
        //for ormat, set to global
        // @ts-ignore
        window._spService = this
        // @ts-ignore
        window._pageContext = context.pageContext
        // @ts-ignore
        console.log("SP_Service constructor, window._spService, window._pageContext", window._spService, window._pageContext);
        
    }


    //$select=Title,Order....
    public getListItems(listName: string, $select:string = '', $filter:string ='', $top:number = 1000, skipTokenIdValue?:number): Promise<any> {
        return this.getListItemsFromWeb(this.context.pageContext.web.absoluteUrl, listName, $select, $filter, $top, skipTokenIdValue);
    }

    public getListItemsFromWeb(web:string, listName: string, $select:string = '', $filter:string ='', $top:number = 1000, skipTokenIdValue?:number): Promise<any> {
        let $skip = skipTokenIdValue ? `$skiptoken=Paged=TRUE%26p_ID=${skipTokenIdValue}` : "";
        let promise = new Promise((resolve, reject) => {
            this.context.spHttpClient.get(
                web +
                `/_api/web/lists/GetByTitle('${listName}')/Items?$top=${$top}&${ $select ? $select : '' }&${ $filter ? $filter : '' }&${$skip}`, SPHttpClient.configurations.v1)//&$inlinecount=allpage
                .then((response: SPHttpClientResponse) => {
                    response.json().then((data:any) => {
                        console.log('list items for', listName, data);
                        resolve(data);
                    });
                });
        });
        
        return promise;
    }

    public getListFields(listName: string, $filter:string =''): Promise<any> {
        let promise = new Promise((resolve, reject) => {
            this.context.spHttpClient.get(
                this.context.pageContext.web.absoluteUrl +
                `/_api/web/lists/GetByTitle('${listName}')/fields?${ $filter ? $filter : '' }`, SPHttpClient.configurations.v1)
                .then((response: SPHttpClientResponse) => {
                    response.json().then((data:any) => {
                        console.log('list fields for', listName, data);
                        resolve(data);
                    });
                });
        });
        
        return promise;
    }

    public getListItem(listName: string, id:number): Promise<any> {
        return this.getListItemFromWeb(this.context.pageContext.web.absoluteUrl, listName, id);
    }

    public getListItemFromWeb(web:string, listName: string, id:number): Promise<any> {
        let promise = new Promise((resolve, reject) => {
            this.context.spHttpClient.get(
                web +
                `/_api/web/lists/GetByTitle('${listName}')/Items(${id})`, SPHttpClient.configurations.v1)
                .then((response: SPHttpClientResponse) => {
                    response.json().then((data:any) => {
                        console.log('list item for', listName, id, data);
                        resolve(data);
                    });
                });
        });
        
        return promise;
    }

    public getFiles(listName: string, $select:string = '', $filter:string = ''): Promise<any> {
        let promise = new Promise((resolve, reject) => {
            this.context.spHttpClient.get(
                this.context.pageContext.web.absoluteUrl +
                `/_api/web/lists/GetByTitle('${listName}')/RootFolder/Files?$top=1000&${ $select ? $select : '' }&${ $filter ? $filter : '' }`, SPHttpClient.configurations.v1)
                .then((response: SPHttpClientResponse) => {
                    response.json().then((data:any) => {
                        console.log('list items for', listName, data);
                        resolve(data);
                    });
                });
        });
        
        return promise;
    }


    public createListItem(listName: string, body: object): Promise<any> {
        // const spOpts: string = JSON.stringify({
        //     'Title': `Ã—â€ºÃ—â€¢Ã—ÂªÃ—Â¨Ã—Âª 4`, 'name': 'Ã—Â©Ã—Â 4', 'age': 80
        // });
        const spOpts: string = JSON.stringify(body);
        let promise = new Promise((resolve, reject) => {
            this.context.spHttpClient.post(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${listName}')/items`, SPHttpClient.configurations.v1, {
                headers: {
                    'Accept': 'application/json;odata=nometadata',
                    'Content-type': 'application/json;odata=nometadata',
                    'odata-version': ''
                },
                body: spOpts
            })
                .then((response: SPHttpClientResponse) => {
                    console.log(`Status code: ${response.status}`);
                    console.log(`Status text: ${response.statusText}`);
                    response.json().then((responseJSON: JSON) => {
                        console.log(responseJSON);
                        resolve(responseJSON);
                    });
                });
        });
        return promise
    }

    public updateListItem(listName: string, id: number, body: object): Promise<any> {
        let bodyStringify: string = JSON.stringify(body);
        let promise = new Promise((resolve, reject) => {
            this.context.spHttpClient.post(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${listName}')/items(${id})`,
                SPHttpClient.configurations.v1, {
                headers: {
                    //'Accept': 'application/json;odata=nometadata',
                    'Accept': 'application/json;odata=verbose',
                    'Content-type': 'application/json;odata=verbose',
                    'odata-version': '',
                    'IF-MATCH': '*',
                    'X-HTTP-Method': 'MERGE'
                },
                body: bodyStringify,
                method: 'POST'
            })
                .then((response: SPHttpClientResponse) => {
                    console.log(`response: ${response.status}`);
                    resolve(response);
                });
        });
        return promise
    }

    public deleteListItem(listName: string, id: number): Promise<any> {

        let promise = new Promise((resolve, reject) => {
            this.context.spHttpClient.post(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${listName}')/items(${id})`,
                SPHttpClient.configurations.v1, {
                headers: {
                    'Accept': 'application/json;odata=nometadata',
                    'Content-type': 'application/json;odata=nometadata',
                    'odata-version': '',
                    'IF-MATCH': '*',
                    'X-HTTP-Method': 'DELETE'
                },
            })
                .then((response: SPHttpClientResponse) => {
                    console.log(`response: ${response.status}`);
                    resolve(response);
                });
        });
        return promise
    }

    //get userid from current user using the loginname
    public getUserId(): Promise<any> {
        let promise = new Promise((resolve, reject) => {
            const payload: string = JSON.stringify({
                'logonName': this.context.pageContext.user.loginName // i:0#.f|membership|firstname.lastname@contoso.onmicrosoft.com      
              });
              var postData = {
                body: payload
              };
            this.context.spHttpClient.post(`${this.context.pageContext.web.absoluteUrl}/_api/web/ensureuser'`, SPHttpClient.configurations.v1, postData)
                .then((response: SPHttpClientResponse) => {
                    response.json().then((data:any) => {
                        console.log('user id', data);
                        resolve(data);
                    });
                });
        });
        return promise;
    }

    //"2021-06-14T21:00:00Z"  =>  16-Jul-2025
    public toDate_ddMMMyyyy (s:string):string{
        if (!s) { return "" }
        let a = new Date(s).toString().split(" ")
        //  0       1     2       3
        //['Wed', 'Jun', '16', '2021', '03:00:00', 'GMT+0300', '(Israel', 'Daylight', 'Time)']
        return `${a[2]}-${a[1]}-${a[3]}`
    };

    public search(query: string, selectproperties?:string, sortlist?:string,  rowlimit?:number): Promise<any> {
        let promise = new Promise((resolve, reject) => {

            let end = ''
            if (selectproperties) { end += `&selectproperties='${selectproperties}'` }
            if (rowlimit) { end += `&rowlimit=${rowlimit}` }
            if (sortlist) { end += `&sortlist='${sortlist}'` }

            const spSeachConfig : ISPHttpClientConfiguration = {
                defaultODataVersion : ODataVersion.v3
            };

            const clientConfigODataV3 : SPHttpClientConfiguration = SPHttpClient.configurations.v1.overrideWith(spSeachConfig);

            this.context.spHttpClient.get(
                this.context.pageContext.web.absoluteUrl +
                `/_api/search/query?querytext='${query}'${end}`, clientConfigODataV3)
                .then((response: SPHttpClientResponse) => {
                    response.json().then((data:any) => {
                        console.log('search raw data ', data);
                        
                        let results = data.PrimaryQueryResult.RelevantResults.Table.Rows;
                        console.log(results);
                        // .results//.PrimaryQueryResult.RelevantResults.Table.Rows
                        let arr:any[] = []

                        results.forEach(function (row:any) {
                            let item:any = {}
                            // row.Cells.results.forEach(function (cell) { item[cell.Key] = cell.Value })
                            row.Cells.forEach(function (cell:any) { item[cell.Key] = cell.Value })
                            arr.push(item)
                        });

                        console.log('search results for', `'${query}'${end}`, data);
                        resolve(arr);
                    });
                });
        });
        
        return promise;
    }
    
    public addAttachment(web:string, listName: string, id: number, file: File){
        console.log("addAttachment", web, listName, id, file);
        
        return new Promise((resolve, reject) => {
    
            let u = `${web}/_api/lists/GetByTitle('${listName}')/items(${id})/AttachmentFiles/add(FileName='${file.name}')`;
    
            let reader = new FileReader();
            reader.onload = (e) => {
                //@ts-ignore
                let buffer:any = e.target.result;

                this.context.spHttpClient.post(u,
                    SPHttpClient.configurations.v1, {
                    headers: {
                        //'Accept': 'application/json;odata=nometadata',
                        'Accept': 'application/json;odata=verbose',
                        'Content-type': 'application/json;odata=verbose',
                        'content-length': buffer.byteLength,
                        'odata-version': '',
                    },
                    body: buffer,
                    method: 'POST'
                })
                .then((response: SPHttpClientResponse) => {
                    console.log(`response: ${response.status}`);
                    resolve(response);
                });
            };
            reader.readAsArrayBuffer(file);
        });
    }//addAttachment
    


    public deleteAttachment(odata_id:string){
        //"@odata.id":string
        console.log("deleteAttachment", odata_id);
        
        return new Promise((resolve, reject) => {
    
            let u = odata_id

            this.context.spHttpClient.post(u,
                SPHttpClient.configurations.v1, {
                headers: {
                    //'Accept': 'application/json;odata=nometadata',
                    'Accept': 'application/json;odata=verbose',
                    'Content-type': 'application/json;odata=verbose',
                    'odata-version': '',
                    'IF-MATCH': '*',
                    'X-HTTP-Method': 'DELETE',
                },
                method: 'POST'
            })
            .then((response: SPHttpClientResponse) => {
                console.log(`response: ${response.status}`);
                resolve(response);
            });
        });
    }//deleteAttachment


    public async createFileItem(web:string, docLib:string, subfolders:string, 
                            fileName:string, fileContent:Blob, metadataBody:object){
        //must be 2 parts, upload the file, then update the fields

        // 1. Upload with $expand to get ListItem info in response
        let relUrlDocLib = `${docLib}${subfolders? '/' + subfolders:''}`
        const uploadUrl = `${web}/_api/web/GetFolderByServerRelativeUrl('${relUrlDocLib}')` + 
                            `/Files/add(url='${fileName}',overwrite=true)?$expand=ListItemAllFields`;
        
        const uploadResponse = await this.context.spHttpClient.post(uploadUrl,
            SPHttpClient.configurations.v1, {
                body: fileContent,
                headers: {
                    //'Accept': 'application/json;odata=verbose',
                    'Accept': 'application/json;odata=nometadata',
                    'Content-Type': 'application/octet-stream',
                    'odata-version': ''

                }
            }
        );//end uploadResponse

        if (!uploadResponse.ok) throw new Error('Upload failed');
        const result = await uploadResponse.json();

        if (metadataBody) {
            // 2. Update metadata - we already have item type and ID from upload response
            //const itemType = result.ListItemAllFields.__metadata.type;
            const itemId = result.ListItemAllFields.Id;

            const updateUrl = `${web}/_api/web/lists/GetByTitle('${docLib}')/items(${itemId})`;
    
            //@ts-ignore
            //metadataBody['__metadata'] = { 'type': itemType };

            await this.context.spHttpClient.post(
                updateUrl,SPHttpClient.configurations.v1, {
                    body: JSON.stringify(metadataBody),
                    headers: {
                        //'Accept': 'application/json;odata=verbose',
                        //'Content-Type': 'application/json;odata=verbose',
                        'Accept': 'application/json;odata=nometadata',
                        'Content-Type': 'application/json;odata=nometadata',
                        'IF-MATCH': '*',
                        'X-HTTP-Method': 'MERGE',
                        'odata-version': ''
                    }
                }
            );//end update
        }
        return result;
    }//createFileItem

}


// use
    // this.getListItems('test');
    // this.updateListItems('test', 2, obj);
    // this.createListItem('test', obj);
    // this.deleteListItem('test', 2);
    // this.getUserId();