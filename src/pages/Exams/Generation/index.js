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

import { exams } from "../../../common/data/exams"
import { SimpleStringValue } from "helpers/common_helper_functions"
import {
  createExam,
  deleteExam,
  getAllExam,
  updateExam,
} from "helpers/backendHelpers/exam"
function Exam() {
  document.title = "Exam | LMS Ghana"

  const [modal, setModal] = useState(false)
  const [modal1, setModal1] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitLoading, setsubmitLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)

  const [exam, setExam] = useState(null)
  const [exams, setExams] = useState([])

  const [save, setSave] = useState(false)

  useEffect(() => {
    getAllExams()
  }, [save])

  const getAllExams = async () => {
    try {
      setLoading(true)
      let response = await getAllExam()
      let { exams } = response.data || {}
      exams = exams || []
      setExams(exams)
      setLoading(false)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching Exams"
      setExams([])
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleAddExamSubmit = async data => {
    try {
      setsubmitLoading(true)
      let response = await createExam(data)
      let message = response?.message || "Exam Created Successfully"
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
        "There was a problem creating exam"
      setsubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleEditExamSubmit = async (id, data) => {
    if (!id) {
      return SaveToast({
        message: "Please enter exam id",
        type: "error",
      })
    }

    try {
      setsubmitLoading(true)
      let response = await updateExam(id, data)
      let message = response?.message || "Exam Updated Successfully"
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
        "There was a problem creating exam"
      setsubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      ex_examTitle: (exam && exam.ex_examTitle) || "",
      ex_startDate: (exam && exam.ex_startDate) || "",
      ex_endDate: (exam && exam.ex_endDate) || "",
      ex_totalMarks: (exam && exam.ex_totalMarks) || "",
    },
    validationSchema: Yup.object({
      ex_examTitle: Yup.string().required("Please Enter Title"),
      ex_startDate: Yup.date().required("Please Enter Exam Start Date "),
      ex_endDate: Yup.date().required("Please Enter Exam End Date "),
      ex_totalMarks: Yup.number()
        .required("Please Enter Total Marks")
        .min(10, "Total Marks Must Between 10 To 1000")
        .max(1000, "Total Marks  Must Between 10 To 1000"),
    }),
    onSubmit: values => {
      let examData = values
      if (isEdit) {
        delete examData["ex_id"]
        return handleEditExamSubmit(exam.ex_id, examData)
      } else {
        return handleAddExamSubmit(examData)
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
      ex_id: exam.ex_id,
      ex_examTitle: exam.ex_examTitle,
      ex_startDate: exam.ex_startDate,
      ex_totalMarks: exam.ex_totalMarks,
      ex_endDate: exam.ex_endDate,
    })
    setIsEdit(true)
    toggle()
  }

  const onClickDelete = exam => {
    setExam(exam)
    setDeleteModal(true)
  }

  const handleDeleteExam = async () => {
    if (!exam.ex_id) {
      return SaveToast({ message: "Invalid Exam ID", type: "error" })
    }

    try {
      const response = await deleteExam(exam.ex_id)
      let message = response?.message || "Exam deleted successfully"
      SaveToast({ message, type: "success" })

      setSave(prevSave => !prevSave)
      setDeleteModal(false)
      setExam({})
      return
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem deleting Exam"
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
        Header: "Title",
        accessor: "ex_examTitle",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Start date",
        accessor: "ex_startDate",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "End date",
        accessor: "ex_endDate",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Total marks",
        accessor: "ex_totalMarks",
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
                  const examGenData = cellProps.row.original
                  handleExamClick(examGenData)
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
                  const examGenData = cellProps.row.original
                  onClickDelete(examGenData)
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
        onDeleteClick={handleDeleteExam}
        onCloseClick={handleDeleteModalCloseClick}
      />
      <AddEditExamModal
        isOpen={modal}
        toggle={toggle}
        isEdit={isEdit}
        validation={validation}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <TableContainer
                    columns={columns}
                    data={exams}
                    isGlobalFilter={true}
                    isAddOptions={true}
                    handleAddButtonClick={handleAddButtonClick}
                    addButtonLabel={"Add Exam"}
                    customPageSize={10}
                    className="custom-header-css"
                    canExportCsv={true}
                    canPrint={false}
                    dataFetchLoading={loading}
                    docHeader={"Exams | LMS Ghana"}
                    noDataMessage="No system activity found."
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

export default Exam
