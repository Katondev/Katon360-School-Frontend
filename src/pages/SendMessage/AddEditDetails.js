import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
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
import { getUserTypeInfo } from "helpers/authHelper"
import SubmitLoader from "components/Common/SubmitLoader"
import { getAllStudentsByTeacher } from "helpers/backendHelpers/students"
import { SaveToast } from "components/Common/SaveToast"
import { getAllClassroomBySchool } from "helpers/backendHelpers/classroom"
import { createMessage } from "helpers/backendHelpers/sendMessage"

const AddEditSendMessage = props => {
  const [isEdit, setIsEdit] = useState(false)
  const [isView, setIsView] = useState(false)
  // const [AssigmentId, setAssigmentId] = useState(0)
  const [submitLoading, setSubmitLoading] = useState(false)
  const userInfo = JSON.parse(localStorage.getItem("teacherInfo"))
  const [students, setStudents] = useState([])
  const [studentDropDown, setStudentDropDown] = useState()
  const [loading, setLoading] = useState(false)
  const [classroomDropdownValues, setClassroomDropdownValues] = useState([])
  const [messageType, setMessageType] = useState(true)
  const [classRoom, setClassRoom] = useState("")
  const userType = JSON.parse(localStorage.getItem("userInfoSchool"))
  console.log("userType12", userType)
  const [form, setForm] = useState({
    sm_msg: "",
    sm_type: messageType,
    cr_id: "",
    sm_student: [],
  })

  useEffect(() => {
    if (form?.cr_id) {
      fetchAllStudentsByClassRoomId(form?.cr_id)
    }
  }, [form?.cr_id])

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
  const fetchAllStudentsByClassRoomId = async classRoomId => {
    try {
      let body = {
        sc_id: userType?.sc_id,
        tc_classRoomId: JSON.stringify(classRoomId),
      }
      setLoading(true)
      let response = await getAllStudentsByTeacher(body)
      let { students } = response.data
      students = students || []
      let dropdownValue = []
      students.map(data => {
        let options = {
          value: data.st_id,
          label: data.st_fullName,
        }
        dropdownValue.push(options)
      })
      setStudents(students)
      setStudentDropDown(dropdownValue)

      setLoading(false)
    } catch (error) {
      let message = error?.message || "There was problem fetching students"
      setStudents([])
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }
  const fetchAllStudents = async () => {
    try {
      let body = {
        sc_id: userInfo?.tc_school?.sc_id,
        tc_classRoomId: JSON.stringify(userInfo?.tc_classRoomId),
      }
      setLoading(true)
      let response = await getAllStudentsByTeacher(body)
      let { students } = response.data
      students = students || []
      let dropdownValue = []
      students.map(data => {
        let options = {
          value: data.st_id,
          label: data.st_fullName,
        }
        dropdownValue.push(options)
      })
      setStudents(students)
      setStudentDropDown(dropdownValue)

      setLoading(false)
    } catch (error) {
      let message = error?.message || "There was problem fetching students"
      setStudents([])
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  useEffect(() => {
    document.getElementById("Send-message").classList.add("mm-active")

    fetchAllStudents()
    fetchClassroomDropDownValues()
  }, [])

  const handleAddMessageSubmit = async messageData => {
    console.log("messageData Body : ", messageData)
    try {
      setSubmitLoading(true)
      const response = await createMessage(messageData)
      let sendMessage = response?.sendMessage || "Message Send Successfully"
      SaveToast({ sendMessage, type: "success" })
      setSubmitLoading(false)
      props.history.push("/Send-message")
    } catch (error) {
      let sendMessage =
        error?.response?.data?.sendMessage ||
        error?.sendMessage ||
        "There Was A Problem Sending Message"
      setSubmitLoading(false)
      return SaveToast({ sendMessage, type: "error" })
    }
  }

  return (
    <React.Fragment>
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
                    sm_msg: Yup.string().required("Please Enter  Description"),
                  })}
                  onSubmit={values => {
                    let messageData = values
                    messageData["sm_type"] =
                      messageData["sm_type"] == true
                        ? "Entire class"
                        : "Student"
                    let studentIds = []
                    let studentData = messageData["sm_student"]

                    studentData.length > 0 &&
                      studentData.map(data => {
                        studentIds.push(data.value)
                      })

                    messageData["sm_student"] = JSON.stringify(studentIds)
                    messageData["sc_id"] = userType?.sc_id
                    messageData["cr_id"] = messageType ? classRoom : ""
                    console.log("messageType", messageType)
                    if (isEdit) {
                      // return handleEditAssigmentSubmit(AssigmentId, Assigment)
                    } else {
                      return handleAddMessageSubmit(messageData)
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
                          console.log("data is :", e)
                          e.preventDefault()
                          handleSubmit(e)
                          return false
                        }}
                      >
                        <Row className="mb-3">
                          <Col
                            md={4}
                            sm={6}
                            xs={12}
                            className="mt-2 mt-md-0 mb-3"
                          >
                            <Label>Send Message</Label>
                            <br />
                            <Label className="form-label">Entire Class</Label>
                            &nbsp;&nbsp;
                            <Input
                              id="type-true"
                              name="sm_type"
                              type="radio"
                              placeholder="Enter Title"
                              onChange={event => {
                                if (event.target.checked) {
                                  let temp = form
                                  temp["sm_type"] = 0
                                  values["sm_type"] = 0
                                  setMessageType(!messageType)
                                  setForm(temp)
                                }
                              }}
                              onBlur={handleBlur}
                              value={values.sm_type}
                              defaultChecked={
                                values.sm_type == true ? true : false
                              }
                            />
                            <br />
                            <Label htmlFor="false" className="form-label">
                              Students
                            </Label>
                            &nbsp;&nbsp;
                            <Input
                              id="type-false"
                              name="sm_type"
                              type="radio"
                              onChange={event => {
                                if (event.target.checked) {
                                  let temp = form
                                  temp["sm_type"] = "student"
                                  values["sm_type"] = "student"
                                  setMessageType(!messageType)
                                  setForm(temp)
                                }
                              }}
                              onBlur={handleBlur}
                              value={values.sm_type}
                              defaultChecked={
                                values.sm_type == true ? false : true
                              }
                            />
                          </Col>
                          <>
                            <Row>
                              <Col md={4} sm={6} xs={12} className="mb-3">
                                <Label className="form-label">
                                  Select Classroom
                                </Label>
                                <Input
                                  name="cr_id"
                                  type="select"
                                  className="form-select"
                                  onChange={e => {
                                    handleChange(e)
                                    setClassRoom(e.target.value)
                                    let temp = form
                                    temp["cr_id"] = e.target.value
                                    setForm(temp)
                                  }}
                                  onBlur={handleBlur}
                                  value={values.cr_id || 0}
                                  invalid={
                                    touched.cr_id && errors.cr_id ? true : false
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
                                {touched.cr_id && errors.cr_id ? (
                                  <FormFeedback type="invalid">
                                    {errors.cr_id}
                                  </FormFeedback>
                                ) : null}
                              </Col>
                            </Row>
                          </>
                          {!messageType && (
                            <>
                              <Row>
                                <Col md={4} sm={6} xs={12} className="mb-3">
                                  <Label className="form-label">
                                    Select Student
                                    <span className="text-danger">*</span>
                                  </Label>

                                  <Select
                                    name="sm_student"
                                    options={studentDropDown}
                                    value={values.sm_student}
                                    validate={{
                                      required: { value: true },
                                    }}
                                    onChange={value => {
                                      console.log(value)
                                      setFieldValue(
                                        "sm_student",
                                        value ? value : ""
                                      )
                                    }}
                                    onBlur={evt => {
                                      setFieldTouched("sm_student", true, true)
                                    }}
                                    className="react-select-container"
                                    classNamePrefix="select2-selection"
                                    invalid={
                                      touched.sm_student && errors.sm_student
                                        ? true
                                        : false
                                    }
                                    placeholder="Type to search..."
                                    isMulti={true}
                                    isClearable
                                    isSearchable
                                  />
                                  {!!touched.sm_student &&
                                  !!errors.sm_student ? (
                                    <div className="invalid-react-select-dropdown">
                                      {errors.sm_student}
                                    </div>
                                  ) : null}
                                </Col>
                              </Row>
                            </>
                          )}
                        </Row>

                        <Row>
                          <Col sm={12} md={6}>
                            <Row>
                              <Col>
                                <Label className="form-label">
                                  Description
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="sm_msg"
                                  type="textarea"
                                  rows={6}
                                  placeholder="Enter Description"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={touched.sm_msg && errors.sm_msg}
                                  defaultValue={form.sm_msg}
                                />
                                {touched.sm_msg && errors.sm_msg && (
                                  <FormFeedback>{errors.sm_msg}</FormFeedback>
                                )}
                              </Col>
                            </Row>
                          </Col>
                        </Row>

                        <Row className="mb-3 text-center mt-3">
                          <Col>
                            <Button
                              size="md"
                              color="dark"
                              type="button"
                              disabled={submitLoading}
                              className="mx-2"
                              onClick={() => {
                                props.history.push("/Send-message")
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

AddEditSendMessage.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
}

export default AddEditSendMessage
