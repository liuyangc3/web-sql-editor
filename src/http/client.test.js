/**
 * @jest-environment jsdom
 */

import { HttpClient } from './client';
import { HttpParams } from './params';

describe('test client', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation((req) => {
      let p = new Promise((resolve, reject) => {
        resolve({ ok: true, json: () => req });
      });
      return p;
    });
  });

  it('test HttpClient', async () => {
    const client = new HttpClient();
    const data = await client.get('/test');
    expect(data.url).toBe('/test');
  });

  it('test interceptors', async () => {
    const client = new HttpClient();
    client.register((req, next) => {
      const newReq = req.clone({ url: '/newurl' });
      return next.handle(newReq);
    });
    client.register((req, next) => {
      const newReq = req.clone({ method: 'POST', params: new HttpParams({ fromString: 'foo=bar' }) });
      return next.handle(newReq);
    });
    client.register((req, next) => {
      const newReq = req.clone({ setParams: { auth: 'true' } });
      return next.handle(newReq);
    });

    const data = await client.get('/test');
    expect(data.url).toBe('/newurl?foo=bar&auth=true');
    expect(data.method).toBe('POST');
  });
});