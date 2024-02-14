import { getApiConfig } from "helpers/authHelper"
import { get, post, put, del } from "../api_helper"
import * as url from "../urlHelper"

export const getAllStudentRemark = () => {
  return get(url.STUDENT_REMARK, getApiConfig())
}

export const getStudentRemark = id => {
  return get(`${url.STUDENT_REMARK}/${id}`, getApiConfig())
}

export const getStudentRemarkByStudent = (st_id) => {
  return get(`${url.STUDENT_REMARK}/byStudent/get?st_id=${st_id}`, getApiConfig())
}

export const createStudentRemark = data => {
  return post(url.STUDENT_REMARK, data, getApiConfig())
}

export const createStudentRemarkByStudent = (sc_id, data) => {
  return post(`${url.STUDENT_REMARK}/byStudent/create?sc_id=${sc_id}`, data, getApiConfig())
}

export const updateStudentRemark = (id, data) => {
  return put(`${url.STUDENT_REMARK}/${id}`, data, getApiConfig())
}

export const updateStudentRemarkByStudent = (id, data, sc_id) => {
  return put(`${url.STUDENT_REMARK}/byStudent/${id}?sc_id=${sc_id}`, data, getApiConfig())
}

export const deleteStudentRemark = id => {
  return del(`${url.STUDENT_REMARK}/${id}`, getApiConfig())
}
