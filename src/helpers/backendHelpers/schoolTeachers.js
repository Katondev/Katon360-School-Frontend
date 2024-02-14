import { getApiConfig } from "helpers/authHelper"
import { get, post, put, del } from "../api_helper"
import * as url from "../urlHelper"

export const getAllSchoolTeachers = () => {
  return get(url.SCHOOL_TEACHERS, getApiConfig())
}
export const getAllTeachersBySchool = sc_id => {
  return get(`${url.SCHOOL_TEACHERS}/bySchool?sc_id=${sc_id}`, getApiConfig())
}

export const getLevelWiseTeacherCount = () => {
  return get(`${url.SCHOOL_TEACHERS}/level/count`, getApiConfig())
}

export const getTeacher = id => {
  return get(`${url.SCHOOL_TEACHERS}/${id}`, getApiConfig())
}

export const getTeacherByTeacherId = id => {
  return get(
    `${url.SCHOOL_TEACHERS}/getTeacherByTeacherId/${id}`,
    getApiConfig()
  )
}

export const getTeacherBySchool = (id, sc_id) => {
  return get(
    `${url.SCHOOL_TEACHERS}/bySchool/${id}?sc_id=${sc_id}`,
    getApiConfig()
  )
}

export const createTeacher = data => {
  return post(url.SCHOOL_TEACHERS, data, getApiConfig(true))
}

export const updateTeacher = (id, data) => {
  return put(`${url.SCHOOL_TEACHERS}/${id}`, data, getApiConfig(true))
}

export const updateTeacherProfileBySchool = (id, data, sc_id) => {
  return put(
    `${url.SCHOOL_TEACHERS}/profile/${id}?sc_id=${sc_id}`,
    data,
    getApiConfig(true)
  )
}

export const deleteTeacher = id => {
  return del(`${url.SCHOOL_TEACHERS}/${id}`, getApiConfig())
}
