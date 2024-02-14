import { getApiConfig } from "helpers/authHelper"
import { get, post, put, del } from "../api_helper"
import * as url from "../urlHelper"

export const getAllExam = () => {
  return get(url.EXAM, getApiConfig())
}

export const getExam = id => {
  return get(`${url.EXAM}/${id}`, getApiConfig())
}

export const createExam = data => {
  return post(url.EXAM, data, getApiConfig())
}

export const updateExam = (id, data) => {
  return put(`${url.EXAM}/${id}`, data, getApiConfig())
}

export const deleteExam = id => {
  return del(`${url.EXAM}/${id}`, getApiConfig())
}
