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

import RemarkModal from "./ViewModal"

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

import { remarkOfStudent } from "../../common/data/remarks"

import { SimpleStringValue } from "helpers/common_helper_functions"
import { studentList } from "common/data/dropdownVals"
import {
  createStudentRemark,
  updateStudentRemark,
  deleteStudentRemark,
  getAllStudentRemark,
  getStudentRemark,
} from "helpers/backendHelpers/studentRemark"

import { getAllSchoolTeachers } from "helpers/backendHelpers/schoolTeachers"
import { getAllStudents } from "helpers/backendHelpers/students"

import SubmitLoader from "common/SubmitLoader"

const Remark = () => {
  document.title = "Remark | LMS Ghana"

  const [modal, setModal] = useState(false)
  const [modal1, setModal1] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [remark, setRemark] = useState("")
  const [remarks, setRemarks] = useState([])
  const [submitLoading, setsubmitLoading] = useState(false)

  const [loading, setLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)

  const [classTeacherDropdown, setClassTeacherDropdown] = useState([])
  const [studentDropdown, setStudentDropdown] = useState([])

  const [save, setSave] = useState(false)

  useEffect(() => {
    getAllStudentRemarks()
    setClassTeacherDropdownValues()
    setStudentDropdownValues()
  }, [save])

  const getAllStudentRemarks = async () => {
    try {
      setLoading(true)
      let response = await getAllStudentRemark()
      let { studentRemark } = response.data || {}
      studentRemark = studentRemark || []
      setRemarks(studentRemark)
      setLoading(false)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching studentRemarks"
      setRemarks([])
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

  const setStudentDropdownValues = async () => {
    try {
      let response = await getAllStudents()
      let { students } = response.data || {}
      students = students || []
      setStudentDropdown(students)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching class students"
      setStudentDropdown([])
      return SaveToast({ message, type: "error" })
    }
  }

  const handleAddStudentRemarkSubmit = async data => {
    try {
      setsubmitLoading(true)
      let response = await createStudentRemark(data)
      let message = response?.message || "StudentRemark Created Successfully"
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
        "There was a problem creating StudentRemark"
      setsubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleEditStudentRemarkSubmit = async (id, data) => {
    if (!id) {
      return SaveToast({
        message: "Please enter studentRemark id",
        type: "error",
      })
    }

    try {
      setsubmitLoading(true)
      let response = await updateStudentRemark(id, data)
      let message = response?.message || "studentRemark Updated Successfully"
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
        "There was a problem creating studentRemark"
      setsubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      sr_studentId: (remark && remark.sr_studentId) || "",
      sr_teacherId: (remark && remark.sr_teacherId) || "",
      sr_remarks: (remark && remark.sr_remarks) || "",
    },
    validationSchema: Yup.object({
      sr_studentId: Yup.string().required("Please Select StudentName "),
      sr_teacherId: Yup.string().required("Please Select TeacherName "),
      sr_remarks: Yup.string().required("Please Enter Remark"),
    }),
    onSubmit: values => {
      let studentRemark = values
      if (isEdit) {
        delete studentRemark["sr_id"]
        return handleEditStudentRemarkSubmit(remark.sr_id, studentRemark)
      } else {
        return handleAddStudentRemarkSubmit(studentRemark)
      }
    },
  })

  const onClickDelete = remark => {
    setRemark(remark)
    setDeleteModal(true)
  }

  const toggleViewModal = () => {
    if (modal1) {
      setRemark({})
    }
    setModal1(!modal1)
    if (remark) {
      setRemark(null)
    }
  }

  const toggle = () => {
    if (modal) {
      setModal(false)
      setRemark(null)
    } else {
      setModal(true)
    }
  }

  const handleDeleteModalCloseClick = () => {
    setDeleteModal(false)
    setRemark({})
  }

  const handleStudentRemarkClick = async arg => {
    let remark = arg
    const resp = await getStudentRemark(remark.sr_id)
    const studentRemark = resp.data.studentRemark
    setRemark({
      sr_id: studentRemark.sr_id,
      sr_remarks: studentRemark.sr_remarks,
      sr_teacherId: studentRemark.sr_teacherId,
      sr_studentId: studentRemark.sr_studentId,
    })

    setIsEdit(true)
    toggle()
  }

  const handleDeleteStudentRemark = async () => {
    if (!remark.sr_id) {
      return SaveToast({ message: "Invalid StudentRemark ID", type: "error" })
    }

    try {
      const response = await deleteStudentRemark(remark.sr_id)
      let message = response?.message || "StudentRemark deleted successfully"
      SaveToast({ message, type: "success" })

      setSave(prevSave => !prevSave)
      setDeleteModal(false)
      setRemark({})
      return
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem deleting studentRemark"
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
        Header: "Student",
        accessor: "sr_student.st_fullName",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Teacher",
        accessor: "sr_teacher.tc_fullName",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Remark",
        accessor: "sr_remarks",
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
                  setRemark(cellProps.row.original)
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
                  const remarkData = cellProps.row.original
                  handleStudentRemarkClick(remarkData)
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
                  const remarkData = cellProps.row.original
                  onClickDelete(remarkData)
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
      <RemarkModal isOpen={modal1} toggle={toggleViewModal} remark={remark} />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteStudentRemark}
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
                    data={remarks}
                    isGlobalFilter={true}
                    isAddOptions={true}
                    handleAddButtonClick={handleAddButtonClick}
                    addButtonLabel={"Add Remarks"}
                    customPageSize={10}
                    className="custom-header-css"
                    canExportCsv={true}
                    canPrint={false}
                    docHeader={"StudentRemark | LMS Ghana"}
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
              {!!isEdit ? "Edit Remark" : "Add Remark"}
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
                        Select Student <span className="text-danger">*</span>
                      </Label>
                      <Input
                        name="sr_studentId"
                        type="select"
                        className="form-select"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.sr_studentId || 0}
                        invalid={
                          validation.touched.sr_studentId &&
                          validation.errors.sr_studentId
                            ? true
                            : false
                        }
                      >
                        <option value="0" disabled>
                          Select Student
                        </option>
                        {studentDropdown.map(val => {
                          return (
                            <option key={val.st_id} value={val.st_id}>
                              {val.st_fullName}
                            </option>
                          )
                        })}
                      </Input>
                      {validation.touched.sr_studentId &&
                      validation.errors.sr_studentId ? (
                        <FormFeedback type="invalid">
                          {validation.errors.sr_studentId}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label className="form-label">
                        Select Teacher <span className="text-danger">*</span>
                      </Label>
                      <Input
                        name="sr_teacherId"
                        type="select"
                        className="form-select"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.sr_teacherId || 0}
                        invalid={
                          validation.touched.sr_teacherId &&
                          validation.errors.sr_teacherId
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
                      {validation.touched.sr_teacherId &&
                      validation.errors.sr_teacherId ? (
                        <FormFeedback type="invalid">
                          {validation.errors.sr_teacherId}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label className="form-label">
                        Remark <span className="text-danger">*</span>
                      </Label>
                      <Input
                        name="sr_remarks"
                        type="textarea"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.sr_remarks || ""}
                        invalid={
                          validation.touched.sr_remarks &&
                          validation.errors.sr_remarks
                            ? true
                            : false
                        }
                      />
                      {validation.touched.sr_remarks &&
                      validation.errors.sr_remarks ? (
                        <FormFeedback type="invalid">
                          {validation.errors.sr_remarks}
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
Remark.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
}

export default Remark
