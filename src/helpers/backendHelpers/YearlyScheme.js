import { getApiConfig } from "helpers/authHelper"
import { get, post, put, del } from "../api_helper"
import * as url from "../urlHelper"

export const getAllYearlyScheme = () => {
  return get(`${url.YEARLYSCHEME}/get`, getApiConfig())
}

export const getYearlyScheme = id => {
  return get(`${url.YEARLYSCHEME}/${id}`, getApiConfig())
}

export const createYearlyScheme = data => {
  return post(url.YEARLYSCHEME, data, getApiConfig(true))
}

export const updateYearlyScheme = (id, data) => {
  return put(`${url.YEARLYSCHEME}/${id}`, data, getApiConfig(true))
}

export const deleteYearlyScheme = id => {
  return del(`${url.YEARLYSCHEME}/${id}`, getApiConfig())
}
