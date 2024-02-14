import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  FormFeedback,
  Input,
  Label,
  Row,
} from "reactstrap"
import { Form, Formik } from "formik"
import * as Yup from "yup"
import {
  bloodGroups as BGdropdownVals,
  countryCodes,
} from "common/data/dropdownVals"
import RegionDistrictCircuitDropDownAllSelectable from "components/Common/RegionDistrictCircuitDropDownAllSelectable"
import SubmitLoader from "common/SubmitLoader"
import Select from "react-select"

import { defaultRDCSeparator } from "helpers/common_helper_functions"

import { SaveToast } from "components/Common/SaveToast"
import {
  updateStudent,
  createStudent,
  getStudent,
} from "helpers/backendHelpers/students"

import { getAllClassroomBySchool } from "helpers/backendHelpers/classroom"
import { IMAGE_URL } from "helpers/urlHelper"

const StudentModal = props => {
  const [isEdit, setIsEdit] = useState(false)
  const [isView, setIsView] = useState(false)
  const [studentId, setStudentId] = useState(0)

  const [submitLoading, setSubmitLoading] = useState(false)
  const [classroomDropdownValues, setClassroomDropdownValues] = useState([])

  const [selectedCountryCode, setSelectedCountryCode] = useState({})

  const userType = JSON.parse(localStorage.getItem("userInfoSchool"))

  const [form, setForm] = useState({
    st_classRoomId: "",
    st_fullName: "",
    st_parentName: "",
    st_phoneNumber: "",
    st_altPhoneNumber: "",
    st_email: "",
    st_profilePic: { fileName: "", file: {} },
    st_bloodGroup: "",
    st_dateOfBirth: "",
    st_region: "",
    st_district: "",
    st_circuit: "",
    st_address: "",
    st_password: "",
    st_studentId: "",
    st_altEmail: "",
    st_parentEmail: "",
    st_areaOfStudy: "",
    st_curricularActivities: "",
    st_countryCode: 0,
    st_status: true,
    areaValue: "",
  })

  useEffect(() => {
    // document.getElementById("students-list").classList.add("mm-active")
    // document.getElementById("students").classList.add("mm-active")
    let { type, id } = props.match.params || {}
    fetchClassroomDropDownValues()

    switch (type) {
      case "edit":
        setIsEdit(true)
        setIsView(false)
        setStudentId(parseInt(id))
        break
      case "view":
        setIsView(true)
        setIsEdit(false)
        setStudentId(parseInt(id))
        break
      case "add":
      default:
        setIsView(false)
        setIsEdit(false)
        setStudentId(0)
        break
    }

    if (id) {
      fetchStudentForEdit(id)
    }
  }, [isEdit])

  const fetchClassroomDropDownValues = async () => {
    try {
      let body = {
        sc_id: userType?.sc_id,
      }
      let response = await getAllClassroomBySchool(body)
      let { classRooms } = response.data || {}
      classRooms = classRooms || []
      let classroomVals = classRooms
        .filter(classroom => {
          return classroom.cr_status
        })
        .map(classroom => {
          return {
            id: classroom.cr_id,
            value: `${classroom.cr_class}-${classroom.cr_division}`,
          }
        })
      setClassroomDropdownValues(classroomVals)
      return
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching classrooms"

      return SaveToast({ message, type: "error" })
    }
  }

  const fetchStudentForEdit = async st_id => {
    try {
      let body = {
        sc_id: userType?.sc_id,
      }
      let response = await getStudent(st_id, body)

      let { student } = response.data || {}

      student = student || {}

      let { st_region, st_district, st_circuit } = student

      let areaValue = `${st_region || ""}${defaultRDCSeparator}${
        st_district || ""
      }${defaultRDCSeparator}${st_circuit || ""}`
      student["areaValue"] = areaValue
      student["st_profilePic_old"] = student["st_profilePic"]
      student["st_profilePic"] = { fileName: "", file: {} }
      student["st_altPhoneNumber"] =
        student.st_altPhoneNumber === null ? "" : student.st_altPhoneNumber

      if (student.st_classRoom) {
        let { cr_class, cr_division } = student?.st_classRoom
        student.st_classRoom = `${cr_class}-${cr_division}`
      }

      setSelectedCountryCode(
        countryCodes.find(
          countryCode => countryCode.value === student["st_countryCode"]
        )
      )
      return setForm(student)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching student details"

      setForm(form)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleCreateStudent = async reqBody => {
    try {
      setSubmitLoading(true)
      let response = await createStudent(reqBody)
      let message = response?.message || "Student created successfully"
      SaveToast({ message, type: "success" })
      setSubmitLoading(false)
      props.history.push("/students")
      return
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem creating student details"
      setSubmitLoading(false)
      setForm(form)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleUpdateStudentSubmit = async (id, reqBody) => {
    if (!studentId) {
      return SaveToast({ message: "Invalid Student ID", type: "error" })
    }

    try {
      setSubmitLoading(true)
      let response = await updateStudent(studentId, reqBody)
      let message = response?.message || "Student Updated Successfully"
      SaveToast({ message, type: "success" })
      setSubmitLoading(false)
      props.history.push("/students")
      return
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem updating student"

      setSubmitLoading(false)
      setForm(form)
      return SaveToast({ message, type: "error" })
    }
  }

  const passwordValidation = !isEdit
    ? Yup.string().min(6).required("Please Enter password")
    : Yup.string().min(6).optional("Please Enter password")

  return (
    <React.Fragment>
      <div className="page-content">
        <div
          className="container-fluid"
          style={submitLoading ? { position: "relative", opacity: "0.8" } : {}}
        >
          {submitLoading ? <SubmitLoader /> : <></>}
          <Card>
            <CardHeader>
              <CardTitle>
                {isView ? (
                  <Label>Student Details</Label>
                ) : (
                  <Label>{!isEdit ? "Enter" : "Update"} Details</Label>
                )}
              </CardTitle>
            </CardHeader>
            <CardBody>
              <Formik
                enableReinitialize={true}
                initialValues={form}
                validationSchema={Yup.object({
                  st_studentId: Yup.string().required("Please Enter StudentId"),
                  st_fullName: Yup.string().required("Please Enter Full Name"),
                  st_parentName: Yup.string().notRequired().nullable(),
                  st_phoneNumber: Yup.string()
                    .notRequired()
                    .matches(/^[0-9]{10}$/, "Please Enter Valid Phone Number")
                    .nullable(),
                  st_altPhoneNumber: Yup.string()
                    .nullable()
                    .notRequired()
                    .matches(/^[0-9]{10}$/, "Please Enter Valid Phone Number"),
                  st_email: Yup.string()
                    .notRequired()
                    .email("Please Enter Valid Email")
                    .nullable(),
                  st_classRoomId: Yup.string().notRequired().nullable(),
                  st_profilePic: Yup.mixed().notRequired().nullable(),
                  // .test(
                  //   "fileNotSelected",
                  //   "Please Select Profile Picture",
                  //   value => {
                  //     return isEdit || !!form?.["st_profilePic"]?.file?.type
                  //   }
                  // )
                  // .test("fileFormat", "Unsupported Format", value => {
                  //   if (!form?.["st_profilePic"]?.file?.type)
                  //     return isEdit || false

                  //   return [
                  //     "image/png",
                  //     "image/jpg",
                  //     "image/jpeg",
                  //     "image/gif",
                  //   ].includes(form?.["st_profilePic"].file.type)
                  // }),
                  st_bloodGroup: Yup.string().notRequired().nullable(),
                  st_dateOfBirth: Yup.date().notRequired().nullable(),
                  areaValue: Yup.mixed().test(
                    "invalidInput",
                    "Please Select Region-District-Circuit",
                    value => {
                      return !!value
                    }
                  ),
                  st_address: Yup.string()
                    .notRequired("Please Enter Address")
                    .nullable(),
                  st_status: Yup.bool().required("Please Select Status"),
                  st_password: passwordValidation,
                  st_altEmail: Yup.string().notRequired().nullable(),
                  st_parentEmail: Yup.string()
                    .notRequired()
                    .email("Please Enter Valid ParentEmail")
                    .nullable(),
                  st_areaOfStudy: Yup.string().notRequired().nullable(),
                  st_curricularActivities: Yup.string()
                    .notRequired()
                    .nullable(),
                  st_countryCode: Yup.string().notRequired().nullable(),
                })}
                onSubmit={values => {
                  let [st_region, st_district, st_circuit] =
                    (values?.areaValue + "" || "")?.split(
                      defaultRDCSeparator
                    ) || []

                  st_region = st_region || null
                  st_district = st_district || null
                  st_circuit = st_circuit || null

                  let studentData = values

                  studentData["st_countryCode"] =
                    studentData["st_countryCode"] === 0
                      ? null
                      : studentData["st_countryCode"]

                  studentData.st_password =
                    studentData.st_password === ""
                      ? null
                      : studentData.st_password

                  if (isEdit) {
                    studentData["st_region"] = st_region
                    studentData["st_district"] = st_district
                    studentData["st_circuit"] = st_circuit
                    studentData["st_profilePic_old"] = form.st_profilePic_old
                    studentData["st_profilePic"] = form.st_profilePic.file
                    studentData["sc_id"] = userType?.sc_id
                    delete studentData["st_id"]
                    return handleUpdateStudentSubmit(studentId, studentData)
                  } else {
                    studentData["st_profilePic"] = form.st_profilePic.file
                    studentData["st_region"] = st_region
                    studentData["st_district"] = st_district
                    studentData["st_circuit"] = st_circuit
                    studentData["sc_id"] = userType?.sc_id
                    return handleCreateStudent(studentData)
                  }
                }}
              >
                {({
                  touched,
                  errors,
                  values,
                  handleSubmit,
                  handleBlur,
                  handleChange,
                  setFieldValue,
                  setFieldTouched,
                }) => (
                  <>
                    <Form
                      onSubmit={e => {
                        e.preventDefault()
                        handleSubmit(e)
                        return false
                      }}
                    >
                      <Row>
                        <Col>
                          <Row className="mb-3">
                            <Col md={4} sm={6} xs={12} className="mb-3">
                              <Label className="form-label">
                                Student Id
                                <span className="text-danger">*</span>
                              </Label>
                              <Input
                                name="st_studentId"
                                type="text"
                                placeholder="Enter Student Id"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                invalid={
                                  touched.st_studentId && errors.st_studentId
                                }
                                defaultValue={form.st_studentId}
                              />
                              {touched.st_studentId && errors.st_studentId && (
                                <FormFeedback>
                                  {errors.st_studentId}
                                </FormFeedback>
                              )}
                            </Col>

                            <Col md={4} sm={6} xs={12} className="mb-3">
                              <Label className="form-label">
                                Select Classroom
                              </Label>
                              <Input
                                name="st_classRoomId"
                                type="select"
                                className="form-select"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.st_classRoomId || 0}
                                invalid={
                                  touched.st_classRoomId &&
                                  errors.st_classRoomId
                                    ? true
                                    : false
                                }
                              >
                                <option value="0" disabled>
                                  Select Classroom
                                </option>
                                {classroomDropdownValues.map(val => {
                                  return (
                                    <option key={val.id} value={val.id}>
                                      {val.value}
                                    </option>
                                  )
                                })}
                              </Input>
                              {touched.st_classRoomId &&
                              errors.st_classRoomId ? (
                                <FormFeedback type="invalid">
                                  {errors.st_classRoomId}
                                </FormFeedback>
                              ) : null}
                            </Col>

                            <Col md={4} sm={6} xs={12} className="mb-3">
                              <Label className="form-label">
                                Full Name <span className="text-danger">*</span>
                              </Label>
                              <Input
                                name="st_fullName"
                                type="text"
                                placeholder="Enter Full Name"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                invalid={
                                  touched.st_fullName && errors.st_fullName
                                }
                                defaultValue={form.st_fullName}
                              />
                              {touched.st_fullName && errors.st_fullName && (
                                <FormFeedback>
                                  {errors.st_fullName}
                                </FormFeedback>
                              )}
                            </Col>

                            <Col md={4} sm={6} xs={12} className="mb-3">
                              <Label className="form-label">Parent Name </Label>
                              <Input
                                name="st_parentName"
                                type="text"
                                placeholder="Enter Parent Name"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                invalid={
                                  touched.st_parentName && errors.st_parentName
                                }
                                defaultValue={form.st_parentName}
                              />
                              {touched.st_parentName &&
                                errors.st_parentName && (
                                  <FormFeedback>
                                    {errors.st_parentName}
                                  </FormFeedback>
                                )}
                            </Col>

                            <Col
                              md={2}
                              sm={4}
                              xs={12}
                              className="mt-2 mt-sm-0 mb-3"
                            >
                              <Label className="form-label">
                                Country Code{" "}
                              </Label>
                              <Select
                                name="st_countryCode"
                                placeholder="Select Country Code"
                                value={selectedCountryCode}
                                onChange={value => {
                                  setSelectedCountryCode(value)
                                  setFieldValue(
                                    "st_countryCode",
                                    value ? value.value : ""
                                  )
                                }}
                                onBlur={evt => {
                                  setFieldTouched("st_countryCode", true, true)
                                }}
                                options={countryCodes.map(countryCode => {
                                  return {
                                    label: `${countryCode.label} (+${countryCode.value})`,
                                    value: countryCode.value,
                                  }
                                })}
                                isClearable
                                invalid={
                                  touched.st_countryCode &&
                                  errors.st_countryCode
                                }
                              />
                              {touched.st_countryCode &&
                                errors.st_countryCode && (
                                  <div className="invalid-react-select-dropdown">
                                    {errors.st_countryCode}
                                  </div>
                                )}
                            </Col>

                            <Col
                              md={2}
                              sm={4}
                              xs={6}
                              className="mt-2 mt-sm-0 mb-3"
                            >
                              <Label className="form-label">
                                Phone Number{" "}
                              </Label>
                              <Input
                                name="st_phoneNumber"
                                type="tel"
                                placeholder="Enter Phone Number"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                invalid={
                                  touched.st_phoneNumber &&
                                  errors.st_phoneNumber
                                }
                                defaultValue={form.st_phoneNumber}
                              />
                              {touched.st_phoneNumber &&
                                errors.st_phoneNumber && (
                                  <FormFeedback>
                                    {errors.st_phoneNumber}
                                  </FormFeedback>
                                )}
                            </Col>

                            <Col
                              md={4}
                              sm={6}
                              xs={12}
                              className="mt-2 mt-sm-0 mb-3"
                            >
                              <Label className="form-label">
                                Alt. Phone Number
                              </Label>
                              <Input
                                name="st_altPhoneNumber"
                                type="tel"
                                placeholder="Enter Alt. Phone Number"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                invalid={
                                  touched.st_altPhoneNumber &&
                                  errors.st_altPhoneNumber
                                }
                                defaultValue={form.st_altPhoneNumber}
                              />
                              {touched.st_altPhoneNumber &&
                                errors.st_altPhoneNumber && (
                                  <FormFeedback>
                                    {errors.st_altPhoneNumber}
                                  </FormFeedback>
                                )}
                            </Col>

                            <Col
                              md={4}
                              sm={6}
                              xs={12}
                              className="mt-2 mt-md-0 mb-3"
                            >
                              <Label className="form-label">Email</Label>
                              <Input
                                name="st_email"
                                type="email"
                                placeholder="Enter Email"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                invalid={touched.st_email && errors.st_email}
                                defaultValue={form.st_email}
                              />
                              {touched.st_email && errors.st_email && (
                                <FormFeedback>{errors.st_email}</FormFeedback>
                              )}
                            </Col>

                            <Col
                              md={4}
                              sm={6}
                              xs={12}
                              className="mt-2 mt-md-0 mb-3"
                            >
                              <Label className="form-label">Alt Email</Label>
                              <Input
                                name="st_altEmail"
                                type="email"
                                placeholder="Enter Alt. Email"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                invalid={
                                  touched.st_altEmail && errors.st_altEmail
                                }
                                defaultValue={form.st_altEmail}
                              />
                              {touched.st_altEmail && errors.st_altEmail && (
                                <FormFeedback>
                                  {errors.st_altEmail}
                                </FormFeedback>
                              )}
                            </Col>

                            <Col
                              md={4}
                              sm={6}
                              xs={12}
                              className="mt-2 mt-md-0 mb-3"
                            >
                              <Label className="form-label">
                                Parent Email{" "}
                              </Label>
                              <Input
                                name="st_parentEmail"
                                type="email"
                                placeholder="Enter ParentEmail"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                invalid={
                                  touched.st_parentEmail &&
                                  errors.st_parentEmail
                                }
                                defaultValue={form.st_parentEmail}
                              />
                              {touched.st_parentEmail &&
                                errors.st_parentEmail && (
                                  <FormFeedback>
                                    {errors.st_parentEmail}
                                  </FormFeedback>
                                )}
                            </Col>

                            <Col
                              md={4}
                              sm={6}
                              xs={12}
                              className="mt-2 mt-sm-0 mb-3"
                            >
                              <RegionDistrictCircuitDropDownAllSelectable
                                isRequired={true}
                                fieldName="areaValue"
                                hasTouched={touched.areaValue}
                                hasErrors={errors.areaValue}
                                areaValue={values.areaValue}
                                setFieldValue={setFieldValue}
                                setFieldTouched={setFieldTouched}
                              />
                            </Col>

                            <Col md={4} sm={6} xs={12} className="mb-3">
                              <Label className="form-label">
                                Area Of Study{" "}
                              </Label>
                              <Input
                                name="st_areaOfStudy"
                                type="text"
                                placeholder="Enter Area Of Study"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                invalid={
                                  touched.st_areaOfStudy &&
                                  errors.st_areaOfStudy
                                }
                                defaultValue={form.st_areaOfStudy}
                              />
                              {touched.st_areaOfStudy &&
                                errors.st_areaOfStudy && (
                                  <FormFeedback>
                                    {errors.st_areaOfStudy}
                                  </FormFeedback>
                                )}
                            </Col>

                            <Col md={4} sm={6} xs={12} className="mb-3">
                              <Label className="form-label">
                                Curricular Activities{" "}
                              </Label>
                              <Input
                                name="st_curricularActivities"
                                type="text"
                                placeholder="Enter Area of Study"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                invalid={
                                  touched.st_curricularActivities &&
                                  errors.st_curricularActivities
                                }
                                defaultValue={form.st_curricularActivities}
                              />
                              {touched.st_curricularActivities &&
                                errors.st_curricularActivities && (
                                  <FormFeedback>
                                    {errors.st_curricularActivities}
                                  </FormFeedback>
                                )}
                            </Col>

                            <Col md={4} sm={6} xs={12} className="mb-3">
                              <Label className="form-label">Blood Group </Label>
                              <Input
                                name="st_bloodGroup"
                                type="select"
                                className="form-select"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.st_bloodGroup || 0}
                                invalid={
                                  touched.st_bloodGroup && errors.st_bloodGroup
                                    ? true
                                    : false
                                }
                              >
                                <option value="0" disabled>
                                  Select Blood Group
                                </option>
                                {BGdropdownVals.map(val => {
                                  return (
                                    <option key={val} value={val}>
                                      {val}
                                    </option>
                                  )
                                })}
                              </Input>
                              {touched.st_bloodGroup && errors.st_bloodGroup ? (
                                <FormFeedback type="invalid">
                                  {errors.st_bloodGroup}
                                </FormFeedback>
                              ) : null}
                            </Col>

                            <Col
                              md={4}
                              sm={6}
                              xs={12}
                              className="mt-2 mt-md-0 mb-3"
                            >
                              <Label className="form-label">
                                Date Of Birth{" "}
                              </Label>
                              <Input
                                name="st_dateOfBirth"
                                type="date"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                invalid={
                                  touched.st_dateOfBirth &&
                                  errors.st_dateOfBirth
                                }
                                value={values.st_dateOfBirth}
                              />
                              {touched.st_dateOfBirth &&
                                errors.st_dateOfBirth && (
                                  <FormFeedback>
                                    {errors.st_dateOfBirth}
                                  </FormFeedback>
                                )}
                            </Col>

                            <Col
                              md={4}
                              sm={6}
                              xs={12}
                              className="mt-2 mt-md-0 mb-3"
                            >
                              <Label className="form-label">
                                Password
                                {!isEdit && (
                                  <span className="text-danger">*</span>
                                )}
                              </Label>
                              <Input
                                name="st_password"
                                type="password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.st_password || ""}
                                invalid={
                                  touched.st_password && errors.st_password
                                    ? true
                                    : false
                                }
                              />
                              {touched.st_password && errors.st_password ? (
                                <FormFeedback type="invalid">
                                  {errors.st_password}
                                </FormFeedback>
                              ) : null}
                            </Col>
                          </Row>

                          <Row className="mb-3">
                            <Col sm={12} md={6}>
                              <Row>
                                <Col>
                                  <Label className="form-label">Address </Label>
                                  <Input
                                    name="st_address"
                                    type="textarea"
                                    rows={6}
                                    placeholder="Enter Address"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    invalid={
                                      touched.st_address && errors.st_address
                                    }
                                    defaultValue={form.st_address}
                                  />
                                  {touched.st_address && errors.st_address && (
                                    <FormFeedback>
                                      {errors.st_address}
                                    </FormFeedback>
                                  )}
                                </Col>
                              </Row>
                            </Col>

                            <Col sm={12} md={6} className="mt-2 mt-md-0">
                              <Row>
                                <Col>
                                  <Label className="form-label">
                                    Profile Pic{" "}
                                    {isEdit && form?.st_profilePic_old && (
                                      <>
                                        <span className="ms-2">
                                          (
                                          <a
                                            href={`${IMAGE_URL}/${
                                              form?.st_profilePic_old || ""
                                            }`}
                                            target="_blank"
                                            rel="noreferrer"
                                          >
                                            Saved Profile Picture
                                          </a>
                                          )
                                        </span>
                                      </>
                                    )}
                                  </Label>
                                  <Input
                                    name="st_profilePic"
                                    type="file"
                                    accept=".png, .jpg, .jpeg, .gif"
                                    placeholder="Select Profile Pic"
                                    onChange={e => {
                                      let tempForm = form
                                      tempForm["st_profilePic"]["fileName"] =
                                        e.target.value
                                      tempForm["st_profilePic"]["file"] =
                                        e.target.files[0]
                                      setForm(tempForm)
                                    }}
                                    invalid={
                                      !!touched.st_profilePic &&
                                      !!errors.st_profilePic
                                    }
                                    defaultValue={form.st_profilePic.fileName}
                                  />
                                  {touched.st_profilePic &&
                                    errors.st_profilePic && (
                                      <FormFeedback>
                                        {errors.st_profilePic}
                                      </FormFeedback>
                                    )}
                                </Col>
                              </Row>
                            </Col>
                          </Row>

                          <Row className="mb-3 text-center">
                            <Col>
                              <Button
                                size="md"
                                color="dark"
                                type="submit"
                                disabled={submitLoading}
                              >
                                {!isEdit ? "Save" : "Update"}
                              </Button>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Form>
                  </>
                )}
              </Formik>
            </CardBody>
          </Card>
        </div>
      </div>
    </React.Fragment>
  )
}

StudentModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
}

export default StudentModal
