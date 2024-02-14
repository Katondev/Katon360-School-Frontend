import { getApiConfig } from "helpers/authHelper"
import { get, post, put, del } from "../api_helper"
import * as url from "../urlHelper"

export const getAllQuestionBank = () => {
  return get(url.QUESTION_BANK, getApiConfig())
}

export const getQuestionBank = id => {
  return get(`${url.QUESTION_BANK}/${id}`, getApiConfig())
}

export const createQuestionBank = data => {
  return post(url.QUESTION_BANK, data, getApiConfig())
}

export const updateQuestionBank = (id, data) => {
  return put(`${url.QUESTION_BANK}/${id}`, data, getApiConfig())
}

export const deleteQuestionBank = id => {
  return del(`${url.QUESTION_BANK}/${id}`, getApiConfig())
}
