





export declare class WebPartContext  { //skipped all extends
    get domElement(): HTMLElement;
    get webPartTag(): string;
    get instanceId(): string;
    get pageContext(): PageContext;
    get dynamicDataProvider(): any;
    get dynamicDataSourceManager(): any;
    get msGraphClientFactory(): MSGraphClientFactory;
    get httpClient(): HttpClient;
    get spHttpClient(): SPHttpClient;
    get isServedFromLocalhost(): boolean;
}

export declare class MSGraphClientFactory {
    getClient(version: '3'): Promise<MSGraphClientV3>;
    //getClientWithMiddleware(version: '3', options: ClientOptions): Promise<MSGraphClientV3>;
}

export declare class MSGraphClientV3 {
    api(path: string): GraphRequest;
    get client(): Client;
}

export declare class Client {
    api(path: string): GraphRequest;
}

interface KeyValuePairObjectStringNumber {
    [key: string]: string | number;
}

export declare type GraphRequestCallback = (error: GraphError, response: any, rawResponse?: any) => void;

export declare class GraphError extends Error {
    statusCode: number;
    code: string | null;
    requestId: string | null;
    date: Date;
    body: any;
}

//this thing has good stuff..
export declare class GraphRequest {
    header(headerKey: string, headerValue: string): GraphRequest;
    headers(headers: KeyValuePairObjectStringNumber | HeadersInit): GraphRequest;
    option(key: string, value: any): GraphRequest;
    options(options: {
        [key: string]: any;
    }): GraphRequest;
    //middlewareOptions(options: MiddlewareOptions[]): GraphRequest;
    version(version: string): GraphRequest;
    responseType(responseType: ResponseType): GraphRequest;
    /**
     * @public
     * To add properties for select OData Query param
     * @param {string|string[]} properties - The Properties value
     * @returns The same GraphRequest instance that is being called with, after adding the properties for $select query
     */
    select(properties: string | string[]): GraphRequest;
    /**
     * @public
     * To add properties for expand OData Query param
     * @param {string|string[]} properties - The Properties value
     * @returns The same GraphRequest instance that is being called with, after adding the properties for $expand query
     */
    expand(properties: string | string[]): GraphRequest;
    /**
     * @public
     * To add properties for orderby OData Query param
     * @param {string|string[]} properties - The Properties value
     * @returns The same GraphRequest instance that is being called with, after adding the properties for $orderby query
     */
    orderby(properties: string | string[]): GraphRequest;
    /**
     * @public
     * To add query string for filter OData Query param. The request URL accepts only one $filter Odata Query option and its value is set to the most recently passed filter query string.
     * @param {string} filterStr - The filter query string
     * @returns The same GraphRequest instance that is being called with, after adding the $filter query
     */
    filter(filterStr: string): GraphRequest;
    /**
     * @public
     * To add criterion for search OData Query param. The request URL accepts only one $search Odata Query option and its value is set to the most recently passed search criterion string.
     * @param {string} searchStr - The search criterion string
     * @returns The same GraphRequest instance that is being called with, after adding the $search query criteria
     */
    search(searchStr: string): GraphRequest;
    /**
     * @public
     * To add number for top OData Query param. The request URL accepts only one $top Odata Query option and its value is set to the most recently passed number value.
     * @param {number} n - The number value
     * @returns The same GraphRequest instance that is being called with, after adding the number for $top query
     */
    top(n: number): GraphRequest;
    /**
     * @public
     * To add number for skip OData Query param. The request URL accepts only one $skip Odata Query option and its value is set to the most recently passed number value.
     * @param {number} n - The number value
     * @returns The same GraphRequest instance that is being called with, after adding the number for the $skip query
     */
    skip(n: number): GraphRequest;
    /**
     * @public
     * To add token string for skipToken OData Query param. The request URL accepts only one $skipToken Odata Query option and its value is set to the most recently passed token value.
     * @param {string} token - The token value
     * @returns The same GraphRequest instance that is being called with, after adding the token string for $skipToken query option
     */
    skipToken(token: string): GraphRequest;
    /**
     * @public
     * To add boolean for count OData Query param. The URL accepts only one $count Odata Query option and its value is set to the most recently passed boolean value.
     * @param {boolean} isCount - The count boolean
     * @returns The same GraphRequest instance that is being called with, after adding the boolean value for the $count query option
     */
    count(isCount?: boolean): GraphRequest;
    /**
     * @public
     * Appends query string to the urlComponent
     * @param {string|KeyValuePairObjectStringNumber} queryDictionaryOrString - The query value
     * @returns The same GraphRequest instance that is being called with, after appending the query string to the url component
     */
    query(queryDictionaryOrString: string | KeyValuePairObjectStringNumber): GraphRequest;
    /**
     * @public
     * @async
     * Makes a http request with GET method
     * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
     * @returns A promise that resolves to the get response
     */
    get(callback?: GraphRequestCallback): Promise<any>;
    /**
     * @public
     * @async
     * Makes a http request with POST method
     * @param {any} content - The content that needs to be sent with the request
     * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
     * @returns A promise that resolves to the post response
     */
    post(content: any, callback?: GraphRequestCallback): Promise<any>;
    /**
     * @public
     * @async
     * Alias for Post request call
     * @param {any} content - The content that needs to be sent with the request
     * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
     * @returns A promise that resolves to the post response
     */
    create(content: any, callback?: GraphRequestCallback): Promise<any>;
    /**
     * @public
     * @async
     * Makes http request with PUT method
     * @param {any} content - The content that needs to be sent with the request
     * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
     * @returns A promise that resolves to the put response
     */
    put(content: any, callback?: GraphRequestCallback): Promise<any>;
    /**
     * @public
     * @async
     * Makes http request with PATCH method
     * @param {any} content - The content that needs to be sent with the request
     * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
     * @returns A promise that resolves to the patch response
     */
    patch(content: any, callback?: GraphRequestCallback): Promise<any>;
    /**
     * @public
     * @async
     * Alias for PATCH request
     * @param {any} content - The content that needs to be sent with the request
     * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
     * @returns A promise that resolves to the patch response
     */
    update(content: any, callback?: GraphRequestCallback): Promise<any>;
    /**
     * @public
     * @async
     * Makes http request with DELETE method
     * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
     * @returns A promise that resolves to the delete response
     */
    delete(callback?: GraphRequestCallback): Promise<any>;
    /**
     * @public
     * @async
     * Alias for delete request call
     * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
     * @returns A promise that resolves to the delete response
     */
    del(callback?: GraphRequestCallback): Promise<any>;
    /**
     * @public
     * @async
     * Makes a http request with GET method to read response as a stream.
     * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
     * @returns A promise that resolves to the getStream response
     */
    getStream(callback?: GraphRequestCallback): Promise<any>;
    /**
     * @public
     * @async
     * Makes a http request with GET method to read response as a stream.
     * @param {any} stream - The stream instance
     * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
     * @returns A promise that resolves to the putStream response
     */
    putStream(stream: any, callback?: GraphRequestCallback): Promise<any>;
}

