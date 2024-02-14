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
import { useLocation, useParams } from "react-router-dom"
import SubmitLoader from "components/Common/SubmitLoader"
import {
  createAssigmentQuestion,
  getAssigmentQuestion,
  updateAssigmentQuestion,
} from "helpers/backendHelpers/assigmentQuestion"

import {
  getAllCategories,
  getAllSubCategories,
  getAllTopics,
} from "helpers/backendHelpers/category"
import { getSubCategories } from "helpers/backendHelpers/book"
import { section, subjectsMaster } from "common/data/dropdownVals"
import useAllContentCategories from "hooks/useAllContentCategories"

const AddEditAssigmentQuestion = props => {
  const location = useLocation()
  const type = location.state?.type
  const id = location.state?.id
  const userType = getUserTypeInfo()
  const [isEdit, setIsEdit] = useState(false)
  const [isView, setIsView] = useState(false)
  // const [subCategoryValues, setSubCategoryValues] = useState([])
  // const [topicValues, setTopicValues] = useState([])
  const [AssigmentQuestionId, setAssigmentId] = useState(0)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [questionType, setQuestionType] = useState("mcq")
  const [questionStatement, setQuestionStatement] = useState("text")
  const [temp, setTemp] = useState(false)
  const [genreOptions, setGenreOptions] = useState([
    {
      value: "option1",
      label: "option1",
    },
    {
      value: "option2",
      label: "option2",
    },
    {
      value: "option3",
      label: "option3",
    },
    {
      value: "option4",
      label: "option4",
    },
    {
      value: "option5",
      label: "option5",
    },
  ])

  const { getLevelFromClassName, getClasses, getSubjects, getTopics } =
    useAllContentCategories()
  const [categoryValues, setCategoryValues] = useState([])
  const [subjects, setSubjects] = useState([])
  const [topics, setTopics] = useState([])

  const [form, setForm] = useState({
    aq_title: "",
    aq_answerType: "",
    aq_mark: "",
    aq_option1: "",
    aq_option2: "",
    aq_option3: "",
    aq_option4: "",
    aq_option5: "",
    aq_correntAns: "",
    aq_correct: true,
    qasn_id: "",
    aq_questionType: "mcq",
    aq_questionStatement: "text",
    aq_image: { fileName: "", file: {} },
    aq_category: "",
    aq_subCategory: "",
    aq_topic: "",
    aq_section: "",
  })

  useEffect(() => {
    document.getElementById("AssignmentQuestion").classList.add("mm-active")

    let { type, id } = props.match.params || {}
    // fetchSubCategoryDropDownValues()
    // fetchTopicDropDownValues()
    document.getElementById("mcq").checked = true
    if (document.getElementById("text")) {
      document.getElementById("text").checked = true
    }
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
      fetchAssigmentQuestionDetailsForEdit(id)
    }
  }, [isEdit])

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

  // const getAllSubCategoriesFromApi = async (filterCategory = "") => {
  //   try {
  //     let response = await getSubCategories()

  //     let { subCategories } = response.data
  //     let vals = []
  //     if (filterCategory) {
  //       subCategories.map(mainCategory => {
  //         let { category } = mainCategory
  //         category.map(Category => {
  //           let { subCategory } = Category
  //           if (Category.categoryName === filterCategory) {
  //             subCategory.map(cat => {
  //               vals.push({ name: cat.subCateName, value: cat.subCateName })
  //             })
  //           }
  //         })
  //       })
  //     } else {
  //       subCategories.map(mainCategory => {
  //         let { category } = mainCategory
  //         category.map(Category => {
  //           let { subCategory } = Category
  //           subCategory.map(cat => {
  //             vals.push({ name: cat.subCateName, value: cat.subCateName })
  //           })
  //         })
  //       })
  //       let tempVals = []
  //       vals.length > 0 &&
  //         vals.map((data, i) => {
  //           if (i < 4) {
  //             tempVals.push(data.value)
  //           }
  //         })
  //     }
  //     setSubCategoryValues(vals)
  //   } catch (error) {
  //     setError(error)
  //   }
  // }

  // const getAllTopicsFromApi = async (filterCategory = "") => {
  //   try {
  //     let response = await getAllTopics()
  //     let { topics } = response.data
  //     let vals = []
  //     if (filterCategory) {
  //       topics.map(mainCategory => {
  //         let { category } = mainCategory
  //         category.map(Category => {
  //           let { subCategory } = Category
  //           subCategory.map(subCat => {
  //             let { topics } = subCat
  //             if (subCat.subCateName === filterCategory) {
  //               topics.map(topic => {
  //                 vals.push({ name: topic.topicName, value: topic.topicName })
  //               })
  //             }
  //           })
  //         })
  //       })
  //     } else {
  //       topics.map(mainCategory => {
  //         let { category } = mainCategory
  //         category.map(Category => {
  //           let { subCategory } = Category
  //           subCategory.map(subCat => {
  //             let { topics } = subCat
  //             topics.map(topic => {
  //               vals.push({ name: topic.topicName, value: topic.topicName })
  //             })
  //           })
  //         })
  //       })
  //     }
  //     setTopicValues(vals)
  //   } catch (error) {
  //     setError(error)
  //   }
  // }

  const fetchAssigmentQuestionDetailsForEdit = async aq_id => {
    try {
      let response = await getAssigmentQuestion(aq_id)

      let { assignmentQuestions } = response.data || {}
      assignmentQuestions = assignmentQuestions || {}
      assignmentQuestions["aq_image_old"] = assignmentQuestions["aq_image"]
      assignmentQuestions["aq_image"] = { fileName: "", file: {} }

      // getAllSubCategoriesFromApi(assignmentQuestions?.aq_category)
      // getAllTopicsFromApi(assignmentQuestions?.aq_subCategory)

      if (assignmentQuestions.aq_questionType === "mcq") {
        if (document.getElementById("mcq")) {
          document.getElementById("mcq").checked = true
        }
        setQuestionType("mcq")
      } else if (assignmentQuestions.aq_questionType === "theory") {
        if (document.getElementById("theory")) {
          document.getElementById("theory").checked = true
        }
        setQuestionType("theory")
      }

      if (assignmentQuestions.aq_questionStatement === "text") {
        if (document.getElementById("text")) {
          document.getElementById("text").checked = true
        }

        setQuestionStatement("text")
      } else if (assignmentQuestions.aq_questionStatement === "image") {
        if (document.getElementById("image")) {
          document.getElementById("image").checked = true
        }
        // document.getElementById("image").checked = true
        setQuestionStatement("image")
      }

      if (assignmentQuestions?.aq_answerType == "text") {
      } else {
        if (assignmentQuestions?.aq_correntAns?.length) {
          assignmentQuestions.aq_correntAns =
            assignmentQuestions.aq_correntAns.map(data => {
              return { label: data, value: data }
            })
        }
      }

      // assignmentQuestions["aq_correntAns"]
      if (isEdit) {
        if (assignmentQuestions.aq_correct === true) {
          document.getElementById("option1").checked = true
          setCorrectAns(true)
        } else if (assignmentQuestions.aq_correct === false) {
          document.getElementById("option2").checked = true
          setCorrectAns(false)
        } else if (assignmentQuestions.aq_correct === false) {
          document.getElementById("option3").checked = true
          setCorrectAns(false)
        } else if (assignmentQuestions.aq_correct === false) {
          document.getElementById("option4").checked = true
          setCorrectAns(false)
        } else if (assignmentQuestions.aq_correct === false) {
          document.getElementById("option5").checked = true
          setCorrectAns(false)
        }
      }

      // Assigning the subject list
      if (assignmentQuestions["aq_category"]) {
        const newSubjects = getSubjects("", assignmentQuestions["aq_category"])
        setSubjects(newSubjects)

        if (assignmentQuestions["aq_subCategory"]) {
          const newTopics = getTopics(
            "",
            assignmentQuestions["aq_category"],
            assignmentQuestions["aq_subCategory"]
          )
          setTopics(newTopics)
        }
      }

      return setForm(assignmentQuestions)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching freelance teacher details"

      setForm(form)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleAddAssigmentQuestionSubmit = async data => {
    try {
      setSubmitLoading(true)
      const response = await createAssigmentQuestion(data)
      let message = response?.message || "Live Session Added Successfully"
      SaveToast({ message, type: "success" })
      setSubmitLoading(false)
      props.history.push("/AssignmentQuestion")
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Adding Live Session"
      setSubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleEditAssigmentQuestionSubmit = async (id, data) => {
    if (!id) {
      return SaveToast({
        message: "Please enter Live Session Id",
        type: "error",
      })
    }
    try {
      setSubmitLoading(true)
      const response = await updateAssigmentQuestion(id, data)
      let message = response?.message || "Live Session Updated Successfully"
      SaveToast({ message, type: "success" })
      setSubmitLoading(false)
      props.history.push("/AssignmentQuestion")
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Adding Live Session"
      setSubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  // const handleUpdateEventCalender = () => {
  //   setUpdateModal(false)
  //   SaveToast({
  //     message: "Event Calender Updated Successfully",
  //     type: "success",
  //   })
  //   props.history.push("/live-session")
  // }

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
      {/* <UpdateModal
        show={updateModal}
        onUpdateClick={handleUpdateEventCalender}
        onCloseClick={() => setUpdateModal(false)}
      /> */}
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
                    aq_mark:
                      form.aq_questionType == "mcq" &&
                      Yup.string().required("Please Select Marks"),

                    aq_answerType:
                      form.aq_questionType == "mcq" &&
                      Yup.string().required("Please Select correct answer"),

                    aq_correntAns:
                      form.aq_questionType == "mcq" &&
                      Yup.mixed().test(
                        "invalidInput",
                        "Please Select Correct Answer",
                        value => {
                          return !!value
                        }
                      ),
                    aq_title:
                      form.aq_questionStatement == "text" &&
                      Yup.string().required(
                        "Please Enter Assigment Question Title"
                      ),
                    aq_category: Yup.string().required(
                      "Please Select Class/Grade"
                    ),
                    aq_subCategory: Yup.string().required(
                      "Please Select Subject"
                    ),
                    aq_topic: Yup.string().required("Please Select Topic"),
                    aq_section:
                      type == 2 &&
                      Yup.string().required("Please Select Section"),
                    aq_option2:
                      form.aq_questionType == "mcq" &&
                      Yup.string().required("Please Enter option2 Title"),
                    aq_option1:
                      form.aq_questionType == "mcq" &&
                      Yup.string().required("Please Enter option1 Title"),
                    aq_questionStatement:
                      form.aq_questionType == "theory" &&
                      Yup.string().required("Please Select Question Statement"),
                  })}
                  onSubmit={values => {
                    console.log("Gogogog")
                    console.log(values)

                    let AssigmentQuestion = values
                    let { aq_correntAns: CorrectAnswer } = values

                    AssigmentQuestion["aq_mainCategory"] =
                      getLevelFromClassName(AssigmentQuestion["aq_category"])

                    if (isEdit) {
                      if (type == 1) {
                        AssigmentQuestion["tc_id"] = id
                      } else {
                        AssigmentQuestion["pp_id"] = id
                      }
                      AssigmentQuestion["aq_image_old"] = form.aq_image_old
                      AssigmentQuestion["aq_image"] = form.aq_image.file
                      AssigmentQuestion["aq_type"] = type

                      if (values?.aq_answerType == "multiple") {
                        CorrectAnswer = CorrectAnswer.map(data => {
                          return data.value
                        })
                        AssigmentQuestion.aq_correntAns =
                          CorrectAnswer?.toString()
                      } else if (values?.aq_answerType == "single") {
                        if (CorrectAnswer.length > 0) {
                          CorrectAnswer = CorrectAnswer[0].value
                          AssigmentQuestion.aq_correntAns =
                            CorrectAnswer?.toString()
                        } else {
                          AssigmentQuestion.aq_correntAns =
                            CorrectAnswer?.value.toString()
                        }
                      } else {
                        AssigmentQuestion["aq_type"] = type
                        if (Array.isArray(AssigmentQuestion.aq_correntAns)) {
                          AssigmentQuestion.aq_correntAns = AssigmentQuestion
                            .aq_correntAns[0]
                            ? AssigmentQuestion.aq_correntAns[0]
                            : null
                        } else {
                          AssigmentQuestion.aq_correntAns =
                            AssigmentQuestion.aq_correntAns
                        }
                      }

                      return handleEditAssigmentQuestionSubmit(
                        AssigmentQuestionId,
                        AssigmentQuestion
                      )
                    } else {
                      if (type == 1) {
                        AssigmentQuestion["tc_id"] = id
                      } else {
                        AssigmentQuestion["pp_id"] = id
                      }
                      console.log(values?.aq_answerType)
                      if (values?.aq_answerType == "multiple") {
                        CorrectAnswer = CorrectAnswer.map(data => {
                          return data.value
                        })
                        AssigmentQuestion.aq_correntAns =
                          CorrectAnswer?.toString()
                      } else if (values?.aq_answerType == "single") {
                        CorrectAnswer = CorrectAnswer?.value
                        AssigmentQuestion.aq_correntAns =
                          CorrectAnswer?.toString()
                      } else {
                        AssigmentQuestion.aq_correntAns = AssigmentQuestion
                          .aq_correntAns[0]
                          ? AssigmentQuestion.aq_correntAns[0]
                          : null
                      }
                      AssigmentQuestion["aq_image"] = form.aq_image.file
                      AssigmentQuestion["aq_type"] = type
                      return handleAddAssigmentQuestionSubmit(AssigmentQuestion)
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
                      {console.log(errors)}
                      <Form
                        onSubmit={e => {
                          console.log("hi")

                          e.preventDefault()
                          handleSubmit(e)
                          return false
                        }}
                      >
                        <Row>
                          <Col>
                            <Row className="mb-3">
                              <Col
                                md={2}
                                sm={6}
                                xs={12}
                                className="mt-2 mt-md-0 mb-3"
                              >
                                <Label>Question Type</Label>
                                <br />
                                <Label className="form-label">MCQ</Label>
                                &nbsp;&nbsp;
                                <Input
                                  id="mcq"
                                  name="aq_questionType"
                                  type="radio"
                                  onChange={event => {
                                    if (event.target.checked) {
                                      let temp = form
                                      temp["aq_questionType"] = "mcq"
                                      values["aq_questionType"] = "mcq"
                                      setQuestionType("mcq")
                                      setQuestionStatement("text")
                                      setForm(temp)
                                    }
                                  }}
                                  onBlur={handleBlur}
                                  invalid={
                                    touched.aq_questionType &&
                                    errors.aq_questionType
                                  }
                                  value={form.aq_questionType}
                                  // defaultChecked
                                />
                                <br />
                                <Label className="form-label">Theory</Label>
                                &nbsp;&nbsp;
                                <Input
                                  id="theory"
                                  name="aq_questionType"
                                  type="radio"
                                  // value={false}
                                  onChange={event => {
                                    if (event.target.checked) {
                                      let temp = form
                                      temp["aq_questionType"] = "theory"
                                      temp["aq_questionStatement"] = "text"
                                      values["aq_questionStatement"] = "text"
                                      values["aq_questionType"] = "theory"
                                      setQuestionType("theory")
                                      setForm(temp)
                                      setTemp(!temp)
                                    }
                                  }}
                                  onBlur={handleBlur}
                                  invalid={
                                    touched.aq_questionType &&
                                    errors.aq_questionType
                                  }
                                  value={form.aq_questionType}
                                  // defaultChecked
                                />
                                {touched.aq_questionType &&
                                  errors.aq_questionType && (
                                    <FormFeedback>
                                      {errors.aq_questionType}
                                    </FormFeedback>
                                  )}
                              </Col>
                              <Col
                                md={2}
                                sm={6}
                                xs={12}
                                className="mt-2 mt-md-0 mb-3"
                              >
                                {questionType == "theory" && (
                                  <>
                                    <Label>Question Statement</Label>
                                    <br />
                                    <Label className="form-label">Text</Label>
                                    &nbsp;&nbsp;
                                    <Input
                                      id="text"
                                      name="aq_questionStatement"
                                      type="radio"
                                      onChange={event => {
                                        if (event.target.checked) {
                                          let temp = form
                                          temp["aq_questionStatement"] = "text"
                                          values["aq_questionStatement"] =
                                            "text"
                                          setQuestionStatement("text")
                                          setForm(temp)
                                        }
                                      }}
                                      onBlur={handleBlur}
                                      invalid={
                                        touched.aq_questionStatement &&
                                        errors.aq_questionStatement
                                      }
                                      value={form.aq_questionStatement}
                                      defaultChecked
                                    />
                                    <br />
                                    <Label
                                      htmlFor="false"
                                      className="form-label"
                                    >
                                      Image
                                    </Label>
                                    &nbsp;&nbsp;
                                    <Input
                                      id="image"
                                      name="aq_questionStatement"
                                      type="radio"
                                      // value={false}
                                      onChange={event => {
                                        if (event.target.checked) {
                                          let temp = form
                                          temp["aq_questionStatement"] = "image"
                                          values["aq_questionStatement"] =
                                            "image"
                                          // setQuestionType('image')
                                          setQuestionStatement("image")

                                          setForm(temp)
                                        }
                                      }}
                                      onBlur={handleBlur}
                                      invalid={
                                        touched.aq_questionStatement &&
                                        errors.aq_questionStatement
                                      }
                                      value={form.aq_questionStatement}
                                      // defaultChecked
                                    />
                                    {touched.aq_questionStatement &&
                                      errors.aq_questionStatement && (
                                        <FormFeedback>
                                          {errors.aq_questionStatement}
                                        </FormFeedback>
                                      )}
                                  </>
                                )}
                              </Col>
                              {questionStatement == "text" && (
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
                                    name="aq_title"
                                    type="text"
                                    placeholder="Enter Title"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    invalid={
                                      touched.aq_title && errors.aq_title
                                    }
                                    defaultValue={form.aq_title}
                                  />
                                  {touched.aq_title && errors.aq_title && (
                                    <FormFeedback>
                                      {errors.aq_title}
                                    </FormFeedback>
                                  )}
                                </Col>
                              )}
                              {questionStatement == "image" && (
                                <Col md={4} sm={6} xs={12} className="mb-3">
                                  <Label className="form-label">
                                    Image
                                    {isEdit && form?.aq_image_old && (
                                      <>
                                        <span className="ms-2">
                                          (
                                          <a
                                            href={`${IMAGE_URL}/${
                                              form?.aq_image_old || ""
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
                                    name="aq_image_old"
                                    type="file"
                                    accept=".png, .jpg, .jpeg, .gif"
                                    placeholder="Select Profile Pic"
                                    onChange={e => {
                                      let tempForm = form
                                      tempForm["aq_image"]["fileName"] =
                                        e.target.value
                                      tempForm["aq_image"]["file"] =
                                        e.target.files[0]
                                      setForm(tempForm)
                                    }}
                                    // // onBlur={handleBlur}
                                    invalid={
                                      touched.aq_image && errors.aq_image
                                    }
                                    defaultValue={form?.aq_image?.fileName}
                                  />
                                  {touched.aq_image && errors.aq_image && (
                                    <FormFeedback>
                                      {errors.aq_image}
                                    </FormFeedback>
                                  )}
                                </Col>
                              )}

                              {/* <Col
                                md={4}
                                sm={6}
                                xs={12}
                                className="mt-2 mt-md-0 mb-3"
                              >
                                <Label className="form-label">
                                  Live Session Date
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="aq_date"
                                  type="date"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  max={new Date().toJSON().slice(0, 10)}
                                  invalid={touched.aq_date && errors.aq_date}
                                  value={values.aq_date}
                                />
                                {touched.aq_date && errors.aq_date && (
                                  <FormFeedback>{errors.aq_date}</FormFeedback>
                                )}
                              </Col> */}
                              {questionType == "mcq" && (
                                <Col
                                  md={4}
                                  sm={6}
                                  xs={12}
                                  className="mt-2 mt-sm-0 mb-3"
                                >
                                  <Label className="form-label">
                                    Answer Type
                                  </Label>
                                  <Input
                                    name="aq_answerType"
                                    type="select"
                                    className="form-select"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.aq_answerType || 0}
                                    invalid={
                                      touched.aq_answerType &&
                                      errors.aq_answerType
                                        ? true
                                        : false
                                    }
                                  >
                                    <option value="0" disabled>
                                      Answer Type
                                    </option>

                                    <option value="single">
                                      Single Answer
                                    </option>
                                    <option value="multiple">
                                      Multiple Answer
                                    </option>
                                    <option value="text">text</option>
                                  </Input>
                                  {touched.aq_answerType &&
                                  errors.aq_answerType ? (
                                    <FormFeedback type="invalid">
                                      {errors.aq_answerType}
                                    </FormFeedback>
                                  ) : null}
                                </Col>
                              )}
                              <Col
                                md={4}
                                sm={6}
                                xs={12}
                                className="mt-2 mt-md-0 mb-3"
                              >
                                <Label className="form-label">
                                  Marks
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="aq_mark"
                                  type="text"
                                  placeholder="Enter  Marks"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={touched.aq_mark && errors.aq_mark}
                                  defaultValue={form.aq_mark}
                                />
                                {touched.aq_mark && errors.aq_mark && (
                                  <FormFeedback>{errors.aq_mark}</FormFeedback>
                                )}
                              </Col>
                              {type == 2 && (
                                <Col
                                  md={4}
                                  sm={6}
                                  xs={12}
                                  className="mt-2 mt-sm-0 mb-3"
                                >
                                  <Label className="form-label">Section</Label>
                                  <span className="text-danger">*</span>

                                  <Input
                                    name="aq_section"
                                    type="select"
                                    className="form-select"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.aq_section || 0}
                                    invalid={
                                      touched.aq_section && errors.aq_section
                                        ? true
                                        : false
                                    }
                                  >
                                    <option value="0" disabled>
                                      Select Section
                                    </option>
                                    {section.map(val => {
                                      return (
                                        <option key={val.id} value={val.value}>
                                          {val.label}
                                        </option>
                                      )
                                    })}
                                  </Input>
                                  {touched.aq_section && errors.aq_section ? (
                                    <FormFeedback type="invalid">
                                      {errors.aq_section}
                                    </FormFeedback>
                                  ) : null}
                                </Col>
                              )}

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
                                  name="aq_category"
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

                                    setFieldValue("aq_subCategory", "")
                                    setFieldValue("aq_topic", "")
                                  }}
                                  onBlur={handleBlur}
                                  value={values.aq_category || 0}
                                  invalid={
                                    touched.aq_category && errors.aq_category
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
                                {touched.aq_category && errors.aq_category ? (
                                  <FormFeedback type="invalid">
                                    {errors.aq_category}
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
                                  name="aq_subCategory"
                                  type="select"
                                  className="form-select"
                                  onChange={e => {
                                    handleChange(e)

                                    const newTopics = getTopics(
                                      "",
                                      values.aq_category,
                                      e.target.value
                                    )
                                    setTopics(newTopics)

                                    setFieldValue("aq_topic", "")
                                  }}
                                  onBlur={handleBlur}
                                  value={values.aq_subCategory || 0}
                                  invalid={
                                    touched.aq_subCategory &&
                                    errors.aq_subCategory
                                      ? true
                                      : false
                                  }
                                  disabled={!values.aq_category}
                                >
                                  <option value="0" disabled>
                                    Select Subject
                                  </option>
                                  {subjects.map(subject => {
                                    return (
                                      <option
                                        key={subject.label}
                                        value={subject.value}
                                      >
                                        {subject.label}
                                      </option>
                                    )
                                  })}
                                </Input>
                                {touched.aq_subCategory &&
                                errors.aq_subCategory ? (
                                  <FormFeedback type="invalid">
                                    {errors.aq_subCategory}
                                  </FormFeedback>
                                ) : null}
                              </Col>

                              {/* Topic not needed */}
                              <Col
                                md={4}
                                sm={6}
                                xs={12}
                                className="mt-2 mt-sm-0 mb-3"
                              >
                                <Label className="form-label">Topics</Label>
                                <span className="text-danger">*</span>

                                <Input
                                  name="aq_topic"
                                  type="select"
                                  className="form-select"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.aq_topic || 0}
                                  invalid={
                                    touched.aq_topic && errors.aq_topic
                                      ? true
                                      : false
                                  }
                                  disabled={
                                    !values.aq_category ||
                                    !values.aq_subCategory
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
                                {touched.aq_topic && errors.aq_topic ? (
                                  <FormFeedback type="invalid">
                                    {errors.aq_topic}
                                  </FormFeedback>
                                ) : null}
                              </Col>

                              {questionType == "mcq" && (
                                <>
                                  <Col
                                    md={4}
                                    sm={6}
                                    xs={12}
                                    className="mt-2 mt-md-0 mb-3"
                                  >
                                    <Label className="form-label">
                                      option 1
                                      <span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                      name="aq_option1"
                                      type="text"
                                      placeholder="option 1"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      invalid={
                                        touched.aq_option1 && errors.aq_option1
                                      }
                                      defaultValue={form.aq_option1}
                                    />
                                    {touched.aq_option1 &&
                                      errors.aq_option1 && (
                                        <FormFeedback>
                                          {errors.aq_option1}
                                        </FormFeedback>
                                      )}
                                  </Col>
                                  <br />
                                  <Col
                                    md={4}
                                    sm={6}
                                    xs={12}
                                    className="mt-2 mt-md-0 mb-3"
                                  >
                                    <Label className="form-label">
                                      option 2
                                      <span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                      name="aq_option2"
                                      type="text"
                                      placeholder="option 2"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      invalid={
                                        touched.aq_option2 && errors.aq_option2
                                      }
                                      defaultValue={form.aq_option2}
                                    />
                                    {touched.aq_option2 &&
                                      errors.aq_option2 && (
                                        <FormFeedback>
                                          {errors.aq_option2}
                                        </FormFeedback>
                                      )}
                                  </Col>
                                  <br />
                                  <Col
                                    md={4}
                                    sm={6}
                                    xs={12}
                                    className="mt-2 mt-md-0 mb-3"
                                  >
                                    <Label className="form-label">
                                      option 3
                                    </Label>
                                    <Input
                                      name="aq_option3"
                                      type="text"
                                      placeholder="option 3"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      invalid={
                                        touched.aq_option3 && errors.aq_option3
                                      }
                                      defaultValue={form.aq_option3}
                                    />
                                    {/* {touched.aq_option3 && errors.aq_option3 && (
                                <FormFeedback>{errors.aq_option3}</FormFeedback>
                              )} */}
                                  </Col>
                                  <Col
                                    md={4}
                                    sm={6}
                                    xs={12}
                                    className="mt-2 mt-md-0 mb-3"
                                  >
                                    <Label className="form-label">
                                      option 4
                                    </Label>
                                    <Input
                                      name="aq_option4"
                                      type="text"
                                      placeholder="option 4"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      invalid={
                                        touched.aq_option4 && errors.aq_option4
                                      }
                                      defaultValue={form.aq_option4}
                                    />
                                    {/* {touched.aq_option4 && errors.aq_option4 && (
                                <FormFeedback>{errors.aq_option4}</FormFeedback>
                              )} */}
                                  </Col>
                                  <br />
                                  <Col
                                    md={4}
                                    sm={6}
                                    xs={12}
                                    className="mt-2 mt-md-0 mb-3"
                                  >
                                    <Label className="form-label">
                                      option 5
                                    </Label>
                                    <Input
                                      name="aq_option5"
                                      type="text"
                                      placeholder="option 5"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      invalid={
                                        touched.aq_option5 && errors.aq_option5
                                      }
                                      defaultValue={form.aq_option5}
                                    />
                                    {/* {touched.aq_option5 && errors.aq_option5 && (
                                <FormFeedback>{errors.aq_option5}</FormFeedback>
                              )} */}
                                  </Col>
                                  <Col md={4} sm={6} xs={12} className="mb-3">
                                    <Label className="form-label">
                                      Correct Answer
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {values.aq_answerType != "text" ? (
                                      <>
                                        <Select
                                          name="aq_correntAns"
                                          options={genreOptions}
                                          value={values.aq_correntAns}
                                          validate={{
                                            required: { value: true },
                                          }}
                                          onChange={value => {
                                            setFieldValue(
                                              "aq_correntAns",
                                              value ? value : ""
                                            )
                                          }}
                                          onBlur={evt => {
                                            setFieldTouched(
                                              "aq_correntAns",
                                              true,
                                              true
                                            )
                                          }}
                                          className="react-select-container"
                                          classNamePrefix="select2-selection"
                                          // invalid={
                                          //   !!touched.aq_correntAns &&
                                          //   !!errors.aq_correntAns
                                          // }
                                          invalid={
                                            touched.aq_correntAns &&
                                            errors.aq_correntAns
                                              ? true
                                              : false
                                          }
                                          placeholder="Type to search..."
                                          isMulti={
                                            values.aq_answerType == "multiple"
                                              ? true
                                              : false
                                          }
                                          isClearable
                                          isSearchable
                                        />
                                        {!!touched.aq_correntAns &&
                                        !!errors.aq_correntAns ? (
                                          <div className="invalid-react-select-dropdown">
                                            {errors.aq_correntAns}
                                          </div>
                                        ) : null}
                                      </>
                                    ) : (
                                      <>
                                        <Input
                                          name="aq_correntAns"
                                          type="textarea"
                                          rows={6}
                                          placeholder="Enter Correct Answer"
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          invalid={
                                            touched.aq_correntAns &&
                                            errors.aq_correntAns
                                          }
                                          defaultValue={form.aq_correntAns[0]}
                                        />
                                      </>
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
                                    props.history.push("/AssignmentQuestion")
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

AddEditAssigmentQuestion.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
}

export default AddEditAssigmentQuestion
