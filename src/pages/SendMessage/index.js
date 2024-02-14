import React, { useMemo, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import TableContainer from "../../components/Common/TableContainer"

import DeleteModal from "../../components/Common/DeleteModal"

import {
  SimpleStringValue,
  SimpleDateFormate,
} from "helpers/common_helper_functions"
import { SaveToast } from "components/Common/SaveToast"
import { Col, Row, UncontrolledTooltip, Card, CardBody } from "reactstrap"

import {
  deleteAssigment,
  updateAssigment,
} from "helpers/backendHelpers/assigment"
import {
  deleteMessage,
  getAllMessages,
} from "helpers/backendHelpers/sendMessage"

const SendMessage = props => {
  document.title = "Send Message | LMS Ghana"

  const [deleteModal, setDeleteModal] = useState(false)
  const [messageList, setMessageList] = useState([])
  const [singleMessage, setSingleMessage] = useState({})
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [allSchool, setAllSchool] = useState([])

  const userInfo = JSON.parse(localStorage.getItem("teacherInfo"))

  useEffect(() => {
    fetchMessages()
  }, [saved])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await getAllMessages()
      let { sendMessage } = response.data || {}
      sendMessage = sendMessage || []

      setMessageList(sendMessage)
      setLoading(false)
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Fetching Messages"
      setMessageList([])
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const onClickDelete = messageData => {
    setSingleMessage(messageData)
    setDeleteModal(true)
  }

  const handleUpdateAssigmentStatus = async (id, status) => {
    if (!id) {
      return SaveToast({
        message: "Please Enter Message Id",
        type: "error",
      })
    }
    try {
      const response = updateAssigment(id, { asn_status: status })
      const message = response?.message || "Message Status Updated Successfully"
      SaveToast({ message, type: "success" })

      setSaved(prevSaved => !prevSaved)
      return
    } catch (error) {
      const message =
        error?.message || "There Was A Problem Updating Message Status"
      return SaveToast({ message, type: "error" })
    }
  }

  const handleDeleteAssigment = async () => {
    if (!singleMessage.sm_id) {
      return SaveToast({ message: "Invalid Message ID", type: "error" })
    }
    try {
      const response = await deleteMessage(singleMessage.sm_id)
      const message = response?.message || "Message Deleted Successfully"
      SaveToast({ message, type: "success" })

      setSaved(prevSaved => !prevSaved)
      setDeleteModal(false)
      return
    } catch (error) {
      const message = error?.message || "There was a problem deleting message"
      return SaveToast({ message, type: "error" })
    }
  }

  const handleAddButtonClick = () => {
    props.history.push("/Send-message/add")
  }

  const columns = useMemo(
    () => [
      {
        Header: "Message",
        accessor: "sm_msg",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Class",
        accessor: "cr_id",
        filterable: true,
        Cell: cellProps => {
          return (
            <>
              {cellProps.row.original?.sm_classRoom?.cr_class &&
              cellProps.row.original?.sm_classRoom?.cr_division ? (
                <p>
                  {cellProps.row.original?.sm_classRoom?.cr_class}, &nbsp;
                  {cellProps.row.original?.sm_classRoom?.cr_division}
                </p>
              ) : (
                "-"
              )}
            </>
          )
        },
      },
      // {
      //   Header: "Students",
      //   accessor: "sm_student",
      //   filterable: true,
      //   Cell: cellProps => {
      //     return <SimpleStringValue {...cellProps} />
      //   },
      // },
      {
        Header: "Message To",
        accessor: "sm_type",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      // {
      //   Header: "Message Send To",
      //   accessor: "sm_type",
      //   filterable: true,
      //   Cell: cellProps => {
      //     return <SimpleDateFormate {...cellProps} />
      //   },
      // },
      // {
      //   Header: "Status",
      //   accessor: "asn_status",
      //   disableFilters: true,
      //   Cell: cellProps => {
      //     const cellData = cellProps.row.original
      //     return (
      //       <div className="form-check form-switch form-switch-md">
      //         <input
      //           type="checkbox"
      //           className="form-check-input"
      //           id={`tc_status_checkbox-${cellData.sm_id}`}
      //           name={`tc_status_checkbox-${cellData.sm_id}`}
      //           defaultChecked={cellData.asn_status}
      //           onChange={e => {
      //             let { checked, name } = e.target
      //             document.getElementById(name).checked = checked
      //             return handleUpdateAssigmentStatus(cellData.sm_id, checked)
      //           }}
      //         />
      //       </div>
      //     )
      //   },
      // },
      {
        Header: "Action",
        accessor: "action",
        disableFilters: true,
        Cell: cellProps => {
          return (
            <div className="d-flex gap-3">
              <Link
                to="#"
                className="text-danger"
                onClick={() => {
                  const messageData = cellProps.row.original
                  onClickDelete(messageData)
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
      Header: "Message",
      accessor: "sm_msg",
      filterable: true,
      Cell: cellProps => {
        return <SimpleStringValue {...cellProps} />
      },
    },
    {
      Header: "Class",
      accessor: "cr_id",
      filterable: true,
      Cell: cellProps => {
        return <SimpleStringValue {...cellProps} />
      },
    },
    {
      Header: "Students",
      accessor: "sm_student",
      filterable: true,
      Cell: cellProps => {
        return <SimpleStringValue {...cellProps} />
      },
    },
    {
      Header: "Message Send",
      accessor: "sm_type",
      filterable: true,
      Cell: cellProps => {
        return <SimpleStringValue {...cellProps} />
      },
    },
  ])

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteAssigment}
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
                      data={messageList}
                      isGlobalFilter={true}
                      isAddOptions={true}
                      addButtonLabel="Add Message"
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

export default SendMessage
