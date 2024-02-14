import { getApiConfig } from "helpers/authHelper"
import { get, post, put, del } from "../api_helper"
import * as url from "../urlHelper"

export const getAllMainCategories = () => {
  return get(`${url.CATEGORY}/mainCategories`, getApiConfig())
}
export const getAllCategories = () => {
  return get(`${url.CATEGORY}/categories`, getApiConfig())
}
export const getAllSubCategories = () => {
  return get(`${url.CATEGORY}/subCategories`, getApiConfig())
}
export const getAllTopics = () => {
  return get(`${url.CATEGORY}/topics`, getApiConfig())
}

export const getAllContentCategories = () => {
  return get(`${url.CATEGORY}/all`, getApiConfig())
}
