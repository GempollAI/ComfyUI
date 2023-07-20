import config from './config.js'
class FetchRequest {
  constructor() {
    this.interceptors = {
      request: [],
      response: []
    };
  }

  async request(url, options) {
    for (const interceptor of this.interceptors.request) {
      options = await interceptor(options);
    }
    return fetch(config.base_url + url, options);
  }

  async response(response) {
    for (const interceptor of this.interceptors.response) {
      response = await interceptor(response);
    }
    return response;
  }

  get(url, params = {},  options = {}) {
    options.method = 'GET';
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    const requestUrl = queryString ? `${url}?${queryString}` : url;
    return this.request(requestUrl, options)
      .then(this.response.bind(this));
  }

  post(url, data = {}, options = {}) {
    options.method = 'POST';
    options.body = JSON.stringify(data);
    options.headers = { 'Content-Type': 'application/json' };
    return this.request(url, options)
      .then(this.response.bind(this));
  }

  postNoStringfy(url, data = {}, options = {}) {
    options.method = 'POST';
    options.body = data;
    options.headers = { 'Content-Type': 'application/json' };
    return this.request(url, options)
      .then(this.response.bind(this));
  }

  useRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor);
  }

  useResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor);
  }
}

const fetchRequest = new FetchRequest();

// 添加请求拦截器
fetchRequest.useRequestInterceptor(async (options) => {
  // 在请求头中添加 token
  const token = localStorage.getItem(config.token_key)
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`
    };
  }
  return options;
});

// 添加响应拦截器
fetchRequest.useResponseInterceptor(async (response) => {
  const data = await response.json();
  // if (data.code === 401) {
  //   // 未授权，跳转到登录页
  //   window.location.href = '/login';
  // }
  return data;
});

export default fetchRequest