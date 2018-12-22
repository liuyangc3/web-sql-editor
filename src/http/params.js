function standardEncoding(v) {
  return encodeURIComponent(v)
    .replace(/%40/gi, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/gi, '$')
    .replace(/%2C/gi, ',')
    .replace(/%3B/gi, ';')
    .replace(/%2B/gi, '+')
    .replace(/%3D/gi, '=')
    .replace(/%3F/gi, '?')
    .replace(/%2F/gi, '/');
}

function paramParser(rawParams, codec) {
  const map = new Map();
  if (rawParams.length > 0) {
    const params = rawParams.split('&');
    params.forEach((param) => {
      const eqIdx = param.indexOf('=');
      const [key, val] = eqIdx === -1 ?
        [codec.decode(param), ''] :
        [codec.decode(param.slice(0, eqIdx)), codec.decode(param.slice(eqIdx + 1))];
      const list = map.get(key) || [];
      list.push(val);
      map.set(key, list);
    });
  }
  return map;
}

export class HttpParamsCodec {
  encode = key => standardEncoding(key);
  decode = key => decodeURIComponent(key);
}

/**
 * options {fromString: string, fromObject: object}
 */
export class HttpParams {
  map;
  encoder;

  constructor(options) {
    this.encoder = new HttpParamsCodec();
    this.map = new Map();
    if (options) {
      if (!!options.fromString &&
        typeof options.fromString === 'string') {
        if (!!options.fromObject) {
          throw new Error(`Cannot specify both fromString and fromObject.`);
        }
        this.map = paramParser(options.fromString, this.encoder);
      }

      else if (!!options.fromObject &&
        typeof options.fromObject === 'object') {
        const emptyValue = [''];
        Object.entries(options.fromObject).forEach(([key, value]) => {
          if (typeof value === 'string') {
            this.map.set(key, [value]);
          } 
          else if (Array.isArray(value)) {
            const list = value.filter(v => typeof v === 'string');
            list.length > 0 ? this.map.set(key, list) : this.map.set(key, emptyValue);
          }
          else {
            this.map.set(key, emptyValue);
          }
        });
      }
    }
  }

  /**
   * proxy map methods
   */
  has = key => this.map.has(key);
  keys = () => Array.from(this.map.keys());
  get = key => {
    const res = this.map.get(key);
    return !!res ? res[0] : null;
  };
  /**
   * check duplicate in this method
   */
  set = (key, value) => {
    const list = this.map.get(key) || [];
    if (Array.isArray(value)) {
      value.filter(v => typeof v === 'string').forEach(v => {
        if (!list.includes(v)) { list.push(v); }
      });
    } 
    else if (!list.includes(value)) {
      list.push(value);
    }
    this.map.set(key, list);
    return this;
  };

  toString() {
    return this.keys().map(key => {
      const eKey = this.encoder.encode(key);
      return this.map.get(key).map(value => value ? eKey + '=' + this.encoder.encode(value) : eKey)
        .join('&');
    })
      .join('&');
  }
}

