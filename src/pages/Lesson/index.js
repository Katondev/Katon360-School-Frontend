import React, { useEffect, useMemo, useState } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import { isEmpty } from "lodash"
import { Form as RBSForm } from "react-bootstrap"
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import TableContainer from "../../components/Common/TableContainer"
import * as Yup from "yup"
import { useFormik } from "formik"
import DeleteModal from "../../components/Common/DeleteModal"
import { SaveToast } from "components/Common/SaveToast"

import LessonModal from "./ViewModal"

import {
  Col,
  Row,
  UncontrolledTooltip,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Input,
  FormFeedback,
  Label,
  Card,
  CardBody,
} from "reactstrap"

import { lessonNote } from "../../common/data/lesson"

import { SimpleStringValue } from "helpers/common_helper_functions"
import { subjects } from "common/data/dropdownVals"
import {
  createTeacherLesson,
  updateTeacherLesson,
  getAllTeacherLesson,
  getTeacherLesson,
  deleteTeacherLesson,
} from "helpers/backendHelpers/lesson"

import { getAllSchoolTeachers } from "helpers/backendHelpers/schoolTeachers"
import SubmitLoader from "common/SubmitLoader"

const Lesson = () => {
  document.title = "Lesson | LMS Ghana"

  const [modal, setModal] = useState(false)
  const [modal1, setModal1] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [lesson, setLesson] = useState("")
  const [lessons, setLessons] = useState([])

  const [submitLoading, setsubmitLoading] = useState(false)

  const [loading, setLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)

  const [classTeacherDropdown, setClassTeacherDropdown] = useState([])

  const [save, setSave] = useState(false)

  useEffect(() => {
    getAllTeacherLessons()
    setClassTeacherDropdownValues()
  }, [save])

  const getAllTeacherLessons = async () => {
    try {
      setLoading(true)
      let response = await getAllTeacherLesson()
      let { teacherLesson } = response.data || {}
      teacherLesson = teacherLesson || []
      setLessons(teacherLesson)
      setLoading(false)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching teacherLessons"
      setLessons([])
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const setClassTeacherDropdownValues = async () => {
    try {
      let response = await getAllSchoolTeachers()
      let { teachers } = response.data || {}
      teachers = teachers || []
      setClassTeacherDropdown(teachers)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching class teachers"
      setClassTeacherDropdown([])
      return SaveToast({ message, type: "error" })
    }
  }

  const handleAddTeacherLessonSubmit = async data => {
    try {
      setsubmitLoading(true)
      let response = await createTeacherLesson(data)
      let message = response?.message || "TeacherLesson Created Successfully"
      SaveToast({ message, type: "success" })
      validation.resetForm()
      toggle()
      setSave(prevSave => !prevSave)
      setsubmitLoading(false)
      return
    } catch (error) {
      console.log(error)
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem creating TeacherLesson"
      setsubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleEditTeacherLessonkSubmit = async (id, data) => {
    if (!id) {
      return SaveToast({
        message: "Please enter teacherLesson id",
        type: "error",
      })
    }

    try {
      setsubmitLoading(true)
      let response = await updateTeacherLesson(id, data)
      let message = response?.message || "teacherLesson Updated Successfully"
      SaveToast({ message, type: "success" })

      validation.resetForm()
      toggle()
      setSave(prevSave => !prevSave)
      setsubmitLoading(false)
      return
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem creating teacherLesson"
      setsubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      tl_teacherId: (lesson && lesson.tl_teacherId) || "",
      tl_lesson: (lesson && lesson.tl_lesson) || "",
      tl_subject: (lesson && lesson.tl_subject) || "",
    },
    validationSchema: Yup.object({
      tl_teacherId: Yup.string().required("Please Select TeacherName"),
      tl_subject: Yup.string()
        .oneOf(subjects, "Please Select Valid Subject")
        .required("Please Select Subject "),
      tl_lesson: Yup.string().required("Please Enter Lesson"),
    }),
    onSubmit: values => {
      let teacherLessonData = values
      if (isEdit) {
        delete teacherLessonData["tl_id"]
        return handleEditTeacherLessonkSubmit(lesson.tl_id, teacherLessonData)
      } else {
        return handleAddTeacherLessonSubmit(teacherLessonData)
      }
    },
  })

  const onClickDelete = Teacherlesson => {
    setLesson(Teacherlesson)
    setDeleteModal(true)
  }

  const toggleViewModal = () => {
    if (modal1) {
      setLesson({})
    }
    setModal1(!modal1)
    if (lesson) {
      setLesson(null)
    }
  }

  const toggle = () => {
    if (modal) {
      setModal(false)
      setLesson(null)
    } else {
      setModal(true)
    }
  }

  const handleDeleteModalCloseClick = () => {
    setDeleteModal(false)
    setLesson({})
  }

  const handleTeacherLessonClick = async arg => {
    let lesson = arg

    const resp = await getTeacherLesson(lesson.tl_id)
    const teacherLesson = resp.data.teacherLesson
    setLesson({
      tl_id: lesson.tl_id,
      tl_teacherId: teacherLesson.tl_teacherId,
      tl_subject: lesson.tl_subject,
      tl_lesson: lesson.tl_lesson,
    })

    setIsEdit(true)
    toggle()
  }

  const handleDeleteTeacherLesson = async () => {
    if (!lesson.tl_id) {
      return SaveToast({ message: "Invalid TeacherLesson ID", type: "error" })
    }

    try {
      const response = await deleteTeacherLesson(lesson.tl_id)
      let message = response?.message || "TeacherLesson deleted successfully"
      SaveToast({ message, type: "success" })

      setSave(prevSave => !prevSave)
      setDeleteModal(false)
      setLesson({})
      return
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem deleting TeacherLesson"
      return SaveToast({ message, type: "error" })
    }
  }
  const handleAddButtonClick = () => {
    setIsEdit(false)
    toggle()
  }

  const columns = useMemo(
    () => [
      {
        Header: "Teacher",
        accessor: "tl_teacher.tc_fullName",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Lecture",
        accessor: "tl_subject",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Lesson",
        accessor: "tl_lesson",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Action",
        accessor: "action",
        disableFilters: true,
        Cell: cellProps => {
          return (
            <div className="d-flex gap-3">
              <Link
                to="#"
                className="text-dark"
                onClick={() => {
                  setLesson(cellProps.row.original)
                  toggleViewModal()
                }}
              >
                <i className="mdi mdi-eye font-size-18" id="viewtooltip" />
                <UncontrolledTooltip placement="top" target="viewtooltip">
                  View
                </UncontrolledTooltip>
              </Link>
              <Link
                to="#"
                className="text-success"
                onClick={() => {
                  const lessonData = cellProps.row.original
                  handleTeacherLessonClick(lessonData)
                }}
              >
                <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                <UncontrolledTooltip placement="top" target="edittooltip">
                  Edit
                </UncontrolledTooltip>
              </Link>
              <Link
                to="#"
                className="text-danger"
                onClick={() => {
                  const lessonData = cellProps.row.original
                  onClickDelete(lessonData)
                }}
              >
                <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
                <UncontrolledTooltip placement="top" target="deletetooltip">
                  Delete
                </UncontrolledTooltip>
              </Link>
            </div>
          )
        },
      },
    ],
    []
  )

  return (
    <React.Fragment>
      <LessonModal isOpen={modal1} toggle={toggleViewModal} lesson={lesson} />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteTeacherLesson}
        onCloseClick={handleDeleteModalCloseClick}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <TableContainer
                    columns={columns}
                    data={lessons}
                    isGlobalFilter={true}
                    isAddOptions={true}
                    handleAddButtonClick={handleAddButtonClick}
                    addButtonLabel={"Add Lesson"}
                    customPageSize={10}
                    className="custom-header-css"
                    canExportCsv={true}
                    canPrint={true}
                    docHeader={"TeacherLesson | LMS Ghana"}
                    dataFetchLoading={loading}
                    noDataMessage="No system activity found."
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Modal
            isOpen={modal}
            toggle={toggle}
            style={submitLoading ? { position: "relative" } : {}}
          >
            {submitLoading ? <SubmitLoader /> : <></>}
            <ModalHeader toggle={toggle} tag="h4">
              {!!isEdit ? "Edit Lesson" : "Add Lesson"}
            </ModalHeader>
            <ModalBody>
              <Form
                onSubmit={e => {
                  e.preventDefault()
                  validation.handleSubmit()
                  return false
                }}
              >
                <Row>
                  <Col className="col-12">
                    <div className="mb-3">
                      <Label className="form-label">
                        Select Subject <span className="text-danger">*</span>
                      </Label>
                      <Input
                        name="tl_subject"
                        type="select"
                        className="form-select"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.tl_subject || 0}
                        invalid={
                          validation.touched.tl_subject &&
                          validation.errors.tl_subject
                            ? true
                            : false
                        }
                      >
                        <option value="0" disabled>
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
                      {validation.touched.tl_subject &&
                      validation.errors.tl_subject ? (
                        <FormFeedback type="invalid">
                          {validation.errors.tl_subject}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label className="form-label">
                        Select Teacher <span className="text-danger">*</span>
                      </Label>
                      <Input
                        name="tl_teacherId"
                        type="select"
                        className="form-select"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.tl_teacherId || 0}
                        invalid={
                          validation.touched.tl_teacherId &&
                          validation.errors.tl_teacherId
                            ? true
                            : false
                        }
                      >
                        <option value="0" disabled>
                          Select Teacher
                        </option>
                        {classTeacherDropdown.map(val => {
                          return (
                            <option key={val.tc_id} value={val.tc_id}>
                              {val.tc_fullName}
                            </option>
                          )
                        })}
                      </Input>
                      {validation.touched.tl_teacherId &&
                      validation.errors.tl_teacherId ? (
                        <FormFeedback type="invalid">
                          {validation.errors.tl_teacherId}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label className="form-label">
                        Lesson <span className="text-danger">*</span>
                      </Label>
                      <Input
                        name="tl_lesson"
                        type="textarea"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.tl_lesson || ""}
                        invalid={
                          validation.touched.tl_lesson &&
                          validation.errors.tl_lesson
                            ? true
                            : false
                        }
                      />
                      {validation.touched.tl_lesson &&
                      validation.errors.tl_lesson ? (
                        <FormFeedback type="invalid">
                          {validation.errors.tl_lesson}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      <button
                        type="submit"
                        className="btn btn-success save-user"
                      >
                        Save
                      </button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </ModalBody>
          </Modal>
        </div>
      </div>
    </React.Fragment>
  )
}
Lesson.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
}

export default Lesson
