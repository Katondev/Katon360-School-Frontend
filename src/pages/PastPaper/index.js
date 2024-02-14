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

import { updateAssigment } from "helpers/backendHelpers/assigment"
import {
  deletePastPaper,
  getAllPastPaper,
  updatePastPaper,
} from "helpers/backendHelpers/pastPaper"

const PastPaper = props => {
  document.title = "PastPaper | LMS Ghana"

  const [deleteModal, setDeleteModal] = useState(false)
  const [pastPaperList, setPastPaperList] = useState([])
  const [PastPaper, setPastPaper] = useState({})
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
      const response = await getAllPastPaper()
      let { pastPaper } = response.data || {}
      pastPaper = pastPaper || []

      setPastPaperList(pastPaper)
      setLoading(false)
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Fetching Messages"
      setPastPaperList([])
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const onClickDelete = PastPaperData => {
    setPastPaper(PastPaperData)
    setDeleteModal(true)
  }

  const handleUpdatePastPaperStatus = async (id, status) => {
    if (!id) {
      return SaveToast({
        message: "Please Enter Past Paper Id",
        type: "error",
      })
    }
    try {
      const response = updatePastPaper(id, { pp_status: status })
      const message =
        response?.message || "Past Paper Status Updated Successfully"
      SaveToast({ message, type: "success" })

      setSaved(prevSaved => !prevSaved)
      return
    } catch (error) {
      const message =
        error?.message || "There Was A Problem Updating Message Status"
      return SaveToast({ message, type: "error" })
    }
  }

  const handleDeletePastPaper = async () => {
    if (!PastPaper.pp_id) {
      return SaveToast({ message: "Invalid Paper ID", type: "error" })
    }
    try {
      const response = await deletePastPaper(PastPaper.pp_id)
      const message = response?.message || "Paper Deleted Successfully"
      SaveToast({ message, type: "success" })

      setSaved(prevSaved => !prevSaved)
      setDeleteModal(false)
      return
    } catch (error) {
      const message = error?.message || "There was a problem deleting PastPaper"
      return SaveToast({ message, type: "error" })
    }
  }

  const handleAddButtonClick = () => {
    props.history.push("/past-paper/add")
  }

  const columns = useMemo(
    () => [
      {
        Header: "Paper Title",
        accessor: "pp_title",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Paper Year",
        accessor: "pp_year",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Total Marks",
        accessor: "pp_totalMarks",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Class/Grade",
        accessor: "pp_category",
        filterable: false,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },

      {
        Header: "Status",
        accessor: "pp_status",
        disableFilters: true,
        Cell: cellProps => {
          const cellData = cellProps.row.original
          return (
            <div className="form-check form-switch form-switch-md">
              <input
                type="checkbox"
                className="form-check-input"
                id={`tc_status_checkbox-${cellData.pp_id}`}
                name={`tc_status_checkbox-${cellData.pp_id}`}
                defaultChecked={cellData.pp_status}
                onChange={e => {
                  let { checked, name } = e.target
                  document.getElementById(name).checked = checked
                  return handleUpdatePastPaperStatus(cellData.pp_id, checked)
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
                // to={{
                //   pathname: "/past-paper-questions/add",
                //   state: {
                //     params: { pp_id: cellProps.row.original.pp_id },
                //   },
                // }}
                to={{
                  pathname: "/past-questions/" + cellProps.row.original.pp_id,
                  state: {
                    type: 1,
                  },
                }}
                className="text-dark"
              >
                <i className="mdi mdi-file font-size-18" id="filetooltip" />
                <UncontrolledTooltip placement="top" target="filetooltip">
                  Manage Question
                </UncontrolledTooltip>
              </Link> */}
              {/* <Link
                to="#"
                className="text-dark"
                onClick={() => {
                  props.history.push(
                    "/past-paper/view/" + cellProps.row.original.pp_id
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
                    "/past-paper/edit/" + cellProps.row.original.pp_id
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
                  const PastPaperData = cellProps.row.original
                  onClickDelete(PastPaperData)
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
      accessor: "pp_title",
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
        onDeleteClick={handleDeletePastPaper}
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
                      data={pastPaperList}
                      isGlobalFilter={true}
                      isAddOptions={true}
                      addButtonLabel="Add Past Paper"
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

export default PastPaper
