import { getApiConfig } from "helpers/authHelper"
import { del, get, post } from "../api_helper"
import * as url from "../urlHelper"

export const getAllMessages = () => {
  // return post(`${url.SENDMESSAGE}/get?tc_id=${schoolId}`, getApiConfig())
  return get(`${url.SENDMESSAGE}/getAll`, getApiConfig(true))
}

export const createMessage = data => {
  return post(url.SENDMESSAGE, data, getApiConfig(true))
}

export const deleteMessage = id => {
  return del(`${url.SENDMESSAGE}/${id}`, getApiConfig())
}
