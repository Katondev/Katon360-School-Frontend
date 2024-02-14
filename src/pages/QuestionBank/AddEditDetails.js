import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  FormFeedback,
  Input,
  Label,
  Row,
} from "reactstrap"
import { Form as RBSForm } from "react-bootstrap"
import { Form, Formik } from "formik"
import * as Yup from "yup"
import { SaveToast } from "components/Common/SaveToast"

import {
  standard as classesDropdown,
  classRoomType,
  subjects,
  options as queOptions,
} from "../../common/data/dropdownVals"
import ViewDetails from "./ViewDetails"
import UpdateModal from "../../components/Common/UpdateModal"
import {
  updateQuestionBank,
  getQuestionBank,
  createQuestionBank,
} from "helpers/backendHelpers/questionBank"
import { getAllClassroom } from "helpers/backendHelpers/classroom"

const QuestionBankModal = props => {
  const [isEdit, setIsEdit] = useState(false)
  const [isView, setIsView] = useState(false)
  const [questionBankId, setQuestionBankId] = useState(0)
  const [submitLoading, setSubmitLoading] = useState(false)

  const [updateModal, setUpdateModal] = useState(false)
  const [classroomDropdownValues, setClassroomDropdownValues] = useState([])

  const [apiErrors, setApiErrors] = useState({})

  const [form, setForm] = useState({
    //qb_classRoomId: "",
    qb_class: "",
    qb_subject: "",
    qb_questionTitle: "",
    qb_option1: "",
    qb_option2: "",
    qb_option3: "",
    qb_option4: "",
    qb_correctAnswer: "",
  })
  useEffect(() => {
    let { type, id } = props.match.params || {}
    fetchClassroomDropDownValues()

    document.getElementById("question-bank").classList.add("mm-active")
    switch (type) {
      case "edit":
        setIsEdit(true)
        setIsView(false)
        setQuestionBankId(parseInt(id))
        break
      case "view":
        setIsView(true)
        setIsEdit(false)
        setQuestionBankId(parseInt(id))
        break
      default:
        setIsView(false)
        setIsEdit(false)
        setQuestionBankId(0)
        break
    }

    if (id) {
      fetchQuestionForEdit(id)
    }
  }, [isEdit])

  const fetchClassroomDropDownValues = async () => {
    try {
      let response = await getAllClassroom()
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
      return
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching classrooms"

      return SaveToast({ message, type: "error" })
    }
  }

  const fetchQuestionForEdit = async qb_id => {
    try {
      let response = await getQuestionBank(qb_id)

      let { question } = response.data || {}
      let { cr_class, cr_division } = question.qb_classRoom
      question = question || {}

      question.qb_classRoom = `${cr_class}-${cr_division}`
      const answer = question.qb_correctAnswer

      if (isEdit) {
        if (answer === "Option1") {
          document.getElementById("option1").checked = true
        } else if (answer === "Option2") {
          document.getElementById("option2").checked = true
        } else if (answer === "Option3") {
          document.getElementById("option3").checked = true
        } else if (answer === "Option4") {
          document.getElementById("option4").checked = true
        } else {
          return false
        }
      }

      return setForm(question)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching question details"

      setForm(form)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleCreateQuestionSubmit = async data => {
    try {
      setSubmitLoading(true)
      let response = await createQuestionBank(data)
      let message = response?.message || "Question created successfully"
      SaveToast({ message, type: "success" })
      setSubmitLoading(false)
      props.history.push("/question-bank")
      return
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem creating question details"

      const errors = error.response.data.error.errors || {}
      setApiErrors(errors)
      setSubmitLoading(false)
      setForm(form)

      return SaveToast({ message, type: "error" })
    }
  }

  const handleUpdateQuestionSubmit = async (id, reqBody) => {
    if (!id) {
      return SaveToast({ message: "Invalid Question ID", type: "error" })
    }

    try {
      setSubmitLoading(true)
      let response = await updateQuestionBank(id, reqBody)
      let message = response?.message || "Question Updated Successfully"
      SaveToast({ message, type: "success" })
      setSubmitLoading(false)
      props.history.push("/question-bank")
      return
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem updating question"

      setSubmitLoading(false)
      setForm(form)
      return SaveToast({ message, type: "error" })
    }
  }

  const onClickUpdate = values => {
    setUpdateModal(true)
  }

  const handleUpdateQuestionBank = () => {
    setUpdateModal(false)
    props.history.push("/question-bank")
  }
  return (
    <React.Fragment>
      <UpdateModal
        show={updateModal}
        onUpdateClick={handleUpdateQuestionBank}
        onCloseClick={() => setUpdateModal(false)}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Card>
            <CardHeader>
              <CardTitle>
                {isView ? (
                  <Label>Question Bank Details</Label>
                ) : (
                  <Label>{!isEdit ? "Enter" : "Update"} Details</Label>
                )}
              </CardTitle>
            </CardHeader>
            <CardBody>
              {isView ? (
                <>
                  <ViewDetails questionData={form} {...props} />
                </>
              ) : (
                <Formik
                  enableReinitialize={true}
                  initialValues={form}
                  validationSchema={Yup.object({
                    // qb_classRoomId: Yup.number().required(
                    //   "Please Select ClassRoom"
                    // ),
                    // qb_classRoomm: Yup.string()
                    //   .oneOf(classRoomType, "Please Select the Class")
                    //   .required("Please Select the Class"),
                    qb_subject: Yup.string()
                      .oneOf(subjects, "Please Select Valid Subject")
                      .required("Please Select Subject"),
                    qb_questionTitle: Yup.string().required(
                      "Please Enter the Question Title"
                    ),
                    qb_option1: Yup.string().required(
                      "Please Enter the Option 1"
                    ),
                    qb_option2: Yup.string().required(
                      "Please Enter the Option 2"
                    ),
                    qb_option3: Yup.string().required(
                      "Please Enter the Option 3"
                    ),
                    qb_option4: Yup.string().required(
                      "Please Enter the Option 4"
                    ),
                    // qb_correctAnswer: Yup.string().required(
                    //   "Please Select the Correct Answer"
                    // ),
                  })}
                  onSubmit={values => {
                    let questionData = values
                    console.log(values)
                    // questionData["qb_classRoomId"] = parseInt(
                    //   questionData["qb_classRoomId"]
                    // )
                    questionData["qb_class"] = questionData["qb_class"]
                    if (isEdit) {
                      delete questionData["qb_id"]
                      return handleUpdateQuestionSubmit(
                        questionBankId,
                        questionData
                      )
                    } else {
                      console.log("Create")
                      return handleCreateQuestionSubmit(questionData)
                    }
                  }}
                >
                  {({
                    touched,
                    errors,
                    values,
                    handleSubmit,
                    handleBlur,
                    setFieldValue,
                    setFieldTouched,
                    handleChange,
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
                              {/* <Col md={4} sm={10} xs={12} className="mb-3">
                                <Label className="form-label">
                                  Select Classroom{" "}
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="qb_classRoomId"
                                  type="select"
                                  className="form-select"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.qb_classRoomId || 0}
                                  invalid={
                                    touched.qb_classRoomId &&
                                    errors.qb_classRoomId
                                      ? true
                                      : false
                                  }
                                >
                                  <option value="0" disabled>
                                    Select Classroom
                                  </option>
                                  {classroomDropdownValues.map(val => {
                                    return (
                                      <option key={val.id} value={val.id}>
                                        {val.value}
                                      </option>
                                    )
                                  })}
                                </Input>
                                {touched.qb_classRoomId &&
                                errors.qb_classRoomId ? (
                                  <FormFeedback type="invalid">
                                    {errors.qb_classRoomId}
                                  </FormFeedback>
                                ) : null}
                              </Col> */}

                              <Col md={6} sm={10} xs={12} className="mb-3">
                                <Label className="form-label">
                                  Select Class{" "}
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="qb_class"
                                  type="select"
                                  className="form-select"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.qb_class || 0}
                                  // invalid={
                                  //   touched.qb_class &&
                                  //   errors.qb_class
                                  //     ? true
                                  //     : false
                                  // }
                                >
                                  <option value={0} disabled>
                                    Select Class
                                  </option>
                                  {classRoomType.map(classRoom => (
                                    <optgroup
                                      key={classRoom.label}
                                      label={classRoom.label}
                                    >
                                      {classRoom.options.map(option => (
                                        <option
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </option>
                                      ))}
                                    </optgroup>
                                  ))}
                                </Input>
                                {/* {touched.qb_class &&
                                errors.qb_class ? (
                                  <FormFeedback type="invalid">
                                    {errors.qb_class}
                                  </FormFeedback>
                                ) : null} */}
                              </Col>

                              {/* <Col md={6} sm={10} xs={12} className="mb-3">
                                <Label className="form-label">
                                  Select Class{" "}
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="qb_classRoomm"
                                  type="select"
                                  className="form-select"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.qb_classRoomm || 0}
                                  invalid={
                                    touched.qb_classRoomm &&
                                    errors.qb_classRoomm
                                      ? true
                                      : false
                                  }
                                >
                                  <option value={0} disabled>
                                    Select Class
                                  </option>
                                  {Array.isArray(classRoomType) &&
                                    classRoomType.map(val => {
                                      if (
                                        typeof val === "string" ||
                                        typeof val === "number"
                                      ) {
                                        return (
                                          <option key={val} value={val}>
                                            {val}
                                          </option>
                                        )
                                      } else {
                                        return null
                                      }
                                    })}
                                </Input>
                                {touched.qb_classRoomm &&
                                errors.qb_classRoomm ? (
                                  <FormFeedback type="invalid">
                                    {errors.qb_classRoomm}
                                  </FormFeedback>
                                ) : null}
                              </Col> */}

                              <Col
                                md={6}
                                sm={6}
                                xs={12}
                                className="mt-md-0 mb-3"
                              >
                                <Label className="form-label">
                                  Subject <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="qb_subject"
                                  type="select"
                                  className="form-select"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.qb_subject || 0}
                                  invalid={
                                    touched.qb_subject && errors.qb_subject
                                      ? true
                                      : false
                                  }
                                >
                                  <option disabled value={0}>
                                    Select Subject
                                  </option>
                                  {subjects.map(val => {
                                    return (
                                      <option key={val} value={val}>
                                        {val}
                                      </option>
                                    )
                                  })}
                                </Input>
                                {touched.qb_subject && errors.qb_subject && (
                                  <FormFeedback>
                                    {errors.qb_subject}
                                  </FormFeedback>
                                )}
                              </Col>
                              <Col
                                md={12}
                                sm={12}
                                xs={12}
                                className="mt-2 mb-3"
                              >
                                <Label className="form-label">
                                  Question Title{" "}
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="qb_questionTitle"
                                  type="text"
                                  placeholder="Enter the Question Title"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={
                                    touched.qb_questionTitle &&
                                    errors.qb_questionTitle
                                  }
                                  defaultValue={values.qb_questionTitle}
                                />
                                {touched.qb_questionTitle &&
                                  errors.qb_questionTitle && (
                                    <FormFeedback>
                                      {errors.qb_questionTitle}
                                    </FormFeedback>
                                  )}
                              </Col>

                              <Col md={6} sm={6} xs={12} className="mt-2 mb-3">
                                <Label className="form-label">
                                  Option 1{" "}
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="qb_option1"
                                  type="text"
                                  placeholder="Enter Option 1"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={
                                    touched.qb_option1 && errors.qb_option1
                                  }
                                  defaultValue={values.qb_option1}
                                />
                                {touched.qb_option1 && errors.qb_option1 && (
                                  <FormFeedback>
                                    {errors.qb_option1}
                                  </FormFeedback>
                                )}
                              </Col>

                              <Col md={6} sm={6} xs={12} className="mt-2 mb-3">
                                <Label className="form-label">
                                  Option 2{" "}
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="qb_option2"
                                  type="text"
                                  placeholder="Enter Option 2"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={
                                    touched.qb_option2 && errors.qb_option2
                                  }
                                  defaultValue={values.qb_option2}
                                />
                                {touched.qb_option2 && errors.qb_option2 && (
                                  <FormFeedback>
                                    {errors.qb_option2}
                                  </FormFeedback>
                                )}
                              </Col>

                              <Col md={6} sm={6} xs={12} className="mt-2 mb-3">
                                <Label className="form-label">
                                  Option 3{" "}
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="qb_option3"
                                  type="text"
                                  placeholder="Enter Option 3"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={
                                    touched.qb_option3 && errors.qb_option3
                                  }
                                  defaultValue={values.qb_option3}
                                />
                                {touched.qb_option3 && errors.qb_option3 && (
                                  <FormFeedback>
                                    {errors.qb_option3}
                                  </FormFeedback>
                                )}
                              </Col>

                              <Col md={6} sm={6} xs={12} className="mt-2 mb-3">
                                <Label className="form-label">
                                  Option 4{" "}
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="qb_option4"
                                  type="text"
                                  placeholder="Enter Option 4"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={
                                    touched.qb_option4 && errors.qb_option4
                                  }
                                  defaultValue={values.qb_option4}
                                />
                                {touched.qb_option4 && errors.qb_option4 && (
                                  <FormFeedback>
                                    {errors.qb_option4}
                                  </FormFeedback>
                                )}
                              </Col>

                              <Col
                                md={12}
                                sm={12}
                                xs={12}
                                className="mt-2 mb-3"
                              >
                                <Col sm={12} md={6} className="mt-2 mt-md-0">
                                  <Row className="mt-2">
                                    <Label className="form-label">
                                      Correct Answer{" "}
                                      <span className="text-danger">*</span>
                                    </Label>
                                    <Col className="d-flex gap-3">
                                      <RBSForm.Check
                                        id="option1"
                                        name="qb_correctAnswer"
                                        type="radio"
                                        label="Option1"
                                        onChange={event => {
                                          let temp = form
                                          let option = event.target.value
                                          temp["qb_correctAnswer"] = option
                                          values["qb_correctAnswer"] = option
                                          setForm(temp)
                                        }}
                                        value="Option1"
                                        invalid={
                                          touched.qb_correctAnswer &&
                                          errors.qb_correctAnswer
                                            ? true
                                            : false
                                        }
                                      />
                                      <RBSForm.Check
                                        id="option2"
                                        name="qb_correctAnswer"
                                        type="radio"
                                        label="Option2"
                                        onChange={event => {
                                          let temp = form
                                          let option = event.target.value
                                          temp["qb_correctAnswer"] = option
                                          values["qb_correctAnswer"] = option
                                          setForm(temp)
                                        }}
                                        value="Option2"
                                        invalid={
                                          touched.qb_correctAnswer &&
                                          errors.qb_correctAnswer
                                            ? true
                                            : false
                                        }
                                      />
                                      <RBSForm.Check
                                        id="option3"
                                        name="qb_correctAnswer"
                                        type="radio"
                                        label="Option3"
                                        onChange={event => {
                                          let temp = form
                                          let option = event.target.value
                                          temp["qb_correctAnswer"] = option
                                          values["qb_correctAnswer"] = option
                                          setForm(temp)
                                        }}
                                        value="Option3"
                                        invalid={
                                          touched.qb_correctAnswer &&
                                          errors.qb_correctAnswer
                                            ? true
                                            : false
                                        }
                                      />
                                      <RBSForm.Check
                                        id="option4"
                                        name="qb_correctAnswer"
                                        type="radio"
                                        label="Option4"
                                        onChange={event => {
                                          let temp = form
                                          let option = event.target.value
                                          temp["qb_correctAnswer"] = option
                                          values["qb_correctAnswer"] = option
                                          setForm(temp)
                                        }}
                                        value="Option4"
                                        invalid={
                                          touched.qb_correctAnswer &&
                                          errors.qb_correctAnswer
                                            ? true
                                            : false
                                        }
                                      />
                                    </Col>
                                    {apiErrors?.qb_correctAnswer && (
                                      <div className="invalid-react-select-dropdown">
                                        {apiErrors?.qb_correctAnswer}
                                      </div>
                                    )}
                                  </Row>
                                </Col>
                              </Col>
                            </Row>

                            <Row className="mb-3"></Row>

                            <Row className="mb-3 text-center">
                              <Col>
                                <Button size="md" color="dark" type="submit">
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
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </React.Fragment>
  )
}

QuestionBankModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
}

export default QuestionBankModal
