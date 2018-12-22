import { HttpParams } from './params';
import { HttpFetchHandler, HttpInterceptorHandler } from './handler';
import { HttpRequest } from './request';

export class HttpClient {
  withCredentials = true;
  defualtHeaders = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  });
  // interceptors call chain
  interceptors = [];

  constructor(handler) {
    // handler must impl hanlle(req: HttpRequest)
    // wo dont check handler here
    this.handler = handler ? handler : new HttpFetchHandler();
  }

  supportCookies(bool) {
    this.withCredentials = bool;
  }

  /**
   * register interceptor to call chain
   * 
   * @param {Function} interceptor 
   *  function(req, next) => { 
   *   // do sthing
   *   return next.handle(req) 
   * }
   */
  register(interceptor) {
    this.interceptors.push(interceptor);
  }

  /**
   * @param {string} url 
   * @param {params: object, headers: Headers} options 
   */
  get(url, options) {
    return this.request('get', url, null, options);
  }

  /**
   * @param {string} url 
   * @param {object} body
   * @param {params: object, headers: Headers} options 
   */
  post(url, body, options) {
    return this.request('post', url, body, options);
  }

  put(url, body, options) {
    return this.request('put', url, body, options);
  }

  delete(url, options) {
    return this.request('delete', url, null, options);
  }

  /**
   * @param {string} method
   * @param {string} url
   * @param {object} body
   * @param {headers: Headers, params: object} options
   */
  request(method, url, body, options) {
    let reqOpts = { withCredentials: this.withCredentials };
    if (options) {
      if (!!options.params) {
        if (options.params instanceof HttpParams) {
          reqOpts.params = options.params;
        } else {
          reqOpts.params = new HttpParams({ fromObject: options.params });
        }
      }

      if (!!options.headers) {
        reqOpts.headers = Object.assign(options.headers, this.defualtHeaders);
      } else {
        reqOpts.headers = this.defualtHeaders;
      }
    }

    const req = new HttpRequest(method, url, body, reqOpts);

    // call interceptors, get chained hanlder
    const chain = this.interceptors.reduceRight(
      (next, interceptor) => new HttpInterceptorHandler(next, interceptor), this.handler);

    return chain.handle(req).then(resp => {
      if (resp.ok) { // status 200-299
        switch (req.responseType) {
          // TODO: now only support json
          case 'json':
            return resp.json();
          // case 'text':
          //   return resp.text();
          // case 'blob':
          //   return resp.blob();
          // case 'arrayBuffer':
          //   return resp.arrayBuffer();
          default:
            // Guard against new future observe types being added.
            throw new Error(`Unreachable: unhandled request type ${req.responseType}.`);
        }
      }
      // !resp.ok
      return Promise.reject(resp);
    });
  }
}
