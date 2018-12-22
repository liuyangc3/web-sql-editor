import { HttpFetchHandler } from './handler';
import { HttpRequest } from './request';


describe('test hanlder', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() => {
      let p = new Promise((resolve, reject) => {
        resolve({
          ok: true,
          json: () => ({ Id: '123' })
        });
      });
      return p;
    });
  });

  it('test HttpFetchHandler', async () => {
    const req = new HttpRequest('get', '/post');
    const resp = await new HttpFetchHandler().handle(req)
    const data = await resp.json();
    expect(data).toEqual({ Id: '123' });
  });
});