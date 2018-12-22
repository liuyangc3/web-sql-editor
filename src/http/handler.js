
/**
 * hander use fetch
 */
export class HttpFetchHandler {
  /**
   * @param {HttpRequest} req
   * @returns `Promise`
   */
  handle(req) {
    const contentType = req.detectContentTypeHeader();
    if (contentType) {
      req.headers.set('Content-Type', contentType);
    }
    const request = new Request(req.urlWithParams,
      {
        method: req.method,
        headers: req.headers,
        body: req.serializeBody(),
        // cross-origin should use 'include'
        credentials: req.withCredentials ? 'omit' : 'same-origin'
      });

    return fetch(request);
  }
}

export class HttpInterceptorHandler {
  /**
   * @param {HttpHandler} next
   * @param {Function} interceptor
   */
  constructor(next, interceptor) {
    this.next = next;
    this.interceptor = interceptor;
  }

  /**
   * 
   * @param {HttpRequest} req 
   * @return a `Promise`
   */
  handle(req) {
    return this.interceptor(req, this.next);
  }
}