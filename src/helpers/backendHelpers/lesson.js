import { getApiConfig } from "helpers/authHelper"
import { get, post, put, del } from "../api_helper"
import * as url from "../urlHelper"

export const getAllTeacherLesson = () => {
  return get(url.TEACHER_LESSON, getApiConfig())
}

export const getTeacherLesson = id => {
  return get(`${url.TEACHER_LESSON}/${id}`, getApiConfig())
}

export const createTeacherLesson = data => {
  return post(url.TEACHER_LESSON, data, getApiConfig())
}

export const updateTeacherLesson = (id, data) => {
  return put(`${url.TEACHER_LESSON}/${id}`, data, getApiConfig())
}

export const deleteTeacherLesson = id => {
  return del(`${url.TEACHER_LESSON}/${id}`, getApiConfig())
}