export declare interface IHttpClientConfigurations {
    readonly v1: HttpClientConfiguration;
}

export declare interface IHttpClientConfiguration {}  

export declare class HttpClientConfiguration implements IHttpClientConfiguration {
    protected flags: IHttpClientConfiguration;
    constructor(flags: IHttpClientConfiguration, overrideFlags?: IHttpClientConfiguration);
    overrideWith(sourceFlags: IHttpClientConfiguration): HttpClientConfiguration;
    protected initializeFlags(): void;
}


export declare class HttpClient {
    static readonly configurations: IHttpClientConfigurations;
    fetch(url: string, configuration: HttpClientConfiguration, options: IHttpClientOptions): Promise<HttpClientResponse>;
    get(url: string, configuration: HttpClientConfiguration, options?: IHttpClientOptions): Promise<HttpClientResponse>;
    post(url: string, configuration: HttpClientConfiguration, options: IHttpClientOptions): Promise<HttpClientResponse>;
}

export declare interface IHttpClientOptions extends RequestInit {}

export declare class HttpClientResponse  {
    protected nativeResponse: Response;
    get bodyUsed(): boolean;
    arrayBuffer(): Promise<ArrayBuffer>;
    blob(): Promise<Blob>;
    formData(): Promise<FormData>;
    json(): Promise<any>;
    text(): Promise<string>;
    get type(): ResponseType;
    get url(): string;
    get status(): number;
    get ok(): boolean;
    get statusText(): string;
    get headers(): Headers;
    clone(): HttpClientResponse;
}

export declare class SPHttpClient {
    static readonly configurations: ISPHttpClientConfigurations;
    static getWebUrlFromRequestUrl(requestUrl: string): string;
    get isNavigate(): boolean;
    set isNavigate(isNavigate: boolean);
    fetch(url: string, configuration: SPHttpClientConfiguration, options: ISPHttpClientOptions): Promise<SPHttpClientResponse>;
    get(url: string, configuration: SPHttpClientConfiguration, options?: ISPHttpClientOptions): Promise<SPHttpClientResponse>;
    post(url: string, configuration: SPHttpClientConfiguration, options: ISPHttpClientOptions): Promise<SPHttpClientResponse>;
}

