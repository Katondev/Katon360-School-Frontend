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
  getAllNotification,
  updateNotification,
  deleteNotification,
} from "helpers/backendHelpers/Notification"
import { IMAGE_URL } from "helpers/urlHelper"
import NotificationModal from "./ViewModal"

const Notification = props => {
  document.title = "Notification | LMS Ghana"

  const [deleteModal, setDeleteModal] = useState(false)
  const [notificationList, setNotificationList] = useState([])
  const [notification, setNotification] = useState({})
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [modal1, setModal1] = useState(false)
  const [image, setImage] = useState("")

  useEffect(() => {
    fetchNotification()
  }, [saved])

  const fetchNotification = async () => {
    try {
      setLoading(true)
      const response = await getAllNotification()
      let { notification } = response.data || {}
      notification = notification || []
      setNotificationList(notification)
      setLoading(false)
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Fetching Notification"
      setNotificationList([])
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const onClickDelete = teacher => {
    setNotification(teacher)
    setDeleteModal(true)
  }

  const handleUpdateNotificationStatus = async (id, status) => {
    if (!id) {
      return SaveToast({
        message: "Please Enter Notification Id",
        type: "error",
      })
    }
    try {
      const response = updateNotification(id, { nt_status: status })
      const message =
        response?.message || "Notification Status Updated Successfully"
      SaveToast({ message, type: "success" })

      setSaved(prevSaved => !prevSaved)
      return
    } catch (error) {
      const message =
        error?.message || "There Was A Problem Updating Notification Status"
      return SaveToast({ message, type: "error" })
    }
  }

  const handleDeleteEventCalender = async () => {
    if (!notification.nt_id) {
      return SaveToast({ message: "Invalid Notification ID", type: "error" })
    }
    try {
      const response = await deleteNotification(notification.nt_id)
      const message = response?.message || "Notification Deleted Successfully"
      SaveToast({ message, type: "success" })

      setSaved(prevSaved => !prevSaved)
      setDeleteModal(false)
      return
    } catch (error) {
      const message =
        error?.message || "There was a problem deleting Notification"
      return SaveToast({ message, type: "error" })
    }
  }

  const handleAddButtonClick = () => {
    props.history.push("/notification/add")
  }

  const toggleViewModal = () => {
    setModal1(!modal1)
  }

  const columns = useMemo(
    () => [
      {
        Header: "Class",
        accessor: "nt_class",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Title",
        accessor: "nt_title",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Description",
        accessor: "nt_desc",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      // {
      //   Header: "Image",
      //   accessor: "nt_file",
      //   filterable: true,
      //   Cell: cellProps => {
      //     const cellData = cellProps.row.original
      //     return (
      //       <div className="text-center">
      //         {cellData?.nt_file != "" && cellData?.nt_file != null ? (
      //           <img
      //             src={`${IMAGE_URL}/${cellData?.nt_file}`}
      //             style={{ width: "50px" }}
      //             onClick={() => {
      //               toggleViewModal()
      //               setImage(cellData?.nt_file)
      //             }}
      //           />
      //         ) : (
      //           "-"
      //         )}
      //       </div>
      //     )
      //   },
      // },
      {
        Header: "Status",
        accessor: "nt_status",
        disableFilters: true,
        Cell: cellProps => {
          const cellData = cellProps.row.original
          return (
            <div className="form-check form-switch form-switch-md">
              <input
                type="checkbox"
                className="form-check-input"
                id={`tc_status_checkbox-${cellData.nt_id}`}
                name={`tc_status_checkbox-${cellData.nt_id}`}
                defaultChecked={cellData.nt_status}
                onChange={e => {
                  let { checked, name } = e.target
                  document.getElementById(name).checked = checked
                  return handleUpdateNotificationStatus(cellData.nt_id, checked)
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
                className="text-success"
                onClick={() => {
                  props.history.push(
                    "/notification/edit/" + cellProps.row.original.nt_id
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
                  const notificationData = cellProps.row.original
                  onClickDelete(notificationData)
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
      <NotificationModal
        isOpen={modal1}
        toggle={toggleViewModal}
        image={image}
      />
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
                    data={notificationList}
                    isGlobalFilter={true}
                    isAddOptions={true}
                    addButtonLabel="Add Notification"
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

export default Notification
