import { getApiConfig } from "helpers/authHelper"
import { get, post, put, del } from "../api_helper"
import * as url from "../urlHelper"

export const getAllWeeklyLessonPlan = () => {
  return get(`${url.WEEKLYLESSONPLAN}/`, getApiConfig())
}

export const getWeeklyLessonPlan = id => {
  return get(`${url.WEEKLYLESSONPLAN}/${id}`, getApiConfig())
}

export const createWeeklyLessonPlan = data => {
  return post(url.WEEKLYLESSONPLAN, data, getApiConfig(true))
}

export const updateWeeklyLessonPlan = (id, data) => {
  return put(`${url.WEEKLYLESSONPLAN}/${id}`, data, getApiConfig(true))
}

export const deleteWeeklyLessonPlan = id => {
  return del(`${url.WEEKLYLESSONPLAN}/${id}`, getApiConfig())
}
