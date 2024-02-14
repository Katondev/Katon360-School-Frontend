import React, { useMemo, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import TableContainer from "../../components/Common/TableContainer"

//import components
// import Breadcrumbs from "../../components/Common/Breadcrumb"
import DeleteModal from "../../components/Common/DeleteModal"

import {
  SimpleStringValue,
  SimpleDateFormate,
} from "helpers/common_helper_functions"
import { SaveToast } from "components/Common/SaveToast"
import { Col, Row, UncontrolledTooltip, Card, CardBody } from "reactstrap"

import {
  getAllEventCalender,
  updateEventCalender,
  deleteEventCalender,
} from "helpers/backendHelpers/EventCalender"

const EventCalender = props => {
  document.title = "Event Calender | LMS Ghana"

  const [deleteModal, setDeleteModal] = useState(false)
  const [eventCalenderList, setEventCalenderList] = useState([])
  const [eventCalender, setTeacher] = useState({})
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAllEventCalender()
  }, [saved])

  const fetchAllEventCalender = async () => {
    try {
      setLoading(true)
      const response = await getAllEventCalender()
      let { events } = response.data || {}
      events = events || []
      setEventCalenderList(events)
      setLoading(false)
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Fetching Teachers"
      setEventCalenderList([])
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const onClickDelete = eventCalender => {
    setTeacher(eventCalender)
    setDeleteModal(true)
  }

  const handleUpdateEventCalenderStatus = async (id, status) => {
    if (!id) {
      return SaveToast({
        message: "Please Enter Event Calender Id",
        type: "error",
      })
    }
    try {
      const response = updateEventCalender(id, { ec_status: status })
      const message =
        response?.message || "Event Calender Status Updated Successfully"
      SaveToast({ message, type: "success" })

      setSaved(prevSaved => !prevSaved)
      return
    } catch (error) {
      const message =
        error?.message || "There Was A Problem Updating Event Calender Status"
      return SaveToast({ message, type: "error" })
    }
  }

  const handleDeleteEventCalender = async () => {
    if (!eventCalender.ec_id) {
      return SaveToast({ message: "Invalid EventCalender ID", type: "error" })
    }
    try {
      const response = await deleteEventCalender(eventCalender.ec_id)
      const message = response?.message || "EventCalender Deleted Successfully"
      SaveToast({ message, type: "success" })

      setSaved(prevSaved => !prevSaved)
      setDeleteModal(false)
      return
    } catch (error) {
      const message =
        error?.message || "There was a problem deleting EventCalender"
      return SaveToast({ message, type: "error" })
    }
  }

  const handleAddButtonClick = () => {
    props.history.push("/event-calender/add")
  }

  const columns = useMemo(
    () => [
      {
        Header: "Class",
        accessor: "ec_class",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Event Type",
        accessor: "ec_eventtype",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Event Date",
        accessor: "ec_eventDate",
        filterable: true,
        Cell: cellProps => {
          return <SimpleDateFormate {...cellProps} />
        },
      },
      {
        Header: "Event Title",
        accessor: "ec_eventTitle",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Status",
        accessor: "ec_status",
        disableFilters: true,
        Cell: cellProps => {
          const cellData = cellProps.row.original
          return (
            <div className="form-check form-switch form-switch-md">
              <input
                type="checkbox"
                className="form-check-input bg-dark"
                id={`tc_status_checkbox-${cellData.ec_id}`}
                name={`tc_status_checkbox-${cellData.ec_id}`}
                defaultChecked={cellData.ec_status}
                onChange={e => {
                  let { checked, name } = e.target
                  document.getElementById(name).checked = checked
                  return handleUpdateEventCalenderStatus(
                    cellData.ec_id,
                    checked
                  )
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
              {/* <Link
                to="#"
                className="text-dark"
                onClick={() => {
                  props.history.push(
                    "/event-calender/view/" + cellProps.row.original.ec_id
                  )
                }}
              >
                <i className="mdi mdi-eye font-size-18" id="viewtooltip" />
                <UncontrolledTooltip placement="top" target="viewtooltip">
                  View
                </UncontrolledTooltip>
              </Link> */}
              <Link
                to="#"
                className="text-success"
                onClick={() => {
                  props.history.push(
                    "/event-calender/edit/" + cellProps.row.original.ec_id
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
                  const eventCalenderData = cellProps.row.original
                  onClickDelete(eventCalenderData)
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
        onDeleteClick={handleDeleteEventCalender}
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
                    data={eventCalenderList}
                    isGlobalFilter={true}
                    isAddOptions={true}
                    addButtonLabel="Add EventCalender"
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

export default EventCalender
