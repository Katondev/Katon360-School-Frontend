import React, { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
} from "reactstrap"

// Formik Validation
import * as Yup from "yup"
import { useFormik, Formik } from "formik"

//redux
import { useSelector, useDispatch } from "react-redux"
import { Form as RBSForm } from "react-bootstrap"

import { withRouter, useHistory } from "react-router-dom"

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb"
import {
  countryCodes,
  schoolType,
  bloodGroups as BGdropdownVals,
  subjectsMaster,
} from "common/data/dropdownVals"

// import avatar from "../../assets/images/users/avatar-1.jpg"
// actions
import { editProfile, resetProfileFlag } from "../../store/actions"
import {
  getSchoolInfo,
  getTeacherInfo,
  setTeacherInfo,
} from "helpers/authHelper"
import UpdateModal from "components/Common/UpdateModal"
import { SaveToast } from "components/Common/SaveToast"
import { getSchool, updateSchool } from "helpers/backendHelpers/school"
import { defaultRDCSeparator } from "helpers/common_helper_functions"
import RegionDistrictCircuitDropDownAllSelectable from "common/RegionDistrictCircuitDropDownAllSelectable"
import Select from "react-select"
import {
  getTeacher,
  getTeacherBySchool,
  updateTeacherProfileBySchool,
} from "helpers/backendHelpers/schoolTeachers"
import { IMAGE_URL } from "helpers/urlHelper"
import { getAllClassroomBySchool } from "helpers/backendHelpers/classroom"

