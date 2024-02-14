import React, { useEffect, useMemo, useState } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import TableContainer from "../../components/Common/TableContainer"
import * as Yup from "yup"
import { useFormik } from "formik"
import DeleteModal from "../../components/Common/DeleteModal"
import { SaveToast } from "components/Common/SaveToast"
import ClassroomModal from "./ViewModal"

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

import { classRoomType } from "../../common/data/dropdownVals"
import Select from "react-select"

import { divisions as divisionDropdown } from "../../common/data/dropdownVals"
import { SimpleStringValue } from "helpers/common_helper_functions"
import {
  getAllClassroom,
  createClassroom,
  updateClassroom,
  deleteClassroom,
  getClassroom,
} from "helpers/backendHelpers/classroom"

import {
  getAllSchoolTeachers,
  getAllTeachersBySchool,
} from "helpers/backendHelpers/schoolTeachers"
import SubmitLoader from "common/SubmitLoader"
import { getUserTypeInfo } from "helpers/authHelper"
function Classroom() {
  document.title = "Classroom | LMS Ghana"

  const [modal, setModal] = useState(false)
  const [modal1, setModal1] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [classroom, setClassroom] = useState(null)
  const [classrooms, setClassrooms] = useState([])
  const [loadind, setLoading] = useState(false)
  const [selectedClass, setSelectedClass] = useState("")
  const [submitLoading, setsubmitLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [classTeacherDropdown, setClassTeacherDropdown] = useState([])
  const [exportData, setExportData] = useState([])
  const [save, setSave] = useState(false)
  const userType = getUserTypeInfo()

  useEffect(() => {
    getAllClassrooms()
    setClassTeacherDropdownValues()
  }, [save])

  useEffect(() => {
    const filteredData = classrooms.map(item => {
      const { cr_classTeacher, ...rest } = item
      return rest
    })
    setExportData(filteredData)
  }, [classrooms])

  const getAllClassrooms = async () => {
    try {
      setLoading(true)
      let response = await getAllClassroom()
      let { classRooms } = response.data || {}
      classRooms = classRooms || []
      setClassrooms(classRooms)
      setLoading(false)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching classrooms"
      setClassrooms([])
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const setClassTeacherDropdownValues = async () => {
    try {
      let response = await getAllTeachersBySchool(userType?.sc_id)
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

  const handleAddClassroomSubmit = async data => {
    try {
      setsubmitLoading(true)
      let response = await createClassroom(data)
      let message = response?.message || "classRoom Created Successfully"
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
        "There was a problem creating classroom"
      setsubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleEditClassroomSubmit = async (id, data) => {
    if (!id) {
      return SaveToast({
        message: "Please enter classroom id",
        type: "error",
      })
    }

    try {
      setsubmitLoading(true)
      let response = await updateClassroom(id, data)
      let message = response?.message || "classRoom Updated Successfully"
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
        "There was a problem creating classroom"
      setsubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleUpdateClassroomStatus = async (cr_id, cr_status) => {
    if (!cr_id) {
      return SaveToast({
        message: "Please enter classroom id",
        type: "error",
      })
    }

    try {
      let response = await updateClassroom(cr_id, { cr_status })
      let message =
        response?.message || "GES Member Status Updated Successfully"
      SaveToast({ message, type: "success" })

      setSave(prevSave => !prevSave)
      return
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem updating classroom status"
      return SaveToast({ message, type: "error" })
    }
  }

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      cr_class: (classroom && classroom.cr_class) || "",
      cr_division: (classroom && classroom.cr_division) || "",
      cr_noOfStudents: (classroom && classroom.cr_noOfStudents) || "",
      cr_classTeacherId: (classroom && classroom.cr_classTeacherId) || "",
    },
    validationSchema: Yup.object({
      cr_class: Yup.string().required("Please Select Class"),
      cr_division: Yup.string()
        .oneOf(divisionDropdown, "Please Select Valid Division")
        .required("Please Select Division"),
      cr_noOfStudents: Yup.number()
        .required("Please Enter No. Of Students")
        .min(1, "No. Of Students Must Greater Than 1"),
      cr_classTeacherId: Yup.string().required("Please Select Class Teacher"),
    }),
    onSubmit: values => {
      let classRoom = values
      if (isEdit) {
        delete classRoom["cr_id"]
        return handleEditClassroomSubmit(classroom.cr_id, classRoom)
      } else {
        return handleAddClassroomSubmit(classRoom)
      }
    },
  })

  const onClickDelete = classroom => {
    setClassroom(classroom)
    setDeleteModal(true)
  }

  const toggleViewModal = () => {
    if (modal1) {
      setClassroom({})
    }
    setModal1(!modal1)
    if (classroom) {
      setClassroom(null)
    }
  }

  const toggle = () => {
    if (modal) {
      setModal(false)
      setClassroom(null)
      setSelectedClass({})
    } else {
      setModal(true)
    }
  }

  const handleClassroomClick = async arg => {
    let classroom = arg
    const resp = await getClassroom(classroom.cr_id)
    const classRoom = resp.data.classRoom
    setClassroom({
      cr_id: classRoom.cr_id,
      cr_class: classRoom.cr_class,
      cr_division: classRoom.cr_division,
      cr_noOfStudents: classRoom.cr_noOfStudents,
      cr_classTeacherId: classRoom.cr_classTeacherId,
    })

    setSelectedClass({ label: classRoom.cr_class, value: classRoom.cr_class })
    setIsEdit(true)
    toggle()
  }

  const handleDeleteClassroom = async () => {
    if (!classroom.cr_id) {
      return SaveToast({ message: "Invalid Classroom ID", type: "error" })
    }

    try {
      const response = await deleteClassroom(classroom.cr_id)
      let message = response?.message || "Classroom deleted successfully"
      SaveToast({ message, type: "success" })

      setSave(prevSave => !prevSave)
      setDeleteModal(false)
      setClassroom({})
      return
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem deleting classroom"
      return SaveToast({ message, type: "error" })
    }
  }

  const handleAddButtonClick = () => {
    setIsEdit(false)
    toggle()
  }

  const handleDeleteModalCloseClick = () => {
    setDeleteModal(false)
    setClassroom({})
  }

  const columns = useMemo(
    () => [
      {
        Header: "Class",
        accessor: "cr_class",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Division",
        accessor: "cr_division",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Class Teacher",
        accessor: "cr_classTeacher.tc_fullName",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Status",
        accessor: "cr_status",
        disableFilters: true,
        Cell: cellProps => {
          const cellData = cellProps.row.original
          return (
            <div className="form-check form-switch form-switch-md">
              <input
                type="checkbox"
                className="form-check-input"
                id={`cr_status_checkbox-${cellData.cr_id}`}
                name={`cr_status_checkbox-${cellData.cr_id}`}
                defaultChecked={cellData.cr_status}
                onChange={e => {
                  let { checked, name } = e.target
                  document.getElementById(name).checked = checked
                  return handleUpdateClassroomStatus(cellData.cr_id, checked)
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
                  const classroomData = cellProps.row.original
                  setClassroom(classroomData)
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
                  const classroomData = cellProps.row.original
                  handleClassroomClick(classroomData)
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
                  const classroomData = cellProps.row.original
                  onClickDelete(classroomData)
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
      <ClassroomModal
        isOpen={modal1}
        toggle={toggleViewModal}
        classroom={classroom}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteClassroom}
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
                    data={classrooms}
                    exportData={exportData}
                    isGlobalFilter={true}
                    isAddOptions={true}
                    handleAddButtonClick={handleAddButtonClick}
                    addButtonLabel={"Add Classroom"}
                    customPageSize={10}
                    className="custom-header-css"
                    canExportCsv={true}
                    canPrint={false}
                    docHeader={"Classroom | LMS Ghana"}
                    dataFetchLoading={loadind}
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
              {!!isEdit ? "Edit Classroom" : "Add Classroom"}
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
                        Select Class <span className="text-danger">*</span>
                      </Label>
                      <Select
                        name="cr_class"
                        placeholder="Select Class"
                        onChange={value => {
                          setSelectedClass(value)
                          validation.setFieldValue(
                            "cr_class",
                            value ? value.value : ""
                          )
                        }}
                        value={selectedClass || 0}
                        options={classRoomType}
                        isClearable
                        invalid={
                          validation.touched.cr_class &&
                          validation.errors.cr_class
                        }
                      />

                      {validation.touched.cr_class &&
                        validation.errors.cr_class && (
                          <div className="invalid-react-select-dropdown">
                            {validation.errors.cr_class}
                          </div>
                        )}
                    </div>

                    <div className="mb-3">
                      <Label className="form-label">
                        Select Division <span className="text-danger">*</span>
                      </Label>
                      <Input
                        name="cr_division"
                        type="select"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.cr_division || 0}
                        invalid={
                          validation.touched.cr_division &&
                          validation.errors.cr_division
                            ? true
                            : false
                        }
                      >
                        <option value="0" disabled>
                          Select Division
                        </option>
                        {divisionDropdown.map(val => {
                          return (
                            <option key={val} value={val}>
                              {val}
                            </option>
                          )
                        })}
                      </Input>
                      {validation.touched.cr_division &&
                      validation.errors.cr_division ? (
                        <FormFeedback type="invalid">
                          {validation.errors.cr_division}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label className="form-label">
                        Number Of Students{" "}
                        <span className="text-danger">*</span>
                      </Label>
                      <Input
                        name="cr_noOfStudents"
                        type="number"
                        min={1}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.cr_noOfStudents || ""}
                        invalid={
                          validation.touched.cr_noOfStudents &&
                          validation.errors.cr_noOfStudents
                            ? true
                            : false
                        }
                      />
                      {validation.touched.cr_noOfStudents &&
                      validation.errors.cr_noOfStudents ? (
                        <FormFeedback type="invalid">
                          {validation.errors.cr_noOfStudents}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label className="form-label">
                        Select Class Teacher{" "}
                        <span className="text-danger">*</span>
                      </Label>
                      <Input
                        name="cr_classTeacherId"
                        type="select"
                        className="form-select"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.cr_classTeacherId || 0}
                        invalid={
                          validation.touched.cr_classTeacherId &&
                          validation.errors.cr_classTeacherId
                            ? true
                            : false
                        }
                      >
                        <option value="0" disabled>
                          Select Class Teacher
                        </option>
                        {classTeacherDropdown.map(val => {
                          return (
                            <option key={val.tc_id} value={val.tc_id}>
                              {val.tc_fullName}
                            </option>
                          )
                        })}
                      </Input>
                      {validation.touched.cr_classTeacherId &&
                      validation.errors.cr_classTeacherId ? (
                        <FormFeedback type="invalid">
                          {validation.errors.cr_classTeacherId}
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
                        disabled={submitLoading}
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
Classroom.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
}

export default Classroom