export declare interface ISPHttpClientConfiguration  {
    defaultSameOriginCredentials?: boolean;
    defaultODataVersion?: ODataVersion;
    requestDigest?: boolean;
}

export declare interface ISPHttpClientConfigurations {
    readonly v1: SPHttpClientConfiguration;
}

export declare class SPHttpClientConfiguration  { //skipped extends
    get defaultSameOriginCredentials(): boolean;
    get defaultODataVersion(): ODataVersion;
    get requestDigest(): boolean;
    protected initializeFlags(): void;
    overrideWith(sourceFlags: ISPHttpClientConfiguration): SPHttpClientConfiguration;
}

export declare class ODataVersion {
    static v3: ODataVersion;
    static v4: ODataVersion;
    private _versionString;
    static tryParseFromHeaders(headers: Headers): ODataVersion | undefined;
    toString(): string;
}

export declare interface ISPHttpClientOptions extends IHttpClientOptions {
    webUrl?: string;
}

export declare class SPHttpClientResponse extends HttpClientResponse {
    clone(): SPHttpClientResponse;
}










export declare class PageContext {
    //get aadInfo(): AzureActiveDirectoryInfo | undefined;
    get cultureInfo(): CultureInfo;
    get list(): SPList | undefined;
    get listItem(): SPListItem | undefined;
    get site(): SPSite;
    get user(): SPUser;
    get web(): SPWeb;
    get legacyPageContext(): any;
    get isInitialized(): boolean;
}

export declare class CultureInfo {
    readonly currentCultureName: string;
    readonly currentUICultureName: string;
    readonly isRightToLeft: boolean;
}

export declare class SPList {
    readonly id: Guid;
    readonly permissions: SPPermission;
    readonly serverRelativeUrl: string;
    readonly title: string;
}

//i added ID , Id and Title
export declare class SPListItem {
    readonly id: number;
    readonly Id: number;
    readonly ID: number;
    public Title: string;
}

export declare class SPSite {
    readonly absoluteUrl: string;
    readonly cdnPrefix: string;
    readonly classification: string;
    readonly correlationId: Guid;
    readonly group: /*O365GroupAssociation*/ any | undefined; //couldnt find O365GroupAssociation
    readonly id: Guid;
    readonly isNoScriptEnabled: boolean;
    readonly recycleBinItemCount: number;
    readonly serverRelativeUrl: string;
    readonly serverRequestPath: string;
    readonly sitePagesEnabled: boolean;
}

export declare class SPWeb {
    readonly absoluteUrl: string;
    readonly id: Guid;
    readonly isAppWeb: boolean;
    readonly language: number;
    readonly languageName: string;
    readonly logoUrl: string;
    readonly permissions: SPPermission;
    readonly serverRelativeUrl: string;
    readonly templateName: string;
    readonly title: string;
    readonly description: string;
}

export declare class SPUser {
    readonly displayName: string;
    readonly email: string;
    readonly isAnonymousGuestUser: boolean;
    readonly isExternalGuestUser: boolean;
    readonly loginName: string;
    readonly preferUserTimeZone: boolean;
}





//not sure what todo with but it comes alot
export declare class Guid {
    static readonly empty: Guid;
    private static readonly _guidRegEx;
    private _guid;
    static newGuid(randomNumberGenerator?: any): Guid;
    static parse(guidString: string | undefined | null): Guid;
    static tryParse(guid: string | undefined | null): Guid | undefined;
    static isValid(guid: string | undefined | null): boolean;
    equals(guid: Guid): boolean;
    toString(): string;
}


