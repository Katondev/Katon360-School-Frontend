import { getApiConfig } from "helpers/authHelper"
import { get, post, put, del } from "../api_helper"
import * as url from "../urlHelper"

export const getAllPastPaper = () => {
  return get(`${url.PASTPAPER}/getAll`, getApiConfig())
}
export const updatePastPaper = (id, data) => {
  return put(`${url.PASTPAPER}/${id}`, data, getApiConfig(true))
}

export const getPastPaper = id => {
  return get(`${url.PASTPAPER}/${id}`, getApiConfig())
}

export const createPastPaper = data => {
  return post(url.PASTPAPER, data, getApiConfig(true))
}

export const deletePastPaper = id => {
  return del(`${url.PASTPAPER}/${id}`, getApiConfig())
}
