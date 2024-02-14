import { getApiConfig } from "helpers/authHelper"
import { get, post, put, del } from "../api_helper"
import * as url from "../urlHelper"

export const getAllPastPaperQuestion = () => {
  return get(`${url.PASTPAPERQUESTION}/getAll`, getApiConfig())
}
export const getAllPastPaperQuestionByPaper = (pp_id) => {
  return get(`${url.PASTPAPERQUESTION}/getPpQueByPaper?pp_id=${pp_id}`, getApiConfig())
}
export const updatePastPaperQuestion = (id, data) => {
  return put(`${url.PASTPAPERQUESTION}/${id}`, data, getApiConfig(true))
}

export const getPastPaperQuestion = id => {
  return get(`${url.PASTPAPERQUESTION}/${id}`, getApiConfig())
}

export const createPastPaperQuestion = data => {
  return post(url.PASTPAPERQUESTION, data, getApiConfig(true))
}

export const deletePastPaperQuestion = id => {
  return del(`${url.PASTPAPERQUESTION}/${id}`, getApiConfig())
}
