import { getApiConfig } from "helpers/authHelper"
import { get, post, put, del } from "../api_helper_area"
import * as url from "../urlHelper"

export const getAllRegion = () => {
  return get(url.REGION, getApiConfig())
}

export const createArea = data => {
  return post(url.MANAGE_AREA, data, getApiConfig())
}

export const getAllDistrict = () => {
  return get(url.DISTRICT, getApiConfig())
}

export const getAllCircuit = () => {
  return get(url.CIRCUIT, getApiConfig())
}

export const deleteArea = id => {
  return del(`${url.MANAGE_AREA}/${id}`, getApiConfig())
}
