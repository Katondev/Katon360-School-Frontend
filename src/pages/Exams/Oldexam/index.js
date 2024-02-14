import React, { useEffect, useMemo, useState } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import "../../../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import TableContainer from "../../../components/Common/TableContainer"
import * as Yup from "yup"
import { useFormik } from "formik"
import DeleteModal from "../../../components/Common/DeleteModal"
import { SaveToast } from "components/Common/SaveToast"
import TeacherModal from "../../Notification/AddEditDetails"
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

import { oldexams } from "../../../common/data/oldexams"
// import { examOld Exam } from "../../../"
import {
  classRoomTypeStatic,
  standard as classesDropdown,
} from "../../../common/data/dropdownVals"
import { subjects as subjectDropdown } from "../../../common/data/dropdownVals"

import {
  ClassRoomValue,
  SimpleStringValue,
} from "helpers/common_helper_functions"
import { exams } from "common/data/exams"
import { getAllClassroom } from "helpers/backendHelpers/classroom"
import { getAllExam } from "helpers/backendHelpers/exam"
import {
  createOldExamPaper,
  deleteOldExamPaper,
  getAllOldExamPaper,
  updateOldExamPaper,
} from "helpers/backendHelpers/oldExamPaper"

import { IMAGE_URL } from "helpers/urlHelper"

function Exam() {
  document.title = "OldExamPaper | LMS Ghana"

  const [modal, setModal] = useState(false)
  const [modal1, setModal1] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

  const [loading, setLoading] = useState(false)
  const [classroomDropdownValues, setClassroomDropdownValues] = useState([])
  const [examDropdownValues, setExamDropdownValues] = useState([])

  const [submitLoading, setsubmitLoading] = useState(false)

  const [deleteModal, setDeleteModal] = useState(false)

  const [exam, setExam] = useState(null)

  const [oldExamPapers, setOldExamPapers] = useState([])
  const [save, setSave] = useState(false)

  useEffect(() => {
    getAllOldExamPapers()
    fetchClassroomDropDownValues()
    fetchExamDropDownValues()
  }, [save])

  const getAllOldExamPapers = async () => {
    try {
      setLoading(true)
      let response = await getAllOldExamPaper()
      let { examSchedule } = response.data || {}
      examSchedule = examSchedule || []
      setOldExamPapers(examSchedule)
      setLoading(false)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching ExamPaper"
      setOldExamPapers([])
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

  const handleAddOldExamPaperSubmit = async data => {
    try {
      setsubmitLoading(true)
      let response = await createOldExamPaper(data)
      let message = response?.message || "OldExamPaper Created Successfully"
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
        "There was a problem creating oldExamPaper"
      setsubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }
  const handleEditOldExamPaperSubmit = async (id, data) => {
    if (!id) {
      return SaveToast({
        message: "Please enter OldExamPaper id",
        type: "error",
      })
    }

    try {
      setsubmitLoading(true)
      let response = await updateOldExamPaper(id, data)
      let message = response?.message || "OldExamPaper Updated Successfully"
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
        "There was a problem creating oldExamPaper"
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
      et_oldExamPaper:
        (exam && exam.et_oldExamPaper: { fileName: "", file: {} }) || "",
    },
    validationSchema: Yup.object({
      et_classId: Yup.string().required("Please Select Class"),
      et_subject: Yup.string().required("Please Select Subject"),
      et_examId: Yup.string().required("Please Select Exam"),
      et_oldExamPaper: Yup.mixed().test(
        "fileFormat",
        "Unsupported Format",
        value => {
          if (!(value && value.file && value.file.type)) return true
          return [
            "image/png",
            "image/jpg",
            "image/jpeg",
            "image/gif",
            "application/pdf",
          ].includes(value.file.type)
        }
      ),
    }),
    onSubmit: values => {
      let oldExamPaper = values
      oldExamPaper.et_oldExamPaper = oldExamPaper?.et_oldExamPaper?.file
      // oldExamPaper["et_classId"] = "3"
      if (isEdit) {
        delete oldExamPaper["et_id"]
        // oldExamPaper["et_oldExamPaper_old"] = exam.et_oldExamPaper_old
        // oldExamPaper["et_oldExamPaper"] = exam.et_oldExamPaper.file
        return handleEditOldExamPaperSubmit(exam.et_id, oldExamPaper)
      } else {
        // oldExamPaper["et_oldExamPaper"] = exam.et_oldExamPaper.file
        return handleAddOldExamPaperSubmit(oldExamPaper)
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
      et_examId: exam.et_examId,
      et_classId: exam.et_classId,
      et_oldExamPaper: exam.et_oldExamPaper,
    })
    setIsEdit(true)
    toggle()
  }

  const onClickDelete = exam => {
    setExam(exam)
    setDeleteModal(true)
  }

  const handleDeleteOldExamPaper = async () => {
    if (!exam.et_id) {
      return SaveToast({ message: "Invalid OldExamPaper ID", type: "error" })
    }

    try {
      const response = await deleteOldExamPaper(exam.et_id)
      let message = response?.message || "OldExamPaper deleted successfully"
      SaveToast({ message, type: "success" })

      setSave(prevSave => !prevSave)
      setDeleteModal(false)
      setExam({})
      return
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem deleting OldExamPaper"
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
          // return classRoomTypeStatic.map(option => {
          //   return option.options.map(data => {
          //     if (cellProps.value === data.value) {
          //       return data.label
          //     }
          //   })
          // })
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
        Header: "Old Exam Paper",
        accessor: "et_oldExamPaper",
        filterable: true,
        Cell: cellProps => {
          return cellProps?.row?.original?.et_oldExamPaper ? (
            <a
              href={IMAGE_URL + "/" + cellProps?.row?.original?.et_oldExamPaper}
              target="#"
            >
              View Paper
            </a>
          ) : (
            <p>Not Available</p>
          )
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
                  const examData = cellProps.row.original
                  setExam(examData)
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
                  const oldExamData = cellProps.row.original
                  handleExamClick(oldExamData)
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
                  const oldExamData = cellProps.row.original
                  onClickDelete(oldExamData)
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
        onDeleteClick={handleDeleteOldExamPaper}
        onCloseClick={handleDeleteModalCloseClick}
      />
      <AddEditExamModal
        isOpen={modal}
        toggle={toggle}
        isEdit={isEdit}
        validation={validation}
        classDropDownVals={classroomDropdownValues}
        examDropDownVals={examDropdownValues}
        submitLoading={submitLoading}
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
                    data={oldExamPapers}
                    isGlobalFilter={true}
                    isAddOptions={true}
                    handleAddButtonClick={handleAddButtonClick}
                    addButtonLabel={"Add Old Exam"}
                    customPageSize={10}
                    className="custom-header-css"
                    dataFetchLoading={loading}
                    noDataMessage="No system activity found."
                    canExportCsv={true}
                    canPrint={false}
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
