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
import UpdateModal from "../../components/Common/UpdateModal"
import { getSchoolInfo } from "helpers/authHelper"
import { SaveToast } from "components/Common/SaveToast"

import SubmitLoader from "components/Common/SubmitLoader"
import {
  countryCodes,
  classRoomType,
  eventType,
} from "common/data/dropdownVals"
import { defaultRDCSeparator } from "helpers/common_helper_functions"
import DatePicker from "react-multi-date-picker"
import {
  createEventCalender,
  updateEventCalender,
  getEventCalender,
} from "helpers/backendHelpers/EventCalender"
import { titleCase } from "helpers/function_helper"
// import "react-multi-date-picker/styles/colors/default.css"
// import "react-multi-date-picker/styles/layouts/default.css"
// import "react-multi-date-picker/styles/themes/default.css"

const TeacherModal = props => {
  const schoolInfo = getSchoolInfo()
  const [isEdit, setIsEdit] = useState(false)
  const [isView, setIsView] = useState(false)
  const [eventCalenderId, setEventCalenderId] = useState(0)
  const [updateModal, setUpdateModal] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [selectedClass, setSelectedClass] = useState({})
  const [selectedEventType, setSelectedEventType] = useState({})
  const [eventDate, setEventDate] = useState([])
  const [selectedDate, setSelectedDate] = useState([])
  // 0 = School,1 = Class
  const [eventSaveType, setEventSaveType] = useState(0)

  const [form, setForm] = useState({
    ec_schoolId: "",
    ec_class: "",
    ec_eventtype: "",
    ec_eventDate: "",
    ec_eventTitle: "",
    ec_eventSaveType: 0,
  })

  useEffect(() => {
    document.getElementById("event-calender").classList.add("mm-active")

    let { type, id } = props.match.params || {}

    switch (type) {
      case "edit":
        setIsEdit(true)
        setIsView(false)
        setEventCalenderId(parseInt(id))
        break
      case "view":
        setIsView(true)
        setIsEdit(false)
        setEventCalenderId(parseInt(id))
        break
      case "add":
        break
      default:
        setIsView(false)
        setIsEdit(false)
        setEventCalenderId(parseInt(id))
        break
    }

    if (id) {
      fetchEventCalenderDetailsForEdit(id)
    }
  }, [isEdit])

  useEffect(() => {
    let tempDate = []
    if (eventCalenderId === 0) {
      eventDate &&
        eventDate.map(data => {
          tempDate.push(`${data.year}-${data.month.number}-${data.day}`)
        })
      setSelectedDate(tempDate)
    } else {
    }
  }, [eventDate])

  const fetchEventCalenderDetailsForEdit = async ec_id => {
    try {
      let response = await getEventCalender(ec_id)
      let { calender } = response.data || {}
      calender = calender || {}

      setEventDate(calender.ec_eventDate)

      setSelectedClass({
        label: calender.ec_class,
        value: calender.ec_class,
      })

      setSelectedEventType({
        label: calender.ec_eventtype,
        value: calender.ec_eventtype,
      })
      if (calender.ec_eventSaveType == 0) {
        if (document.getElementById("school")) {
          document.getElementById("school").checked = true
        }
        setEventSaveType(calender.ec_eventSaveType)
      } else if (calender.ec_eventSaveType == 1) {
        if (document.getElementById("class")) {
          document.getElementById("class").checked = true
        }
        setEventSaveType(calender.ec_eventSaveType)
      }
      return setForm(calender)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching freelance teacher details"

      setForm(form)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleAddEventCalenderSubmit = async data => {
    try {
      setSubmitLoading(true)
      const response = await createEventCalender(data)
      let message = response?.message || "Event Calender Added Successfully"
      SaveToast({ message, type: "success" })
      setSubmitLoading(false)
      props.history.push("/event-calender")
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Adding Event Calender"
      setSubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleEditEventCalenderSubmit = async (id, data) => {
    if (!id) {
      return SaveToast({
        message: "Please enter Event Calender Id",
        type: "error",
      })
    }
    try {
      setSubmitLoading(true)
      const response = await updateEventCalender(id, data)
      let message = response?.message || "Event Calender Updated Successfully"
      SaveToast({ message, type: "success" })
      setSubmitLoading(false)
      props.history.push("/event-calender")
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Adding Event Calender"
      setSubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleUpdateEventCalender = () => {
    setUpdateModal(false)
    SaveToast({
      message: "Event Calender Updated Successfully",
      type: "success",
    })
    props.history.push("/event-calender")
  }

  // const titleCase = str => {
  //   var splitStr = str.toLowerCase().split(" ")
  //   for (var i = 0; i < splitStr.length; i++) {
  //     // You do not need to check if i is larger than splitStr length, as your for does that for you
  //     // Assign it back to the array
  //     splitStr[i] =
  //       splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
  //   }
  //   // Directly return the joined string
  //   return splitStr.join(" ")
  // }

  return (
    <React.Fragment>
      <UpdateModal
        show={updateModal}
        onUpdateClick={handleUpdateEventCalender}
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
                    ec_class:
                      eventSaveType == 1 &&
                      Yup.string().required("Please Select Class"),

                    ec_eventtype: Yup.mixed().test(
                      "invalidInput",
                      "Please Select Event Type",
                      value => {
                        if (value) {
                          return value.length
                        } else {
                          return false
                        }
                      }
                    ),
                    // ec_eventDate: Yup.string().required(
                    //   "Please Select Event Date"
                    // ),

                    ec_eventTitle: Yup.string().required(
                      "Please Select Event Title"
                    ),
                  })}
                  onSubmit={values => {
                    let eventCalender = values
                    eventCalender["ec_eventSaveType"] = eventSaveType
                    eventCalender["ec_class"] =
                      eventSaveType == 1 ? selectedClass.value : "null"
                    if (isEdit) {
                      eventCalender["ec_schoolId"] = schoolInfo.sc_id
                      eventCalender["ec_eventTitle"] = titleCase(
                        values.ec_eventTitle
                      )
                      eventCalender["ec_eventtype"] = selectedEventType.value
                      eventCalender["ec_eventDate"] = eventDate
                      // eventCalender["ec_eventTitle"] = form.ec_eventTitle
                      return handleEditEventCalenderSubmit(
                        eventCalenderId,
                        eventCalender
                      )
                    } else {
                      eventCalender["ec_schoolId"] = schoolInfo.sc_id
                      eventCalender["ec_eventtype"] = values.ec_eventtype
                      eventCalender["ec_eventDate"] =
                        JSON.stringify(selectedDate)
                      eventCalender["ec_eventTitle"] = titleCase(
                        values.ec_eventTitle
                      )
                      return handleAddEventCalenderSubmit(eventCalender)
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
                              <Col
                                md={12}
                                sm={12}
                                xs={12}
                                className="mt-2 mt-md-0"
                              >
                                <div className="d-flex">
                                  <br />
                                  <Label className="form-label">School</Label>
                                  &nbsp;&nbsp;
                                  <Input
                                    id="school"
                                    name="ec_eventSaveType"
                                    type="radio"
                                    placeholder="Enter Title"
                                    onClick={event => {
                                      if (event.target.checked) {
                                        let temp = form
                                        temp["ec_eventSaveType"] = 0
                                        values["ec_eventSaveType"] = 0
                                        setEventSaveType(0)
                                        setForm(temp)
                                      }
                                    }}
                                    onBlur={handleBlur}
                                    value={form.ec_eventSaveType}
                                    defaultChecked
                                  />
                                  <br />
                                  &nbsp;&nbsp;&nbsp;
                                  <Label htmlFor="false" className="form-label">
                                    Class
                                  </Label>
                                  &nbsp;&nbsp;
                                  <Input
                                    id="class"
                                    name="ec_eventSaveType"
                                    type="radio"
                                    onClick={event => {
                                      if (event.target.checked) {
                                        let temp = form
                                        temp["ec_eventSaveType"] = 1
                                        values["ec_eventSaveType"] = 1
                                        setEventSaveType(1)
                                        setForm(temp)
                                      }
                                    }}
                                    onBlur={handleBlur}
                                    value={form.ec_eventSaveType}
                                  />
                                </div>
                              </Col>
                            </Row>
                            {eventSaveType == 1 && (
                              <>
                                <Row className="mb-3">
                                  <Col
                                    md={4}
                                    sm={6}
                                    xs={12}
                                    className="mt-2 mt-sm-0 mb-3"
                                  >
                                    <Label className="form-label">
                                      Class{" "}
                                      <span className="text-danger">*</span>
                                    </Label>
                                    <Select
                                      name="ec_class"
                                      placeholder="Select Class"
                                      value={selectedClass}
                                      onChange={value => {
                                        setSelectedClass(value)
                                        setFieldValue(
                                          "ec_class",
                                          value ? value.value : ""
                                        )
                                      }}
                                      onBlur={evt => {
                                        setFieldTouched("ec_class", true, true)
                                      }}
                                      options={classRoomType}
                                      isClearable
                                      invalid={
                                        touched.ec_class && errors.ec_class
                                      }
                                    />
                                    {touched.ec_class && errors.ec_class && (
                                      <div className="invalid-react-select-dropdown">
                                        {errors.ec_class}
                                      </div>
                                    )}
                                  </Col>
                                </Row>
                              </>
                            )}

                            <Row className="mb-3">
                              <Col
                                md={4}
                                sm={6}
                                xs={12}
                                className="mt-2 mt-md-0 mb-3"
                              >
                                <Label className="form-label">
                                  Event Title
                                </Label>
                                <Input
                                  name="ec_eventTitle"
                                  type="text"
                                  placeholder="Enter Full Name"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={
                                    touched.ec_eventTitle &&
                                    errors.ec_eventTitle
                                  }
                                  defaultValue={form.ec_eventTitle}
                                />
                                {touched.ec_eventTitle &&
                                  errors.ec_eventTitle && (
                                    <FormFeedback>
                                      {errors.ec_eventTitle}
                                    </FormFeedback>
                                  )}
                              </Col>
                            </Row>
                            <Row className="mb-3">
                              <Col
                                md={4}
                                sm={6}
                                xs={12}
                                className="mt-2 mt-sm-0 mb-3"
                              >
                                <Label className="form-label">
                                  Event Type
                                  <span className="text-danger">*</span>
                                </Label>
                                <Select
                                  name="ec_eventtype"
                                  placeholder="Select Event Type"
                                  value={selectedEventType}
                                  onChange={value => {
                                    setSelectedEventType(value)
                                    setFieldValue(
                                      "ec_eventtype",
                                      value ? value.value : ""
                                    )
                                  }}
                                  onBlur={evt => {
                                    setFieldTouched("ec_eventtype", true, true)
                                  }}
                                  options={eventType}
                                  isClearable
                                  invalid={
                                    touched.ec_eventtype && errors.ec_eventtype
                                  }
                                />
                                {touched.ec_eventtype &&
                                  errors.ec_eventtype && (
                                    <div className="invalid-react-select-dropdown">
                                      {errors.ec_eventtype}
                                    </div>
                                  )}
                              </Col>
                            </Row>

                            <Row className="mb-3">
                              <Col
                                md={4}
                                sm={6}
                                xs={12}
                                className="mt-2 mt-sm-0 mb-3"
                              >
                                <Label className="form-label">
                                  Event Date
                                  <span className="text-danger">*</span>
                                </Label>
                                <DatePicker
                                  name="ec_eventDate"
                                  {...(eventCalenderId == 0 && "multiple")}
                                  value={eventDate}
                                  onChange={setEventDate}
                                  position="top"
                                  style={{ zIndex: "9999" }}
                                />
                                {touched.ec_eventDate &&
                                  errors.ec_eventDate && (
                                    <div className="invalid-react-select-dropdown">
                                      {errors.ec_eventDate}
                                    </div>
                                  )}
                              </Col>
                            </Row>

                            <Row className="mb-3">
                              <Col>
                                <Button
                                  size="md"
                                  color="dark"
                                  type="button"
                                  disabled={submitLoading}
                                  className="mx-2"
                                  onClick={() => {
                                    props.history.push("/event-calender")
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
