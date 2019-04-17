import { Http, Request, RequestOptions, RequestOptionsArgs, Response, XHRBackend } from "@angular/http"
import { Injectable } from "@angular/core"
import { Observable } from "rxjs/Rx"
import { FlashMessagesService } from 'angular2-flash-messages';

// operators
import "rxjs/add/operator/catch"
import "rxjs/add/observable/throw"
import "rxjs/add/operator/map"

@Injectable()
export class HttpInterceptor extends Http {

    constructor(
        backend: XHRBackend,
        options: RequestOptions,
        public http: Http,
        private _flashMessagesService: FlashMessagesService
    ) {
        super(backend, options)
    }

    public request(url: string|Request, options?: RequestOptionsArgs): Observable<Response> {
        return super.request(url, options)
            .catch(this.handleError)
    }

    public handleError = (error: Response) => {
            
        // Do messaging and error handling here
        // console.log('Error: ', JSON.parse(error['_body']).message);

        // alert(JSON.parse(error['_body']).message);
        this._flashMessagesService.show(JSON.parse(error['_body']).message, { cssClass: 'alert-danger text-center', timeout: 1500 });
        this._flashMessagesService.grayOut(true);

        return Observable.throw(error)
    }
}