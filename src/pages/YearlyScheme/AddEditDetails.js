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
import moment from "moment"
import {
  createYearlyScheme,
  getYearlyScheme,
  updateYearlyScheme,
} from "helpers/backendHelpers/YearlyScheme"
import DatePicker from "react-datepicker"
// import "react-datepicker/dist/react-datepicker.css"

const TeacherModal = props => {
  const teacherInfo = getTeacherInfo()
  const [isEdit, setIsEdit] = useState(false)
  const [isView, setIsView] = useState(false)
  const [yearlySchemeId, setYearlySchemeId] = useState(0)
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
    ysc_year: "",
    ysc_date: "",
    ysc_classId: "",
    sc_id: "",
    ysc_subject: "",
    ysc_weekNumber: "",
    term1_subStrand: "",
    term2_subStrand: "",
    term3_subStrand: "",
    tc_id: "",
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

  useEffect(() => {
    fetchSchoolDetailsForEdit()
  }, [])
  useEffect(() => {
    document.getElementById("yearly-scheme").classList.add("mm-active")

    let { type, id } = props.match.params || {}

    switch (type) {
      case "edit":
        setIsEdit(true)
        setIsView(false)
        setYearlySchemeId(parseInt(id))
        break
      case "view":
        setIsView(true)
        setIsEdit(false)
        setYearlySchemeId(parseInt(id))
        break
      case "add":
        break
      default:
        setIsView(false)
        setIsEdit(false)
        setYearlySchemeId(parseInt(id))
        break
    }

    if (id) {
      fetchYearlySchemeForEdit(id)
      fetchSchoolDetailsForEdit()
    }
  }, [isEdit])

  useEffect(() => {
    if (allSchool.length > 0) {
      setSelectedSchool(allSchool.find(data => data.value === form.sc_id))
    }
  }, [allSchool])

  const fetchYearlySchemeForEdit = async ysc_id => {
    try {
      let response = await getYearlyScheme(ysc_id)
      let { yearlyScheme } = response.data || {}
      yearlyScheme = yearlyScheme || {}

      setSelectedDate(moment(yearlyScheme.ysc_date).format("YYYY-MM-DD"))
      setSelectedClass({
        label: yearlyScheme.ysc_classId,
        value: yearlyScheme.ysc_classId,
      })
      setSelectedYear(new Date().setFullYear(yearlyScheme.ysc_year, 1, 1))
      return setForm(yearlyScheme)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching Yearly Scheme details"

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
        "There was a problem fetching Notification details"

      setForm(form)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleAddYearlySchemeSubmit = async data => {
    try {
      setSubmitLoading(true)
      const response = await createYearlyScheme(data)
      let message = response?.message || "Yearly Scheme Added Successfully"
      SaveToast({ message, type: "success" })
      setSubmitLoading(false)
      props.history.push("/yearly-scheme")
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Adding Yearly Scheme"
      setSubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleEditYearlySchemeSubmit = async (id, data) => {
    if (!id) {
      return SaveToast({
        message: "Please enter Yearly Scheme Id",
        type: "error",
      })
    }
    try {
      setSubmitLoading(true)
      const response = await updateYearlyScheme(id, data)
      let message = response?.message || "Yearly Scheme Updated Successfully"
      SaveToast({ message, type: "success" })
      setSubmitLoading(false)
      props.history.push("/yearly-scheme")
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Adding Yearly Scheme"
      setSubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleUpdateYearlyScheme = () => {
    setUpdateModal(false)
    SaveToast({
      message: "Yearly Scheme Updated Successfully",
      type: "success",
    })
    props.history.push("/yearly-scheme")
  }

  return (
    <React.Fragment>
      <NotificationModal isOpen={modal1} toggle={toggleViewModal} form={form} />
      <UpdateModal
        show={updateModal}
        onUpdateClick={handleUpdateYearlyScheme}
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
                    ysc_subject: Yup.string().required("Please Enter Subject"),
                    // ysc_year: Yup.string().required("Please Enter Year"),
                    ysc_date: Yup.string().required("Please Select Date"),
                    ysc_classId: Yup.string().required("Please Select Class"),
                    ysc_weekNumber: Yup.string().required(
                      "Please Enter Week Number"
                    ),
                  })}
                  onSubmit={values => {
                    let yearlyScheme = values

                    let yearDate = new Date(selectedYear).getFullYear()

                    if (isEdit) {
                      yearlyScheme["sc_id"] = teacherInfo.tc_school.sc_id
                      yearlyScheme["tc_id"] = teacherInfo.tc_id
                      yearlyScheme["ysc_classId"] = selectedClass.value
                      yearlyScheme["ysc_year"] = yearDate

                      delete yearlyScheme["ysc_id"]
                      return handleEditYearlySchemeSubmit(
                        yearlySchemeId,
                        yearlyScheme
                      )
                    } else {
                      yearlyScheme["sc_id"] = teacherInfo.tc_school.sc_id
                      yearlyScheme["tc_id"] = teacherInfo.tc_id
                      yearlyScheme["ysc_classId"] = selectedClass.value
                      yearlyScheme["ysc_year"] = yearDate
                      return handleAddYearlySchemeSubmit(yearlyScheme)
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
                                  Enter Year{" "}
                                  <span className="text-danger">*</span>
                                </Label>
                                {/* <Input
                                  name="ysc_year"
                                  type="number"
                                  placeholder="Enter Year"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={touched.ysc_year && errors.ysc_year}
                                  value={values.ysc_year}
                                />
                                {touched.ysc_year && errors.ysc_year && (
                                  <FormFeedback>{errors.ysc_year}</FormFeedback>
                                )} */}
                                <DatePicker
                                  name="ysc_year"
                                  onChange={e => {
                                    setSelectedYear(e)
                                  }}
                                  placeholderText="Select Year"
                                  selected={
                                    selectedYear != undefined && selectedYear
                                  }
                                  invalid={touched.ysc_year && errors.ysc_year}
                                  dateFormat="yyyy"
                                  showYearPicker
                                  // value={selectedYear}
                                />
                                {touched.ysc_year && errors.ysc_year && (
                                  <FormFeedback>{errors.ysc_year}</FormFeedback>
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
                                  name="ysc_classId"
                                  placeholder="Select Class"
                                  value={selectedClass}
                                  onChange={value => {
                                    setSelectedClass(value)
                                    setFieldValue(
                                      "ysc_classId",
                                      value ? value.value : ""
                                    )
                                  }}
                                  onBlur={evt => {
                                    setFieldTouched("ysc_classId", true, true)
                                  }}
                                  options={classRoomType}
                                  isClearable
                                  invalid={
                                    touched.ysc_classId && errors.ysc_classId
                                  }
                                />
                                {touched.ysc_classId && errors.ysc_classId && (
                                  <div className="invalid-react-select-dropdown">
                                    {errors.ysc_classId}
                                  </div>
                                )}
                              </Col>
                              <Col md={4} sm={6} xs={4} className="mb-3">
                                <Label className="form-label">
                                  Select Date{" "}
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="ysc_date"
                                  type="date"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={touched.ysc_date && errors.ysc_date}
                                  defaultValue={
                                    selectedDate != undefined && selectedDate
                                  }
                                />
                                {touched.ysc_date && errors.ysc_date && (
                                  <FormFeedback>{errors.ysc_date}</FormFeedback>
                                )}
                              </Col>
                              <Col md={4} sm={6} xs={4} className="mb-3">
                                <Label className="form-label">
                                  Enter Subject{" "}
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="ysc_subject"
                                  type="text"
                                  placeholder="Enter Strand"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={
                                    touched.ysc_subject && errors.ysc_subject
                                  }
                                  value={values.ysc_subject}
                                />
                                {touched.ysc_subject && errors.ysc_subject && (
                                  <FormFeedback>
                                    {errors.ysc_subject}
                                  </FormFeedback>
                                )}
                              </Col>
                              <Col md={4} sm={6} xs={4} className="mb-3">
                                <Label className="form-label">
                                  Enter Week Number{" "}
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="ysc_weekNumber"
                                  type="number"
                                  placeholder="Enter Week Number"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={
                                    touched.ysc_weekNumber &&
                                    errors.ysc_weekNumber
                                  }
                                  value={values.ysc_weekNumber}
                                />
                                {touched.ysc_weekNumber &&
                                  errors.ysc_weekNumber && (
                                    <FormFeedback>
                                      {errors.ysc_weekNumber}
                                    </FormFeedback>
                                  )}
                              </Col>
                              <Col md={4} sm={6} xs={4} className="mb-3">
                                <Label className="form-label">
                                  Enter Term 1 Substrand{" "}
                                </Label>
                                <Input
                                  name="term1_subStrand"
                                  type="text"
                                  placeholder="Enter Term 1 Substrand"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={
                                    touched.term1_subStrand &&
                                    errors.term1_subStrand
                                  }
                                  value={values.term1_subStrand}
                                />
                                {touched.term1_subStrand &&
                                  errors.term1_subStrand && (
                                    <FormFeedback>
                                      {errors.term1_subStrand}
                                    </FormFeedback>
                                  )}
                              </Col>
                              <Col md={4} sm={6} xs={4} className="mb-3">
                                <Label className="form-label">
                                  Enter Term 2 Substrand{" "}
                                </Label>
                                <Input
                                  name="term2_subStrand"
                                  type="text"
                                  placeholder="Enter Term 2 Substrand"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={
                                    touched.term2_subStrand &&
                                    errors.term2_subStrand
                                  }
                                  value={values.term2_subStrand}
                                />
                                {touched.term2_subStrand &&
                                  errors.term2_subStrand && (
                                    <FormFeedback>
                                      {errors.term2_subStrand}
                                    </FormFeedback>
                                  )}
                              </Col>
                              <Col md={4} sm={6} xs={4} className="mb-3">
                                <Label className="form-label">
                                  Enter Term 3 Substrand{" "}
                                </Label>
                                <Input
                                  name="term3_subStrand"
                                  type="text"
                                  placeholder="Enter Term 3 Substrand"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={
                                    touched.term3_subStrand &&
                                    errors.term3_subStrand
                                  }
                                  value={values.term3_subStrand}
                                />
                                {touched.term3_subStrand &&
                                  errors.term3_subStrand && (
                                    <FormFeedback>
                                      {errors.term3_subStrand}
                                    </FormFeedback>
                                  )}
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
                                    props.history.push("/yearly-scheme")
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
