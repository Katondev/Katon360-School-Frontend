import { getApiConfig } from "helpers/authHelper"
import { get, post, put, del } from "../api_helper"
import * as url from "../urlHelper"

export const updateAssigmentQuestion = (id, data) => {
  return put(`${url.ASSIGMENTQUESTION}/${id}`, data, getApiConfig(true))
}
export const getAssigmentQuestion = id => {
  return get(`${url.ASSIGMENTQUESTION}/${id}`, getApiConfig())
}

export const getAssigmentQuestionByAssignment = (tc_id, asn_id) => {
  return get(`${url.ASSIGMENTQSET}/getAssignmentQues?tc_id=${tc_id}&asn_id=${asn_id}`, getApiConfig())
}

export const getAssigmentQsetByAssign = (asn_id) => {
  return get(`${url.ASSIGMENTQSET}/getAssignmentQsetByAssign?asn_id=${asn_id}`, getApiConfig())
}

export const getAllAssigmentQset = () => {
  return get(`${url.ASSIGMENTQSET}/getAll`, getApiConfig())
}

export const createAssigmentQset = data => {
  return post(url.ASSIGMENTQSET, data, getApiConfig())
}

export const deleteAssigmentQuestion = id => {
  return del(`${url.ASSIGMENTQSET}/${id}`, getApiConfig())
}
