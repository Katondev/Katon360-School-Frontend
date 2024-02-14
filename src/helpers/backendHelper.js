import { get, post, put, del } from "./api_helper"
import * as url from "./urlHelper"
import { getApiConfig } from "./authHelper"

// Student Login
export const loginUser = reqBody => {
  return post(url.USER_LOGIN, reqBody, {})
}
// Student Logout
export const logoutUser = () => {
  return del(url.USER_LOGOUT, getApiConfig())
}
// Teacher Login
export const loginTeacher = reqBody => {
  return post(url.TEACHER_LOGIN, reqBody, {})
}
// Teacher Logout
export const logoutTeacher = reqBody => {
  return post(url.TEACHER_LOGOUT, reqBody, {})
}
