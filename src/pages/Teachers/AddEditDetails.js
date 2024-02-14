import React, { useEffect, useState } from "react"
import PropTypes, { number, object } from "prop-types"
import {
  Button,
  Card,
  CardBody,
  Col,
  FormFeedback,
  Input,
  Label,
  Row,
} from "reactstrap"
import { Form, Formik } from "formik"
import * as Yup from "yup"
import ViewDetails from "./ViewDetails"
import Select from "react-select"
import UpdateModal from "../../components/Common/UpdateModal"
import { SaveToast } from "components/Common/SaveToast"
import {
  createTeacher,
  getTeacher,
  updateTeacher,
} from "helpers/backendHelpers/schoolTeachers"
import { IMAGE_URL } from "helpers/urlHelper"
import SubmitLoader from "components/Common/SubmitLoader"
import RegionDistrictCircuitDropDownAllSelectable from "components/Common/RegionDistrictCircuitDropDownAllSelectable"
import {
  divisions as DivisionVal,
  bloodGroups as BGdropdownVals,
  standard as ClassesVal,
  countryCodes,
  subjectsMaster,
} from "common/data/dropdownVals"
import { defaultRDCSeparator } from "helpers/common_helper_functions"
import { getAllClassroomBySchool } from "helpers/backendHelpers/classroom"
const TeacherModal = props => {
  const [isEdit, setIsEdit] = useState(false)
  const [isView, setIsView] = useState(false)
  const [teacherId, setTeacherId] = useState(0)
  const [classroomDropdownValues, setClassroomDropdownValues] = useState([])
  const [updateModal, setUpdateModal] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [selectedCountryCode, setSelectedCountryCode] = useState({})
  const [selectedClassRoom, setSelectedClassRoom] = useState([])
  const [selectedSubject, setSelectedSubject] = useState([])
  const userType = JSON.parse(localStorage.getItem("userInfoSchool"))
  const [temp, setTemp] = useState(false)

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
    areaValue: "",
    tc_subject: "",
    tc_classRoomId: "",
  })
  useEffect(() => {
    fetchClassroomDropDownValues()
  }, [])
  useEffect(() => {
    document.getElementById("teachers").classList.add("mm-active")
    let { type, id } = props.match.params || {}
    fetchClassroomDropDownValues()
    switch (type) {
      case "edit":
        setIsEdit(true)
        setIsView(false)
        setTeacherId(parseInt(id))
        break
      case "view":
        setIsView(true)
        setIsEdit(false)
        setTeacherId(parseInt(id))
        break
      case "add":
        break
      default:
        setIsView(false)
        setIsEdit(false)
        setTeacherId(parseInt(id))
        break
    }

    if (id) {
      fetchTeacherDetailsForEdit(id)
    }
  }, [isEdit])

  useEffect(() => {
    if (classroomDropdownValues.length > 0 && isEdit) {
      fetchTeacherDetailsForEdit(teacherId)
    }
  }, [classroomDropdownValues])

  const fetchTeacherDetailsForEdit = async tc_id => {
    try {
      let response = await getTeacher(tc_id)

      let { teacher } = response.data || {}
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

      setSelectedCountryCode(
        countryCodes.find(
          countryCode => countryCode.value === teacher["tc_countryCode"]
        )
      )

      let subFromRes = teacher["tc_subject"]
      let tempSub = []
      if (subFromRes && subFromRes.length > 0) {
        tempSub = subjectsMaster.filter(masterSub => {
          return subFromRes.find(subRes => {
            return subRes == masterSub.value
          })
        })
        setSelectedSubject(tempSub)
        setTemp(!temp)
      }

      let dataFromRes = teacher["tc_classRoomId"]
      let tempClassRoomLabels =
        classroomDropdownValues &&
        classroomDropdownValues.filter(data => {
          return dataFromRes.find(data1 => data1 == data.value)
        })
      setSelectedClassRoom(tempClassRoomLabels)
      return setForm(teacher)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching freelance teacher details"

      setForm(form)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleAddTeacherSubmit = async data => {
    try {
      setSubmitLoading(true)
      const response = await createTeacher(data)
      let message = response?.message || "Teacher Added Successfully"
      SaveToast({ message, type: "success" })
      setSubmitLoading(false)
      props.history.push("/teachers")
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Adding Teacher"
      setSubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleEditTeacherSubmit = async (id, data) => {
    if (!id) {
      return SaveToast({
        message: "Please enter Teacher Id",
        type: "error",
      })
    }
    try {
      setSubmitLoading(true)
      const response = await updateTeacher(id, data)
      let message = response?.message || "Teacher Updated Successfully"
      SaveToast({ message, type: "success" })
      setSubmitLoading(false)
      props.history.push("/teachers")
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Adding Teacher"
      setSubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleUpdateTeacher = () => {
    setUpdateModal(false)
    SaveToast({ message: "Teacher Updated Successfully", type: "success" })
    props.history.push("/teachers")
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
      setTemp(!temp)
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
        onUpdateClick={handleUpdateTeacher}
        onCloseClick={() => setUpdateModal(false)}
      />
      <div className="page-content">
        <div
          className="container-fluid"
          style={submitLoading ? { position: "relative", opacity: "0.8" } : {}}
        >
          {submitLoading ? <SubmitLoader /> : <></>}
          {isView ? (
            <>
              <ViewDetails {...props} />
            </>
          ) : (
            <Card>
              <CardBody>
                <Formik
                  enableReinitialize={true}
                  initialValues={form}
                  validationSchema={Yup.object({
                    tc_fullName: Yup.string().required(
                      "Please Enter Your Full Name"
                    ),
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
                      .required("Please Enter Your Phone Number")
                      .matches(
                        /^[0-9]{10}$/,
                        "Please Enter Valid Phone Number"
                      ),
                    tc_altPhoneNumber: Yup.string()
                      .nullable()
                      .notRequired()
                      .matches(
                        /^[0-9]{10}$/,
                        "Please Enter Valid Phone Number"
                      ),
                    tc_profilePic: Yup.mixed().nullable().notRequired(),
                    // .test(
                    //   "fileNotSelected",
                    //   "Please Select Profile Picture",
                    //   value => {
                    //     return isEdit || !!form?.["tc_profilePic"]?.file?.type
                    //   }
                    // )
                    // .test("fileFormat", "Unsupported Format", value => {
                    //   if (!form?.["tc_profilePic"]?.file?.type)
                    //     return isEdit || false

                    //   return [
                    //     "image/png",
                    //     "image/jpg",
                    //     "image/jpeg",
                    //     "image/gif",
                    //   ].includes(form?.["tc_profilePic"].file.type)
                    // }),
                    tc_degreeCertificate: Yup.mixed().nullable().notRequired(),
                    // .test(
                    //   "fileNotSelected",
                    //   "Please Select Degree Certificate",
                    //   value => {
                    //     return (
                    //       isEdit ||
                    //       !!form?.["tc_degreeCertificate"]?.file?.type
                    //     )
                    //   }
                    // )
                    // .test("fileFormat", "Unsupported Format", value => {
                    //   if (!form?.["tc_degreeCertificate"]?.file?.type)
                    //     return isEdit || false

                    //   return [
                    //     "image/png",
                    //     "image/jpg",
                    //     "image/jpeg",
                    //     "image/gif",
                    //   ].includes(form?.["tc_degreeCertificate"].file.type)
                    // }),
                    tc_countryCode: Yup.string().required(
                      "Please Select Country Code"
                    ),

                    tc_dateOfBirth: Yup.string().notRequired().nullable(),
                    tc_bloodGroup: Yup.string().nullable().notRequired(),
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
                    let tc_classRoomId = selectedClassRoom.map(
                      data => data.value
                    )
                    if (isEdit) {
                      const tc_id = teacherData["tc_id"]
                      teacherData["tc_region"] = tc_region
                      teacherData["tc_district"] = tc_district
                      teacherData["tc_circuit"] = tc_circuit
                      teacherData["tc_profilePic_old"] = form.tc_profilePic_old
                      teacherData["tc_degreeCertificate_old"] =
                        form.tc_degreeCertificate_old
                      teacherData["tc_profilePic"] = form.tc_profilePic.file
                      teacherData["tc_degreeCertificate"] =
                        form.tc_degreeCertificate.file
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
                                  Full Name{" "}
                                  <span className="text-danger">*</span>
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
                                    setFieldTouched(
                                      "tc_classRoomId",
                                      true,
                                      true
                                    )
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
                                  Staff Id{" "}
                                  <span className="text-danger">*</span>
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
                                  <FormFeedback>
                                    {errors.tc_staffId}
                                  </FormFeedback>
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
                                {touched.tc_education &&
                                  errors.tc_education && (
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
                                    setFieldTouched(
                                      "tc_countryCode",
                                      true,
                                      true
                                    )
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
                                <Label className="form-label">
                                  Blood Group{" "}
                                </Label>
                                <Input
                                  name="tc_bloodGroup"
                                  type="select"
                                  className="form-select"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.tc_bloodGroup || 0}
                                  invalid={
                                    touched.tc_bloodGroup &&
                                    errors.tc_bloodGroup
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
                                {touched.tc_bloodGroup &&
                                errors.tc_bloodGroup ? (
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
                                    <Label className="form-label">
                                      Address{" "}
                                    </Label>
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
                                    {touched.tc_address &&
                                      errors.tc_address && (
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
                                      defaultValue={form.tc_profilePic.fileName}
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
                                      {isEdit &&
                                        form?.tc_degreeCertificate_old && (
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
                                              </a>)
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
                                        tempForm["tc_degreeCertificate"][
                                          "file"
                                        ] = e.target.files[0]
                                        setForm(tempForm)
                                      }}
                                      invalid={
                                        touched.tc_degreeCertificate &&
                                        errors.tc_degreeCertificate
                                      }
                                      defaultValue={
                                        form.tc_degreeCertificate.fileName
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
          )}
        </div>
      </div>
    </React.Fragment>
  )
}

TeacherModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
}

export default TeacherModal
