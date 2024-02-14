import { getApiConfig } from "helpers/authHelper"
import { get, post, put, del } from "../api_helper"
import * as url from "../urlHelper"

export const getAllStudents = () => {
  return get(url.STUDENTS, getApiConfig())
}

export const getLevelWiseStudentCount = () => {
  return get(`${url.STUDENTS}/level/count`, getApiConfig())
}

export const getAllStudentsBySchool = body => {
  return post(`${url.STUDENTS}/get`, body, getApiConfig())
}

export const getAllStudentsByTeacher = body => {
  return post(`${url.STUDENTS}/getAllStudentsByTeacher`, body, getApiConfig())
}

export const getStudent = (id, body) => {
  return post(`${url.STUDENTS}/${id}`, body, getApiConfig())
}

export const createStudent = data => {
  return post(url.STUDENTS, data, getApiConfig(true))
}

export const updateStudent = (id, data) => {
  return put(`${url.STUDENTS}/${id}`, data, getApiConfig(true))
}

export const deleteStudent = (id, body) => {
  return post(`${url.STUDENTS}/delete/${id}`, body, getApiConfig())
}
