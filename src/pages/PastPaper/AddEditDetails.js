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
import { getUserTypeInfo } from "helpers/authHelper"
import { SaveToast } from "components/Common/SaveToast"

import SubmitLoader from "components/Common/SubmitLoader"
import {
  getAllMainCategories,
  getAllCategories,
  getAllSubCategories,
  getAllTopics,
} from "helpers/backendHelpers/category"
import { getSubCategories } from "helpers/backendHelpers/book"
import DatePicker from "react-datepicker"
import {
  createPastPaper,
  getPastPaper,
  updatePastPaper,
} from "helpers/backendHelpers/pastPaper"

const AddEditPastPaper = props => {
  const [isEdit, setIsEdit] = useState(false)
  const [isView, setIsView] = useState(false)
  const [mainCategoryValues, setMainCategoryValues] = useState([])
  const [categoryValues, setCategoryValues] = useState([])
  const [subCategoryValues, setSubCategoryValues] = useState([])
  const [topicValues, setTopicValues] = useState([])
  const [PastPaperId, setPastPaperId] = useState(0)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [selectedYear, setSelectedYear] = useState("")

  const [form, setForm] = useState({
    pp_year: "",
    pp_body: "",
    pp_title: "",
    pp_category: "",
    pp_subCategory: "",
    pp_topic: "",
    pp_totalMarks: "",
  })

  useEffect(() => { }, [])

  useEffect(() => {
    document.getElementById("past-paper").classList.add("mm-active")

    let { type, id } = props.match.params || {}
    fetchMainCategoryDropDownValues()
    fetchCategoryDropDownValues()
    fetchSubCategoryDropDownValues()
    fetchTopicDropDownValues()

    switch (type) {
      case "edit":
        setIsEdit(true)
        setIsView(false)
        setPastPaperId(parseInt(id))
        break
      case "view":
        setIsView(true)
        setIsEdit(false)
        setPastPaperId(parseInt(id))
        break
      case "add":
        break
      default:
        setIsView(false)
        setIsEdit(false)
        setPastPaperId(parseInt(id))
        break
    }

    if (id) {
      fetchPastPaperDetailsForEdit(id)
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
      return
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
        "There was a problem fetching mainCategories"

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
        "There was a problem fetching mainCategories"

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

  const fetchPastPaperDetailsForEdit = async pp_id => {
    try {
      let response = await getPastPaper(pp_id)
      let { pastPaper } = response.data || {}
      pastPaper = pastPaper || {}
      getAllSubCategoriesFromApi(pastPaper?.pp_category)
      getAllTopicsFromApi(pastPaper?.pp_subCategory)
      setSelectedYear(new Date().setFullYear(pastPaper.pp_year, 1, 1))

      return setForm(pastPaper)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching freelance teacher details"
      setForm(form)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleAddPastPaperSubmit = async data => {
    console.log(data)
    try {
      setSubmitLoading(true)
      const response = await createPastPaper(data)
      let message = response?.message || "PastPaper Added Successfully"
      SaveToast({ message, type: "success" })
      setSubmitLoading(false)

      props.history.push("/past-paper")
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Adding Past Paper"
      setSubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleEditPastPaperSubmit = async (id, data) => {
    if (!id) {
      return SaveToast({
        message: "Please enter Past Paper Id",
        type: "error",
      })
    }
    try {
      setSubmitLoading(true)
      const response = await updatePastPaper(id, data)
      let message = response?.message || "Past Paper Updated Successfully"
      SaveToast({ message, type: "success" })
      setSubmitLoading(false)

      props.history.push("/past-paper")
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Updating Past Paper"
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
          category.map(Category => {
            let { subCategory } = Category
            subCategory.map(subCat => {
              let { topics } = subCat
              if (subCat.subCateName === filterCategory) {
                topics.map(topic => {
                  vals.push({ name: topic.topicName, value: topic.topicName })
                })
              }
            })
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
                    pp_title: Yup.string().required("Please Enter Paper Title"),

                    // pp_year: Yup.string().required("Please Enter Year"),

                    pp_category: Yup.string().required(
                      "Please Select Class/Grade"
                    ),

                    pp_subCategory: Yup.string().required(
                      "Please Select Subject"
                    ),

                    pp_topic: Yup.string().required("Please Select Topic"),

                    pp_body: Yup.string().required("Please Select Body"),
                    pp_totalMarks: Yup.string().required(
                      "Please Enter Total Marks"
                    ),
                  })}
                  onSubmit={values => {
                    let yearDate = new Date(selectedYear).getFullYear()

                    let PastPaperValues = values

                    PastPaperValues["pp_year"] = yearDate

                    if (isEdit) {
                      return handleEditPastPaperSubmit(
                        PastPaperId,
                        PastPaperValues
                      )
                    } else {
                      return handleAddPastPaperSubmit(PastPaperValues)
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
                                  name="pp_title"
                                  type="text"
                                  placeholder="Enter Title"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={touched.pp_title && errors.pp_title}
                                  defaultValue={form.pp_title}
                                />
                                {touched.pp_title && errors.pp_title && (
                                  <FormFeedback>{errors.pp_title}</FormFeedback>
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
                                  name="pp_totalMarks"
                                  type="number"
                                  placeholder="Enter Toal Marks"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={
                                    touched.pp_totalMarks &&
                                    errors.pp_totalMarks
                                  }
                                  defaultValue={form.pp_totalMarks}
                                />
                                {touched.pp_totalMarks &&
                                  errors.pp_totalMarks && (
                                    <FormFeedback>
                                      {errors.pp_totalMarks}
                                    </FormFeedback>
                                  )}
                              </Col>
                              <Col md={4} sm={6} xs={12} className="mb-3">
                                <Label className="form-label">
                                  Enter Year
                                  <span className="text-danger">*</span>
                                </Label>

                                <DatePicker
                                  name="pp_year"
                                  onChange={e => {
                                    setSelectedYear(e)
                                  }}
                                  placeholderText="Select Year"
                                  selected={
                                    selectedYear != undefined && selectedYear
                                  }
                                  invalid={touched.pp_year && errors.pp_year}
                                  dateFormat="yyyy"
                                  showYearPicker
                                // value={selectedYear}
                                />
                                {touched.pp_year && errors.pp_year && (
                                  <FormFeedback>{errors.pp_year}</FormFeedback>
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
                                  Class/Grade
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="pp_category"
                                  type="select"
                                  className="form-select"
                                  onChange={e => {
                                    handleChange(e)
                                    getAllSubCategoriesFromApi(e.target.value)
                                    values.pp_subCategory = ""
                                    values.pp_topic = ""
                                  }}
                                  onBlur={handleBlur}
                                  value={values.pp_category || 0}
                                  invalid={
                                    touched.pp_category && errors.pp_category
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
                                {touched.pp_category && errors.pp_category ? (
                                  <FormFeedback type="invalid">
                                    {errors.pp_category}
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
                                  name="pp_subCategory"
                                  type="select"
                                  className="form-select"
                                  onChange={e => {
                                    handleChange(e)
                                    getAllTopicsFromApi(e.target.value)
                                    values.pp_topic = ""
                                  }}
                                  onBlur={handleBlur}
                                  value={values.pp_subCategory || 0}
                                  invalid={
                                    touched.pp_subCategory &&
                                      errors.pp_subCategory
                                      ? true
                                      : false
                                  }
                                >
                                  <option value="0" disabled>
                                    Select Subject
                                  </option>
                                  {subCategoryValues.map(val => {
                                    return (
                                      <option key={val.id} value={val.value}>
                                        {val.value}
                                      </option>
                                    )
                                  })}
                                </Input>
                                {touched.pp_subCategory &&
                                  errors.pp_subCategory ? (
                                  <FormFeedback type="invalid">
                                    {errors.pp_subCategory}
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
                                <span className="text-danger">*</span>

                                <Input
                                  name="pp_topic"
                                  type="select"
                                  className="form-select"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.pp_topic || 0}
                                  invalid={
                                    touched.pp_topic && errors.pp_topic
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
                                {touched.pp_topic && errors.pp_topic ? (
                                  <FormFeedback type="invalid">
                                    {errors.pp_topic}
                                  </FormFeedback>
                                ) : null}
                              </Col>
                            </Row>

                            <Row className="mb-3">
                              <Col sm={12} md={4}>
                                <Row>
                                  <Col>
                                    <Label className="form-label">
                                      Body
                                      <span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                      name="pp_body"
                                      type="select"
                                      className="form-select"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values.pp_body || 0}
                                      invalid={
                                        touched.pp_body && errors.pp_body
                                          ? true
                                          : false
                                      }
                                    >
                                      <option value="0" disabled>
                                        Select Body
                                      </option>
                                      <option value="JAMB">JAMB</option>
                                      <option value="WAEC">WAEC</option>
                                    </Input>
                                    {touched.pp_body && errors.pp_body && (
                                      <FormFeedback>
                                        {errors.pp_body}
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
                                    props.history.push("/past-paper")
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

AddEditPastPaper.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
}

export default AddEditPastPaper