const UserProfile = props => {
  //meta title
  document.title = "Profile | Skote - React Admin & Dashboard Template"

  const [email, setemail] = useState("")
  const [name, setname] = useState("")
  const [avatar, setAvatar] = useState("")

  const [idx, setidx] = useState(0)
  const [isEdit, setIsEdit] = useState(true)
  const [isView, setIsView] = useState(false)

  const [updateModal, setUpdateModal] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const userType = JSON.parse(localStorage.getItem("userInfoSchool"))
  const [selectedCountryCode, setSelectedCountryCode] = useState({})
  const [teacherId, setTeacherId] = useState(0)
  const [selectedSubject, setSelectedSubject] = useState([])
  const [selectedClassRoom, setSelectedClassRoom] = useState([])
  const [classroomDropdownValues, setClassroomDropdownValues] = useState([])

  const [form, setForm] = useState({
    tc_fullName: "",
    tc_email: "",
    tc_staffId: "",
    tc_schoolId: "",
    tc_education: "",
    tc_phoneNumber: "",
    tc_altPhoneNumber: "",
    tc_address: "",
    tc_profilePic: { fileName: "", file: {} },
    tc_degreeCertificate: { fileName: "", file: {} },
    tc_bloodGroup: "",
    tc_dateOfBirth: "",
    tc_altEmail: "",
    tc_countryCode: "",
    tc_subject: "",
    areaValue: "",
  })

  const history = useHistory()
  const { error, success } = useSelector(state => ({
    error: state.Profile.error,
    success: state.Profile.success,
  }))

  useEffect(() => {
    if (getTeacherInfo()) {
      const obj = getTeacherInfo()
    }
  }, [])

  useEffect(() => {
    let { type, id } = props.match.params || {}
    fetchClassroomDropDownValues()

    switch (type) {
      case "edit":
        setIsEdit(true)
        setIsView(true)
        setTeacherId(parseInt(id))
        break
      default:
        setIsView(false)
        setIsEdit(false)
        setTeacherId(parseInt(id))
        break
    }
    fetchEditTeacherDetails(id)
  }, [isEdit])

  useEffect(() => {
    if (classroomDropdownValues.length > 0 && isEdit) {
      fetchEditTeacherDetails(teacherId)
    }
  }, [classroomDropdownValues])

  const fetchEditTeacherDetails = async id => {
    try {
      const response = await getTeacherBySchool(id, userType?.sc_id)
      let { teacher } = response.data || {}
      console.log("teacher11", teacher)
      teacher = teacher || {}
      let { tc_region, tc_district, tc_circuit } = teacher

      let areaValue = `${tc_region || ""}${defaultRDCSeparator}${
        tc_district || ""
      }${defaultRDCSeparator}${tc_circuit || ""}`
      teacher["areaValue"] = areaValue

      teacher["tc_profilePic_old"] = teacher["tc_profilePic"]
      teacher["tc_degreeCertificate_old"] = teacher["tc_degreeCertificate"]
      teacher["tc_profilePic"] = { fileName: "", file: {} }
      teacher["tc_degreeCertificate"] = { fileName: "", file: {} }

      setAvatar(`${IMAGE_URL}/${teacher["tc_profilePic_old"]}`)
      setname(teacher.tc_fullName)
      setemail(teacher.tc_email)
      setidx(teacher.tc_id)
      setSelectedCountryCode(
        countryCodes.find(
          countryCode => countryCode.value === teacher["tc_countryCode"]
        )
      )
      let subFromRes = teacher["tc_subject"]
      let tempSub = []
      if (subFromRes && subFromRes.length > 0) {
        tempSub = subjectsMaster?.filter(masterSub => {
          return subFromRes?.find(subRes => {
            return subRes == masterSub.value
          })
        })
        setSelectedSubject(tempSub)
      }

      let dataFromRes = teacher["tc_classRoomId"]
      let tempClassRoomLabels =
        classroomDropdownValues &&
        classroomDropdownValues.filter(data => {
          return dataFromRes?.find(data1 => data1 == data.value)
        })

      setSelectedClassRoom(tempClassRoomLabels)
      return setForm(teacher)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching freelance school details"

      setForm(form)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleUpdateSchool = () => {
    setUpdateModal(false)
    SaveToast({ message: "Teacher Updated Successfully", type: "success" })
    history.push(`/teacher/profile/edit/${teacherId}`)
  }

  const handleEditTeacherSubmit = async (teacherId, data) => {
    try {
      setSubmitLoading(true)
      const response = await updateTeacherProfileBySchool(
        teacherId,
        data,
        userType?.sc_id
      )
      let message = response?.message || "Teacher Updated Successfully"
      let { teacher } = response.data || {}
      console.log("teacher12", teacher)
      if (response.status) {
        localStorage.removeItem("teacherInfo")
        if (!setTeacherInfo(teacher[0])) {
          return setError("Error while adding details")
        }
      }

      SaveToast({ message, type: "success" })
      setSubmitLoading(false)
      fetchEditTeacherDetails(teacherId)
      // props.history.push("/")
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Updating School"
      setSubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

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
            value: classroom.cr_id,
            label: `${classroom.cr_class}-${classroom.cr_division}`,
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

  return (
    <React.Fragment>
      <UpdateModal
        show={updateModal}
        onUpdateClick={handleUpdateSchool}
        onCloseClick={() => setUpdateModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          {/* <Breadcrumb showGoBackButton="Back" /> */}
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            {/* <h4 className="mb-0 font-size-18">{RDC}</h4> */}

            <Col className="text-end">
              <Button
                color="dark"
                onClick={() => {
                  props.history.goBack()
                }}
              >
                Back
              </Button>
            </Col>
          </div>

          <Row>
            <Col lg="12">
              {error && error ? <Alert color="dark">{error}</Alert> : null}
              {success ? <Alert color="success">{success}</Alert> : null}

              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="ms-3 me-4">
                      <img
                        src={avatar}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>{name}</h5>
                        <p className="mb-1">{}</p>
                        <p className="mb-0">Id no: #{idx}</p>
                      </div>
                    </div>
                    {/* <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>Area</h5>
                        <p className="mb-1">
                          Region-District-Circuit:
                          {RDC}
                        </p>
                        <p className="mb-0">
                          Town: {form.sc_town ? form.sc_town : "Town"}
                        </p>

                        <p className="mb-0"></p>
                      </div>
                    </div> */}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <h4 className="card-title mb-4">Edit Teacher</h4>

          <Card>
            <CardBody>
              <Formik
                enableReinitialize={true}
                initialValues={form}
                validationSchema={Yup.object({
                  tc_fullName: Yup.string().required(
                    "Please Enter Your Full Name"
                  ),
                  tc_email: Yup.string()
                    .required("Please Enter Your Email")
                    .email("Please Enter Valid Email"),
                  tc_altEmail: Yup.string()
                    .optional()
                    .email("Please Enter Valid Email")
                    .nullable(),
                  tc_staffId: Yup.string().required(
                    "Please Enter Your Staff Id"
                  ),
                  tc_education: Yup.string().notRequired().nullable(),
                  tc_address: Yup.string().notRequired().nullable(),
                  tc_phoneNumber: Yup.string()
                    .required("Please enter phone number")
                    .matches(
                      /^\d{9}$/,
                      "Please enter 9 digit number,without adding 0"
                    ),
                  tc_altPhoneNumber: Yup.string()
                    .nullable()
                    .notRequired()
                    .matches(/^[0-9]{10}$/, "Please Enter Valid Phone Number"),
                  tc_profilePic: Yup.mixed().nullable().notRequired(),
                  tc_classRoomId: Yup.mixed().test(
                    "invalidInput",
                    "Please Select Classroom",
                    value => {
                      if (value) {
                        return value.length
                      } else {
                        return false
                      }
                    }
                  ),
                  tc_degreeCertificate: Yup.mixed().nullable().notRequired(),

                  tc_countryCode: Yup.string().required(
                    "Please Select Country Code"
                  ),
                  tc_dateOfBirth: Yup.string().notRequired().nullable(),
                  tc_bloodGroup: Yup.string().nullable().notRequired(),
                  tc_subject: Yup.mixed().test(
                    "invalidInput",
                    "Please Select Subject",
                    value => {
                      if (value) {
                        return value.length
                      } else {
                        return false
                      }
                    }
                  ),
                  // tc_region: Yup.string().required("Please Select Region"),
                  areaValue: Yup.mixed().test(
                    "invalidInput",
                    "Please Select Region-District-Circuit",
                    value => {
                      return !!value
                    }
                  ),
                })}
                onSubmit={values => {
                  let [tc_region, tc_district, tc_circuit] =
                    (values?.areaValue + "" || "")?.split(
                      defaultRDCSeparator
                    ) || []

                  tc_region = tc_region || null
                  tc_district = tc_district || null
                  tc_circuit = tc_circuit || null

                  let teacherData = values
                  let tc_subjects = selectedSubject.map(data => data.value)
                  let tc_classRoomId = selectedClassRoom.map(data => data.value)
                  if (isEdit) {
                    const tc_id = teacherData["tc_id"]
                    teacherData["tc_region"] = tc_region
                    teacherData["tc_district"] = tc_district
                    teacherData["tc_circuit"] = tc_circuit
                    teacherData["tc_profilePic_old"] = form?.tc_profilePic_old
                    teacherData["tc_degreeCertificate_old"] =
                      form?.tc_degreeCertificate_old
                    teacherData["tc_profilePic"] = form?.tc_profilePic.file
                    teacherData["tc_degreeCertificate"] =
                      form?.tc_degreeCertificate.file
                    teacherData["tc_subject"] = tc_subjects.toString()
                    teacherData["tc_classRoomId"] = tc_classRoomId.toString()

                    delete teacherData["tc_id"]
                    return handleEditTeacherSubmit(teacherId, teacherData)
                  } else {
                    teacherData["tc_profilePic"] = form.tc_profilePic.file
                    teacherData["tc_degreeCertificate"] =
                      form.tc_degreeCertificate.file
                    teacherData["tc_region"] = tc_region
                    teacherData["tc_district"] = tc_district
                    teacherData["tc_circuit"] = tc_circuit
                    teacherData["tc_subject"] = tc_subjects.toString()
                    teacherData["tc_classRoomId"] = tc_classRoomId.toString()
                    return handleAddTeacherSubmit(teacherData)
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
                        console.log(e)
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
                                Full Name <span className="text-danger">*</span>
                              </Label>
                              <Input
                                name="tc_fullName"
                                type="text"
                                placeholder="Enter Full Name"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                invalid={
                                  touched.tc_fullName && errors.tc_fullName
                                }
                                defaultValue={form.tc_fullName}
                              />
                              {touched.tc_fullName && errors.tc_fullName && (
                                <FormFeedback>
                                  {errors.tc_fullName}
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
                                Select ClassRoom
                                <span className="text-danger">*</span>
                              </Label>
                              <Select
                                isMulti
                                name="tc_classRoomId"
                                placeholder="Select ClassRoom"
                                value={selectedClassRoom}
                                onChange={value => {
                                  setSelectedClassRoom(value)
                                  setFieldValue(
                                    "tc_classRoomId",
                                    value ? value : ""
                                  )
                                }}
                                onBlur={evt => {
                                  setFieldTouched("tc_classRoomId", true, true)
                                }}
                                options={classroomDropdownValues}
                                isClearable
                                invalid={
                                  touched.tc_classRoomId &&
                                  errors.tc_classRoomId
                                }
                              />
                              {touched.tc_classRoomId &&
                                errors.tc_classRoomId && (
                                  <div className="invalid-react-select-dropdown">
                                    {errors.tc_classRoomId}
                                  </div>
                                )}
                            </Col>
                            <Col
                              md={4}
                              sm={6}
                              xs={12}
                              className="mt-2 mt-sm-0 mb-3"
                            >
                              <Label className="form-label">
                                Select Subject
                                <span className="text-danger">*</span>
                              </Label>
                              <Select
                                isMulti
                                name="tc_subject"
                                placeholder="Select Subject"
                                value={selectedSubject}
                                onChange={value => {
                                  setSelectedSubject(value)
                                  setFieldValue(
                                    "tc_subject",
                                    value ? value : ""
                                  )
                                }}
                                onBlur={evt => {
                                  setFieldTouched("tc_subject", true, true)
                                }}
                                options={subjectsMaster}
                                isClearable
                                invalid={
                                  touched.tc_subject && errors.tc_subject
                                }
                              />
                              {touched.tc_subject && errors.tc_subject && (
                                <div className="invalid-react-select-dropdown">
                                  {errors.tc_subject}
                                </div>
                              )}
                            </Col>
                            <Col
                              md={4}
                              sm={6}
                              xs={12}
                              className="mt-2 mt-md-0 mb-3"
                            >
                              <Label className="form-label">
                                Email <span className="text-danger">*</span>
                              </Label>
                              <Input
                                name="tc_email"
                                type="email"
                                placeholder="Enter Email"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                invalid={touched.tc_email && errors.tc_email}
                                defaultValue={form.tc_email}
                              />
                              {touched.tc_email && errors.tc_email && (
                                <FormFeedback>{errors.tc_email}</FormFeedback>
                              )}
                            </Col>

                            <Col
                              md={4}
                              sm={6}
                              xs={12}
                              className="mt-2 mt-md-0 mb-3"
                            >
                              <Label className="form-label">Alt. Email</Label>
                              <Input
                                name="tc_altEmail"
                                type="email"
                                placeholder="Enter Alternate Email"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                invalid={
                                  touched.tc_altEmail && errors.tc_altEmail
                                }
                                defaultValue={form.tc_altEmail}
                              />
                              {touched.tc_altEmail && errors.tc_altEmail && (
                                <FormFeedback>
                                  {errors.tc_altEmail}
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
                                Staff Id <span className="text-danger">*</span>
                              </Label>
                              <Input
                                name="tc_staffId"
                                type="string"
                                placeholder="Enter Staff Id"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                invalid={
                                  touched.tc_staffId && errors.tc_staffId
                                }
                                defaultValue={form.tc_staffId}
                              />
                              {touched.tc_staffId && errors.tc_staffId && (
                                <FormFeedback>{errors.tc_staffId}</FormFeedback>
                              )}
                            </Col>

                            <Col
                              md={4}
                              sm={6}
                              xs={12}
                              className="mt-2 mt-sm-0 mb-3"
                            >
                              <Label className="form-label">Education </Label>
                              <Input
                                name="tc_education"
                                type="text"
                                placeholder="Enter Education"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                invalid={
                                  touched.tc_education && errors.tc_education
                                }
                                defaultValue={form.tc_education}
                              />
                              {touched.tc_education && errors.tc_education && (
                                <FormFeedback>
                                  {errors.tc_education}
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

                            <Col
                              md={2}
                              sm={4}
                              xs={12}
                              className="mt-2 mt-sm-0 mb-3"
                            >
                              <Label className="form-label">
                                Country Code{" "}
                                <span className="text-danger">*</span>
                              </Label>
                              <Select
                                name="tc_countryCode"
                                placeholder="Select Country Code"
                                value={selectedCountryCode}
                                onChange={value => {
                                  setSelectedCountryCode(value)
                                  setFieldValue(
                                    "tc_countryCode",
                                    value ? value.value : ""
                                  )
                                }}
                                onBlur={evt => {
                                  setFieldTouched("tc_countryCode", true, true)
                                }}
                                options={countryCodes.map(countryCode => {
                                  return {
                                    label: `${countryCode.label} (+${countryCode.value})`,
                                    value: countryCode.value,
                                  }
                                })}
                                isClearable
                                invalid={
                                  touched.tc_countryCode &&
                                  errors.tc_countryCode
                                }
                              />
                              {touched.tc_countryCode &&
                                errors.tc_countryCode && (
                                  <div className="invalid-react-select-dropdown">
                                    {errors.tc_countryCode}
                                  </div>
                                )}
                            </Col>

                            <Col
                              md={2}
                              sm={3}
                              xs={6}
                              className="mt-2 mt-sm-0 mb-3"
                            >
                              <Label className="form-label">
                                Phone Number{" "}
                                <span className="text-danger">*</span>
                              </Label>
                              <Input
                                name="tc_phoneNumber"
                                type="tel"
                                placeholder="Enter Phone Number"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                invalid={
                                  touched.tc_phoneNumber &&
                                  errors.tc_phoneNumber
                                }
                                defaultValue={form.tc_phoneNumber}
                              />
                              {touched.tc_phoneNumber &&
                                errors.tc_phoneNumber && (
                                  <FormFeedback>
                                    {errors.tc_phoneNumber}
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
                                name="tc_altPhoneNumber"
                                type="tel"
                                placeholder="Enter Alt. Phone Number"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                invalid={
                                  touched.tc_altPhoneNumber &&
                                  errors.tc_altPhoneNumber
                                }
                                defaultValue={form.tc_altPhoneNumber}
                              />
                              {touched.tc_altPhoneNumber &&
                                errors.tc_altPhoneNumber && (
                                  <FormFeedback>
                                    {errors.tc_altPhoneNumber}
                                  </FormFeedback>
                                )}
                            </Col>

                            <Col md={4} sm={6} xs={12} className="mb-3">
                              <Label className="form-label">Blood Group </Label>
                              <Input
                                name="tc_bloodGroup"
                                type="select"
                                className="form-select"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.tc_bloodGroup || 0}
                                invalid={
                                  touched.tc_bloodGroup && errors.tc_bloodGroup
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
                              {touched.tc_bloodGroup && errors.tc_bloodGroup ? (
                                <FormFeedback type="invalid">
                                  {errors.tc_bloodGroup}
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
                                name="tc_dateOfBirth"
                                type="date"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                max={new Date().toJSON().slice(0, 10)}
                                invalid={
                                  touched.tc_dateOfBirth &&
                                  errors.tc_dateOfBirth
                                }
                                value={values.tc_dateOfBirth}
                              />
                              {touched.tc_dateOfBirth &&
                                errors.tc_dateOfBirth && (
                                  <FormFeedback>
                                    {errors.tc_dateOfBirth}
                                  </FormFeedback>
                                )}
                            </Col>
                          </Row>

                          <Row className="mb-3">
                            <Col sm={12} md={6}>
                              <Row>
                                <Col>
                                  <Label className="form-label">Address </Label>
                                  <Input
                                    name="tc_address"
                                    type="textarea"
                                    rows={6}
                                    placeholder="Enter Address"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    invalid={
                                      touched.tc_address && errors.tc_address
                                    }
                                    defaultValue={form.tc_address}
                                  />
                                  {touched.tc_address && errors.tc_address && (
                                    <FormFeedback>
                                      {errors.tc_address}
                                    </FormFeedback>
                                  )}
                                </Col>
                              </Row>
                            </Col>

                            <Col sm={12} md={6} className="mt-2 mt-md-0">
                              <Row>
                                <Col>
                                  <Label className="form-label">
                                    Profile Pic
                                    {isEdit && form?.tc_profilePic_old && (
                                      <>
                                        <span className="ms-2">
                                          (
                                          <a
                                            href={`${IMAGE_URL}/${
                                              form?.tc_profilePic_old || ""
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
                                    name="tc_profilePic"
                                    type="file"
                                    accept=".png, .jpg, .jpeg, .gif"
                                    placeholder="Select Profile Pic"
                                    onChange={e => {
                                      let tempForm = form
                                      tempForm["tc_profilePic"]["fileName"] =
                                        e.target.value
                                      tempForm["tc_profilePic"]["file"] =
                                        e.target.files[0]
                                      setForm(tempForm)
                                    }}
                                    // onBlur={handleBlur}
                                    invalid={
                                      touched.tc_profilePic &&
                                      errors.tc_profilePic
                                    }
                                    defaultValue={form?.tc_profilePic?.fileName}
                                  />
                                  {touched.tc_profilePic &&
                                    errors.tc_profilePic && (
                                      <FormFeedback>
                                        {errors.tc_profilePic}
                                      </FormFeedback>
                                    )}
                                </Col>
                              </Row>

                              <Row className="mt-2">
                                <Col>
                                  <Label className="form-label">
                                    Degree Certificate
                                    {isEdit && form?.tc_degreeCertificate_old && (
                                      <>
                                        <span className="ms-2">
                                          (
                                          <a
                                            href={`${IMAGE_URL}/${
                                              form?.tc_degreeCertificate_old ||
                                              ""
                                            }`}
                                            target="_blank"
                                            rel="noreferrer"
                                          >
                                            Saved Degree Certificate
                                          </a>
                                        </span>
                                      </>
                                    )}
                                  </Label>
                                  <Input
                                    name="tc_degreeCertificate"
                                    type="file"
                                    accept=".png, .jpg, .jpeg, .gif, .pdf"
                                    placeholder="Select Degree Certificate"
                                    onChange={e => {
                                      let tempForm = form
                                      tempForm["tc_degreeCertificate"][
                                        "fileName"
                                      ] = e.target.value
                                      tempForm["tc_degreeCertificate"]["file"] =
                                        e.target.files[0]
                                      setForm(tempForm)
                                    }}
                                    invalid={
                                      touched.tc_degreeCertificate &&
                                      errors.tc_degreeCertificate
                                    }
                                    defaultValue={
                                      form?.tc_degreeCertificate?.fileName
                                    }
                                  />
                                  {touched.tc_degreeCertificate &&
                                    errors.tc_degreeCertificate && (
                                      <FormFeedback>
                                        {errors.tc_degreeCertificate}
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
                                type="button"
                                disabled={submitLoading}
                                className="mx-2"
                                onClick={() => {
                                  props.history.push("/teachers")
                                }}
                              >
                                Cancel
                              </Button>
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
        </Container>
      </div>
    </React.Fragment>
  )
}

export default withRouter(UserProfile)
