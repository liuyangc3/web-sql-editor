import { Headers, Request } from 'node-fetch';


const localStorageMock = (function() {
  let store = {};
  return {
    getItem: function(key) {
      return store[key] || null
    },
    setItem: function(key, value) {
      store[key] = value.toString()
    },
    removeItem: function(key) {
      delete store[key]
    },
    clear: function() {
      store = {}
    },
  }
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});
Object.defineProperty(window, 'Headers', {
  value: Headers,
});
Object.defineProperty(window, 'Request', {
  value: Request,
});
