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
import { SaveToast } from "components/Common/SaveToast"
import { IMAGE_URL } from "helpers/urlHelper"

import SubmitLoader from "components/Common/SubmitLoader"
import {
  createAssigment,
  getAssigment,
  updateAssigment,
} from "helpers/backendHelpers/assigment"

import {
  getAllMainCategories,
  getAllCategories,
  getAllSubCategories,
  getAllTopics,
} from "helpers/backendHelpers/category"
import { getSubCategories } from "helpers/backendHelpers/book"
import { subjectsMaster } from "common/data/dropdownVals"
import useAllContentCategories from "hooks/useAllContentCategories"

const AddEditAssigment = props => {
  const userType = getUserTypeInfo()
  const [isEdit, setIsEdit] = useState(false)
  const [isView, setIsView] = useState(false)
  const [mainCategoryValues, setMainCategoryValues] = useState([])
  const [subCategoryValues, setSubCategoryValues] = useState([])
  const [topicValues, setTopicValues] = useState([])
  const [AssigmentId, setAssigmentId] = useState(0)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [selectedRadio, setSelectedRadio] = useState(true)
  const [isDateRange, setIsDateRange] = useState(false)

  const { getLevelFromClassName, getClasses, getSubjects, getTopics } =
    useAllContentCategories()
  const [categoryValues, setCategoryValues] = useState([])
  const [subjects, setSubjects] = useState([])
  const [topics, setTopics] = useState([])

  const [form, setForm] = useState({
    asn_title: "",
    asn_totalMarks: "",
    asn_questionSetType: "dynamic",
    asn_passingMarks: "",
    asn_duration: "",
    asn_markPerQue: "",
    asn_mainCategory: "",
    asn_category: "",
    asn_subCategory: "",
    asn_topic: "",
    asn_desc: "",
    ans_image: { fileName: "", file: {} },
    asn_isDateRange: false,
    asn_startDate: "",
    asn_endDate: "",
  })

  useEffect(() => {
    document.getElementById("Assignment").classList.add("mm-active")

    let { type, id } = props.match.params || {}

    document.getElementById("type-false").checked = true
    switch (type) {
      case "edit":
        setIsEdit(true)
        setIsView(false)
        setAssigmentId(parseInt(id))
        break
      case "view":
        setIsView(true)
        setIsEdit(false)
        setAssigmentId(parseInt(id))
        break
      case "add":
        break
      default:
        setIsView(false)
        setIsEdit(false)
        setAssigmentId(parseInt(id))
        break
    }

    if (id) {
      fetchAssigmentDetailsForEdit(id)
    }
  }, [isEdit])

  // const fetchMainCategoryDropDownValues = async () => {
  //   try {
  //     let response = await getAllMainCategories()
  //     let { mainCategories } = response.data || {}
  //     mainCategories = mainCategories || []
  //     let mainCategoryVals = mainCategories.map(mainCategory => {
  //       return {
  //         id: mainCategory.cc_id,
  //         value: mainCategory.cc_categoryName,
  //       }
  //     })
  //     setMainCategoryValues(mainCategoryVals)
  //     return
  //   } catch (error) {
  //     let message =
  //       error?.response?.data?.message ||
  //       error?.message ||
  //       "There was a problem fetching mainCategories"

  //     return SaveToast({ message, type: "error" })
  //   }
  // }

  useEffect(() => {
    // Set the subjects list
    const newClasses = getClasses("")
    setCategoryValues(newClasses)
  }, [getClasses])

  // const fetchSubCategoryDropDownValues = async () => {
  //   try {
  //     let response = await getAllSubCategories()
  //     let { subCategories } = response.data || {}
  //     subCategories = subCategories || []
  //     let allSubCategory = []
  //     subCategories.map(subCategory => {
  //       let itemArr = []
  //       subCategory.category.map(data => {
  //         let item2 = data.subCategory.map(subData => {
  //           return {
  //             id: subData.subCateId,
  //             value: subData.subCateName,
  //           }
  //         })
  //         itemArr.push(...item2)
  //       })

  //       allSubCategory.push(...itemArr)
  //     })
  //     setSubCategoryValues(allSubCategory)
  //     return
  //   } catch (error) {
  //     let message =
  //       error?.response?.data?.message ||
  //       error?.message ||
  //       "There was a problem fetching mainCategories"

  //     return SaveToast({ message, type: "error" })
  //   }
  // }

  // const fetchTopicDropDownValues = async () => {
  //   try {
  //     let response = await getAllTopics()
  //     let { topics } = response.data || {}
  //     topics = topics || []
  //     let allTopicsData = []
  //     topics.map(topicItem => {
  //       let itemArr = []
  //       topicItem.category.map(data => {
  //         data.subCategory.map(subData => {
  //           let item2 = subData.topics.map(topicData => {
  //             return {
  //               id: topicData.topicId,
  //               value: topicData.topicName,
  //             }
  //           })
  //           itemArr.push(...item2)
  //         })
  //       })

  //       allTopicsData.push(...itemArr)
  //     })
  //     setTopicValues(allTopicsData)
  //     return
  //   } catch (error) {
  //     let message =
  //       error?.response?.data?.message ||
  //       error?.message ||
  //       "There was a problem fetching topics"

  //     return SaveToast({ message, type: "error" })
  //   }
  // }

  const fetchAssigmentDetailsForEdit = async ls_id => {
    try {
      let response = await getAssigment(ls_id)
      let { assignment } = response.data || {}
      assignment = assignment || {}
      // assignment["ans_image_old"] = assignment["ans_image"]
      // assignment["ans_image"] = { fileName: "", file: {} }
      if (assignment.asn_isDateRange === true) {
        document.getElementById("type-true").checked = true
        setIsDateRange(true)
      } else if (assignment.asn_isDateRange === false) {
        document.getElementById("type-false").checked = true
        setIsDateRange(false)
      }

      // Assigning the subject list
      if (assignment["asn_category"]) {
        const newSubjects = getSubjects("", assignment["asn_category"])
        setSubjects(newSubjects)

        if (assignment["asn_subCategory"]) {
          const newTopics = getTopics(
            "",
            assignment["asn_category"],
            assignment["asn_subCategory"]
          )
          setTopics(newTopics)
        }
      }

      return setForm(assignment)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching freelance teacher details"
      setForm(form)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleAddAssigmentSubmit = async data => {
    try {
      setSubmitLoading(true)
      const response = await createAssigment(data)
      let message = response?.message || "Assignments Added Successfully"
      SaveToast({ message, type: "success" })
      setSubmitLoading(false)

      props.history.push("/Assignment")
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Adding Live Session"
      setSubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleEditAssigmentSubmit = async (id, data) => {
    if (!id) {
      return SaveToast({
        message: "Please enter Live Session Id",
        type: "error",
      })
    }
    try {
      setSubmitLoading(true)
      const response = await updateAssigment(id, data)
      let message = response?.message || "Live Session Updated Successfully"
      SaveToast({ message, type: "success" })
      setSubmitLoading(false)

      props.history.push("/Assignment")
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Adding Assignment"
      setSubmitLoading(false)
      return SaveToast({ message, type: "error" })
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
                    // asn_endDate: Yup.string()
                    //   .required("Please Select Date")
                    //   .nullable(),
                    // asn_startDate: Yup.string()
                    //   .required("Please Select Date")
                    //   .nullable(),
                    // asn_desc: Yup.string().required(
                    //   "Please Enter Live Session Description"
                    // ),
                    asn_category: Yup.string().required(
                      "Please Select Class/Grade"
                    ),
                    // asn_mainCategory: Yup.string().required(
                    //   "Please Main Category"
                    // ),
                    asn_markPerQue: Yup.string().required(
                      "Please Marks Per Category"
                    ),
                    // asn_questionSetType: Yup.string().required(
                    //   "Please Question Set Type Category"
                    // ),
                    asn_subCategory: Yup.string().required(
                      "Please Select Subject"
                    ),
                    asn_topic: Yup.string().required("Please Select Topic"),
                    asn_title: Yup.string().required(
                      "Please Enter  Assigment Title"
                    ),
                    asn_passingMarks: Yup.string().required(
                      "Please Enter  Pass Marks "
                    ),
                    // ans_image: Yup.mixed().nullable().notRequired(),
                    asn_duration: Yup.string().required(
                      "Please Enter  Duration Title"
                    ),
                    asn_desc: Yup.string().required(
                      "Please Enter  Description"
                    ),
                    asn_totalMarks: Yup.string().required(
                      "Please Enter Total Marks"
                    ),
                  })}
                  onSubmit={values => {
                    let Assigment = values
                    console.log("hi this is the best")
                    console.log(values)

                    Assigment["asn_mainCategory"] = getLevelFromClassName(
                      Assigment["asn_category"]
                    )

                    if (isEdit) {
                      Assigment["tc_id"] = userType.tc_id
                      // Assigment["ans_image_old"] = form.ans_image_old
                      // Assigment["ans_image"] = form.ans_image.file
                      Assigment["asn_isDateRange"] = isDateRange
                      Assigment["asn_duration"] = Assigment["asn_duration"]
                      Assigment["asn_startDate"] = isDateRange
                        ? Assigment["asn_startDate"]
                        : ""
                      Assigment["asn_endDate"] = isDateRange
                        ? Assigment["asn_endDate"]
                        : ""
                      return handleEditAssigmentSubmit(AssigmentId, Assigment)
                    } else {
                      Assigment["tc_id"] = userType.tc_id
                      // Assigment["ans_image"] = form.ans_image.file
                      Assigment["asn_isDateRange"] = isDateRange
                      Assigment["asn_startDate"] = isDateRange
                        ? Assigment["asn_startDate"]
                        : ""
                      Assigment["asn_endDate"] = isDateRange
                        ? Assigment["asn_endDate"]
                        : ""
                      return handleAddAssigmentSubmit(Assigment)
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
                          // console.log("data is :", e)
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
                                className="mt-2 mt-md-0 mb-3"
                              >
                                <Label className="form-label">
                                  Title
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="asn_title"
                                  type="text"
                                  placeholder="Enter Title"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={
                                    touched.asn_title && errors.asn_title
                                  }
                                  defaultValue={form.asn_title}
                                />
                                {touched.asn_title && errors.asn_title && (
                                  <FormFeedback>
                                    {errors.asn_title}
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
                                  Total Marks
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="asn_totalMarks"
                                  type="text"
                                  placeholder="Enter Toal Marks"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={
                                    touched.asn_totalMarks &&
                                    errors.asn_totalMarks
                                  }
                                  defaultValue={form.asn_totalMarks}
                                />
                                {touched.asn_totalMarks &&
                                  errors.asn_totalMarks && (
                                    <FormFeedback>
                                      {errors.asn_totalMarks}
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
                                  Marks Per Question
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="asn_markPerQue"
                                  type="select"
                                  className="form-select"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.asn_markPerQue || 0}
                                  invalid={
                                    touched.asn_markPerQue &&
                                    errors.asn_markPerQue
                                      ? true
                                      : false
                                  }
                                >
                                  <option value="0" disabled>
                                    Marks Per Question
                                  </option>
                                  <option value={1}>1</option>
                                  <option value={2}>2</option>
                                  <option value={3}>3</option>
                                  <option value={4}>4</option>
                                  <option value={5}>5</option>
                                  <option value={6}>6</option>
                                  <option value={7}>7</option>
                                  <option value={8}>8</option>
                                  <option value={9}>9</option>
                                  <option value={10}>10</option>
                                </Input>
                                {touched.asn_markPerQue &&
                                errors.asn_markPerQue ? (
                                  <FormFeedback type="invalid">
                                    {errors.asn_markPerQue}
                                  </FormFeedback>
                                ) : null}
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
                                  Class/Grade
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="asn_category"
                                  type="select"
                                  className="form-select"
                                  onChange={e => {
                                    handleChange(e)

                                    // Set the subjects list
                                    const newSubjects = getSubjects(
                                      "",
                                      e.target.value
                                    )
                                    setSubjects(newSubjects)

                                    setFieldValue("asn_subCategory", "")
                                    setFieldValue("asn_topic", "")
                                  }}
                                  onBlur={handleBlur}
                                  value={values.asn_category || 0}
                                  invalid={
                                    touched.asn_category && errors.asn_category
                                      ? true
                                      : false
                                  }
                                >
                                  <option value="0" disabled>
                                    Select Class/Grade
                                  </option>
                                  {categoryValues.map(category => {
                                    return (
                                      <option key={category} value={category}>
                                        {category}
                                      </option>
                                    )
                                  })}
                                </Input>
                                {touched.asn_category && errors.asn_category ? (
                                  <FormFeedback type="invalid">
                                    {errors.asn_category}
                                  </FormFeedback>
                                ) : null}
                              </Col>

                              <Col
                                md={4}
                                sm={6}
                                xs={12}
                                className="mt-2 mt-sm-0 mb-3"
                              >
                                <Label className="form-label">
                                  Subject
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="asn_subCategory"
                                  type="select"
                                  className="form-select"
                                  onChange={e => {
                                    handleChange(e)

                                    const newTopics = getTopics(
                                      "",
                                      values.asn_category,
                                      e.target.value
                                    )
                                    setTopics(newTopics)

                                    setFieldValue("aq_topic", "")
                                  }}
                                  onBlur={handleBlur}
                                  value={values.asn_subCategory || 0}
                                  invalid={
                                    touched.asn_subCategory &&
                                    errors.asn_subCategory
                                      ? true
                                      : false
                                  }
                                  disabled={!values.asn_category}
                                >
                                  <option value="0" disabled>
                                    Select Subject
                                  </option>
                                  {subjects.map(subject => {
                                    return (
                                      <option key={subject} value={subject}>
                                        {subject}
                                      </option>
                                    )
                                  })}
                                </Input>
                                {touched.asn_subCategory &&
                                errors.asn_subCategory ? (
                                  <FormFeedback type="invalid">
                                    {errors.asn_subCategory}
                                  </FormFeedback>
                                ) : null}
                              </Col>

                              <Col
                                md={4}
                                sm={6}
                                xs={12}
                                className="mt-2 mt-sm-0 mb-3"
                              >
                                <Label className="form-label">
                                  Topic
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="asn_topic"
                                  type="select"
                                  className="form-select"
                                  onChange={e => {
                                    handleChange(e)
                                  }}
                                  onBlur={handleBlur}
                                  value={values.asn_topic || 0}
                                  invalid={
                                    touched.asn_topic && errors.asn_topic
                                      ? true
                                      : false
                                  }
                                  disabled={
                                    !values.asn_category ||
                                    !values.asn_subCategory
                                  }
                                >
                                  <option value="0" disabled>
                                    Select Topic
                                  </option>
                                  {topics.map(topic => {
                                    return (
                                      <option key={topic} value={topic}>
                                        {topic}
                                      </option>
                                    )
                                  })}
                                </Input>
                                {touched.asn_topic && errors.asn_topic ? (
                                  <FormFeedback type="invalid">
                                    {errors.asn_topic}
                                  </FormFeedback>
                                ) : null}
                              </Col>
                            </Row>

                            <Row className="mb-3">
                              <Col
                                md={4}
                                sm={6}
                                xs={12}
                                className="mt-2 mt-md-0 mb-3"
                              >
                                <Label className="form-label">
                                  Duration (In Minutes)
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="asn_duration"
                                  type="text"
                                  placeholder="Enter Duration"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={
                                    touched.asn_duration && errors.asn_duration
                                  }
                                  defaultValue={form.asn_duration}
                                />
                                {touched.asn_duration &&
                                  errors.asn_duration && (
                                    <FormFeedback>
                                      {errors.asn_duration}
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
                                  Question Set Type
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="asn_questionSetType"
                                  type="select"
                                  className="form-select"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={
                                    values.asn_questionSetType || "dynamic"
                                  }
                                  // defaultValue={form.asn_questionSetType}
                                  invalid={
                                    touched.asn_questionSetType &&
                                    errors.asn_questionSetType
                                      ? true
                                      : false
                                  }
                                >
                                  <option value="0" disabled>
                                    Question Set Type
                                  </option>
                                  <option value="fixed">Fixed Set</option>
                                  <option value="dynamic">Dynamic Set</option>
                                </Input>
                                {touched.asn_questionSetType &&
                                errors.asn_questionSetType ? (
                                  <FormFeedback type="invalid">
                                    {errors.asn_questionSetType}
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
                                  Passing Marks
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="asn_passingMarks"
                                  type="number"
                                  placeholder="Enter Passing Marks"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={
                                    touched.asn_passingMarks &&
                                    errors.asn_passingMarks
                                  }
                                  defaultValue={form.asn_passingMarks}
                                />
                                {touched.asn_passingMarks &&
                                  errors.asn_passingMarks && (
                                    <FormFeedback>
                                      {errors.asn_passingMarks}
                                    </FormFeedback>
                                  )}
                              </Col>
                            </Row>

                            <Row className="mb-3">
                              <Col sm={12} md={6}>
                                <Row>
                                  <Col>
                                    <Label className="form-label">
                                      Description
                                      <span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                      name="asn_desc"
                                      type="textarea"
                                      rows={6}
                                      placeholder="Enter Description"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      invalid={
                                        touched.asn_desc && errors.asn_desc
                                      }
                                      defaultValue={form.asn_desc}
                                    />
                                    {touched.asn_desc && errors.asn_desc && (
                                      <FormFeedback>
                                        {errors.asn_desc}
                                      </FormFeedback>
                                    )}
                                  </Col>
                                </Row>
                              </Col>
                              {/* <Col sm={12} md={6} className="mt-2 mt-md-0">
                                <Row>
                                  <Col>
                                    <Label className="form-label">
                                      Image
                                      {isEdit && form?.ans_image_old && (
                                        <>
                                          <span className="ms-2">
                                            (
                                            <a
                                              href={`${IMAGE_URL}/${form?.ans_image_old || ""
                                                }`}
                                              target="_blank"
                                              rel="noreferrer"
                                            >
                                              Saved Image
                                            </a>
                                            )
                                          </span>
                                        </>
                                      )}
                                    </Label>
                                    <Input
                                      name="ans_image_old"
                                      type="file"
                                      accept=".png, .jpg, .jpeg, .gif"
                                      placeholder="Select Profile Pic"
                                      onChange={e => {
                                        let tempForm = form
                                        tempForm["ans_image"]["fileName"] =
                                          e.target.value
                                        tempForm["ans_image"]["file"] =
                                          e.target.files[0]
                                        setForm(tempForm)
                                      }}
                                      // // onBlur={handleBlur}
                                      invalid={
                                        touched.ans_image && errors.ans_image
                                      }
                                      defaultValue={form.ans_image.fileName}
                                    />
                                    {touched.ans_image && errors.ans_image && (
                                      <FormFeedback>
                                        {errors.ans_image}
                                      </FormFeedback>
                                    )}
                                  </Col>
                                </Row>
                              </Col> */}
                            </Row>

                            <Row className="mb-3">
                              <Col
                                md={4}
                                sm={6}
                                xs={12}
                                className="mt-2 mt-md-0 mb-3"
                              >
                                <Label>Is Date Range</Label>
                                <br />
                                <Label className="form-label">True</Label>
                                &nbsp;&nbsp;
                                <Input
                                  id="type-true"
                                  name="asn_isDateRange"
                                  type="radio"
                                  placeholder="Enter Title"
                                  onChange={event => {
                                    if (event.target.checked) {
                                      let temp = form
                                      temp["asn_isDateRange"] = true
                                      values["asn_isDateRange"] = true
                                      setIsDateRange(true)
                                      setForm(temp)
                                    }
                                  }}
                                  onBlur={handleBlur}
                                  invalid={
                                    touched.asn_isDateRange &&
                                    errors.asn_isDateRange
                                  }
                                  value={form.asn_isDateRange}
                                />
                                <br />
                                <Label htmlFor="false" className="form-label">
                                  False
                                </Label>
                                &nbsp;&nbsp;
                                <Input
                                  id="type-false"
                                  name="asn_isDateRange"
                                  type="radio"
                                  // value={false}
                                  placeholder="Enter Title"
                                  onChange={event => {
                                    if (event.target.checked) {
                                      let temp = form
                                      temp["asn_isDateRange"] = false
                                      values["asn_isDateRange"] = false
                                      setIsDateRange(false)
                                      setForm(temp)
                                      console.log("temp1", temp)
                                    }
                                  }}
                                  onBlur={handleBlur}
                                  invalid={
                                    touched.asn_isDateRange &&
                                    errors.asn_isDateRange
                                  }
                                  value={form.asn_isDateRange}
                                  // defaultChecked
                                />
                                {touched.asn_isDateRange &&
                                  errors.asn_isDateRange && (
                                    <FormFeedback>
                                      {errors.asn_isDateRange}
                                    </FormFeedback>
                                  )}
                              </Col>
                              {isDateRange && (
                                <>
                                  <Col
                                    md={4}
                                    sm={6}
                                    xs={12}
                                    className="mt-2 mt-md-0 mb-3"
                                  >
                                    <Label
                                      className="form-label"
                                      disabled={selectedRadio == "false"}
                                    >
                                      Start Date
                                    </Label>
                                    <Input
                                      name="asn_startDate"
                                      type="date"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      // max={new Date().toJSON().slice(0, 10)}
                                      invalid={
                                        touched.asn_startDate &&
                                        errors.asn_startDate
                                      }
                                      value={values.asn_startDate}
                                    />
                                    {touched.asn_startDate &&
                                      errors.asn_startDate && (
                                        <FormFeedback>
                                          {errors.asn_startDate}
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
                                      End Date
                                    </Label>
                                    <Input
                                      name="asn_endDate"
                                      type="date"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      min={new Date(values?.asn_startDate)
                                        ?.toJSON()
                                        ?.slice(0, 10)}
                                      invalid={
                                        touched.asn_endDate &&
                                        errors.asn_endDate
                                      }
                                      value={values.asn_endDate}
                                    />
                                    {touched.asn_endDate &&
                                      errors.asn_endDate && (
                                        <FormFeedback>
                                          {errors.asn_endDate}
                                        </FormFeedback>
                                      )}
                                  </Col>
                                </>
                              )}
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
                                    props.history.push("/Assignment")
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

AddEditAssigment.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
}

export default AddEditAssigment
