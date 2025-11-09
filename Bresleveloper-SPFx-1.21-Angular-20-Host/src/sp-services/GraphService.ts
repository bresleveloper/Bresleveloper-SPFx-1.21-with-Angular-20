import { MSGraphClientV3 } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';


export default class Graph_Service3 {
    //usage in spfx component : 
    // private _spService: SP_Service  = new SP_Service(this.context)
    constructor(public context: WebPartContext) { }

    public getGraphApi(endpoint:string) : Promise<any> {
        let promise = new Promise( (resolve:any, reject:any) => {

            this.context.msGraphClientFactory
            .getClient('3')
            .then((client: MSGraphClientV3): void => {
                // get information about the current user from the Microsoft Graph
                client.api(endpoint)//('/me')
                .get((error, response: any, rawResponse?: any) => {
                    // handle the response
                    if (error) {
                        console.error(error);
                        alert("error getGraphApi " + endpoint)
                    }
                    resolve(response)
                });
            });

        })

        return promise;
    }

    public postGraphApi(endpoint:string, postbody:any) : Promise<any> {
        let promise = new Promise( (resolve:any, reject:any) => {

            this.context.msGraphClientFactory
            .getClient('3')
            .then((client: MSGraphClientV3): void => {
                client.api(endpoint)
                .post( postbody, (error, response: any, rawResponse?: any) => {
                        if (error) {
                            console.error(error);
                            alert("error postGraphApi " + endpoint)
                        }
                        resolve(response)
                    });
            });

        })

        return promise;
    }

    ///planner/tasks/{task-id}/details
    public updateTaskDetails(taskid:string, ifMatch:string, postbody:any) : Promise<any> {
        let promise = new Promise( (resolve:any, reject:any) => {

            this.context.msGraphClientFactory
            .getClient('3')
            .then((client: MSGraphClientV3): void => {
                client.api(`planner/tasks/${taskid}/details`)
                .header("If-Match", ifMatch)
                .patch( postbody, (error, response: any, rawResponse?: any) => {
                        if (error) {
                            console.error(error);
                            alert("error updateTaskDetails ")
                        }
                        resolve(response)
                    });
            });

        })

        return promise;
    }

    //function uuidv4() {
    public guid() {
        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
            (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
        );
    }
      

    //post(content: any, callback?: GraphRequestCallback): Promise<any>;
    //content => { body:{}, headers:{}}

}