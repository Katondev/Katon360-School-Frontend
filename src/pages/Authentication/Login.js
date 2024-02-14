import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"

import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Form,
  Input,
  FormFeedback,
  Label,
} from "reactstrap"

import { withRouter, Link } from "react-router-dom"

// Formik validation
import * as Yup from "yup"
import { useFormik } from "formik"

import { loginTeacher, loginUser } from "helpers/backendHelper"
import {
  getAuthToken,
  setAuthToken,
  setSchoolInfo,
  setTeacherInfo,
  setUserTypeInfo,
} from "helpers/authHelper"

// import images
import profile from "assets/images/profile-img.png"
import katonSmLogo from "assets/images/custom/logo/katon-sm-logo.png"
import { divisions, schoolLoginUserType } from "common/data/dropdownVals"
const Login = props => {
  //meta title
  document.title = "Login | LMS Ghana"

  useEffect(() => {
    if (getAuthToken()) {
      return props.history.push("/dashboard")
    }
  }, [])

  const [error, setError] = useState("")

  const schoolLogin = async reqBody => {
    try {
      let responseData = await loginUser(reqBody)

      if (!responseData?.status) {
        let message = responseData?.message || "Error while logging in"
        return setError(message)
      }

      let { token, school } = responseData.data

      if (!school) {
        return setError("Error while logging in")
      }

      if (!token) {
        return setError("Error while logging in")
      }

      token = `Bearer ${token}`

      let userInfo = {
        sc_id: school.sc_id,
        userType: "School",
      }

      if (!setAuthToken(token)) {
        return setError("Error while adding details")
      }

      if (!setSchoolInfo(school)) {
        return setError("Error while adding details")
      }

      if (!setUserTypeInfo(userInfo)) {
        return setError("Error while adding details")
      }

      return props.history.push("/dashboard")
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "Error while logging in"
      return setError(message)
    }
  }

  const teacherLogin = async reqBody => {
    try {
      let responseData = await loginTeacher(reqBody)

      if (!responseData?.status) {
        let message = responseData?.message || "Error while logging in"
        return setError(message)
      }
      let { token, teacher } = responseData.data

      if (!teacher) {
        return setError("Error while logging in")
      }

      if (!token) {
        return setError("Error while logging in")
      }

      token = `Bearer ${token}`

      let userInfo = {
        tc_id: teacher.tc_id,
        userType: "Teacher",
        sc_id: teacher.tc_school.sc_id,
        canCreateLiveClass: teacher.canCreateLiveClass,
      }

      if (!setAuthToken(token)) {
        return setError("Error while adding details")
      }

      if (!setTeacherInfo(teacher)) {
        return setError("Error while adding details")
      }

      if (!setUserTypeInfo(userInfo)) {
        return setError("Error while adding details")
      }

      return props.history.push("/lesson-notes")
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "Error while logging in"
      return setError(message)
    }
  }

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      userName: "",
      password: "",
      userType: "",
    },
    validationSchema: Yup.object({
      userName: Yup.string().required("Please Enter Your Username"),
      userType: Yup.string().required("Please Select userType"),

      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: async values => {
      let { userName, password, userType } = values
      let reqBody = {
        userName,
        password,
      }
      if (userType == "School") {
        schoolLogin(reqBody)
      } else if (userType == "Teacher") {
        teacherLogin(reqBody)
      } else if (userType == "Accountant") {
      }
    },
  })
  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="fas fa-home h2" />
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-dark bg-soft">
                  <Row>
                    <Col xs={7}>
                      <div className="text-dark p-4">
                        <h5 className="text-dark">Welcome Back !</h5>
                        <p>Sign in to continue to LMS Ghana.</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/" className="auth-logo-light">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          <img src={katonSmLogo} alt="" height="34" />
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2">
                    <Form
                      className="form-horizontal"
                      onSubmit={e => {
                        e.preventDefault()
                        validation.handleSubmit()
                        return false
                      }}
                    >
                      {error ? <Alert color="dark">{error}</Alert> : null}

                      <div className="mb-3">
                        <Label className="form-label">
                          Select User <span className="text-danger">*</span>
                        </Label>
                        <Input
                          name="userType"
                          type="select"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.userType || 0}
                          invalid={
                            validation.touched.userType &&
                            validation.errors.userType
                              ? true
                              : false
                          }
                        >
                          <option value="0" disabled>
                            Select Type
                          </option>
                          <option value="School">School Admin</option>
                          <option value="Teacher">Teacher</option>
                          <option value="Accountant">Accountant</option>
                        </Input>
                        {validation.touched.userType &&
                        validation.errors.userType ? (
                          <FormFeedback type="invalid">
                            {validation.errors.userType}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">Username</Label>
                        <Input
                          name="userName"
                          className="form-control"
                          placeholder="Enter username"
                          type="text"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.userName || ""}
                          invalid={
                            validation.touched.userName &&
                            validation.errors.userName
                              ? true
                              : false
                          }
                        />
                        {validation.touched.userName &&
                        validation.errors.userName ? (
                          <FormFeedback type="invalid">
                            {validation.errors.userName}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">Password</Label>
                        <Input
                          name="password"
                          value={validation.values.password || ""}
                          type="password"
                          placeholder="Enter Password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            validation.touched.password &&
                            validation.errors.password
                              ? true
                              : false
                          }
                        />
                        {validation.touched.password &&
                        validation.errors.password ? (
                          <FormFeedback type="invalid">
                            {validation.errors.password}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="customControlInline"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="customControlInline"
                        >
                          Remember me
                        </label>
                      </div>

                      <div className="mt-3 d-grid">
                        <button
                          className="btn btn-dark btn-block"
                          type="submit"
                        >
                          Log In
                        </button>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  © KA Technologies {new Date().getFullYear()}.
                  All rights Reserved.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default withRouter(Login)

Login.propTypes = {
  history: PropTypes.object,
}
