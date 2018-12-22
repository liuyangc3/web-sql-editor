import { HttpParams } from './params';


export class HttpRequest {
  method;
  url;
  urlWithParams;
  body = null;

  /**
   * options.headers `Headers`
   */
  headers;

  /**
   * Url params
   * options.params `HttpParams`
   */
  params;

  /**
   * By default, client won't send or receive any cookies
   * options.withCredentials `boolean`
   */
  withCredentials = false;

  /**
   * This is used to parse the response before return
   * defalut is json
   * options.responseType `string`
   */
  responseType = 'json';

  /**
   * @param {string} method
   * @param {string} url
   * @param {string|object|ArrayBuffer} body
   * @param {Oject} options
   * options.headers `Headers`
   * options.params `HttpParams`
   * options.withCredentials `boolean`
   * options.responseType `string`
   */
  constructor(method, url, body, options) {
    this.method = method.toUpperCase();
    this.url = url;

    if (mightHaveBody(this.method)) {
      this.body = body;
    }

    if (options) {
      if (!!options.responseType) {
        this.responseType = options.responseType;
      }

      if (!!options.withCredentials) {
        this.withCredentials = options.withCredentials;
      }

      if (!!options.headers) {
        this.headers = options.headers;
      }

      if (!!options.params && options.params instanceof HttpParams) {
        this.params = options.params;
      }
    }

    if (!this.headers) {
      this.headers = new Headers({
        'Accept': 'application/json;charset=UTF-8',
      });
    }

    if (!this.params) {
      this.urlWithParams = url;
      this.params = new HttpParams();
    } else {
      const params = this.params.toString();
      // Does the URL already have query parameters? Look for '?'.
      const qIdx = url.indexOf('?');
      // There are 3 cases to handle:
      // 1) No existing parameters -> append '?' followed by params.
      // 2) '?' exists and is followed by existing query string ->
      //    append '&' followed by params.
      // 3) '?' exists at the end of the url -> append params directly.
      // This basically amounts to determining the character, if any, with
      // which to join the URL and parameters.
      const sep = qIdx === -1 ? '?' : (qIdx < url.length - 1 ? '&' : '');
      this.urlWithParams = url + sep + params;
    }
  }

  serializeBody() {
    if (this.body === null) {
      return null;
    }

    // Check whether body already serialized
    if (isArrayBuffer(this.body) || isBlob(this.body) || isFormData(this.body) ||
      typeof this.body === 'string') {
      return this.body;
    }

    if (this.body instanceof HttpParams) {
      return this.body.toString();
    }

    // By default, body should serialize to JSON 
    if (typeof this.body === 'object' || typeof this.body === 'boolean' ||
      Array.isArray(this.body)) {
      return JSON.stringify(this.body);
    }

    // Fall back on toString() for everything else.
    return this.body.toString();
  }

  detectContentTypeHeader() {
    if (this.body === null) {
      return null;
    }
    // FormData bodies rely on the browser's content type assignment.
    if (isFormData(this.body)) {
      return null;
    }
    // Blobs usually have their own content type. If it doesn't, then
    // no type can be inferred.
    if (isBlob(this.body)) {
      return this.body.type || null;
    }
    // Array buffers have unknown contents and thus no type can be inferred.
    if (isArrayBuffer(this.body)) {
      return null;
    }
    // Technically, strings could be a form of JSON data, but it's safe enough
    // to assume they're plain strings.
    if (typeof this.body === 'string') {
      return 'text/plain';
    }

    if (this.body instanceof HttpParams) {
      return 'application/x-www-form-urlencoded;charset=UTF-8';
    }
    // Arrays, objects, and numbers will be encoded as JSON.
    if (typeof this.body === 'object' || typeof this.body === 'number' ||
      Array.isArray(this.body)) {
      return 'application/json;charset=UTF-8';
    }
    // No type could be inferred.
    return null;
  }

  /**
   * @param {Object} update
   * update.method `string`
   * update.url `string`
   * update.body `object`, null means empty body
   * update.withCredentials `boolean`
   * update.headers `Headers`, replace headers
   * update.params `HttpParams`, replace params
   * update.setHeaders `object`, append to headers
   * update.setParams `object`, append to params
   * 
   * @return a new HttpRequest with updated properties
   */
  clone(update = {}) {
    const method = update.method || this.method;
    const url = update.url || this.url;
    // const responseType = update.responseType || this.responseType;
    // update.body is `null` empty body
    const body = (update.body !== undefined) ? update.body : this.body;
    // withCredentials is boolean, there is differentiate
    // between `false` and `undefined`  
    const withCredentials =
      (update.withCredentials !== undefined) ? update.withCredentials : this.withCredentials;

    // update.headers | update.params override headers and params
    let headers = update.headers || this.headers;
    let params = update.params || this.params;

    // use update.setHeaders or update.setParams append
    if (update.setHeaders !== undefined) {
      headers =
        Object.keys(update.setHeaders)
          .reduce((headers, name) => headers.set(name, update.setHeaders[name]), headers);
    }
    if (update.setParams) {
      params = Object.keys(update.setParams)
        .reduce((params, param) => params.set(param, update.setParams[param]), params);
    }

    return new HttpRequest(
      method, url, body, {
        params, headers, withCredentials,
      });
  }
}

/**
 * Determine whether the given HTTP method may include a body.
 */
function mightHaveBody(method) {
  switch (method) {
    case 'DELETE':
    case 'GET':
    case 'HEAD':
    case 'OPTIONS':
    case 'JSONP':
      return false;
    default:
      return true;
  }
}

/**
 * Safely assert whether the given value is an ArrayBuffer.
 *
 * In some execution environments ArrayBuffer is not defined.
 */
function isArrayBuffer(value) {
  return typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer;
}

/**
 * Safely assert whether the given value is a Blob.
 *
 * In some execution environments Blob is not defined.
 */
function isBlob(value) {
  return typeof Blob !== 'undefined' && value instanceof Blob;
}

/**
 * Safely assert whether the given value is a FormData instance.
 *
 * In some execution environments FormData is not defined.
 */
function isFormData(value) {
  return typeof FormData !== 'undefined' && value instanceof FormData;
}