import { getApiConfig } from "helpers/authHelper"
import { get, post, put, del } from "../api_helper_area"
import * as url from "../urlHelper"

export const getSubCategories = () => {
  return get(`${url.BOOK_CATEGORY}/subCategories`, getApiConfig())
}

