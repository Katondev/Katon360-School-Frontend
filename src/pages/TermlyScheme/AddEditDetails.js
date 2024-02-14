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
import { classRoomType } from "common/data/dropdownVals"
import { getTeacherInfo } from "helpers/authHelper"
import NotificationModal from "./ViewModal"
import {
  createTermlyScheme,
  getTermlyScheme,
  getTermlySchemeMasterByClassSubAPI,
  updateTermlyScheme,
} from "helpers/backendHelpers/TermlyScheme"
import moment from "moment"
import DatePicker from "react-datepicker"
import { getAllCategories } from "helpers/backendHelpers/category"
import { getTeacherByTeacherId } from "helpers/backendHelpers/schoolTeachers"

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
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [categoryValues, setCategoryValues] = useState([])
  const [subjectMaster, setSubjectMaster] = useState([])
  const userInfo = JSON.parse(localStorage.getItem("teacherInfo"))
  const [termNumber, setTermNumber] = useState("First Term")
  const [classId, setClassId] = useState("")
  const [subject, setSubject] = useState("")

  const [form, setForm] = useState({
    tsc_year: "",
    tsc_termNumber: "First Term",
    tsc_date: "",
    tsc_classId: "",
    sc_id: "",
    tsc_subject: "",
    tsc_weekNumber: "",
    tsc_strand: "",
    tsc_subStrand: "",
    tsc_contentStandards: "",
    tsc_indicators: "",
    tsc_resources: "",
    tc_id: "",
    tsc_allData: {},
  })
  const [termlySchemeForm, setTermlySchemeForm] = useState({
    id: 1,
    tsc_weekNumber0: 1,
    tsc_strand0: "",
    tsc_subStrand0: "",
    tsc_contentStandards0: "",
    tsc_indicators0: "",
    tsc_resources0: "",
    id: 2,
    tsc_weekNumber1: 2,
    tsc_strand1: "",
    tsc_subStrand1: "",
    tsc_contentStandards1: "",
    tsc_indicators1: "",
    tsc_resources1: "",
    id: 3,
    tsc_weekNumber2: 3,
    tsc_strand2: "",
    tsc_subStrand2: "",
    tsc_contentStandards2: "",
    tsc_indicators2: "",
    tsc_resources2: "",
    id: 4,
    tsc_weekNumber3: 4,
    tsc_strand3: "",
    tsc_subStrand3: "",
    tsc_contentStandards3: "",
    tsc_indicators3: "",
    tsc_resources3: "",
    id: 5,
    tsc_weekNumber4: 5,
    tsc_strand4: "",
    tsc_subStrand4: "",
    tsc_contentStandards4: "",
    tsc_indicators4: "",
    tsc_resources4: "",
    id: 6,
    tsc_weekNumber5: 6,
    tsc_strand5: "",
    tsc_subStrand5: "",
    tsc_contentStandards5: "",
    tsc_indicators5: "",
    tsc_resources5: "",
    id: 7,
    tsc_weekNumber6: 7,
    tsc_strand6: "",
    tsc_subStrand6: "",
    tsc_contentStandards6: "",
    tsc_indicators6: "",
    tsc_resources6: "",
    id: 8,
    tsc_weekNumber7: 8,
    tsc_strand7: "",
    tsc_subStrand7: "",
    tsc_contentStandards7: "",
    tsc_indicators7: "",
    tsc_resources7: "",
    id: 9,
    tsc_weekNumber8: 9,
    tsc_strand8: "",
    tsc_subStrand8: "",
    tsc_contentStandards8: "",
    tsc_indicators8: "",
    tsc_resources8: "",
    id: 10,
    tsc_weekNumber9: 10,
    tsc_strand9: "",
    tsc_subStrand9: "",
    tsc_contentStandards9: "",
    tsc_indicators9: "",
    tsc_resources9: "",
    id: 11,
    tsc_weekNumber10: 11,
    tsc_strand10: "",
    tsc_subStrand10: "",
    tsc_contentStandards10: "",
    tsc_indicators10: "",
    tsc_resources10: "",
    id: 12,
    tsc_weekNumber11: 12,
    tsc_strand11: "",
    tsc_subStrand11: "",
    tsc_contentStandards11: "",
    tsc_indicators11: "",
    tsc_resources11: "",
  })

  useEffect(() => {
    if (classId && subject && !isEdit) {
      getTermlySchemeMasterByClassSub(classId, subject)
    }
  }, [classId, subject])

  const toggleViewModal = () => {
    if (modal1) {
      setnotification({})
    }
    setModal1(!modal1)
    if (form) {
      setnotification(null)
    }
  }

  useEffect(() => {
    document.getElementById("termly-scheme").classList.add("mm-active")
    let { type, id } = props.match.params || {}
    fetchCategoryDropDownValues()
    fetchTeacherDetails()
    document.getElementById("firstTermNumber").checked = true
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
      fetchTermlySchemeForEdit(id)
    }
  }, [isEdit])

  const fetchTermlySchemeForEdit = async tsc_id => {
    try {
      let response = await getTermlyScheme(tsc_id)
      let { termlyScheme } = response.data || {}
      termlyScheme = termlyScheme || {}

      setSelectedYear(new Date().setFullYear(termlyScheme.tsc_year, 1, 1))

      setSelectedDate(moment(termlyScheme.tsc_date).format("YYYY-MM-DD"))
      setSelectedClass({
        label: termlyScheme.tsc_classId,
        value: termlyScheme.tsc_classId,
      })
      setTermlySchemeForm(termlyScheme?.tsc_allData)
      if (termlyScheme?.tsc_termNumber === "First Term") {
        document.getElementById("firstTermNumber").checked = true
      } else if (termlyScheme.tsc_termNumber === "Second Term") {
        document.getElementById("secondTermNumber").checked = true
      }
      return setForm(termlyScheme)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching Notification details"

      setForm(form)
      return SaveToast({ message, type: "error" })
    }
  }

  const getTermlySchemeMasterByClassSub = async (classId, subject) => {
    try {
      let response = await getTermlySchemeMasterByClassSubAPI(classId, subject)
      let { termlySchemeMaster } = response.data || {}
      termlySchemeMaster = termlySchemeMaster || {}

      if (termlySchemeMaster?.tsm_allData) {
        setTermlySchemeForm({})
        setTermlySchemeForm(termlySchemeMaster?.tsm_allData)
      }
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching Notification details"

      setForm(form)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleAddTermlySchemeSubmit = async data => {
    try {
      setSubmitLoading(true)
      const response = await createTermlyScheme(data)
      let message = response?.message || "Termly Scheme Added Successfully"
      SaveToast({ message, type: "success" })
      setSubmitLoading(false)
      props.history.push("/termly-scheme")
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Adding Notification"
      setSubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleEditTermlySchemeSubmit = async (id, data) => {
    if (!id) {
      return SaveToast({
        message: "Please enter Termly Scheme Id",
        type: "error",
      })
    }
    try {
      setSubmitLoading(true)
      const response = await updateTermlyScheme(id, data)
      let message = response?.message || "Termly Scheme Updated Successfully"
      SaveToast({ message, type: "success" })
      setSubmitLoading(false)
      props.history.push("/termly-scheme")
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
  const handleChangeForm = e => {
    setTermlySchemeForm(pre => ({
      ...pre,
      [e.target.name]: e.target.value,
    }))
  }

  const fetchCategoryDropDownValues = async () => {
    try {
      let response = await getAllCategories()
      let { categories } = response.data || {}
      categories = categories || []
      let allCategory = []
      categories.map(category => {
        let item = category.category.map(data => {
          return {
            id: data.CategoryId,
            value: data.CategoryName,
          }
        })
        allCategory.push(...item)
      })
      setCategoryValues(allCategory)
      return
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching mainCategories"

      return SaveToast({ message, type: "error" })
    }
  }

  const fetchTeacherDetails = async () => {
    try {
      let response = await getTeacherByTeacherId(userInfo?.tc_id)
      let { teacher } = response.data
      let subjectArray = []
      teacher?.tc_subject.map(data => {
        subjectArray.push({
          label: data,
          value: data,
        })
      })
      setSubjectMaster(subjectArray)
    } catch (error) {
      let message = error?.message || "There was problem fetching students"
      return SaveToast({ message, type: "error" })
    }
  }

  const loopArray = [
    { id: 0 },
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
    { id: 9 },
    { id: 10 },
    { id: 11 },
  ]

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
                    tsc_date: Yup.string().required("Please Select Date"),
                    tsc_classId: Yup.string().required("Please Select Class"),
                    tsc_subject: Yup.string().required("Please Enter Subject"),
                  })}
                  onSubmit={values => {
                    let termlyScheme = values
                    let yearDate = new Date(selectedYear).getFullYear()

                    if (isEdit) {
                      termlyScheme["sc_id"] = teacherInfo.tc_school.sc_id
                      termlyScheme["tc_id"] = teacherInfo.tc_id
                      // termlyScheme["tsc_classId"] = selectedClass.value
                      termlyScheme["tsc_year"] = yearDate
                      termlyScheme["tsc_allData"] =
                        JSON.stringify(termlySchemeForm)
                      termlyScheme["tsc_termNumber"] = termNumber

                      delete termlyScheme["tsc_id"]
                      return handleEditTermlySchemeSubmit(
                        termlySchemeId,
                        termlyScheme
                      )
                    } else {
                      termlyScheme["sc_id"] = teacherInfo.tc_school.sc_id
                      termlyScheme["tc_id"] = teacherInfo.tc_id
                      termlyScheme["tsc_termNumber"] = termNumber
                      // termlyScheme["tsc_classId"] = selectedClass.value
                      termlyScheme["tsc_year"] = yearDate
                      termlyScheme["tsc_allData"] =
                        JSON.stringify(termlySchemeForm)
                      return handleAddTermlySchemeSubmit(termlyScheme)
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
                                md={4}
                                sm={6}
                                xs={12}
                                className="mt-2 mt-sm-0 mb-3"
                              >
                                <Label className="form-label">
                                  Class/Grade
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="tsc_classId"
                                  type="select"
                                  className="form-select"
                                  onChange={e => {
                                    handleChange(e)
                                    setClassId(e.target.value)
                                  }}
                                  onBlur={handleBlur}
                                  value={values.tsc_classId || 0}
                                  invalid={
                                    touched.tsc_classId && errors.tsc_classId
                                      ? true
                                      : false
                                  }
                                >
                                  <option value="0" disabled>
                                    Select Class/Grade
                                  </option>
                                  {categoryValues.map(val => {
                                    return (
                                      <option key={val.id} value={val.value}>
                                        {val.value}
                                      </option>
                                    )
                                  })}
                                </Input>
                                {touched.tsc_classId && errors.tsc_classId ? (
                                  <FormFeedback type="invalid">
                                    {errors.tsc_classId}
                                  </FormFeedback>
                                ) : null}
                              </Col>
                              <Col
                                md={4}
                                sm={6}
                                xs={12}
                                className="mt-2 mt-sm-0 mb-3"
                              >
                                <Label className="form-label">Subjects</Label>
                                <Input
                                  name="tsc_subject"
                                  type="select"
                                  className="form-select"
                                  onChange={e => {
                                    handleChange(e)
                                    setSubject(e.target.value)
                                    values.ls_topic = ""
                                  }}
                                  onBlur={handleBlur}
                                  value={values.tsc_subject || 0}
                                  invalid={
                                    touched.tsc_subject && errors.tsc_subject
                                      ? true
                                      : false
                                  }
                                >
                                  <option value="0" disabled>
                                    Select Subjects
                                  </option>
                                  {subjectMaster.map(val => {
                                    return (
                                      <option key={val.value} value={val.value}>
                                        {val.value}
                                      </option>
                                    )
                                  })}
                                </Input>
                                {touched.tsc_subject && errors.tsc_subject ? (
                                  <FormFeedback type="invalid">
                                    {errors.tsc_subject}
                                  </FormFeedback>
                                ) : null}
                              </Col>
                              <Col
                                md={4}
                                sm={6}
                                xs={12}
                                className="mt-2 mt-md-0 mb-3"
                              >
                                <Label>Term Number</Label>
                                <br />
                                <Label
                                  htmlFor="firstTermNumber"
                                  className="form-label"
                                >
                                  First Term
                                </Label>
                                &nbsp;&nbsp;
                                <Input
                                  id="firstTermNumber"
                                  name="tsc_termNumber"
                                  type="radio"
                                  onChange={event => {
                                    if (event.target.checked) {
                                      let temp = form
                                      temp["tsc_termNumber"] = "First Term"
                                      values["tsc_termNumber"] = "First Term"
                                      setTermNumber("First Term")
                                      setForm(temp)
                                    }
                                  }}
                                  onBlur={handleBlur}
                                  invalid={
                                    touched.tsc_termNumber &&
                                    errors.tsc_termNumber
                                  }
                                  value={form.tsc_termNumber}
                                />
                                &nbsp;&nbsp;
                                <Label
                                  htmlFor="secondTermNumber"
                                  className="form-label"
                                >
                                  Second Term
                                </Label>
                                &nbsp;&nbsp;
                                <Input
                                  id="secondTermNumber"
                                  name="tsc_termNumber"
                                  type="radio"
                                  // value={false}
                                  placeholder="Enter Title"
                                  onChange={event => {
                                    if (event.target.checked) {
                                      let temp = form
                                      temp["tsc_termNumber"] = "Second Term"
                                      values["tsc_termNumber"] = "Second Term"
                                      setTermNumber("Second Term")
                                      setForm(temp)
                                    }
                                  }}
                                  onBlur={handleBlur}
                                  invalid={
                                    touched.tsc_termNumber &&
                                    errors.tsc_termNumber
                                  }
                                  value={form.tsc_termNumber}
                                  // defaultChecked
                                />
                                {touched.tsc_termNumber &&
                                  errors.tsc_termNumber && (
                                    <FormFeedback>
                                      {errors.tsc_termNumber}
                                    </FormFeedback>
                                  )}
                              </Col>
                              <Col md={4} sm={6} xs={4} className="mb-3">
                                <Label className="form-label">
                                  Enter Year{" "}
                                  <span className="text-danger">*</span>
                                </Label>
                                <DatePicker
                                  name="tsc_year"
                                  onChange={e => {
                                    setSelectedYear(e)
                                  }}
                                  placeholderText="Select Year"
                                  selected={
                                    selectedYear != undefined && selectedYear
                                  }
                                  invalid={touched.tsc_year && errors.tsc_year}
                                  dateFormat="yyyy"
                                  showYearPicker
                                />
                                {touched.tsc_year && errors.tsc_year && (
                                  <FormFeedback>{errors.tsc_year}</FormFeedback>
                                )}
                              </Col>

                              <Col md={4} sm={6} xs={4} className="mb-3">
                                <Label className="form-label">
                                  Select Date{" "}
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="tsc_date"
                                  type="date"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={touched.tsc_date && errors.tsc_date}
                                  defaultValue={
                                    selectedDate != undefined && selectedDate
                                  }
                                />
                                {touched.tsc_date && errors.tsc_date && (
                                  <FormFeedback>{errors.tsc_date}</FormFeedback>
                                )}
                              </Col>
                            </Row>
                            {((classId && subject) || isEdit) && (
                              <>
                                <Row>
                                  <Col md={1} sm={2} xs={2} className="mb-1">
                                    <h6 className="form-label">Week Number</h6>
                                  </Col>
                                  <Col className="mb-1">
                                    <h6>Strand</h6>
                                  </Col>
                                  <Col className="mb-1">
                                    <h6>Sub Strand</h6>
                                  </Col>
                                  <Col className="mb-1">
                                    <h6>Content Strandards</h6>
                                  </Col>
                                  <Col className="mb-1">
                                    <h6>Indicators</h6>
                                  </Col>
                                  <Col className="mb-1">
                                    <h6>Resources</h6>
                                  </Col>
                                </Row>
                                {loopArray.map((data, i) => {
                                  return (
                                    <Row key={i}>
                                      <Col
                                        md={1}
                                        sm={2}
                                        xs={2}
                                        className="mb-1"
                                      >
                                        <h6>{`${data.id + 1}`}</h6>
                                      </Col>
                                      <Col className="mb-1">
                                        <Input
                                          name={`tsc_strand${i}`}
                                          type="text"
                                          placeholder="Strand"
                                          onChange={e => {
                                            handleChangeForm(e)
                                          }}
                                          onBlur={handleBlur}
                                          invalid={
                                            touched.tsc_strand &&
                                            errors.tsc_strand
                                          }
                                          value={
                                            termlySchemeForm[`tsc_strand${i}`]
                                          }
                                        />
                                        {touched.tsc_strand &&
                                          errors.tsc_strand && (
                                            <FormFeedback>
                                              {errors.tsc_strand}
                                            </FormFeedback>
                                          )}
                                      </Col>

                                      <Col className="mb-3">
                                        <Input
                                          name={`tsc_subStrand${i}`}
                                          type="text"
                                          placeholder="Sub Strand"
                                          onChange={e => {
                                            handleChangeForm(e)
                                          }}
                                          onBlur={handleBlur}
                                          invalid={
                                            touched.tsc_subStrand &&
                                            errors.tsc_subStrand
                                          }
                                          value={
                                            termlySchemeForm[
                                              `tsc_subStrand${i}`
                                            ]
                                          }
                                        />
                                        {touched.tsc_subStrand &&
                                          errors.tsc_subStrand && (
                                            <FormFeedback>
                                              {errors.tsc_subStrand}
                                            </FormFeedback>
                                          )}
                                      </Col>
                                      <Col className="mb-3">
                                        <Input
                                          name={`tsc_contentStandards${i}`}
                                          type="text"
                                          placeholder="Content Strandards"
                                          onChange={e => {
                                            handleChangeForm(e)
                                          }}
                                          onBlur={handleBlur}
                                          invalid={
                                            touched.tsc_contentStandards &&
                                            errors.tsc_contentStandards
                                          }
                                          value={
                                            termlySchemeForm[
                                              `tsc_contentStandards${i}`
                                            ]
                                          }
                                        />
                                        {touched.tsc_contentStandards &&
                                          errors.tsc_contentStandards && (
                                            <FormFeedback>
                                              {errors.tsc_contentStandards}
                                            </FormFeedback>
                                          )}
                                      </Col>
                                      <Col className="mb-3">
                                        <Input
                                          name={`tsc_indicators${i}`}
                                          type="text"
                                          placeholder="Indicators"
                                          onChange={e => {
                                            handleChangeForm(e)
                                          }}
                                          onBlur={handleBlur}
                                          invalid={
                                            touched.tsc_indicators &&
                                            errors.tsc_indicators
                                          }
                                          value={
                                            termlySchemeForm[
                                              `tsc_indicators${i}`
                                            ]
                                          }
                                        />
                                        {touched.tsc_indicators &&
                                          errors.tsc_indicators && (
                                            <FormFeedback>
                                              {errors.tsc_indicators}
                                            </FormFeedback>
                                          )}
                                      </Col>
                                      <Col className="mb-3">
                                        <Input
                                          name={`tsc_resources${i}`}
                                          type="text"
                                          placeholder="Resources"
                                          onChange={e => {
                                            handleChangeForm(e)
                                          }}
                                          onBlur={handleBlur}
                                          invalid={
                                            touched.tsc_resources &&
                                            errors.tsc_resources
                                          }
                                          value={
                                            termlySchemeForm[
                                              `tsc_resources${i}`
                                            ]
                                          }
                                        />
                                        {touched.tsc_resources &&
                                          errors.tsc_resources && (
                                            <FormFeedback>
                                              {errors.tsc_resources}
                                            </FormFeedback>
                                          )}
                                      </Col>
                                    </Row>
                                  )
                                })}
                              </>
                            )}

                            <Row className="mb-3 text-center">
                              <Col>
                                <Button
                                  size="md"
                                  color="dark"
                                  type="button"
                                  disabled={submitLoading}
                                  className="mx-2"
                                  onClick={() => {
                                    props.history.push("/termly-scheme")
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
