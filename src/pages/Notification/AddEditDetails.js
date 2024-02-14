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
import { SaveToast } from "components/Common/SaveToast"

import { IMAGE_URL } from "helpers/urlHelper"
import SubmitLoader from "components/Common/SubmitLoader"
import RegionDistrictCircuitDropDownAllSelectable from "components/Common/RegionDistrictCircuitDropDownAllSelectable"
import {
  divisions as DivisionVal,
  bloodGroups as BGdropdownVals,
  standard as ClassesVal,
  countryCodes,
  divisionsforClass,
  classRoomType,
} from "common/data/dropdownVals"
import { defaultRDCSeparator } from "helpers/common_helper_functions"
import { getSchoolInfo } from "helpers/authHelper"
import NotificationModal from "./ViewModal"
import {
  createNotification,
  getNotification,
  updateNotification,
} from "helpers/backendHelpers/Notification"
const TeacherModal = props => {
  const schoolInfo = getSchoolInfo()
  const [isEdit, setIsEdit] = useState(false)
  const [isView, setIsView] = useState(false)
  const [notificationId, setNotificationId] = useState(0)
  const [updateModal, setUpdateModal] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [modal1, setModal1] = useState(false)
  const [notification, setnotification] = useState(null)
  const [selectedClass, setSelectedClass] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [notificationType, setNotificationType] = useState(0)

  const [form, setForm] = useState({
    nt_title: "",
    nt_desc: "",
    nt_file: { fileName: "", file: {} },
    nt_schoolId: "",
    nt_class: "",
    areaValue: "",
    nt_type: 0,
  })
  const toggleViewModal = () => {
    if (modal1) {
      setnotification({})
    }
    setModal1(!modal1)
    if (form) {
      setnotification(null)
    }
  }

  const titleCase = str => {
    var splitStr = str.toLowerCase().split(" ")
    for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
    }
    // Directly return the joined string
    return splitStr.join(" ")
  }

  useEffect(() => {
    document.getElementById("notification").classList.add("mm-active")
    let { type, id } = props.match.params || {}

    switch (type) {
      case "edit":
        setIsEdit(true)
        setIsView(false)
        setNotificationId(parseInt(id))
        break
      case "view":
        setIsView(true)
        setIsEdit(false)
        setNotificationId(parseInt(id))
        break
      case "add":
        break
      default:
        setIsView(false)
        setIsEdit(false)
        setNotificationId(parseInt(id))
        break
    }

    if (id) {
      fetchTeacherDetailsForEdit(id)
    }
  }, [isEdit])

  const fetchTeacherDetailsForEdit = async nt_id => {
    try {
      let response = await getNotification(nt_id)

      let { notification } = response.data || {}
      notification = notification || {}

      notification["nt_file_old"] = notification["nt_file"]
      notification["nt_file"] = { fileName: "", file: {} }
      // 0 = Entire School,1 = Particular class
      if (notification.nt_type == 0) {
        if (document.getElementById("school")) {
          document.getElementById("school").checked = true
        }
        setNotificationType(notification.nt_type)
      } else if (notification.nt_type == 1) {
        if (document.getElementById("class")) {
          document.getElementById("class").checked = true
        }
        setNotificationType(notification.nt_type)
      }

      setSelectedClass({
        label: notification.nt_class,
        value: notification.nt_class,
      })

      return setForm(notification)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching Notification details"

      setForm(form)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleAddNotificationSubmit = async data => {
    try {
      setSubmitLoading(true)
      const response = await createNotification(data)
      let message = response?.message || "Notification Added Successfully"
      SaveToast({ message, type: "success" })
      setSubmitLoading(false)
      props.history.push("/notification")
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Adding Notification"
      setSubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }
  useEffect(() => {}, form)
  const handleEditNotificationSubmit = async (id, data) => {
    if (!id) {
      return SaveToast({
        message: "Please enter Notification Id",
        type: "error",
      })
    }
    try {
      setSubmitLoading(true)
      const response = await updateNotification(id, data)
      let message = response?.message || "Notification Updated Successfully"
      SaveToast({ message, type: "success" })
      setSubmitLoading(false)
      props.history.push("/notification")
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
    SaveToast({ message: "Notification Updated Successfully", type: "success" })
    props.history.push("/notification")
  }

  return (
    <React.Fragment>
      <NotificationModal isOpen={modal1} toggle={toggleViewModal} form={form} />
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
                    nt_title: Yup.string().required("Please Enter Title"),
                    nt_desc: Yup.string().required("Please Enter Description"),
                    nt_file: Yup.mixed().test(
                      "fileFormat",
                      "Unsupported Format",
                      value => {
                        if (!(value && value.file && value.file.type))
                          return true
                        return ["application/pdf"].includes(value.file.type)
                      }
                    ),
                    nt_class:
                      notificationType == 1 &&
                      Yup.string().required("Please Select Class"),
                  })}
                  onSubmit={values => {
                    let notification = values
                    notification["nt_type"] = notificationType
                    notification["nt_class"] =
                      notificationType == 1 ? values?.nt_class : "null"
                    if (isEdit) {
                      const tc_id = notification["nt_id"]
                      notification["nt_title"] = titleCase(values.nt_title)
                      notification["nt_schoolId"] = schoolInfo.sc_id
                      notification["nt_file_old"] = form.nt_file_old
                      notification["nt_file"] = form.nt_file.file
                      delete notification["nt_id"]
                      return handleEditNotificationSubmit(
                        notificationId,
                        notification
                      )
                    } else {
                      notification["nt_file"] = form.nt_file.file
                      notification["nt_title"] = titleCase(values.nt_title)

                      notification["nt_desc"] = values.nt_desc
                      notification["nt_class"] = values.nt_class
                      notification["nt_schoolId"] = schoolInfo.sc_id
                      return handleAddNotificationSubmit(notification)
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
                                    name="nt_type"
                                    type="radio"
                                    placeholder="Enter Title"
                                    onClick={event => {
                                      if (event.target.checked) {
                                        let temp = form
                                        temp["nt_type"] = 0
                                        values["nt_type"] = 0
                                        setNotificationType(0)
                                        setForm(temp)
                                      }
                                    }}
                                    onBlur={handleBlur}
                                    value={form.nt_type}
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
                                    name="nt_type"
                                    type="radio"
                                    onClick={event => {
                                      if (event.target.checked) {
                                        let temp = form
                                        temp["nt_type"] = 1
                                        values["nt_type"] = 1
                                        setNotificationType(1)
                                        setForm(temp)
                                      }
                                    }}
                                    onBlur={handleBlur}
                                    value={form.nt_type}
                                  />
                                </div>
                              </Col>
                            </Row>
                            {notificationType == 1 && (
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
                                      name="nt_class"
                                      placeholder="Select Class"
                                      value={selectedClass}
                                      onChange={value => {
                                        setSelectedClass(value)
                                        setFieldValue(
                                          "nt_class",
                                          value ? value.value : ""
                                        )
                                      }}
                                      onBlur={evt => {
                                        setFieldTouched("nt_class", true, true)
                                      }}
                                      options={classRoomType}
                                      isClearable
                                      invalid={
                                        touched.nt_class && errors.nt_class
                                      }
                                    />
                                    {touched.nt_class && errors.nt_class && (
                                      <div className="invalid-react-select-dropdown">
                                        {errors.nt_class}
                                      </div>
                                    )}
                                  </Col>
                                </Row>
                              </>
                            )}
                            <Row className="mb-3">
                              <Col md={4} sm={6} xs={12} className="mb-3">
                                <Label className="form-label">
                                  Title <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="nt_title"
                                  type="text"
                                  placeholder="Enter Title"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={touched.nt_title && errors.nt_title}
                                  defaultValue={form.nt_title}
                                />
                                {touched.nt_title && errors.nt_title && (
                                  <FormFeedback>{errors.nt_title}</FormFeedback>
                                )}
                              </Col>
                            </Row>

                            <Row className="mb-3">
                              <Col md={4} sm={6} xs={12}>
                                <Label className="form-label">
                                  Upload File
                                  {isEdit && form?.nt_file_old && (
                                    <>
                                      <span className="ms-2">
                                        (
                                        <a
                                          href={`${IMAGE_URL}/${form?.nt_file_old}`}
                                          // onClick={() => {
                                          //   toggleViewModal()
                                          // }}
                                          target="_blank"
                                          rel="noreferrer"
                                        >
                                          Saved File
                                        </a>
                                        )
                                      </span>
                                    </>
                                  )}
                                </Label>
                                <Input
                                  name="nt_file"
                                  type="file"
                                  accept=".pdf"
                                  placeholder="Select Profile Pic"
                                  onChange={e => {
                                    let tempForm = form
                                    tempForm["nt_file"]["fileName"] =
                                      e.target.value
                                    tempForm["nt_file"]["file"] =
                                      e.target.files[0]
                                    setForm(tempForm)
                                  }}
                                  // onBlur={handleBlur}
                                  invalid={touched.nt_file && errors.nt_file}
                                  defaultValue={form.nt_file.fileName}
                                />
                                {touched.nt_file && errors.nt_file && (
                                  <FormFeedback>{errors.nt_file}</FormFeedback>
                                )}
                              </Col>
                            </Row>
                            <Row className="mb-3">
                              <Col md={4} sm={6} xs={12} className="mb-3">
                                <Label className="form-label">
                                  Description{" "}
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="nt_desc"
                                  type="textarea"
                                  rows={6}
                                  placeholder="Enter Description"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={touched.nt_desc && errors.nt_desc}
                                  defaultValue={form.nt_desc}
                                />
                                {touched.nt_desc && errors.nt_desc && (
                                  <FormFeedback>{errors.nt_desc}</FormFeedback>
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
                                    props.history.push("/notification")
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
