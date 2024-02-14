import { getApiConfig } from "helpers/authHelper"
import { get, post, put, del } from "../api_helper"
import * as url from "../urlHelper"

export const getAllTermlyScheme = () => {
  return get(`${url.TERMLYSCHEME}/get`, getApiConfig())
}

export const getTermlyScheme = id => {
  return get(`${url.TERMLYSCHEME}/${id}`, getApiConfig())
}

export const getTermlySchemeMasterByClassSubAPI = (classId, subject) => {
  return get(
    `${url.TERMLYSCHEMEMASTER}/getTermlySchemeMasterByClassSub?classId=${classId}&subject=${subject}`,
    getApiConfig()
  )
}

export const createTermlyScheme = data => {
  return post(url.TERMLYSCHEME, data, getApiConfig(true))
}

export const updateTermlyScheme = (id, data, isStatusUpdate = 1) => {
  return put(
    `${url.TERMLYSCHEME}/${id}?isStatusUpdate=${isStatusUpdate}`,
    data,
    getApiConfig(true)
  )
}

export const deleteTermlyScheme = id => {
  return del(`${url.TERMLYSCHEME}/${id}`, getApiConfig())
}
