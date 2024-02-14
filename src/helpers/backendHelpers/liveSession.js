import { getApiConfig } from "helpers/authHelper"
import { get, post, put, del } from "../api_helper"
import * as url from "../urlHelper"

export const getAllLiveSession = teacherId => {
  return get(`${url.LIVESESSION}/get?tc_id=${teacherId}`, getApiConfig())
}
export const updateLiveSession = (id, data) => {
  return put(`${url.LIVESESSION}/${id}`, data, getApiConfig(true))
}
export const getLiveSession = id => {
  return get(`${url.LIVESESSION}/${id}`, getApiConfig())
}

export const createLiveSession = data => {
  return post(url.LIVESESSION, data, getApiConfig(true))
}

export const deleteLiveSession = id => {
  return del(`${url.LIVESESSION}/${id}`, getApiConfig())
}
