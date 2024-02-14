import React, { useMemo, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import TableContainer from "../../components/Common/TableContainer"

//import components
// import Breadcrumbs from "../../components/Common/Breadcrumb"
import DeleteModal from "../../components/Common/DeleteModal"

import { SimpleStringValue } from "helpers/common_helper_functions"
import { SaveToast } from "components/Common/SaveToast"
import { Col, Row, UncontrolledTooltip, Card, CardBody } from "reactstrap"

import {
  getAllSchoolTeachers,
  updateTeacher,
  deleteTeacher,
} from "helpers/backendHelpers/schoolTeachers"

const Teachers = props => {
  document.title = "Teachers | LMS Ghana"

  const [deleteModal, setDeleteModal] = useState(false)
  const [teachers, setTeachers] = useState([])
  const [teacher, setTeacher] = useState({})
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAllTeachers()
  }, [saved])

  const fetchAllTeachers = async () => {
    try {
      setLoading(true)
      const response = await getAllSchoolTeachers()
      let { teachers } = response.data || {}
      teachers = teachers || []
      setTeachers(teachers)
      setLoading(false)
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Fetching Teachers"
      setTeachers([])
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const onClickDelete = teacher => {
    setTeacher(teacher)
    setDeleteModal(true)
  }

  const handleUpdateTeacherStatus = async (id, status) => {
    if (!id) {
      return SaveToast({
        message: "Please Enter Teacher Id",
        type: "error",
      })
    }
    try {
      const response = updateTeacher(id, { tc_status: status })
      const message = response?.message || "Teacher Status Updated Successfully"
      SaveToast({ message, type: "success" })

      setSaved(prevSaved => !prevSaved)
      return
    } catch (error) {
      const message =
        error?.message || "There Was A Problem Updating Teacher Status"
      return SaveToast({ message, type: "error" })
    }
  }

  const handleDeleteTeacher = async () => {
    if (!teacher.tc_id) {
      return SaveToast({ message: "Invalid School ID", type: "error" })
    }
    try {
      const response = await deleteTeacher(teacher.tc_id)
      const message = response?.message || "Teacher Deleted Successfully"
      SaveToast({ message, type: "success" })

      setSaved(prevSaved => !prevSaved)
      setDeleteModal(false)
      return
    } catch (error) {
      const message = error?.message || "There was a problem deleting Teacher"
      return SaveToast({ message, type: "error" })
    }
  }

  const handleAddButtonClick = () => {
    props.history.push("/teachers/add")
  }

  const columns = useMemo(
    () => [
      {
        Header: "Full Name",
        accessor: "tc_fullName",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Email",
        accessor: "tc_email",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Education",
        accessor: "tc_education",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Phone Number",
        accessor: "tc_phoneNumber",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Status",
        accessor: "tc_status",
        disableFilters: true,
        Cell: cellProps => {
          const cellData = cellProps.row.original
          return (
            <div className="form-check form-switch form-switch-md">
              <input
                type="checkbox"
                className="form-check-input"
                id={`tc_status_checkbox-${cellData.tc_id}`}
                name={`tc_status_checkbox-${cellData.tc_id}`}
                defaultChecked={cellData.tc_status}
                onChange={e => {
                  let { checked, name } = e.target
                  document.getElementById(name).checked = checked
                  return handleUpdateTeacherStatus(cellData.tc_id, checked)
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
                    "/teachers/view/" + cellProps.row.original.tc_id
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
                    "/teachers/edit/" + cellProps.row.original.tc_id
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

  const printColumns = useMemo(() => [
    {
      Header: "Full Name",
      accessor: "tc_fullName",
      filterable: false,
      Cell: cellProps => {
        return <SimpleStringValue {...cellProps} />
      },
    },
    {
      Header: "Email",
      accessor: "tc_email",
      filterable: true,
      Cell: cellProps => {
        return <SimpleStringValue {...cellProps} />
      },
    },
    {
      Header: "Education",
      accessor: "tc_education",
      filterable: false,
      Cell: cellProps => {
        return <SimpleStringValue {...cellProps} />
      },
    },
    {
      Header: "Phone Number",
      accessor: "tc_phoneNumber",
      filterable: false,
      Cell: cellProps => {
        return <SimpleStringValue {...cellProps} />
      },
    },
    {
      Header: "Status",
      accessor: "tc_status",
      disableFilters: true,
      Cell: cellProps => {
        return cellProps?.row?.original?.tc_status ? "Active" : "Inactive"
      },
    },
  ])

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteTeacher}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <TableContainer
                    columns={columns}
                    data={teachers}
                    isGlobalFilter={true}
                    isAddOptions={true}
                    addButtonLabel="Add Teacher"
                    handleAddButtonClick={handleAddButtonClick}
                    customPageSize={10}
                    className="custom-header-css"
                    dataFetchLoading={loading}
                    canExportCsv={true}
                    canPrint={true}
                    printColumns={printColumns}
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

export default Teachers
