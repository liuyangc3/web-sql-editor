/**
 * @jest-environment jsdom
 */

import { HttpParamsCodec, HttpParams } from './params';

let codec;

describe('test HttpParamsEncoder', () => {
  beforeEach(() => {
    codec = new HttpParamsCodec();
  });

  it('should not encode spec char', () => {
    expect(codec.encode('@:?$,;+=?/')).toBe('@:?$,;+=?/');
  });

  it('should encode rangular char', () => {
    expect(codec.encode('你好')).toBe('%E4%BD%A0%E5%A5%BD');
  });
});


describe('test HttpParams', () => {
  it('should construct options.fromString', () => {
    expect(new HttpParams({ fromString: '' }).toString()).toBe('');
    expect(new HttpParams({ fromString: 'foo' }).toString()).toBe('foo');
    expect(new HttpParams({ fromString: 'foo=bar' }).toString()).toBe('foo=bar');
    // we don't check duplicate from input
    expect(new HttpParams({ fromString: 'foo=bar&foo=bar' }).toString()).toBe('foo=bar&foo=bar');
    expect(new HttpParams({ fromString: 'foo=bar&foo=bar2' }).toString()).toBe('foo=bar&foo=bar2');
    expect(new HttpParams({ fromString: 'foo=bar&key=value' }).toString()).toBe('foo=bar&key=value');
  });

  it('should construct options.fromObject', () => {
    expect(new HttpParams({ fromObject: {} }).toString()).toBe('');
    // we don't check duplicate from construct
    expect(new HttpParams({ fromObject: { foo: ['', ''] } }).toString()).toBe('foo&foo');
    expect(new HttpParams({ fromObject: { foo: ['bar', 'bar'] } }).toString()).toBe('foo=bar&foo=bar');

    expect(new HttpParams({ fromObject: { foo: ['bar', 'bar2'] } }).toString()).toBe('foo=bar&foo=bar2');
    expect(new HttpParams({ fromObject: { foo: 'bar', key: 'value' } }).toString()).toBe('foo=bar&key=value');
  });

  it('should fromObject value is string', () => {
    // we empty non string values
    expect(new HttpParams({ fromObject: { foo: {} } }).toString()).toBe('foo');
    expect(new HttpParams({ fromObject: { foo: [] } }).toString()).toBe('foo');
    expect(new HttpParams({ fromObject: { foo: null } }).toString()).toBe('foo');
    expect(new HttpParams({ fromObject: { foo: [null, ''] } }).toString()).toBe('foo');
    // we don't check duplicate from construct
    expect(new HttpParams({ fromObject: { foo: [null, '', ''] } }).toString()).toBe('foo&foo');
  });

  it('should proxy map methods', () => {
    let params = new HttpParams();
    expect(params.toString()).toBe('');
    params.set('foo', 'bar');
    expect(params.has('foo')).toBeTruthy();
    expect(params.get('foo')).toBe('bar');
    expect(params.keys()).toEqual(['foo']);
    expect(params.toString()).toBe('foo=bar');
  });

  it('should check duplicate via set', () => {
    const key = 'foo';
    expect(new HttpParams()
      .set(key, '')
      .set(key, '')
      .toString()
    ).toBe('foo');
    expect(new HttpParams()
      .set(key, '')
      .set(key, 'bar')
      .toString()
    ).toBe('foo&foo=bar');
    expect(new HttpParams()
      .set(key, ['', null, ''])
      .toString()
    ).toBe('foo');
    expect(new HttpParams()
      .set(key, ['', null])
      .set(key, '')
      .toString()
    ).toBe('foo');
    expect(new HttpParams()
      .set(key, ['', null])
      .set(key, [])
      .toString()
    ).toBe('foo');
    expect(new HttpParams()
      .set(key, '')
      .set(key, ['bar'])
      .toString()
    ).toBe('foo&foo=bar');
  });


  it('should proxy map methods2', () => {
    let params = new HttpParams();
    params.set('foo', 'bar');
    params.set('key', '');
    expect(params.keys()).toEqual(['foo', 'key']);
    expect(params.toString()).toBe('foo=bar&key');
  });

  it('should throw error both set fromString and fromObject', () => {
    function newHttpParams() {
      new HttpParams({
        fromString: 'foo=bar&key=value',
        fromObject: { key1: 'value1', key2: 'value2' }
      })
    }
    expect(newHttpParams).toThrowError();
  });
});