//than can be useful... keeping
export declare class SPPermission {
    /**
     * Has no permissions on the Web site. Not available through the user interface.
     */
    static readonly emptyMask: SPPermission;
    /**
     * View items in lists, documents in document libraries, and view Web discussion comments.
     */
    static readonly viewListItems: SPPermission;
    /**
     * Add items to lists, add documents to document libraries, and add Web discussion comments.
     */
    static readonly addListItems: SPPermission;
    /**
     * Edit items in lists, edit documents in document libraries, edit Web discussion comments in documents,
     * and customize web part Pages in document libraries.
     */
    static readonly editListItems: SPPermission;
    /**
     * Delete items from a list, documents from a document library, and Web discussion comments in documents.
     */
    static readonly deleteListItems: SPPermission;
    /**
     * Approve a minor version of a list item or document.
     */
    static readonly approveItems: SPPermission;
    /**
     * View the source of documents with server-side file handlers.
     */
    static readonly openItems: SPPermission;
    /**
     * View past versions of a list item or document.
     */
    static readonly viewVersions: SPPermission;
    /**
     * Delete past versions of a list item or document.
     */
    static readonly deleteVersions: SPPermission;
    /**
     * Discard or check in a document which is checked out to another user.
     */
    static readonly cancelCheckout: SPPermission;
    /**
     * Create, change, and delete personal views of lists.
     */
    static readonly managePersonalViews: SPPermission;
    /**
     * Create and delete lists, add or remove columns in a list, and add or remove public views of a list.
     */
    static readonly manageLists: SPPermission;
    /**
     * View forms, views, and application pages, and enumerate lists.
     */
    static readonly viewFormPages: SPPermission;
    /**
     * Allow users to open a Web site, list, or folder to access items inside that container.
     */
    static readonly open: SPPermission;
    /**
     * View pages in a Web site.
     */
    static readonly viewPages: SPPermission;
    /**
     * View the layouts page?
     */
    static readonly layoutsPage: SPPermission;
    /**
     * Add, change, or delete HTML pages or web part Pages, and edit the Web site using a SharePoint
     * Foundation-compatible editor.
     */
    static readonly addAndCustomizePages: SPPermission;
    /**
     * Apply a theme or borders to the entire Web site.
     */
    static readonly applyThemeAndBorder: SPPermission;
    /**
     * Apply a style sheet (.css file) to the Web site.
     */
    static readonly applyStyleSheets: SPPermission;
    /**
     * View reports on Web site usage.
     */
    static readonly viewUsageData: SPPermission;
    /**
     * Create a Web site using Self-Service Site Creation.
     */
    static readonly createSSCSite: SPPermission;
    /**
     * Create subsites such as team sites, Meeting Workspace sites, and Document Workspace sites.
     */
    static readonly manageSubwebs: SPPermission;
    /**
     * Create a group of users that can be used anywhere within the site collection.
     */
    static readonly createGroups: SPPermission;
    /**
     * Create and change permission levels on the Web site and assign permissions to users and groups.
     */
    static readonly managePermissions: SPPermission;
    /**
     * Enumerate files and folders in a Web site using Microsoft Office SharePoint Designer 2007 and WebDAV interfaces.
     */
    static readonly browseDirectories: SPPermission;
    /**
     * View information about users of the Web site.
     */
    static readonly browserUserInfo: SPPermission;
    /**
     * Add or remove personal web parts on a web part Page.
     */
    static readonly addDelPrivateWebParts: SPPermission;
    /**
     * Update web parts to display personalized information.
     */
    static readonly updatePersonalWebParts: SPPermission;
    /**
     * Grant the ability to perform all administration tasks for the Web site as well as manage content.
     *
     * @remarks
     * Activate, deactivate, or edit properties of Web site scoped Features through the object model or
     * through the user interface (UI). When granted on the root Web site of a site collection, activate,
     * deactivate, or edit properties of site collection scoped Features through the object model. To
     * browse to the Site Collection Features page and activate or deactivate site collection scoped
     * Features through the UI, you must be a site collection administrator.
     */
    static readonly manageWeb: SPPermission;
    /**
     * Use features that launch client applications; otherwise, users must work on documents locally and upload changes.
     */
    static readonly useClientIntegration: SPPermission;
    /**
     * Use SOAP, WebDAV, or Microsoft Office SharePoint Designer 2007 interfaces to access the Web site.
     */
    static readonly useRemoteAPIs: SPPermission;
    /**
     * Manage alerts for all users of the Web site.
     */
    static readonly manageAlerts: SPPermission;
    /**
     * Create e-mail alerts.
     */
    static readonly createAlerts: SPPermission;
    /**
     * Allows a user to change his or her user information, such as adding a picture.
     */
    static readonly editMyUserInfo: SPPermission;
    /**
     * Enumerate permissions on the Web site, list, folder, document, or list item.
     */
    static readonly enumeratePermissions: SPPermission;
    /**
     * Has all permissions on the Web site. Not available through the user interface.
     */
    static readonly fullMask: SPPermission;
    private _value;
    get value(): IODataBasePermission;
    hasAnyPermissions(...requestedPerms: SPPermission[]): boolean;
    hasAllPermissions(...requestedPerms: SPPermission[]): boolean;
    hasPermission(requestedPerm: SPPermission): boolean;
}

export declare interface IODataBasePermission {
    Low: number;
    High: number;
}




export declare enum EnvironmentType {
    Test = 0,
    Local = 1,
    SharePoint = 2,
    ClassicSharePoint = 3
}

export declare class Environment {
    private static _type;
    static get type(): EnvironmentType;
}

