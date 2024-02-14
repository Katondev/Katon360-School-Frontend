import { getApiConfig } from "helpers/authHelper"
import { get, post, put, del } from "../api_helper"
import * as url from "../urlHelper"

export const getAllAssigmentQuestion = () => {
  return get(`${url.ASSIGMENTQUESTION}/getAll`, getApiConfig())
}

export const getAllAssigQueByAssignFilter = (aq_category, aq_subCategory) => {
  return get(
    `${url.ASSIGMENTQUESTION}/getAllAssigQueByAssignFilter?aq_category=${aq_category}&aq_subCategory=${aq_subCategory}`,
    getApiConfig()
  )
}
export const getAllAssigQueByPastPaper = id => {
  return get(
    `${url.ASSIGMENTQUESTION}/getAllAssigQueByPastPaper?pp_id=${id}`,
    getApiConfig()
  )
}
export const updateAssigmentQuestion = (id, data) => {
  return put(`${url.ASSIGMENTQUESTION}/${id}`, data, getApiConfig())
}
export const getAssigmentQuestion = id => {
  return get(`${url.ASSIGMENTQUESTION}/${id}`, getApiConfig())
}

export const getAssigmentQuestionByAssignment = (tc_id, asn_id) => {
  return get(
    `${url.ASSIGMENTQUESTION}/getAssignmentQues?tc_id=${tc_id}&asn_id=${asn_id}`,
    getApiConfig()
  )
}

export const createAssigmentQuestion = data => {
  return post(url.ASSIGMENTQUESTION, data, getApiConfig())
}

export const deleteAssigmentQuestion = id => {
  return del(`${url.ASSIGMENTQUESTION}/${id}`, getApiConfig())
}
