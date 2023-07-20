export default { 
  base_url: window.location.hostname === 'ai-comfyui-dev.gempoll.com' ? 'https://ai-dev.gempoll.com/v2' : window.location.hostname === 'ai-comfyui-uat.gempoll.com' ? 'https://ai-uat.gempoll.com/v2' : 'http://36.246.1.11:8080/v2',
  token_key: 'ai-comfyui-token'
}