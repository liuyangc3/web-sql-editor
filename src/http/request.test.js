/**
 * @jest-environment jsdom
 */

import { HttpRequest } from './request';
import { HttpParams } from './params';


describe('test HttpRequest', () => {
  let url, body;
  beforeEach(() => {
    url = 'http://example.com';
    body = { id: 10, data: 'test' };
  });

  it('client shoult init with options', () => {
    const header = { 'Accept': 'application/test' };
    const req = new HttpRequest('post', url, body, {
      headers: new Headers(header),
      params: new HttpParams({ fromObject: { 'foo': 'bar' } }),
      withCredentials: true,
    });

    expect(req.urlWithParams).toBe(`${url}?foo=bar`);
    expect(req.headers).toEqual(new Headers(header));
    expect(req.serializeBody()).toBe(JSON.stringify(body))
  });

  it('methods shoult not init body', () => {
    ['GET', 'DELETE', 'HEAD', 'OPTIONS', 'JSONP'].forEach(method => {
      const req = new HttpRequest(method, url, body);
      expect(req.serializeBody()).toBe(null);
    });
  });

});
