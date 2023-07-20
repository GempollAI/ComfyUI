import config from './config.js'

function getQueryString(key, url) {
  url = url || window.location.href
  const queryString = url.split('?')[1];
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(key);
}

const token = getQueryString('token')
if (token) {
  localStorage.setItem(config.token_key, token);
}

export const getToken = () => {
  return localStorage.getItem(config.token_key)
}