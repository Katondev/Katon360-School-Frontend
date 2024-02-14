import { getApiConfig } from "helpers/authHelper"
import { get, post, put, del } from "../api_helper"
import * as url from "../urlHelper"

export const getAllExamTimeTable = () => {
  return get(url.EXAMTIMETABLE, getApiConfig())
}

export const getExamTimeTable = id => {
  return get(`${url.EXAMTIMETABLE}/${id}`, getApiConfig())
}

export const createExamTimeTable = data => {
  return post(url.EXAMTIMETABLE, data, getApiConfig())
}

export const updateExamTimeTable = (id, data) => {
  return put(`${url.EXAMTIMETABLE}/${id}`, data, getApiConfig())
}

export const deleteExamTimeTable = id => {
  return del(`${url.EXAMTIMETABLE}/${id}`, getApiConfig())
}
