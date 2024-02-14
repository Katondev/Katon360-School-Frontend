import React, { useMemo, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import TableContainer from "../../components/Common/TableContainer"

//import components
// import Breadcrumbs from "../../components/Common/Breadcrumb"
import DeleteModal from "../../components/Common/DeleteModal"

import {
  SimpleStringValue,
  GetSchoolById,
  SimpleDateFormate,
  getSchoolById,
} from "helpers/common_helper_functions"
import { SaveToast } from "components/Common/SaveToast"
import { Col, Row, UncontrolledTooltip, Card, CardBody } from "reactstrap"

import {
  getAllNotification,
  updateNotification,
  deleteNotification,
} from "helpers/backendHelpers/Notification"
import {
  deleteLiveSession,
  getAllLiveSession,
  updateLiveSession,
} from "helpers/backendHelpers/liveSession"
import { getUserTypeInfo } from "helpers/authHelper"

const LiveSession = props => {
  document.title = "Live Session | LMS Ghana"

  const [deleteModal, setDeleteModal] = useState(false)
  const [liveSessionList, setLiveSessionList] = useState([])
  const [liveSession, setLiveSession] = useState({})
  const [saved, setSaved] = useState(false)
  const [temp, setTemp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [allSchool, setAllSchool] = useState([])

  const userType = getUserTypeInfo()

  useEffect(() => {
    fetchLiveSessions()
  }, [saved])

  useEffect(() => {
    setTimeout(() => {
      document.getElementById("live-session")?.classList.add("mm-active")
    }, 400)
  }, [])

  const fetchLiveSessions = async () => {
    try {
      setLoading(true)
      const response = await getAllLiveSession(userType.tc_id)
      let { liveSession } = response.data || {}
      liveSession = liveSession || []
      setLiveSessionList(liveSession)
      setLoading(false)
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Fetching Notification"
      setLiveSessionList([])
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const onClickDelete = liveSessionData => {
    setLiveSession(liveSessionData)
    setDeleteModal(true)
  }

  const handleUpdateLiveSessionStatus = async (id, status) => {
    if (!id) {
      return SaveToast({
        message: "Please Enter Live Session Id",
        type: "error",
      })
    }
    try {
      const response = updateLiveSession(id, { ls_status: status })
      const message =
        response?.message || "Live Session Status Updated Successfully"
      SaveToast({ message, type: "success" })

      setSaved(prevSaved => !prevSaved)
      return
    } catch (error) {
      const message =
        error?.message || "There Was A Problem Updating Live Session Status"
      return SaveToast({ message, type: "error" })
    }
  }

  const handleDeleteLiveSession = async () => {
    if (!liveSession.ls_id) {
      return SaveToast({ message: "Invalid Live Session ID", type: "error" })
    }
    try {
      const response = await deleteLiveSession(liveSession.ls_id)
      const message = response?.message || "Live Session Deleted Successfully"
      SaveToast({ message, type: "success" })

      setSaved(prevSaved => !prevSaved)
      setDeleteModal(false)
      return
    } catch (error) {
      const message =
        error?.message || "There was a problem deleting liveSession"
      return SaveToast({ message, type: "error" })
    }
  }

  const handleAddButtonClick = () => {
    props.history.push("/live-session/add")
  }

  const columns = useMemo(
    () => [
      {
        Header: "Title",
        accessor: "ls_title",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Description",
        accessor: "ls_desc",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Room URL",
        accessor: "ls_roomURL",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Date",
        accessor: "ls_date",
        filterable: true,
        Cell: cellProps => {
          return <SimpleDateFormate {...cellProps} />
        },
      },
      {
        Header: "Status",
        accessor: "ls_status",
        disableFilters: true,
        Cell: cellProps => {
          const cellData = cellProps.row.original
          return (
            <div className="form-check form-switch form-switch-md">
              <input
                type="checkbox"
                className="form-check-input"
                id={`tc_status_checkbox-${cellData.ls_id}`}
                name={`tc_status_checkbox-${cellData.ls_id}`}
                defaultChecked={cellData.ls_status}
                onChange={e => {
                  let { checked, name } = e.target
                  document.getElementById(name).checked = checked
                  return handleUpdateLiveSessionStatus(cellData.ls_id, checked)
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
                    "/live-session/view/" + cellProps.row.original.ls_id
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
                    "/live-session/edit/" + cellProps.row.original.ls_id
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
                  const liveSessionData = cellProps.row.original
                  onClickDelete(liveSessionData)
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
      Header: "Title",
      accessor: "ls_title",
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
        onDeleteClick={handleDeleteLiveSession}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  {allSchool && (
                    <TableContainer
                      columns={columns}
                      data={liveSessionList}
                      isGlobalFilter={true}
                      isAddOptions={true}
                      addButtonLabel="Add Live Session"
                      handleAddButtonClick={handleAddButtonClick}
                      customPageSize={10}
                      className="custom-header-css"
                      dataFetchLoading={loading}
                      canExportCsv={true}
                      canPrint={true}
                      printColumns={printColumns}
                      noDataMessage="No system activity found."
                    />
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
}

export default LiveSession
