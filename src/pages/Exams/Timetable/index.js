import React, { useEffect, useMemo, useState } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import { isEmpty } from "lodash"
import { Form as RBSForm } from "react-bootstrap"
import "../../../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import TableContainer from "../../../components/Common/TableContainer"
import * as Yup from "yup"
import { useFormik } from "formik"
import DeleteModal from "../../../components/Common/DeleteModal"
import { SaveToast } from "components/Common/SaveToast"

import ExamModal from "./ViewModal"
import AddEditExamModal from "./AddEditModal"

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

import { examtimetables as RowExamData } from "../../../common/data/examtimetables"
// import { examtimetable } from "../../../"
import { standard as classesDropdown } from "../../../common/data/dropdownVals"
import { subjects as subjectDropdown } from "../../../common/data/dropdownVals"

import {
  ClassRoomValue,
  SimpleStringValue,
} from "helpers/common_helper_functions"
import { exams } from "common/data/exams"
import { getAllClassroom } from "helpers/backendHelpers/classroom"
import {
  createExamTimeTable,
  deleteExamTimeTable,
  getAllExamTimeTable,
  updateExamTimeTable,
} from "helpers/backendHelpers/examTimeTable"
import { getAllExam } from "helpers/backendHelpers/exam"

function ExamTimeTable() {
  document.title = "ExamTimeTable | LMS Ghana"

  const [modal, setModal] = useState(false)
  const [modal1, setModal1] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

  const [loading, setLoading] = useState(false)
  const [classroomDropdownValues, setClassroomDropdownValues] = useState([])
  const [examDropdownValues, setExamDropdownValues] = useState([])

  const [submitLoading, setsubmitLoading] = useState(false)

  const [deleteModal, setDeleteModal] = useState(false)

  const [exam, setExam] = useState(null)
  const [examTimeTables, setExamTimeTables] = useState([])
  const [save, setSave] = useState(false)
  const [selectedClass, setSelectedClass] = useState("")

  useEffect(() => {
    getAllExamSchedule()
    fetchClassroomDropDownValues()
    fetchExamDropDownValues()
  }, [save])

  const getAllExamSchedule = async () => {
    try {
      setLoading(true)
      let response = await getAllExamTimeTable()
      let { examSchedule } = response.data || {}
      examSchedule = examSchedule || []
      let examsScheduleVals = examSchedule
        .filter(exams => {
          return exams.et_status
        })
        .map(exams => {
          return {
            id: exams.ex_id,
            value: exams.ex_examTitle,
          }
        })
      setExamTimeTables(examSchedule)
      setLoading(false)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching ExamTimeTable"
      setExamTimeTables([])
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

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

  const fetchExamDropDownValues = async () => {
    try {
      let response = await getAllExam()
      let { exams } = response.data || {}
      exams = exams || []
      let examsVals = exams
        .filter(exams => {
          return exams.ex_status
        })
        .map(exams => {
          return {
            id: exams.ex_id,
            value: exams.ex_examTitle,
          }
        })

      setExamDropdownValues(examsVals)

      return
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching exams"

      return SaveToast({ message, type: "error" })
    }
  }
  const handleAddExamTimeTableSubmit = async data => {
    try {
      setsubmitLoading(true)
      let response = await createExamTimeTable(data)
      let message = response?.message || "ExamTimeTable Created Successfully"
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
        "There was a problem creating examTimeTable"
      setsubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleEditExamTimeTableSubmit = async (id, data) => {
    if (!id) {
      return SaveToast({
        message: "Please enter ExamTimeTable id",
        type: "error",
      })
    }

    try {
      setsubmitLoading(true)
      let response = await updateExamTimeTable(id, data)
      let message = response?.message || "ExamTimeTable Updated Successfully"
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
        "There was a problem creating examTimeTable"
      setsubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      et_subject: (exam && exam.et_subject) || "",
      et_classId: (exam && exam.et_classId) || "",
      et_examId: (exam && exam.et_examId) || "",
      et_date: (exam && exam.et_date) || "",
      et_marks: (exam && exam.et_marks) || "",
    },
    validationSchema: Yup.object({
      et_classId: Yup.string().required("Please Select Class"),
      et_subject: Yup.string()
        .oneOf(subjectDropdown, "Please Select Valid Subject")
        .required("Please Select Subject"),
      et_examId: Yup.string().required("Please Select Exam"),
      et_date: Yup.date().required("Please Enter Date "),
      et_marks: Yup.number()
        .required("Please Enter Marks")
        .min(10, "Marks Must Between 10 To 1000")
        .max(1000, "Marks Must Between 10 To 1000"),
    }),
    onSubmit: values => {
      let examTimeTableData = values

      if (isEdit) {
        delete examTimeTableData["et_id"]
        return handleEditExamTimeTableSubmit(exam.et_id, examTimeTableData)
      } else {
        return handleAddExamTimeTableSubmit(examTimeTableData)
      }
    },
  })

  const toggleViewModal = () => {
    if (modal1) {
      setExam({})
    }
    setModal1(!modal1)
    if (exam) {
      setExam(null)
    }
  }

  const toggle = () => {
    if (modal) {
      setModal(false)
      setExam(null)
    } else {
      setModal(true)
    }
  }

  const handleExamClick = arg => {
    const exam = arg
    setExam({
      et_id: exam.et_id,
      et_subject: exam.et_subject,
      et_date: exam.et_date,
      et_marks: exam.et_marks,
      et_examId: exam.et_examId,
      et_classId: exam.et_classId,
    })
    setIsEdit(true)
    toggle()
  }

  const onClickDelete = exam => {
    setExam(exam)
    setDeleteModal(true)
  }

  const handleDeleteExamTimeTable = async () => {
    if (!exam.et_id) {
      return SaveToast({ message: "Invalid ExamTimeTable ID", type: "error" })
    }

    try {
      const response = await deleteExamTimeTable(exam.et_id)
      let message = response?.message || "ExamTimeTable deleted successfully"
      SaveToast({ message, type: "success" })

      setSave(prevSave => !prevSave)
      setDeleteModal(false)
      setExam({})
      return
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem deleting ExamTimeTable"
      return SaveToast({ message, type: "error" })
    }
  }

  const handleAddButtonClick = () => {
    setIsEdit(false)
    toggle()
  }

  const handleDeleteModalCloseClick = () => {
    setDeleteModal(false)
    setExam({})
  }

  const columns = useMemo(
    () => [
      {
        Header: "Exam",
        accessor: "et_exam.ex_examTitle",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Class",
        accessor: "et_classId",
        filterable: true,
        Cell: cellProps => {
          return cellProps.value ? <SimpleStringValue {...cellProps} /> : ""
        },
      },
      {
        Header: "Subject",
        accessor: "et_subject",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Date",
        accessor: "et_date",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },

      {
        Header: "Marks",
        accessor: "et_marks",
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
                  setExam(cellProps.row.original)
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
                  const timetableData = cellProps.row.original
                  handleExamClick(timetableData)
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
                  const timetableData = cellProps.row.original
                  onClickDelete(timetableData)
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
      <ExamModal isOpen={modal1} toggle={toggleViewModal} exam={exam} />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteExamTimeTable}
        onCloseClick={handleDeleteModalCloseClick}
      />
      <AddEditExamModal
        isOpen={modal}
        toggle={toggle}
        isEdit={isEdit}
        validation={validation}
        classDropDownVals={classroomDropdownValues}
        examDropDownVals={examDropdownValues}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        exam={exam != null && exam}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <TableContainer
                    columns={columns}
                    data={examTimeTables}
                    isGlobalFilter={true}
                    isAddOptions={true}
                    handleAddButtonClick={handleAddButtonClick}
                    addButtonLabel={"Add Timetable"}
                    customPageSize={10}
                    className="custom-header-css"
                    canExportCsv={true}
                    canPrint={false}
                    dataFetchLoading={loading}
                    noDataMessage="No system activity found."
                    docHeader={"Exam Timetables | LMS Ghana"}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
}

export default ExamTimeTable
