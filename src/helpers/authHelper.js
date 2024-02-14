export const getAuthToken = () => {
  return localStorage.getItem("authToken") || ""
}

export const setAuthToken = token => {
  if (!token) {
    return false
  }
  localStorage.setItem("authToken", token)
  return true
}

export const removeAuthToken = () => {
  localStorage.removeItem("authToken")
  return true
}

export const getSchoolInfo = () => {
  let schoolInfo = localStorage.getItem("schoolInfo")
  return schoolInfo ? JSON.parse(schoolInfo) : null
}

export const getTeacherInfo = () => {
  let teacherInfo = localStorage.getItem("teacherInfo")
  return teacherInfo ? JSON.parse(teacherInfo) : null
}

export const setSchoolInfo = schoolInfo => {
  if (!schoolInfo) {
    return false
  }

  schoolInfo = JSON.stringify(schoolInfo)
  localStorage.setItem("schoolInfo", schoolInfo)
  return true
}

export const setTeacherInfo = teacherInfo => {
  if (!teacherInfo) {
    return false
  }

  teacherInfo = JSON.stringify(teacherInfo)
  localStorage.setItem("teacherInfo", teacherInfo)
  return true
}

export const setUserTypeInfo = userInfo => {
  if (!userInfo) {
    return false
  }

  userInfo = JSON.stringify(userInfo)
  localStorage.setItem("userInfoSchool", userInfo)
  return true
}
export const getUserTypeInfo = () => {
  // userTypes in Admin
  // Teacher = teacher
  // School Admin = schoolAdmin

  let userInfoType = localStorage.getItem("userInfoSchool")
  return userInfoType ? JSON.parse(userInfoType) : null
}
export const removeSchoolInfo = () => {
  localStorage.removeItem("schoolInfo")
  return true
}

export const removeTeacherInfo = () => {
  localStorage.removeItem("teacherInfo")
  return true
}

export const removeUserInfo = () => {
  localStorage.removeItem("userInfoSchool")
  return true
}

export const getApiConfig = isFormData => {
  let config = {}
  config = {
    "Content-Type": "multipart/form-data",
  }
  let token = getAuthToken()
  if (token) {
    let headers = {}
    if (isFormData) {
      headers = {
        "Content-Type": `multipart/form-data`,
        authorization: token,
      }
    } else {
      headers = {
        authorization: token,
      }
    }

    config = {
      ...config,
      headers,
    }
  }
  return config
}
