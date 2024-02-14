import React, { useMemo, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import TableContainer from "../../components/Common/TableContainer"

//import components
import DeleteModal from "../../components/Common/DeleteModal"

import {
  SimpleStringValue,
  ClassRoomValue,
} from "helpers/common_helper_functions"

import {
  Col,
  Row,
  UncontrolledTooltip,
  Card,
  CardBody,
  Modal,
  Input,
  Label,
  FormFeedback,
  ModalHeader,
  ModalBody,
  Form,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap"
import StudentAttendance from "./Attendance/index"
import {
  getAllStudents,
  deleteStudent,
  updateStudent,
  getAllStudentsBySchool,
  getAllStudentsByTeacher,
} from "helpers/backendHelpers/students"
import { SaveToast } from "components/Common/SaveToast"
import SubmitLoader from "common/SubmitLoader"
import { useFormik } from "formik"
import * as Yup from "yup"
import {
  createStudentRemark,
  createStudentRemarkByStudent,
  getStudentRemark,
  getStudentRemarkByStudent,
  updateStudentRemark,
  updateStudentRemarkByStudent,
} from "helpers/backendHelpers/studentRemark"
import { getTeacherInfo, getUserTypeInfo } from "helpers/authHelper"
import { getAllClassroomByClassRoomId } from "helpers/backendHelpers/classroom"
import {
  getTeacher,
  getTeacherByTeacherId,
} from "helpers/backendHelpers/schoolTeachers"

const Students = props => {
  // document.title = "Students | LMS Ghana"

  const [deleteModal, setDeleteModal] = useState(false)
  const [students, setStudents] = useState([])
  const [classRooms, setClassRooms] = useState([])
  const [classRoomIds, setClassRoomIds] = useState([])
  const [student, setStudent] = useState({})
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [modal, setModal] = useState(false)
  const [remark, setRemark] = useState("")
  const [submitLoading, setsubmitLoading] = useState(false)
  const userType = JSON.parse(localStorage.getItem("userInfoSchool"))
  const userInfo = JSON.parse(localStorage.getItem("teacherInfo"))
  const [save, setSave] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [studentId, setStudentId] = useState("")
  const [activeClassRoomTab, setActiveClassRoomTab] = useState(1)

  useEffect(() => {
    fetchAllStudents()
    fetchTeacherDetails()
  }, [saved])

  useEffect(() => {
    if (classRoomIds && classRoomIds.length > 0) {
      fetchAllClassRoomByClassRoomId(classRoomIds)
    }
  }, [classRoomIds])

  useEffect(() => {
    fetchAllStudentsByClassRoomId(activeClassRoomTab)
  }, [activeClassRoomTab])

  const fetchAllStudents = async () => {
    try {
      let body = {
        sc_id: userType?.sc_id,
        tc_classRoomId: JSON.stringify(userInfo?.tc_classRoomId),
      }
      console.log("userInfo11", userInfo)
      setLoading(true)
      let response = await getAllStudentsByTeacher(body)
      let { students } = response.data
      students = students || []
      setStudents(students)

      setLoading(false)
    } catch (error) {
      let message = error?.message || "There was problem fetching students"
      setStudents([])
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const fetchAllStudentsByClassRoomId = async activeClassRoomTab => {
    try {
      let body = {
        sc_id: userType?.sc_id,
        tc_classRoomId: JSON.stringify(activeClassRoomTab),
      }
      console.log("body11", body)
      setLoading(true)
      let response = await getAllStudentsByTeacher(body)
      let { students } = response.data
      students = students || []
      setStudents(students)

      setLoading(false)
    } catch (error) {
      let message = error?.message || "There was problem fetching students"
      setStudents([])
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const fetchTeacherDetails = async () => {
    try {
      setLoading(true)
      let response = await getTeacherByTeacherId(userInfo?.tc_id)
      let { teacher } = response.data
      setClassRoomIds(teacher?.tc_classRoomId)
    } catch (error) {
      let message = error?.message || "There was problem fetching students"
      setStudents([])
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const fetchAllClassRoomByClassRoomId = async classRoomIds => {
    try {
      let body = {
        cr_id: JSON.stringify(classRoomIds),
      }
      setLoading(true)
      let response = await getAllClassroomByClassRoomId(body)
      let { classRooms } = response.data
      setClassRooms(classRooms)
      setActiveClassRoomTab(classRooms[0]?.cr_id)
      setLoading(false)
    } catch (error) {
      let message = error?.message || "There was problem fetching ClassRooms"
      setClassRooms([])
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleUpdateStudentStatus = async (st_id, st_status) => {
    if (!st_id) {
      return SaveToast({
        message: "Please Enter Student Id",
        type: "error",
      })
    }
    try {
      const response = await updateStudent(st_id, { st_status: st_status })
      const message = response?.message || "Student Status Updated Successfully"
      SaveToast({ message, type: "success" })
      setSaved(prevSaved => !prevSaved)
      return
    } catch (error) {
      const message =
        error?.message || "There Was A Problem Updating Student Status"
      return SaveToast({ message, type: "error" })
    }
  }

  const onClickDelete = student => {
    setStudent(student)
    setDeleteModal(true)
  }

  const handleDeleteStudent = async () => {
    if (!student.st_id) {
      return SaveToast({ message: "Invalid Student Id", type: "error" })
    }
    try {
      let body = {
        sc_id: userType?.sc_id,
      }
      let response = await deleteStudent(student.st_id, body)
      let message = response?.message || "Student deleted successfully."
      SaveToast({ message, type: "success" })
      setSaved(prevSaved => !prevSaved)
      setDeleteModal(false)
      return
    } catch (error) {
      let message = error?.message || "There was problem deleting student"
      SaveToast({ message, type: "error" })
      setDeleteModal(false)
    }
  }

  const handleAddButtonClick = () => {
    props.history.push("/students/add")
  }

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      sr_studentId: (studentId && studentId) || "",
      sr_teacherId: (userType?.tc_id && userType?.tc_id) || "",
      sr_remarks: (remark && remark.sr_remarks) || "",
    },
    validationSchema: Yup.object({
      sr_remarks: Yup.string().required("Please Enter Remark"),
    }),
    onSubmit: values => {
      let studentRemark = values
      studentRemark["sr_teacherId"] = userType?.tc_id
      if (isEdit) {
        delete studentRemark["sr_id"]
        return handleEditStudentRemarkSubmit(remark.sr_id, studentRemark)
      } else {
        return handleAddStudentRemarkSubmit(studentRemark)
      }
    },
  })

  const handleAddStudentRemarkSubmit = async data => {
    try {
      setsubmitLoading(true)
      let response = await createStudentRemarkByStudent(userType?.sc_id, data)
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
      let response = await updateStudentRemarkByStudent(
        id,
        data,
        userType?.sc_id
      )
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

  const handleStudentRemarkClick = async arg => {
    let remark = arg
    setStudentId(remark.st_id)
    const resp = await getStudentRemarkByStudent(remark.st_id)
    if (resp.isFound) {
      setIsEdit(true)
      toggle()
      const studentRemark = resp.data.studentRemark
      setRemark({
        sr_id: studentRemark.sr_id,
        sr_remarks: studentRemark.sr_remarks,
        sr_teacherId: studentRemark.sr_teacherId,
        sr_studentId: studentRemark.sr_studentId,
      })
    } else {
      setIsEdit(false)
      toggle()
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

  const columns = useMemo(
    () => [
      {
        Header: "Classroom",
        accessor: "st_classRoom",
        filterable: true,
        Cell: cellProps => {
          return cellProps.value ? <ClassRoomValue {...cellProps} /> : ""
        },
      },
      {
        Header: "Full Name",
        accessor: "st_fullName",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Region",
        accessor: "st_region",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Phone Number",
        accessor: "st_phoneNumber",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Status",
        accessor: "st_status",
        disableFilters: true,
        Cell: cellProps => {
          const cellData = cellProps.row.original
          return (
            <div className="form-check form-switch form-switch-md">
              <input
                type="checkbox"
                className="form-check-input"
                id={`st_status_checkbox-${cellData.st_id}`}
                name={`st_status_checkbox-${cellData.st_id}`}
                defaultChecked={cellData.st_status}
                onChange={e => {
                  let { checked, name } = e.target
                  document.getElementById(name).checked = checked
                  return handleUpdateStudentStatus(cellData.st_id, checked)
                }}
              />
            </div>
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
                  props.history.push(
                    "/student-details/" + cellProps.row.original.st_id
                  )
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
                  props.history.push(
                    "/students/edit/" + cellProps.row.original.st_id
                  )
                }}
              >
                <i className="mdi mdi-pencil font-size-18" id="edittooltip" />

                <UncontrolledTooltip placement="top" target="edittooltip">
                  Edit
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
                <i
                  className="mdi mdi-pencil-box-outline font-size-18"
                  id="remarkToolTip"
                />
                <UncontrolledTooltip placement="top" target="remarkToolTip">
                  Remark
                </UncontrolledTooltip>
              </Link>
              <Link
                to="#"
                className="text-danger"
                onClick={() => {
                  const teacherData = cellProps.row.original
                  onClickDelete(teacherData)
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
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteStudent}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Nav tabs>
            {classRooms.length > 0 &&
              classRooms.map((data, i) => {
                return (
                  <NavItem key={i}>
                    <NavLink
                      className={activeClassRoomTab === data.cr_id && "active"}
                      onClick={() => {
                        setActiveClassRoomTab(data.cr_id)
                      }}
                    >
                      {data.cr_class}-{data.cr_division}
                    </NavLink>
                  </NavItem>
                )
              })}
          </Nav>
          <TabContent activeTab={activeClassRoomTab}>
            {classRooms.length > 0 ? (
              classRooms.map((data, i) => {
                return (
                  <TabPane tabId={data.cr_id} key={i}>
                    <Row className="mt-3">
                      <Col>
                        <Card>
                          <Row>
                            <Col xs="12">
                              <Card>
                                <CardBody>
                                  <TableContainer
                                    columns={columns}
                                    data={students}
                                    isGlobalFilter={true}
                                    isAddOptions={true}
                                    addButtonLabel="Add Student"
                                    handleAddButtonClick={handleAddButtonClick}
                                    customPageSize={10}
                                    className="custom-header-css"
                                    canExportCsv={true}
                                    canPrint={false}
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
                            style={
                              submitLoading ? { position: "relative" } : {}
                            }
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
                                        Remark{" "}
                                        <span className="text-danger">*</span>
                                      </Label>
                                      <Input
                                        name="sr_remarks"
                                        type="textarea"
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={
                                          validation.values.sr_remarks || ""
                                        }
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
                        </Card>
                      </Col>
                    </Row>
                  </TabPane>
                )
              })
            ) : (
              <h4 className="text-center">No system activity found</h4>
            )}
          </TabContent>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Students
