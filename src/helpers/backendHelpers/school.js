import { getApiConfig } from "helpers/authHelper"
import { get, post, put, del } from "../api_helper"
import * as url from "../urlHelper"
export const getAllSchool = () => {
  return get(`${url.API_URL_ADMIN_AREA}/school`, getApiConfig())
}

export const getSchool = body => {
  return post(`${url.SCHOOLPROFILE}`, body, getApiConfig())
}

export const updateSchool = data => {
  return put(`${url.SCHOOLPROFILE}`, data, getApiConfig())
}

export const updateSchoolById = (id, data) => {
  return put(
    `${url.SCHOOLPROFILE}/updateSchoolById?sc_id=${id}`,
    data,
    getApiConfig()
  )
}
