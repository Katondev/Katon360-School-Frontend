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
  createLiveSession,
  getLiveSession,
  updateLiveSession,
} from "helpers/backendHelpers/liveSession"

import {
  getAllMainCategories,
  getAllCategories,
  getAllSubCategories,
  getAllTopics,
} from "helpers/backendHelpers/category"
import { getSubCategories } from "helpers/backendHelpers/book"
import {
  getAllClassroomByClassRoomId,
  getAllClassroomBySchool,
} from "helpers/backendHelpers/classroom"
import {
  participantsCount,
  subjects,
  subjectsMaster,
} from "common/data/dropdownVals"
import { getTeacherByTeacherId } from "helpers/backendHelpers/schoolTeachers"

const AddEditLiveSession = props => {
  const userType = getUserTypeInfo()
  const [isEdit, setIsEdit] = useState(false)
  const [isView, setIsView] = useState(false)
  const [mainCategoryValues, setMainCategoryValues] = useState([])
  const [categoryValues, setCategoryValues] = useState([])
  const [subCategoryValues, setSubCategoryValues] = useState([])
  const [topicValues, setTopicValues] = useState([])
  const [liveSessionId, setLiveSessionId] = useState(0)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [classroomDropdownValues, setClassroomDropdownValues] = useState([])
  const [selectedClass, setSelectedClass] = useState("")
  const userInfo = JSON.parse(localStorage.getItem("teacherInfo"))
  const [subjectMaster, setSubjectMaster] = useState([])

  const [form, setForm] = useState({
    ls_mainCategory: "",
    ls_subCategory: "",
    ls_topic: "",
    ls_participantCount: "",
    ls_image: { fileName: "", file: {} },
    ls_class: "",
    ls_time: "",
    ls_date: "",
    ls_title: "",
    ls_desc: "",
  })

  useEffect(() => {
    setTimeout(() => {
      document.getElementById("live-session")?.classList.add("mm-active")
    }, 400)
  }, [])

  useEffect(() => {
    if (userInfo && userInfo?.tc_classRoomId) {
      fetchClassroomDropDownValues()
    }
  }, [])

  useEffect(() => {
    document.getElementById("live-session")?.classList.add("mm-active")

    let { type, id } = props.match.params || {}
    fetchMainCategoryDropDownValues()
    fetchCategoryDropDownValues()
    fetchSubCategoryDropDownValues()
    fetchTopicDropDownValues()

    fetchTeacherDetails()

    switch (type) {
      case "edit":
        setIsEdit(true)
        setIsView(false)
        setLiveSessionId(parseInt(id))
        break
      case "view":
        setIsView(true)
        setIsEdit(false)
        setLiveSessionId(parseInt(id))
        break
      case "add":
        break
      default:
        setIsView(false)
        setIsEdit(false)
        setLiveSessionId(parseInt(id))
        break
    }

    if (id) {
      fetchLiveSessionDetailsForEdit(id)
    }
  }, [isEdit])

  const fetchMainCategoryDropDownValues = async () => {
    try {
      let response = await getAllMainCategories()
      let { mainCategories } = response.data || {}
      mainCategories = mainCategories || []
      let mainCategoryVals = mainCategories.map(mainCategory => {
        return {
          id: mainCategory.cc_id,
          value: mainCategory.cc_categoryName,
        }
      })
      setMainCategoryValues(mainCategoryVals)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching mainCategories"

      return SaveToast({ message, type: "error" })
    }
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
        "There was a problem fetching class/grade"

      return SaveToast({ message, type: "error" })
    }
  }

  const fetchSubCategoryDropDownValues = async () => {
    try {
      let response = await getAllSubCategories()
      let { subCategories } = response.data || {}
      subCategories = subCategories || []
      let allSubCategory = []
      subCategories.map(subCategory => {
        let itemArr = []
        subCategory.category.map(data => {
          let item2 = data.subCategory.map(subData => {
            return {
              id: subData.subCateId,
              value: subData.subCateName,
            }
          })
          itemArr.push(...item2)
        })

        allSubCategory.push(...itemArr)
      })
      setSubCategoryValues(allSubCategory)
      return
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching subjects"

      return SaveToast({ message, type: "error" })
    }
  }

  const fetchTopicDropDownValues = async () => {
    try {
      let response = await getAllTopics()
      let { topics } = response.data || {}
      topics = topics || []
      let allTopicsData = []
      topics.map(topicItem => {
        let itemArr = []
        topicItem.category.map(data => {
          data.subCategory.map(subData => {
            let item2 = subData.topics.map(topicData => {
              return {
                id: topicData.topicId,
                value: topicData.topicName,
              }
            })
            itemArr.push(...item2)
          })
        })

        allTopicsData.push(...itemArr)
      })
      setTopicValues(allTopicsData)
      return
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching topics"

      return SaveToast({ message, type: "error" })
    }
  }

  const fetchLiveSessionDetailsForEdit = async ls_id => {
    try {
      let response = await getLiveSession(ls_id)

      let { liveSession } = response.data || {}
      liveSession = liveSession || {}
      liveSession["ls_image_old"] = liveSession["ls_image"]
      liveSession["ls_image_old"] = liveSession["ls_image"]
      liveSession["ls_image"] = { fileName: "", file: {} }
      if (liveSession?.ls_class) {
        setSelectedClass(liveSession?.ls_class)
      }
      getAllSubCategoriesFromApi(liveSession?.ls_class)
      getAllTopicsFromApi(liveSession?.ls_subCategory)

      return setForm(liveSession)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching freelance teacher details"

      setForm(form)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleAddLiveSessionSubmit = async data => {
    try {
      setSubmitLoading(true)
      const response = await createLiveSession(data)
      let message = response?.message || "Live Session Added Successfully"
      SaveToast({ message, type: "success" })
      setSubmitLoading(false)
      props.history.push("/live-session")
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Adding Live Session"
      setSubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleEditLiveSessionSubmit = async (id, data) => {
    if (!id) {
      return SaveToast({
        message: "Please enter Live Session Id",
        type: "error",
      })
    }
    try {
      setSubmitLoading(true)
      const response = await updateLiveSession(id, data)
      let message = response?.message || "Live Session Updated Successfully"
      SaveToast({ message, type: "success" })
      setSubmitLoading(false)
      props.history.push("/live-session")
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Adding Live Session"
      setSubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const getAllSubCategoriesFromApi = async (filterCategory = "") => {
    try {
      let response = await getSubCategories()
      let { subCategories } = response.data
      let vals = []
      if (filterCategory) {
        subCategories.map(mainCategory => {
          let { category } = mainCategory
          category.map(Category => {
            let { subCategory } = Category
            if (Category.categoryName === filterCategory) {
              subCategory.map(cat => {
                vals.push({ name: cat.subCateName, value: cat.subCateName })
              })
            }
          })
        })
      } else {
        subCategories.map(mainCategory => {
          let { category } = mainCategory
          category.map(Category => {
            let { subCategory } = Category
            subCategory.map(cat => {
              vals.push({ name: cat.subCateName, value: cat.subCateName })
            })
          })
        })
        let tempVals = []
        vals.length > 0 &&
          vals.map((data, i) => {
            if (i < 4) {
              tempVals.push(data.value)
            }
          })
      }
      setSubCategoryValues(vals)
    } catch (error) {
      setError(error)
    }
  }

  const getAllTopicsFromApi = async (filterCategory = "") => {
    try {
      let response = await getAllTopics()
      let { topics } = response.data
      let vals = []
      if (filterCategory) {
        topics.map(mainCategory => {
          let { category } = mainCategory
          console.log("category.categoryName", category)
          console.log("selectedClass", selectedClass)

          category.map(Category => {
            if (Category.categoryName == selectedClass) {
              let { subCategory } = Category
              subCategory.map(subCat => {
                let { topics } = subCat
                if (subCat.subCateName === filterCategory) {
                  topics.map(topic => {
                    vals.push({ name: topic.topicName, value: topic.topicName })
                  })
                }
              })
            }
          })
        })
      } else {
        topics.map(mainCategory => {
          let { category } = mainCategory
          category.map(Category => {
            let { subCategory } = Category
            subCategory.map(subCat => {
              let { topics } = subCat
              topics.map(topic => {
                vals.push({ name: topic.topicName, value: topic.topicName })
              })
            })
          })
        })
      }
      setTopicValues(vals)
    } catch (error) {
      setError(error)
    }
  }
  console.log("userInfo12", userInfo)
  // const fetchClassroomDropDownValues = async () => {
  //   try {
  //     let body = {
  //       sc_id: userType?.sc_id,
  //     }
  //     let response = await getAllClassroomBySchool(body)
  //     let { classRooms } = response.data || {}
  //     classRooms = classRooms || []
  //     let classroomVals = classRooms
  //       .filter(classroom => {
  //         return classroom.cr_status
  //       })
  //       .map(classroom => {
  //         return {
  //           id: classroom.cr_id,
  //           value: `${classroom.cr_class}-${classroom.cr_division}`,
  //         }
  //       })
  //     setClassroomDropdownValues(classroomVals)
  //     return
  //   } catch (error) {
  //     let message =
  //       error?.response?.data?.message ||
  //       error?.message ||
  //       "There was a problem fetching classrooms"

  //     return SaveToast({ message, type: "error" })
  //   }
  // }

  const fetchClassroomDropDownValues = async () => {
    try {
      let body = {
        cr_id: JSON.stringify(
          userInfo?.tc_classRoomId ? userInfo?.tc_classRoomId : ""
        ),
      }
      let response = await getAllClassroomByClassRoomId(body)
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
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching classrooms"

      return SaveToast({ message, type: "error" })
    }
  }

  const fetchTeacherDetails = async () => {
    try {
      // setLoading(true)
      let response = await getTeacherByTeacherId(userInfo?.tc_id)
      let { teacher } = response.data
      let subjectArray = []
      if (teacher?.tc_subject && teacher?.tc_subject.length > 0) {
        teacher?.tc_subject.map(data => {
          subjectArray.push({
            label: data,
            value: data,
          })
        })
        setSubjectMaster(subjectArray)
      }
      // setClassRoomIds(teacher?.tc_classRoomId)
    } catch (error) {
      let message = error?.message || "There was problem fetching students"
      // setStudents([])
      // setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleCategoryChange = category => {
    getAllSubCategoriesFromApi(category)
  }

  const handleSubCategoryChange = e => {
    const subCategory = e.target.value
    getAllTopicsFromApi(subCategory)
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
                    ls_date: Yup.string()
                      .required("Please Select Date")
                      .nullable(),
                    ls_desc: Yup.string().required(
                      "Please Enter Live Session Description"
                    ),
                    ls_class: Yup.string().required(
                      "Please Select Class/Grade"
                    ),
                    // ls_mainCategory: Yup.string().required(
                    //   "Please Main Category"
                    // ),
                    ls_subCategory: Yup.string().required(
                      "Please Select Subject"
                    ),
                    ls_topic: Yup.string().required("Please Select Topic"),
                    ls_participantCount: Yup.string().required(
                      "Please select participants count"
                    ),
                    ls_title: Yup.string().required(
                      "Please Enter Live Session Title"
                    ),
                    ls_image: Yup.mixed().nullable().notRequired(),
                    ls_time: Yup.string().required(
                      "Please Enter Live Session time"
                    ),
                  })}
                  onSubmit={values => {
                    let liveSession = values
                    if (isEdit) {
                      liveSession["tc_id"] = userType.tc_id
                      liveSession["ls_image_old"] = form.ls_image_old
                      liveSession["ls_image"] = form.ls_image.file
                      // liveSession["ls_class"] = selectedClass

                      return handleEditLiveSessionSubmit(
                        liveSessionId,
                        liveSession
                      )
                    } else {
                      liveSession["tc_id"] = userType.tc_id
                      liveSession["ls_image"] = form.ls_image.file
                      // liveSession["ls_class"] = selectedClass
                      return handleAddLiveSessionSubmit(liveSession)
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
                                  name="ls_title"
                                  type="text"
                                  placeholder="Enter Title"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={touched.ls_title && errors.ls_title}
                                  defaultValue={form.ls_title}
                                />
                                {touched.ls_title && errors.ls_title && (
                                  <FormFeedback>{errors.ls_title}</FormFeedback>
                                )}
                              </Col>
                              <Col
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
                                  name="ls_date"
                                  type="date"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  min={new Date().toJSON().slice(0, 10)}
                                  invalid={touched.ls_date && errors.ls_date}
                                  value={values.ls_date}
                                />
                                {touched.ls_date && errors.ls_date && (
                                  <FormFeedback>{errors.ls_date}</FormFeedback>
                                )}
                              </Col>
                              <Col
                                md={4}
                                sm={6}
                                xs={12}
                                className="mt-2 mt-sm-0 mb-3"
                              >
                                <Label className="form-label">
                                  Live Session Time
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="ls_time"
                                  // {...(liveSessionId == 0 && "multiple")}
                                  value={values.ls_time}
                                  type="time"
                                  className="form-control"
                                  placeholder="Select Date"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={
                                    touched.ls_time && errors.ls_time
                                      ? true
                                      : false
                                  }
                                ></Input>
                                {touched.ls_time && errors.ls_time ? (
                                  <FormFeedback type="invalid">
                                    {errors.ls_time}
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
                                </Label>
                                <Input
                                  name="ls_class"
                                  type="select"
                                  className="form-select"
                                  onChange={e => {
                                    // setSelectedClass(
                                    //   e.target.options[
                                    //     e.target.selectedIndex
                                    //   ].getAttribute("data-key")
                                    // )
                                    setSelectedClass(e.target.value)
                                    handleChange(e)
                                    getAllSubCategoriesFromApi(e.target.value)
                                    values.ls_subCategory = ""
                                    values.ls_topic = ""
                                  }}
                                  onBlur={handleBlur}
                                  value={values.ls_class || 0}
                                  invalid={
                                    touched.ls_class && errors.ls_class
                                      ? true
                                      : false
                                  }
                                >
                                  <option value="0" disabled>
                                    Select Class/Grade
                                  </option>
                                  {categoryValues.map(val => {
                                    return (
                                      <option
                                        data-key={val.value}
                                        key={val.id}
                                        value={val.value}
                                      >
                                        {val.value}
                                      </option>
                                    )
                                  })}
                                </Input>
                                {touched.ls_class && errors.ls_class ? (
                                  <FormFeedback type="invalid">
                                    {errors.ls_class}
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
                                  name="ls_subCategory"
                                  type="select"
                                  className="form-select"
                                  onChange={e => {
                                    handleChange(e)
                                    getAllTopicsFromApi(e.target.value)
                                    values.ls_topic = ""
                                  }}
                                  onBlur={handleBlur}
                                  value={values.ls_subCategory || 0}
                                  invalid={
                                    touched.ls_subCategory &&
                                    errors.ls_subCategory
                                      ? true
                                      : false
                                  }
                                >
                                  <option value="0" disabled>
                                    Select Subjects
                                  </option>
                                  {subjectsMaster.map(val => {
                                    return (
                                      <option key={val.value} value={val.value}>
                                        {val.value}
                                      </option>
                                    )
                                  })}
                                </Input>
                                {touched.ls_subCategory &&
                                errors.ls_subCategory ? (
                                  <FormFeedback type="invalid">
                                    {errors.ls_subCategory}
                                  </FormFeedback>
                                ) : null}
                              </Col>

                              <Col
                                md={4}
                                sm={6}
                                xs={12}
                                className="mt-2 mt-sm-0 mb-3"
                              >
                                <Label className="form-label">Topics</Label>
                                <Input
                                  name="ls_topic"
                                  type="select"
                                  className="form-select"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.ls_topic || 0}
                                  invalid={
                                    touched.ls_topic && errors.ls_topic
                                      ? true
                                      : false
                                  }
                                >
                                  <option value="0" disabled>
                                    Select Topic
                                  </option>
                                  {topicValues.map(val => {
                                    return (
                                      <option key={val.id} value={val.value}>
                                        {val.value}
                                      </option>
                                    )
                                  })}
                                </Input>
                                {touched.ls_topic && errors.ls_topic ? (
                                  <FormFeedback type="invalid">
                                    {errors.ls_topic}
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
                                  Participants Count
                                </Label>
                                <Input
                                  name="ls_participantCount"
                                  type="select"
                                  className="form-select"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.ls_participantCount || 0}
                                  invalid={
                                    touched.ls_participantCount &&
                                    errors.ls_participantCount
                                      ? true
                                      : false
                                  }
                                >
                                  <option value="0" disabled>
                                    Select Count
                                  </option>
                                  {participantsCount.map(val => {
                                    return (
                                      <option key={val.label} value={val.value}>
                                        {val.value}
                                      </option>
                                    )
                                  })}
                                </Input>
                                {touched.ls_participantCount &&
                                errors.ls_participantCount ? (
                                  <FormFeedback type="invalid">
                                    {errors.ls_participantCount}
                                  </FormFeedback>
                                ) : null}
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
                                      name="ls_desc"
                                      type="textarea"
                                      rows={6}
                                      placeholder="Enter Description"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      invalid={
                                        touched.ls_desc && errors.ls_desc
                                      }
                                      defaultValue={form.ls_desc}
                                    />
                                    {touched.ls_desc && errors.ls_desc && (
                                      <FormFeedback>
                                        {errors.ls_desc}
                                      </FormFeedback>
                                    )}
                                  </Col>
                                </Row>
                              </Col>
                              <Col sm={12} md={6} className="mt-2 mt-md-0">
                                <Row>
                                  <Col>
                                    <Label className="form-label">
                                      Image
                                      {isEdit && form?.ls_image_old && (
                                        <>
                                          <span className="ms-2">
                                            (
                                            <a
                                              href={`${IMAGE_URL}/${
                                                form?.ls_image_old || ""
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
                                      name="ls_image_old"
                                      type="file"
                                      accept=".png, .jpg, .jpeg, .gif"
                                      placeholder="Select Profile Pic"
                                      onChange={e => {
                                        let tempForm = form
                                        tempForm["ls_image"]["fileName"] =
                                          e.target.value
                                        tempForm["ls_image"]["file"] =
                                          e.target.files[0]
                                        setForm(tempForm)
                                      }}
                                      // // onBlur={handleBlur}
                                      invalid={
                                        touched.ls_image && errors.ls_image
                                      }
                                      defaultValue={form.ls_image.fileName}
                                    />
                                    {touched.ls_image && errors.ls_image && (
                                      <FormFeedback>
                                        {errors.ls_image}
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
                                    props.history.push("/live-session")
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

AddEditLiveSession.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
}

export default AddEditLiveSession
