import { getApiConfig } from "helpers/authHelper"
import { get, post, put, del } from "../api_helper"
import * as url from "../urlHelper"

export const getAllStudentAttendances = (month, sc_id) => {
  return get(`${url.STUDENTATTENDANCE}?monthYear=${month}&sc_id=${sc_id}`, getApiConfig())
}

export const getStudentAttendance = id => {
  return get(`${url.STUDENTATTENDANCE}/${id}`, getApiConfig())
}

export const createStudentAttendance = data => {
  return post(url.STUDENTATTENDANCE, data, getApiConfig(true))
}

export const updateStudentAttendanceWithBulk = (data, sc_id) => {
  return put(`${url.STUDENTATTENDANCE}?sc_id=${sc_id}`, data, getApiConfig(true))
}

export const updateStudentAttendance = (studentId, data) => {
  return put(
    `${url.STUDENTATTENDANCE}?studentId=${studentId}`,
    data,
    getApiConfig()
  )
}

export const deleteStudentAttendance = id => {
  return del(`${url.STUDENTATTENDANCE}/${id}`, getApiConfig())
}
