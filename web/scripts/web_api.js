import fetchRequest from "./fetchRequest.js";

/** 获取系统模板 */
const getSysTemplates = (params) => {
  return fetchRequest.get('/api/template/sysList', params)
}

/** 获取我的模板 */
const getMyTemplates = (params) => {
  return fetchRequest.get('/api/template/myList', params)
}

/** 上传模板 */
const uploadTemplateJson = (params) => {
  return fetchRequest.postNoStringfy('/api/template/upload', params)
}

/** 新增模板 */
const addTemplate = (params) => {
  return fetchRequest.post('/api/template/add', params)
}

export {
  getSysTemplates,
  getMyTemplates,
  uploadTemplateJson,
  addTemplate
}