import { getApiConfig } from "helpers/authHelper"
import { get, post, put, del } from "../api_helper"
import * as url from "../urlHelper"

export const getAllClassroom = () => {
  console.log('apiconfigfromclasroom', getApiConfig())
  return get(url.CLASSROOM, getApiConfig())
}

export const getAllClassroomBySchool = (body) => {
  return post(`${url.CLASSROOM}/get`, body, getApiConfig())
}

export const getAllClassroomByClassRoomId = (body) => {
  return post(`${url.CLASSROOM}/getAllClassRoomByClassRoomId`, body, getApiConfig())
}

export const getClassroom = id => {
  return get(`${url.CLASSROOM}/${id}`, getApiConfig())
}

export const createClassroom = data => {
  return post(url.CLASSROOM, data, getApiConfig())
}

export const updateClassroom = (id, data) => {
  return put(`${url.CLASSROOM}/${id}`, data, getApiConfig())
}

export const deleteClassroom = id => {
  return del(`${url.CLASSROOM}/${id}`, getApiConfig())
}
