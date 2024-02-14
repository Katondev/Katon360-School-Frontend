import { getApiConfig } from "helpers/authHelper"
import { get, post, put, del } from "../api_helper"
import * as url from "../urlHelper"

export const getAllStaffMembers = () => {
  return get(url.OFFICE_STAFF, getApiConfig())
}

export const getStaffMember = id => {
  return get(`${url.OFFICE_STAFF}/${id}`, getApiConfig())
}

export const createStaffMember = data => {
  return post(url.OFFICE_STAFF, data, getApiConfig())
}

export const updateStaffMember = (id, data) => {
  return put(`${url.OFFICE_STAFF}/${id}`, data, getApiConfig())
}

export const deleteStaffMember = id => {
  return del(`${url.OFFICE_STAFF}/${id}`, getApiConfig())
}
