import { getApiConfig } from "helpers/authHelper"
import { get, post, put, del } from "../api_helper"
import * as url from "../urlHelper"

export const getAllOldExamPaper = () => {
  return get(url.OLDEXAMPAPER, getApiConfig())
}

export const getOldExamPaper = id => {
  return get(`${url.OLDEXAMPAPER}/${id}`, getApiConfig())
}

export const createOldExamPaper = data => {
  return post(url.OLDEXAMPAPER, data, getApiConfig(true))
}

export const updateOldExamPaper = (id, data) => {
  return put(`${url.OLDEXAMPAPER}/${id}`, data, getApiConfig(true))
}

export const deleteOldExamPaper = id => {
  return del(`${url.OLDEXAMPAPER}/${id}`, getApiConfig())
}
