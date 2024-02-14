import React, { useMemo, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import TableContainer from "../../components/Common/TableContainer"

import DeleteModal from "../../components/Common/DeleteModal"

import { SimpleStringValue } from "helpers/common_helper_functions"

import { Col, Row, UncontrolledTooltip, Card, CardBody } from "reactstrap"

import {
  deleteStaffMember,
  getAllStaffMembers,
  updateStaffMember,
} from "helpers/backendHelpers/officeStaff"
import { SaveToast } from "components/Common/SaveToast"

const OfficeStaff = props => {
  document.title = "Office Staff | LMS Ghana"

  const [deleteModal, setDeleteModal] = useState(false)
  const [staffMembers, setStaffMembers] = useState([])
  const [saved, setSaved] = useState(false)

  const [staffMember, setStaffMember] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAllOfficeStaff()
  }, [saved])

  const fetchAllOfficeStaff = async () => {
    try {
      setLoading(true)
      const response = await getAllStaffMembers()
      let { officeStaffs } = response.data
      officeStaffs = officeStaffs || []
      setStaffMembers(officeStaffs)
      setLoading(false)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was problem fetching staff members"
      setStaffMembers([])
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleUpdateStaffStatus = async (ss_id, ss_status) => {
    if (!ss_id) {
      return SaveToast({ message: "Please Provide Staff Id", type: "error" })
    }
    try {
      let response = await updateStaffMember(ss_id, { ss_status })
      let message = response?.message || "Staff status updated successfully"
      return SaveToast({ message, type: "success" })
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was problem updating staff status"
      return SaveToast({ message, type: "error" })
    }
  }

  const onClickDelete = member => {
    setStaffMember(member)
    setDeleteModal(true)
  }

  const handleDeleteMember = async () => {
    if (!staffMember.ss_id) {
      return SaveToast({ message: "Invalid Staff ID", type: "error" })
    }
    try {
      const response = await deleteStaffMember(staffMember.ss_id)
      const message = response?.message || "Member Deleted Successfully"
      SaveToast({ message, type: "success" })
      setSaved(prevSaved => !prevSaved)
      setDeleteModal(false)
      return
    } catch (error) {
      const message = error?.message || "There Was A Problem Deleting Member"
      return SaveToast({ message, type: "error" })
    }
  }

  const handleAddButtonClick = () => {
    props.history.push("/office-staff/add")
  }

  const columns = useMemo(
    () => [
      {
        Header: "Role",
        accessor: "ss_staffRole",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Email",
        accessor: "ss_email",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },

      {
        Header: "Full Name",
        accessor: "ss_fullName",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Phone Number",
        accessor: "ss_phoneNumber",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Status",
        accessor: "ss_status",
        disableFilters: true,
        Cell: cellProps => {
          const cellData = cellProps.row.original
          return (
            <div className="form-check form-switch form-switch-md">
              <input
                type="checkbox"
                className="form-check-input"
                id={`ss_status_checkbox-${cellData.ss_id}`}
                name={`ss_status_checkbox-${cellData.ss_id}`}
                defaultChecked={cellData.ss_status}
                onChange={e => {
                  let { checked, name } = e.target
                  document.getElementById(name).checked = checked
                  return handleUpdateStaffStatus(cellData.ss_id, checked)
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
                    "/office-staff/view/" + cellProps.row.original.ss_id
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
                    "/office-staff/edit/" + cellProps.row.original.ss_id
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
                  const staffData = cellProps.row.original
                  onClickDelete(staffData)
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
        onDeleteClick={handleDeleteMember}
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
                    data={staffMembers}
                    isGlobalFilter={true}
                    isAddOptions={true}
                    addButtonLabel="Add Staff Member"
                    handleAddButtonClick={handleAddButtonClick}
                    customPageSize={10}
                    className="custom-header-css"
                    canExportCsv={true}
                    canPrint={false}
                    dataFetchLoading={loading}
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

export default OfficeStaff
