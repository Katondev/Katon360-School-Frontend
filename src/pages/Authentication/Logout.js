import PropTypes from "prop-types"
import React, { useEffect } from "react"
import { withRouter } from "react-router-dom"

import {
  getAuthToken,
  removeAuthToken,
  removeSchoolInfo,
  removeTeacherInfo,
  removeUserInfo,
} from "helpers/authHelper"
import { logoutTeacher, logoutUser } from "helpers/backendHelper"

const Logout = props => {
  const userType = JSON.parse(localStorage.getItem("userInfoSchool"))
  useEffect(() => {
    if (userType.userType == "School") {
      logoutUser(getAuthToken())
      removeAuthToken()
      removeSchoolInfo()
      removeUserInfo()
    } else if (userType.userType == "Teacher") {
      logoutTeacher(getAuthToken())
      removeTeacherInfo()
      removeAuthToken()
      removeUserInfo()
    }
    props.history.push("/login")
  }, [])

  return <></>
}

Logout.propTypes = {
  history: PropTypes.object,
}

export default withRouter(Logout)
