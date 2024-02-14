import React, { useMemo, useState, useEffect } from "react"
import { Link, useHistory } from "react-router-dom"
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
  deleteAssigment,
  getAllAssigment,
  updateAssigment,
} from "helpers/backendHelpers/assigment"
import { getUserTypeInfo } from "helpers/authHelper"

const Assigment = props => {
  document.title = "Assignments | LMS Ghana"

  const [deleteModal, setDeleteModal] = useState(false)
  const [assigmentList, setAssigmentList] = useState([])
  const [Assigment, setAssigment] = useState({})
  const [saved, setSaved] = useState(false)
  const [temp, setTemp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [allSchool, setAllSchool] = useState([])
  const history = useHistory()
  const userType = getUserTypeInfo()

  useEffect(() => {
    fetchAssigments()
  }, [saved])

  const fetchAssigments = async () => {
    try {
      setLoading(true)
      const response = await getAllAssigment(userType.tc_id)
      let { assignment } = response.data || {}
      assignment = assignment || []
      setAssigmentList(assignment)
      setLoading(false)
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Fetching Assignments"
      setAssigmentList([])
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const onClickDelete = AssigmentData => {
    setAssigment(AssigmentData)
    setDeleteModal(true)
  }

  const handleUpdateAssigmentStatus = async (id, status) => {
    if (!id) {
      return SaveToast({
        message: "Please Enter Assignments Id",
        type: "error",
      })
    }
    try {
      const response = updateAssigment(id, { asn_status: status })
      const message =
        response?.message || "Assignments Status Updated Successfully"
      SaveToast({ message, type: "success" })

      setSaved(prevSaved => !prevSaved)
      return
    } catch (error) {
      const message =
        error?.message || "There Was A Problem Updating Assignments Status"
      return SaveToast({ message, type: "error" })
    }
  }

  const handleDeleteAssigment = async () => {
    if (!Assigment.asn_id) {
      return SaveToast({ message: "Invalid Assignments ID", type: "error" })
    }
    try {
      const response = await deleteAssigment(Assigment.asn_id)
      const message = response?.message || "Assignments Deleted Successfully"
      SaveToast({ message, type: "success" })

      setSaved(prevSaved => !prevSaved)
      setDeleteModal(false)
      return
    } catch (error) {
      const message = error?.message || "There was a problem deleting Assigment"
      return SaveToast({ message, type: "error" })
    }
  }

  const handleAddButtonClick = () => {
    props.history.push("/Assignment/add")
  }

  const columns = useMemo(
    () => [
      {
        Header: "Title",
        accessor: "asn_title",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Total Marks",
        accessor: "asn_totalMarks",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Class/Grade",
        accessor: "asn_category",
        filterable: false,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Subject",
        accessor: "asn_subCategory",
        filterable: false,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Topic",
        accessor: "asn_topic",
        filterable: false,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Status",
        accessor: "asn_status",
        disableFilters: true,
        Cell: cellProps => {
          const cellData = cellProps.row.original
          return (
            <div className="form-check form-switch form-switch-md">
              <input
                type="checkbox"
                className="form-check-input"
                id={`tc_status_checkbox-${cellData.asn_id}`}
                name={`tc_status_checkbox-${cellData.asn_id}`}
                defaultChecked={cellData.asn_status}
                onChange={e => {
                  let { checked, name } = e.target
                  document.getElementById(name).checked = checked
                  return handleUpdateAssigmentStatus(cellData.asn_id, checked)
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
                to={{
                  pathname:
                    "/assignment-manage/" + cellProps.row.original.asn_id,
                  state: {
                    type: 0,
                    category: cellProps.row.original.asn_category,
                    subCategory: cellProps.row.original.asn_subCategory,
                  },
                }}
                className="text-dark"
              >
                <i className="mdi mdi-file font-size-18" id="filetooltip" />
                <UncontrolledTooltip placement="top" target="filetooltip">
                  Manage Question
                </UncontrolledTooltip>
              </Link>
              {/* <Link
                to="#"
                className="text-dark"
                onClick={() => {
                  props.history.push(
                    "/Assignment/view/" + cellProps.row.original.asn_id
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
                    "/Assignment/edit/" + cellProps.row.original.asn_id
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
                  const AssigmentData = cellProps.row.original
                  onClickDelete(AssigmentData)
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
      accessor: "asn_title",
      filterable: false,
      Cell: cellProps => {
        return <SimpleStringValue {...cellProps} />
      },
    },
    {
      Header: "Total Marks",
      accessor: "asn_totalMarks",
      filterable: true,
      Cell: cellProps => {
        return <SimpleStringValue {...cellProps} />
      },
    },
    {
      Header: "Class/Grade",
      accessor: "asn_category",
      filterable: false,
      Cell: cellProps => {
        return <SimpleStringValue {...cellProps} />
      },
    },
    {
      Header: "Subject",
      accessor: "asn_subCategory",
      filterable: false,
      Cell: cellProps => {
        return <SimpleStringValue {...cellProps} />
      },
    },
    {
      Header: "Topic",
      accessor: "asn_topic",
      filterable: false,
      Cell: cellProps => {
        return <SimpleStringValue {...cellProps} />
      },
    },
    {
      Header: "Status",
      accessor: "asn_status",
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
                      data={assigmentList}
                      isGlobalFilter={true}
                      isAddOptions={true}
                      addButtonLabel="Add Assignments"
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

export default Assigment
