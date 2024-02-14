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

import SubmitLoader from "components/Common/SubmitLoader"
import {
  divisions as DivisionVal,
  bloodGroups as BGdropdownVals,
  standard as ClassesVal,
  classRoomType,
} from "common/data/dropdownVals"
import { getTeacherInfo } from "helpers/authHelper"
import NotificationModal from "./ViewModal"
import { getAllSchool } from "helpers/backendHelpers/school"
import {
  createTermlyScheme,
  getTermlyScheme,
  updateTermlyScheme,
} from "helpers/backendHelpers/TermlyScheme"
import moment from "moment"
import DatePicker from "react-datepicker"
import {
  createWeeklyLessonPlan,
  getWeeklyLessonPlan,
  updateWeeklyLessonPlan,
} from "helpers/backendHelpers/weeklyLessonPlan"
import { IMAGE_URL } from "helpers/urlHelper"

const TeacherModal = props => {
  const teacherInfo = getTeacherInfo()
  const [isEdit, setIsEdit] = useState(false)
  const [isView, setIsView] = useState(false)
  const [termlySchemeId, setTermlySchemeId] = useState(0)
  const [updateModal, setUpdateModal] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [modal1, setModal1] = useState(false)
  const [notification, setnotification] = useState(null)
  const [selectedClass, setSelectedClass] = useState({})
  const [selectedSchool, setSelectedSchool] = useState({})
  const [allSchool, setAllSchool] = useState([])
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedYear, setSelectedYear] = useState("")

  const [form, setForm] = useState({
    wlp_performanceIndicator: "",
    wlp_classId: "",
    sc_id: "",
    wlp_subject: "",
    wlp_weekNumber: "",
    tc_id: "",
    wlp_learningIndicator: "",
    wlp_weekEnding: "",
    wlp_reference: "",
    wlp_teachingMaterial: { fileName: "", file: {} },
    mon: "",
    tue: "",
    wed: "",
    thu: "",
    fri: "",
    sat: "",
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
    fetchSchoolDetailsForEdit()
  }, [])
  useEffect(() => {
    document.getElementById("lesson-notes").classList.add("mm-active")
    let { type, id } = props.match.params || {}

    switch (type) {
      case "edit":
        setIsEdit(true)
        setIsView(false)
        setTermlySchemeId(parseInt(id))
        break
      case "view":
        setIsView(true)
        setIsEdit(false)
        setTermlySchemeId(parseInt(id))
        break
      case "add":
        break
      default:
        setIsView(false)
        setIsEdit(false)
        setTermlySchemeId(parseInt(id))
        break
    }

    if (id) {
      fetchWeeklyLessonPlanForEdit(id)
      fetchSchoolDetailsForEdit()
    }
  }, [isEdit])

  useEffect(() => {
    if (allSchool.length > 0) {
      setSelectedSchool(allSchool.find(data => data.value === form.sc_id))
    }
  }, [allSchool])

  const fetchWeeklyLessonPlanForEdit = async wlp_id => {
    try {
      let response = await getWeeklyLessonPlan(wlp_id)
      let { weeklyLessonPlan } = response.data || {}
      weeklyLessonPlan = weeklyLessonPlan || {}
      weeklyLessonPlan["mon_phase1"] = weeklyLessonPlan?.mon?.phase1
      weeklyLessonPlan["mon_phase2"] = weeklyLessonPlan?.mon?.phase2
      weeklyLessonPlan["mon_phase3"] = weeklyLessonPlan?.mon?.phase3

      weeklyLessonPlan["tue_phase1"] = weeklyLessonPlan?.tue?.phase1
      weeklyLessonPlan["tue_phase2"] = weeklyLessonPlan?.tue?.phase2
      weeklyLessonPlan["tue_phase3"] = weeklyLessonPlan?.tue?.phase3

      weeklyLessonPlan["wed_phase1"] = weeklyLessonPlan?.wed?.phase1
      weeklyLessonPlan["wed_phase2"] = weeklyLessonPlan?.wed?.phase2
      weeklyLessonPlan["wed_phase3"] = weeklyLessonPlan?.wed?.phase3

      weeklyLessonPlan["thu_phase1"] = weeklyLessonPlan?.thu?.phase1
      weeklyLessonPlan["thu_phase2"] = weeklyLessonPlan?.thu?.phase2
      weeklyLessonPlan["thu_phase3"] = weeklyLessonPlan?.thu?.phase3

      weeklyLessonPlan["fri_phase1"] = weeklyLessonPlan?.fri?.phase1
      weeklyLessonPlan["fri_phase2"] = weeklyLessonPlan?.fri?.phase2
      weeklyLessonPlan["fri_phase3"] = weeklyLessonPlan?.fri?.phase3

      weeklyLessonPlan["sat_phase1"] = weeklyLessonPlan?.sat?.phase1
      weeklyLessonPlan["sat_phase2"] = weeklyLessonPlan?.sat?.phase2
      weeklyLessonPlan["sat_phase3"] = weeklyLessonPlan?.sat?.phase3

      setSelectedClass({
        label: weeklyLessonPlan.wlp_classId,
        value: weeklyLessonPlan.wlp_classId,
      })
      weeklyLessonPlan["wlp_teachingMaterial_old"] =
        weeklyLessonPlan?.wlp_teachingMaterial
      weeklyLessonPlan["wlp_teachingMaterial"] = { fileName: "", file: {} }
      return setForm(weeklyLessonPlan)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching Notification details"

      setForm(form)
      return SaveToast({ message, type: "error" })
    }
  }

  const fetchSchoolDetailsForEdit = async () => {
    try {
      let response = await getAllSchool()
      let { schools } = response.data || {}

      schools = schools || {}
      let tempSchools = []
      schools.map(data => {
        tempSchools.push({
          label: data.sc_schoolName,
          value: data.sc_id,
        })
      })
      setAllSchool(tempSchools)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching Weekly Lesson Note details"

      setForm(form)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleAddLessonNoteSubmit = async data => {
    try {
      setSubmitLoading(true)
      const response = await createWeeklyLessonPlan(data)
      let message = response?.message || "Weekly Lesson Note Added Successfully"
      SaveToast({ message, type: "success" })
      setSubmitLoading(false)
      props.history.push("/lesson-notes")
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Adding Weekly Lesson Plan"
      setSubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleEditWeeklyLessonNoteSubmit = async (id, data) => {
    if (!id) {
      return SaveToast({
        message: "Please enter Weekly Lesson Notes Id",
        type: "error",
      })
    }
    try {
      setSubmitLoading(true)
      const response = await updateWeeklyLessonPlan(id, data)
      let message =
        response?.message || "Weekly Lesson Notes Updated Successfully"
      SaveToast({ message, type: "success" })
      setSubmitLoading(false)
      props.history.push("/lesson-notes")
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Adding Weekly Lesson Notes"
      setSubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleUpdateWeeklyLessonNote = () => {
    setUpdateModal(false)
    SaveToast({
      message: "Weekly Lesson Plan Updated Successfully",
      type: "success",
    })
    props.history.push("/lesson-notes")
  }

  return (
    <React.Fragment>
      <NotificationModal isOpen={modal1} toggle={toggleViewModal} form={form} />
      <UpdateModal
        show={updateModal}
        onUpdateClick={handleUpdateWeeklyLessonNote}
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
                    wlp_weekEnding: Yup.string().required(
                      "Please Enter Week Ending"
                    ),
                    wlp_reference: Yup.string().required(
                      "Please Enter Week Reference"
                    ),
                    wlp_classId: Yup.string().required("Please Select Class"),
                    wlp_subject: Yup.string().required("Please Enter Subject"),
                    wlp_weekNumber: Yup.string().required(
                      "Please Enter Week Number"
                    ),
                    wlp_performanceIndicator: Yup.string().required(
                      "Please Enter Subject"
                    ),
                    wlp_teachingMaterial: Yup.mixed().nullable().notRequired(),
                  })}
                  onSubmit={values => {
                    let lessonNote = values
                    let monData = {
                      phase1: values?.mon_phase1,
                      phase2: values?.mon_phase2,
                      phase3: values?.mon_phase3,
                    }
                    let tueData = {
                      phase1: values?.tue_phase1,
                      phase2: values?.tue_phase2,
                      phase3: values?.tue_phase3,
                    }
                    let wedData = {
                      phase1: values?.wed_phase1,
                      phase2: values?.wed_phase2,
                      phase3: values?.wed_phase3,
                    }
                    let thuData = {
                      phase1: values?.thu_phase1,
                      phase2: values?.thu_phase2,
                      phase3: values?.thu_phase3,
                    }
                    let friData = {
                      phase1: values?.fri_phase1,
                      phase2: values?.fri_phase2,
                      phase3: values?.fri_phase3,
                    }
                    let satData = {
                      phase1: values?.sat_phase1,
                      phase2: values?.sat_phase2,
                      phase3: values?.sat_phase3,
                    }
                    delete lessonNote["mon_phase1"]
                    delete lessonNote["mon_phase2"]
                    delete lessonNote["mon_phase3"]

                    delete lessonNote["tue_phase1"]
                    delete lessonNote["tue_phase2"]
                    delete lessonNote["tue_phase3"]

                    delete lessonNote["wed_phase1"]
                    delete lessonNote["wed_phase2"]
                    delete lessonNote["wed_phase3"]

                    delete lessonNote["thu_phase1"]
                    delete lessonNote["thu_phase2"]
                    delete lessonNote["thu_phase3"]

                    delete lessonNote["fri_phase1"]
                    delete lessonNote["fri_phase2"]
                    delete lessonNote["fri_phase3"]

                    delete lessonNote["sat_phase1"]
                    delete lessonNote["sat_phase2"]
                    delete lessonNote["sat_phase3"]

                    if (isEdit) {
                      lessonNote["sc_id"] = teacherInfo.tc_school.sc_id
                      lessonNote["tc_id"] = teacherInfo.tc_id
                      lessonNote["wlp_classId"] = selectedClass.value
                      lessonNote["mon"] = monData
                      lessonNote["tue"] = tueData
                      lessonNote["wed"] = wedData
                      lessonNote["thu"] = thuData
                      lessonNote["fri"] = friData
                      lessonNote["sat"] = satData
                      lessonNote["wlp_teachingMaterial"] =
                        form?.wlp_teachingMaterial?.file
                      lessonNote["wlp_teachingMaterial_old"] =
                        form?.wlp_teachingMaterial_old
                      delete lessonNote["wlp_id"]
                      return handleEditWeeklyLessonNoteSubmit(
                        termlySchemeId,
                        lessonNote
                      )
                    } else {
                      lessonNote["sc_id"] = teacherInfo.tc_school.sc_id
                      lessonNote["tc_id"] = teacherInfo.tc_id
                      lessonNote["wlp_classId"] = selectedClass.value
                      lessonNote["mon"] = monData
                      lessonNote["tue"] = tueData
                      lessonNote["wed"] = wedData
                      lessonNote["thu"] = thuData
                      lessonNote["fri"] = friData
                      lessonNote["sat"] = satData
                      lessonNote["wlp_teachingMaterial"] =
                        form.wlp_teachingMaterial.file
                      return handleAddLessonNoteSubmit(lessonNote)
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
                              <Col md={4} sm={6} xs={4} className="mb-3">
                                <Label className="form-label">
                                  Enter Week Number{" "}
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="wlp_weekNumber"
                                  type="number"
                                  placeholder="Enter Week Number"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={
                                    touched.wlp_weekNumber &&
                                    errors.wlp_weekNumber
                                  }
                                  value={values.wlp_weekNumber}
                                />
                                {touched.wlp_weekNumber &&
                                  errors.wlp_weekNumber && (
                                    <FormFeedback>
                                      {errors.wlp_weekNumber}
                                    </FormFeedback>
                                  )}
                              </Col>
                              <Col
                                md={4}
                                sm={6}
                                xs={4}
                                className="mt-2 mt-sm-0 mb-3"
                              >
                                <Label className="form-label">
                                  Class <span className="text-danger">*</span>
                                </Label>
                                <Select
                                  name="wlp_classId"
                                  placeholder="Select Class"
                                  value={selectedClass}
                                  onChange={value => {
                                    setSelectedClass(value)
                                    setFieldValue(
                                      "wlp_classId",
                                      value ? value.value : ""
                                    )
                                  }}
                                  onBlur={evt => {
                                    setFieldTouched("wlp_classId", true, true)
                                  }}
                                  options={classRoomType}
                                  isClearable
                                  invalid={
                                    touched.wlp_classId && errors.wlp_classId
                                  }
                                />
                                {touched.wlp_classId && errors.wlp_classId && (
                                  <div className="invalid-react-select-dropdown">
                                    {errors.wlp_classId}
                                  </div>
                                )}
                              </Col>
                              <Col md={4} sm={6} xs={4} className="mb-3">
                                <Label className="form-label">
                                  Enter Subject{" "}
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="wlp_subject"
                                  type="text"
                                  placeholder="Enter Subject"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={
                                    touched.wlp_subject && errors.wlp_subject
                                  }
                                  value={values.wlp_subject}
                                />
                                {touched.wlp_subject && errors.wlp_subject && (
                                  <FormFeedback>
                                    {errors.wlp_subject}
                                  </FormFeedback>
                                )}
                              </Col>
                              <Col md={4} sm={6} xs={4} className="mb-3">
                                <Label className="form-label">
                                  Learning Indicator{" "}
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="wlp_learningIndicator"
                                  type="number"
                                  placeholder="Enter Year"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={
                                    touched.wlp_learningIndicator &&
                                    errors.wlp_learningIndicator
                                  }
                                  value={values.wlp_learningIndicator}
                                />
                                {touched.wlp_learningIndicator &&
                                  errors.wlp_learningIndicator && (
                                    <FormFeedback>
                                      {errors.wlp_learningIndicator}
                                    </FormFeedback>
                                  )}
                              </Col>
                              <Col md={4} sm={6} xs={4} className="mb-3">
                                <Label className="form-label">
                                  Performance Indicator{" "}
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="wlp_performanceIndicator"
                                  type="number"
                                  placeholder="Enter Performace Indicator"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={
                                    touched.wlp_performanceIndicator &&
                                    errors.wlp_performanceIndicator
                                  }
                                  value={values.wlp_performanceIndicator}
                                />
                                {touched.wlp_performanceIndicator &&
                                  errors.wlp_performanceIndicator && (
                                    <FormFeedback>
                                      {errors.wlp_performanceIndicator}
                                    </FormFeedback>
                                  )}
                              </Col>
                              <Col md={4} sm={6} xs={4} className="mb-3">
                                <Label className="form-label">
                                  Week Ending{" "}
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="wlp_weekEnding"
                                  type="number"
                                  placeholder="Enter Week Ending"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={
                                    touched.wlp_weekEnding &&
                                    errors.wlp_weekEnding
                                  }
                                  value={values.wlp_weekEnding}
                                />
                                {touched.wlp_weekEnding &&
                                  errors.wlp_weekEnding && (
                                    <FormFeedback>
                                      {errors.wlp_weekEnding}
                                    </FormFeedback>
                                  )}
                              </Col>
                              <Col md={4} sm={6} xs={4} className="mb-3">
                                <Label className="form-label">
                                  Reference{" "}
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="wlp_reference"
                                  type="text"
                                  placeholder="Enter Reference"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={
                                    touched.wlp_reference &&
                                    errors.wlp_reference
                                  }
                                  value={values.wlp_reference}
                                />
                                {touched.wlp_reference &&
                                  errors.wlp_reference && (
                                    <FormFeedback>
                                      {errors.wlp_reference}
                                    </FormFeedback>
                                  )}
                              </Col>
                              <Col md={4} sm={6} xs={4} className="mb-3">
                                <div className="mb-3">
                                  {isEdit && form?.wlp_teachingMaterial_old && (
                                    <>
                                      <Label className="form-label">
                                        Teaching Material
                                        <span className="ms-2">
                                          (
                                          <a
                                            href={`${IMAGE_URL}/${
                                              form?.wlp_teachingMaterial_old ||
                                              ""
                                            }`}
                                            target="_blank"
                                            rel="noreferrer"
                                          >
                                            Saved Teaching Material
                                          </a>
                                          )
                                        </span>
                                      </Label>
                                    </>
                                  )}

                                  {!form?.wlp_teachingMaterial_old && (
                                    <Label className="form-label">
                                      Upload Teaching Material
                                    </Label>
                                  )}
                                  <Input
                                    name="wlp_teachingMaterial"
                                    type="file"
                                    accept=".png, .jpg, .jpeg, .gif, .pdf"
                                    placeholder="Upload Teaching Material"
                                    onChange={e => {
                                      let tempForm = form
                                      tempForm.wlp_teachingMaterial.fileName =
                                        e.target.value
                                      tempForm.wlp_teachingMaterial.file =
                                        e.target.files[0]
                                      setForm(tempForm)
                                    }}
                                    invalid={
                                      touched.wlp_teachingMaterial &&
                                      errors.wlp_teachingMaterial
                                    }
                                    defaultValue={
                                      form?.wlp_teachingMaterial?.fileName
                                    }
                                  />
                                  {touched.wlp_teachingMaterial &&
                                    errors.wlp_teachingMaterial && (
                                      <FormFeedback>
                                        {errors.wlp_teachingMaterial}
                                      </FormFeedback>
                                    )}
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <Col md={2} sm={2} xs={2} className="mb-1">
                                <h5 className="form-label">Day</h5>
                              </Col>
                              <Col xs={10} className="mb-1">
                                <Row>
                                  <Col md={4} sm={4} xs={4} className="mb-1">
                                    <h5 className="form-label">Phase 1</h5>
                                  </Col>
                                  <Col md={4} sm={4} xs={4} className="mb-1">
                                    <h5 className="form-label">Phase 2</h5>
                                  </Col>
                                  <Col md={4} sm={4} xs={4} className="mb-1">
                                    <h5 className="form-label">Phase 3</h5>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>

                            <Row>
                              <Col md={2} sm={2} xs={2} className="mb-2">
                                <Label className="form-label">Monday</Label>
                              </Col>
                              <Col xs={10} className="mb-2">
                                <Row>
                                  <Col md={4} sm={4} xs={4} className="mb-2">
                                    <Input
                                      name="mon_phase1"
                                      type="text"
                                      placeholder="Phase 1"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      invalid={
                                        touched.mon_phase1 && errors.mon_phase1
                                      }
                                      value={values.mon_phase1}
                                    />
                                    {touched.mon_phase1 &&
                                      errors.mon_phase1 && (
                                        <FormFeedback>
                                          {errors.mon_phase1}
                                        </FormFeedback>
                                      )}
                                  </Col>
                                  <Col md={4} sm={4} xs={4} className="mb-2">
                                    <Input
                                      name="mon_phase2"
                                      type="text"
                                      placeholder="Phase 2"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      invalid={
                                        touched.mon_phase2 && errors.mon_phase2
                                      }
                                      value={values.mon_phase2}
                                    />
                                    {touched.mon_phase2 &&
                                      errors.mon_phase2 && (
                                        <FormFeedback>
                                          {errors.mon_phase2}
                                        </FormFeedback>
                                      )}
                                  </Col>
                                  <Col md={4} sm={4} xs={4} className="mb-2">
                                    <Input
                                      name="mon_phase3"
                                      type="text"
                                      placeholder="Phase 3"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      invalid={
                                        touched.mon_phase3 && errors.mon_phase3
                                      }
                                      value={values.mon_phase3}
                                    />
                                    {touched.mon_phase3 &&
                                      errors.mon_phase3 && (
                                        <FormFeedback>
                                          {errors.mon_phase3}
                                        </FormFeedback>
                                      )}
                                  </Col>
                                </Row>
                              </Col>
                            </Row>

                            <Row>
                              <Col md={2} sm={2} xs={2} className="mb-2">
                                <Label className="form-label">Tuesday</Label>
                              </Col>
                              <Col xs={10} className="mb-2">
                                <Row>
                                  <Col md={4} sm={4} xs={4} className="mb-2">
                                    <Input
                                      name="tue_phase1"
                                      type="text"
                                      placeholder="Phase 1"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      invalid={
                                        touched.tue_phase1 && errors.tue_phase1
                                      }
                                      value={values.tue_phase1}
                                    />
                                    {touched.tue_phase1 &&
                                      errors.tue_phase1 && (
                                        <FormFeedback>
                                          {errors.tue_phase1}
                                        </FormFeedback>
                                      )}
                                  </Col>
                                  <Col md={4} sm={4} xs={4} className="mb-2">
                                    <Input
                                      name="tue_phase2"
                                      type="text"
                                      placeholder="Phase 2"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      invalid={
                                        touched.tue_phase2 && errors.tue_phase2
                                      }
                                      value={values.tue_phase2}
                                    />
                                    {touched.tue_phase2 &&
                                      errors.tue_phase2 && (
                                        <FormFeedback>
                                          {errors.tue_phase2}
                                        </FormFeedback>
                                      )}
                                  </Col>
                                  <Col md={4} sm={4} xs={4} className="mb-2">
                                    <Input
                                      name="tue_phase3"
                                      type="text"
                                      placeholder="Phase 3"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      invalid={
                                        touched.tue_phase3 && errors.tue_phase3
                                      }
                                      value={values.tue_phase3}
                                    />
                                    {touched.tue_phase3 &&
                                      errors.tue_phase3 && (
                                        <FormFeedback>
                                          {errors.tue_phase3}
                                        </FormFeedback>
                                      )}
                                  </Col>
                                </Row>
                              </Col>
                            </Row>

                            <Row>
                              <Col md={2} sm={2} xs={2} className="mb-2">
                                <Label className="form-label">Wednesday</Label>
                              </Col>
                              <Col xs={10} className="mb-2">
                                <Row>
                                  <Col md={4} sm={4} xs={4} className="mb-2">
                                    <Input
                                      name="wed_phase1"
                                      type="text"
                                      placeholder="Phase 1"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      invalid={
                                        touched.wed_phase1 && errors.wed_phase1
                                      }
                                      value={values.wed_phase1}
                                    />
                                    {touched.wed_phase1 &&
                                      errors.wed_phase1 && (
                                        <FormFeedback>
                                          {errors.wed_phase1}
                                        </FormFeedback>
                                      )}
                                  </Col>
                                  <Col md={4} sm={4} xs={4} className="mb-2">
                                    <Input
                                      name="wed_phase2"
                                      type="text"
                                      placeholder="Phase 2"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      invalid={
                                        touched.wed_phase2 && errors.wed_phase2
                                      }
                                      value={values.wed_phase2}
                                    />
                                    {touched.wed_phase2 &&
                                      errors.wed_phase2 && (
                                        <FormFeedback>
                                          {errors.wed_phase2}
                                        </FormFeedback>
                                      )}
                                  </Col>
                                  <Col md={4} sm={4} xs={4} className="mb-2">
                                    <Input
                                      name="wed_phase3"
                                      type="text"
                                      placeholder="Phase 3"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      invalid={
                                        touched.wed_phase3 && errors.wed_phase3
                                      }
                                      value={values.wed_phase3}
                                    />
                                    {touched.wed_phase3 &&
                                      errors.wed_phase3 && (
                                        <FormFeedback>
                                          {errors.wed_phase3}
                                        </FormFeedback>
                                      )}
                                  </Col>
                                </Row>
                              </Col>
                            </Row>

                            <Row>
                              <Col md={2} sm={2} xs={2} className="mb-2">
                                <Label className="form-label">Thursday</Label>
                              </Col>
                              <Col xs={10} className="mb-2">
                                <Row>
                                  <Col md={4} sm={4} xs={4} className="mb-2">
                                    <Input
                                      name="thu_phase1"
                                      type="text"
                                      placeholder="Phase 1"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      invalid={
                                        touched.thu_phase1 && errors.thu_phase1
                                      }
                                      value={values.thu_phase1}
                                    />
                                    {touched.thu_phase1 &&
                                      errors.thu_phase1 && (
                                        <FormFeedback>
                                          {errors.thu_phase1}
                                        </FormFeedback>
                                      )}
                                  </Col>
                                  <Col md={4} sm={4} xs={4} className="mb-2">
                                    <Input
                                      name="thu_phase2"
                                      type="text"
                                      placeholder="Phase 2"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      invalid={
                                        touched.thu_phase2 && errors.thu_phase2
                                      }
                                      value={values.thu_phase2}
                                    />
                                    {touched.thu_phase2 &&
                                      errors.thu_phase2 && (
                                        <FormFeedback>
                                          {errors.thu_phase2}
                                        </FormFeedback>
                                      )}
                                  </Col>
                                  <Col md={4} sm={4} xs={4} className="mb-2">
                                    <Input
                                      name="thu_phase3"
                                      type="text"
                                      placeholder="Phase 3"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      invalid={
                                        touched.thu_phase3 && errors.thu_phase3
                                      }
                                      value={values.thu_phase3}
                                    />
                                    {touched.thu_phase3 &&
                                      errors.thu_phase3 && (
                                        <FormFeedback>
                                          {errors.thu_phase3}
                                        </FormFeedback>
                                      )}
                                  </Col>
                                </Row>
                              </Col>
                            </Row>

                            <Row>
                              <Col md={2} sm={2} xs={2} className="mb-2">
                                <Label className="form-label">Friday</Label>
                              </Col>
                              <Col xs={10} className="mb-2">
                                <Row>
                                  <Col md={4} sm={4} xs={4} className="mb-2">
                                    <Input
                                      name="fri_phase1"
                                      type="text"
                                      placeholder="Phase 1"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      invalid={
                                        touched.fri_phase1 && errors.fri_phase1
                                      }
                                      value={values.fri_phase1}
                                    />
                                    {touched.fri_phase1 &&
                                      errors.fri_phase1 && (
                                        <FormFeedback>
                                          {errors.fri_phase1}
                                        </FormFeedback>
                                      )}
                                  </Col>
                                  <Col md={4} sm={4} xs={4} className="mb-2">
                                    <Input
                                      name="fri_phase2"
                                      type="text"
                                      placeholder="Phase 2"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      invalid={
                                        touched.fri_phase2 && errors.fri_phase2
                                      }
                                      value={values.fri_phase2}
                                    />
                                    {touched.fri_phase2 &&
                                      errors.fri_phase2 && (
                                        <FormFeedback>
                                          {errors.fri_phase2}
                                        </FormFeedback>
                                      )}
                                  </Col>
                                  <Col md={4} sm={4} xs={4} className="mb-2">
                                    <Input
                                      name="fri_phase3"
                                      type="text"
                                      placeholder="Phase 3"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      invalid={
                                        touched.fri_phase3 && errors.fri_phase3
                                      }
                                      value={values.fri_phase3}
                                    />
                                    {touched.fri_phase3 &&
                                      errors.fri_phase3 && (
                                        <FormFeedback>
                                          {errors.fri_phase3}
                                        </FormFeedback>
                                      )}
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row>
                              <Col md={2} sm={2} xs={2} className="mb-2">
                                <Label className="form-label">Saturday</Label>
                              </Col>
                              <Col xs={10} className="mb-2">
                                <Row>
                                  <Col md={4} sm={4} xs={4} className="mb-2">
                                    <Input
                                      name="sat_phase1"
                                      type="text"
                                      placeholder="Phase 1"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      invalid={
                                        touched.sat_phase1 && errors.sat_phase1
                                      }
                                      value={values.sat_phase1}
                                    />
                                    {touched.sat_phase1 &&
                                      errors.sat_phase1 && (
                                        <FormFeedback>
                                          {errors.sat_phase1}
                                        </FormFeedback>
                                      )}
                                  </Col>
                                  <Col md={4} sm={4} xs={4} className="mb-2">
                                    <Input
                                      name="sat_phase2"
                                      type="text"
                                      placeholder="Phase 2"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      invalid={
                                        touched.sat_phase2 && errors.sat_phase2
                                      }
                                      value={values.sat_phase2}
                                    />
                                    {touched.sat_phase2 &&
                                      errors.sat_phase2 && (
                                        <FormFeedback>
                                          {errors.sat_phase2}
                                        </FormFeedback>
                                      )}
                                  </Col>
                                  <Col md={4} sm={4} xs={4} className="mb-2">
                                    <Input
                                      name="sat_phase3"
                                      type="text"
                                      placeholder="Phase 3"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      invalid={
                                        touched.sat_phase3 && errors.sat_phase3
                                      }
                                      value={values.sat_phase3}
                                    />
                                    {touched.sat_phase3 &&
                                      errors.sat_phase3 && (
                                        <FormFeedback>
                                          {errors.sat_phase3}
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
                                    props.history.push("/lesson-notes")
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
