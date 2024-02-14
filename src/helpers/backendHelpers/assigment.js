import { getApiConfig } from "helpers/authHelper"
import { get, post, put, del } from "../api_helper"
import * as url from "../urlHelper"

export const getAllAssigment = AssigmentId => {
  return get(`${url.ASSIGMENT}/get?tc_id=${AssigmentId}`, getApiConfig())
}
export const updateAssigment = (id, data) => {
  return put(`${url.ASSIGMENT}/${id}`, data, getApiConfig())
}
export const getAssigment = id => {
  return get(`${url.ASSIGMENT}/${id}`, getApiConfig())
}

export const createAssigment = data => {
  return post(url.ASSIGMENT, data, getApiConfig())
}

export const deleteAssigment = id => {
  return del(`${url.ASSIGMENT}/${id}`, getApiConfig())
}
