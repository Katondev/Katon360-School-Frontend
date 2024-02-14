import { getApiConfig } from "helpers/authHelper"
import { get, post, put, del } from "../api_helper"
import * as url from "../urlHelper"

export const getBookDownloadCount = () => {
  return get(`${url.BOOK}/count`, getApiConfig())
}
