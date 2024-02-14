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
import { SaveToast } from "components/Common/SaveToast"
import { IMAGE_URL } from "helpers/urlHelper"
import SubmitLoader from "components/Common/SubmitLoader"

import {
  createPastPaperQuestion,
  getPastPaperQuestion,
  updatePastPaperQuestion,
} from "helpers/backendHelpers/pastPaperQuestion"

const AddEditPastPaperQuestion = props => {
  const paper_id = props?.location?.state?.params?.pp_id
  const [isEdit, setIsEdit] = useState(false)
  const [isView, setIsView] = useState(false)
  const [PastPaperQuestionId, setPastPaperQuestionId] = useState(0)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [messageType, setMessageType] = useState(true)
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
  const [form, setForm] = useState({
    pq_questionStatement: messageType,
    pq_title: "",
    pq_questionType: "",
    pq_mark: "",
    pq_option1: "",
    pq_option2: "",
    pq_option3: "",
    pq_option4: "",
    pq_option5: "",
    pq_correctAns: "",
    pp_id: "",
    pq_text: "",
    pq_image: { fileName: "", file: {} },
  })

  useEffect(() => {}, [])

  useEffect(() => {
    let { type, id } = props.match.params || {}
    switch (type) {
      case "edit":
        setIsEdit(true)
        setIsView(false)
        setPastPaperQuestionId(parseInt(id))
        break
      case "view":
        setIsView(true)
        setIsEdit(false)
        setPastPaperQuestionId(parseInt(id))
        break
      case "add":
        break
      default:
        setIsView(false)
        setIsEdit(false)
        setPastPaperQuestionId(parseInt(id))
        break
    }
    if (id) {
      fetchPastPaperQuestionDetailsForEdit(id)
    }
  }, [isEdit])

  const fetchPastPaperQuestionDetailsForEdit = async pq_id => {
    try {
      let response = await getPastPaperQuestion(pq_id)

      let { pastQuestionPaper } = response.data || {}
      pastQuestionPaper = pastQuestionPaper || {}

      pastQuestionPaper["pq_image_old"] = pastQuestionPaper["pq_image"]
      pastQuestionPaper["pq_image"] = { fileName: "", file: {} }

      pastQuestionPaper?.pq_questionStatement == "text"
        ? setMessageType(true)
        : setMessageType(false)

      pastQuestionPaper?.pq_questionStatement == "text"
        ? (pastQuestionPaper.pq_questionStatement = true)
        : (pastQuestionPaper.pq_questionStatement = false)

      if (pastQuestionPaper?.pq_questionType == "text") {
      } else {
        if (pastQuestionPaper?.pq_correctAns?.length) {
          pastQuestionPaper.pq_correctAns = pastQuestionPaper.pq_correctAns.map(
            data => {
              return { label: data, value: data }
            }
          )
        }
      }

      if (isEdit) {
        if (pastQuestionPaper.pq_correctAns === true) {
          document.getElementById("option1").checked = true
          setCorrectAns(true)
        } else if (pastQuestionPaper.pq_correctAns === false) {
          document.getElementById("option2").checked = true
          setCorrectAns(false)
        } else if (pastQuestionPaper.pq_correctAns === false) {
          document.getElementById("option3").checked = true
          setCorrectAns(false)
        } else if (pastQuestionPaper.pq_correctAns === false) {
          document.getElementById("option4").checked = true
          setCorrectAns(false)
        } else if (pastQuestionPaper.pq_correctAns === false) {
          document.getElementById("option5").checked = true
          setCorrectAns(false)
        }
      }

      return setForm(pastQuestionPaper)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching Past Paper Questions"

      setForm(form)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleAddPastPaperQuestionSubmit = async data => {
    console.log(data)
    try {
      setSubmitLoading(true)
      const response = await createPastPaperQuestion(data)
      let message = response?.message || "Paper Question Added Successfully"
      SaveToast({ message, type: "success" })
      setSubmitLoading(false)
      props.history.push("/past-paper-questions")
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Adding Paper Question"
      setSubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleEditPastPaperQuestionSubmit = async (id, data) => {
    if (!id) {
      return SaveToast({
        message: "Please enter Paper Question Id",
        type: "error",
      })
    }
    try {
      setSubmitLoading(true)
      const response = await updatePastPaperQuestion(id, data)
      let message = response?.message || "Paper Question Updated Successfully"
      SaveToast({ message, type: "success" })
      setSubmitLoading(false)
      props.history.push("/past-paper-questions")
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Adding Paper Question"
      setSubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

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
                    pq_title: Yup.string().required(
                      "Please Enter Question Title"
                    ),
                    // pq_correctAns: Yup.string().required(
                    //   "Please Enter Correct Answer"
                    // ),
                    pq_mark: Yup.string().required("Please Select Marks"),

                    pq_questionType: Yup.string().required(
                      "Please Select correct answer"
                    ),
                    pq_option2: Yup.string().required(
                      "Please Enter option2 Title"
                    ),
                    pq_option1: Yup.string().required(
                      "Please Enter option1 Title"
                    ),
                  })}
                  onSubmit={values => {
                    console.log(values)

                    let PastPaperQuestion = values
                    PastPaperQuestion["pp_id"] = paper_id
                    PastPaperQuestion["pq_questionStatement"] =
                      messageType == true ? "text" : "image"
                    let { pq_correctAns: CorrectAnswer } = values
                    console.log(CorrectAnswer)

                    if (isEdit) {
                      PastPaperQuestion["pq_image_old"] = form.pq_image_old
                      PastPaperQuestion["pq_image"] = form.pq_image.file

                      if (values?.pq_questionType == "multiple") {
                        CorrectAnswer = CorrectAnswer.map(data => {
                          return data.value
                        })
                        PastPaperQuestion.pq_correctAns =
                          CorrectAnswer.toString()
                      } else if (values?.pq_questionType == "single") {
                        if (CorrectAnswer.length > 0) {
                          CorrectAnswer = CorrectAnswer[0].value
                          PastPaperQuestion.pq_correctAns =
                            CorrectAnswer.toString()
                        } else {
                          PastPaperQuestion.pq_correctAns =
                            CorrectAnswer?.value.toString()
                        }
                      } else {
                        if (Array.isArray(PastPaperQuestion.pq_correctAns)) {
                          PastPaperQuestion.pq_correctAns =
                            PastPaperQuestion.pq_correctAns[0]
                        } else {
                          PastPaperQuestion.pq_correctAns =
                            PastPaperQuestion.pq_correctAns
                        }
                      }

                      return handleEditPastPaperQuestionSubmit(
                        PastPaperQuestionId,
                        PastPaperQuestion
                      )
                    } else {
                      if (values?.pq_questionType == "multiple") {
                        CorrectAnswer = CorrectAnswer.map(data => {
                          return data.value
                        })
                        PastPaperQuestion.pq_correctAns =
                          CorrectAnswer.toString()
                      } else if (values?.pq_questionType == "single") {
                        CorrectAnswer = CorrectAnswer.value
                        PastPaperQuestion.pq_correctAns =
                          CorrectAnswer.toString()
                      } else {
                        console.log(
                          "PastPaperQuestion.pq_correctAns",
                          PastPaperQuestion.pq_correctAns
                        )
                        PastPaperQuestion.pq_correctAns =
                          PastPaperQuestion.pq_correctAns[0]
                      }

                      PastPaperQuestion["pq_image"] = form.pq_image.file

                      return handleAddPastPaperQuestionSubmit(PastPaperQuestion)
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
                                  name="pq_title"
                                  type="text"
                                  placeholder="Enter Title"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={touched.pq_title && errors.pq_title}
                                  defaultValue={form.pq_title}
                                />
                                {touched.pq_title && errors.pq_title && (
                                  <FormFeedback>{errors.pq_title}</FormFeedback>
                                )}
                              </Col>

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
                                  name="pq_questionType"
                                  type="select"
                                  className="form-select"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.pq_questionType || 0}
                                  invalid={
                                    touched.pq_questionType &&
                                    errors.pq_questionType
                                      ? true
                                      : false
                                  }
                                >
                                  <option value="0" disabled>
                                    Answer Type
                                  </option>

                                  <option value="single">Single Answer</option>
                                  <option value="multiple">
                                    Multiple Answer
                                  </option>
                                  <option value="text">text</option>
                                </Input>
                                {touched.pq_questionType &&
                                errors.pq_questionType ? (
                                  <FormFeedback type="invalid">
                                    {errors.pq_questionType}
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
                                  Marks
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="pq_mark"
                                  type="text"
                                  placeholder="Enter  Marks"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={touched.pq_mark && errors.pq_mark}
                                  defaultValue={form.pq_mark}
                                />
                                {touched.pq_mark && errors.pq_mark && (
                                  <FormFeedback>{errors.pq_mark}</FormFeedback>
                                )}
                              </Col>
                            </Row>

                            <Row className="mb-3">
                              <Col
                                md={4}
                                sm={6}
                                xs={12}
                                className="mt-2 mt-md-0 mb-3"
                              >
                                <Label>Question Statement</Label>
                                <br />
                                <Label className="form-label">Text</Label>
                                &nbsp;&nbsp;
                                <Input
                                  id="type-true"
                                  name="pq_questionStatement"
                                  type="radio"
                                  placeholder="Enter Title"
                                  onChange={event => {
                                    if (event.target.checked) {
                                      let temp = form
                                      temp["pq_questionStatement"] = true
                                      values["pq_questionStatement"] = true
                                      setMessageType(!messageType)
                                      setForm(temp)
                                    }
                                  }}
                                  onBlur={handleBlur}
                                  value={values.pq_questionStatement}
                                  defaultChecked={
                                    values.pq_questionStatement == true
                                      ? true
                                      : false
                                  }
                                />
                                <br />
                                <Label htmlFor="false" className="form-label">
                                  Image
                                </Label>
                                &nbsp;&nbsp;
                                <Input
                                  id="type-false"
                                  name="pq_questionStatement"
                                  type="radio"
                                  onChange={event => {
                                    if (event.target.checked) {
                                      let temp = form
                                      temp["pq_questionStatement"] = false
                                      values["pq_questionStatement"] = false
                                      setMessageType(!messageType)
                                      setForm(temp)
                                    }
                                  }}
                                  onBlur={handleBlur}
                                  value={form.pq_questionStatement}
                                  defaultChecked={
                                    values.pq_questionStatement == true
                                      ? false
                                      : true
                                  }
                                />
                              </Col>
                              {messageType && (
                                <>
                                  <Row>
                                    <Col md={4} sm={6} xs={12} className="mb-3">
                                      <Label className="form-label">
                                        Select Text
                                      </Label>
                                      <Input
                                        name="pq_text"
                                        type="textarea"
                                        rows={6}
                                        placeholder="Enter Text"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        invalid={
                                          touched.pq_text && errors.pq_text
                                        }
                                        defaultValue={form.pq_text}
                                      />
                                    </Col>
                                  </Row>
                                </>
                              )}
                              {!messageType && (
                                <>
                                  <Row>
                                    <Col md={4} sm={6} xs={12} className="mb-3">
                                      <Label className="form-label">
                                        Image
                                        {isEdit && form?.pq_image_old && (
                                          <>
                                            <span className="ms-2">
                                              (
                                              <a
                                                href={`${IMAGE_URL}/${
                                                  form?.pq_image_old || ""
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
                                        name="pq_image_old"
                                        type="file"
                                        accept=".png, .jpg, .jpeg, .gif"
                                        placeholder="Select Profile Pic"
                                        onChange={e => {
                                          let tempForm = form
                                          tempForm["pq_image"]["fileName"] =
                                            e.target.value
                                          tempForm["pq_image"]["file"] =
                                            e.target.files[0]
                                          setForm(tempForm)
                                        }}
                                        // // onBlur={handleBlur}
                                        invalid={
                                          touched.pq_image && errors.pq_image
                                        }
                                        defaultValue={form.pq_image.fileName}
                                      />
                                      {touched.pq_image && errors.pq_image && (
                                        <FormFeedback>
                                          {errors.pq_image}
                                        </FormFeedback>
                                      )}
                                    </Col>
                                  </Row>
                                </>
                              )}
                            </Row>

                            {/* <Row className="mb-3">
                            </Row> */}
                            {/* <Row className="mb-3"> */}
                            <Col
                              md={4}
                              sm={6}
                              xs={12}
                              className="mt-2 mt-md-0 mb-3"
                            >
                              <Label className="form-label">
                                option 1<span className="text-danger">*</span>
                              </Label>
                              <Input
                                name="pq_option1"
                                type="text"
                                placeholder="option 1"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                invalid={
                                  touched.pq_option1 && errors.pq_option1
                                }
                                defaultValue={form.pq_option1}
                              />
                              {touched.pq_option1 && errors.pq_option1 && (
                                <FormFeedback>{errors.pq_option1}</FormFeedback>
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
                                option 2<span className="text-danger">*</span>
                              </Label>
                              <Input
                                name="pq_option2"
                                type="text"
                                placeholder="option 2"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                invalid={
                                  touched.pq_option2 && errors.pq_option2
                                }
                                defaultValue={form.pq_option2}
                              />
                              {touched.pq_option2 && errors.pq_option2 && (
                                <FormFeedback>{errors.pq_option2}</FormFeedback>
                              )}
                            </Col>
                            <br />
                            <Col
                              md={4}
                              sm={6}
                              xs={12}
                              className="mt-2 mt-md-0 mb-3"
                            >
                              <Label className="form-label">option 3</Label>
                              <Input
                                name="pq_option3"
                                type="text"
                                placeholder="option 3"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                invalid={
                                  touched.pq_option3 && errors.pq_option3
                                }
                                defaultValue={form.pq_option3}
                              />
                              {/* {touched.pq_option3 && errors.pq_option3 && (
                                <FormFeedback>{errors.pq_option3}</FormFeedback>
                              )} */}
                            </Col>
                            {/* </Row> */}
                            {/* <Row className="mb-3"> */}
                            <Col
                              md={4}
                              sm={6}
                              xs={12}
                              className="mt-2 mt-md-0 mb-3"
                            >
                              <Label className="form-label">
                                option 4<span className="text-danger">*</span>
                              </Label>
                              <Input
                                name="pq_option4"
                                type="text"
                                placeholder="option 4"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                invalid={
                                  touched.pq_option4 && errors.pq_option4
                                }
                                defaultValue={form.pq_option4}
                              />
                              {/* {touched.pq_option4 && errors.pq_option4 && (
                                <FormFeedback>{errors.pq_option4}</FormFeedback>
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
                                option 5<span className="text-danger">*</span>
                              </Label>
                              <Input
                                name="pq_option5"
                                type="text"
                                placeholder="option 5"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                invalid={
                                  touched.pq_option5 && errors.pq_option5
                                }
                                defaultValue={form.pq_option5}
                              />
                              {/* {touched.pq_option5 && errors.pq_option5 && (
                                <FormFeedback>{errors.pq_option5}</FormFeedback>
                              )} */}
                            </Col>
                            {/* </Row> */}
                            <Col md={4} sm={6} xs={12} className="mb-3">
                              <Label className="form-label">
                                Correct Answer
                                <span className="text-danger">*</span>
                              </Label>
                              {console.log(
                                "values.pq_questionType: ",
                                values.pq_questionType
                              )}
                              {values.pq_questionType != "text" ? (
                                <>
                                  <Select
                                    name="pq_correctAns"
                                    options={genreOptions}
                                    value={values.pq_correctAns}
                                    validate={{
                                      required: { value: true },
                                    }}
                                    onChange={value => {
                                      console.log(value)
                                      setFieldValue(
                                        "pq_correctAns",
                                        value ? value : ""
                                      )
                                    }}
                                    onBlur={evt => {
                                      setFieldTouched(
                                        "pq_correctAns",
                                        true,
                                        true
                                      )
                                    }}
                                    className="react-select-container"
                                    classNamePrefix="select2-selection"
                                    // invalid={
                                    //   !!touched.pq_correctAns &&
                                    //   !!errors.pq_correctAns
                                    // }
                                    invalid={
                                      touched.pq_correctAns &&
                                      errors.pq_correctAns
                                        ? true
                                        : false
                                    }
                                    placeholder="Type to search..."
                                    isMulti={
                                      values.pq_questionType == "multiple"
                                        ? true
                                        : false
                                    }
                                    isClearable
                                    isSearchable
                                  />
                                  {!!touched.pq_correctAns &&
                                  !!errors.pq_correctAns ? (
                                    <div className="invalid-react-select-dropdown">
                                      {errors.pq_correctAns}
                                    </div>
                                  ) : null}
                                </>
                              ) : (
                                <>
                                  <Input
                                    name="pq_correctAns"
                                    type="textarea"
                                    rows={6}
                                    placeholder="Enter Correct Answer"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    invalid={
                                      touched.pq_correctAns &&
                                      errors.pq_correctAns
                                    }
                                    defaultValue={form.pq_correctAns[0]}
                                  />
                                </>
                              )}
                            </Col>
                            <Row className="mb-3">
                              <Col>
                                <Button
                                  size="md"
                                  color="dark"
                                  type="button"
                                  disabled={submitLoading}
                                  className="mx-2"
                                  onClick={() => {
                                    props.history.push("/past-paper-questions")
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

AddEditPastPaperQuestion.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
}

export default AddEditPastPaperQuestion
