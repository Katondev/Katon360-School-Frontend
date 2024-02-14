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
import {
  deleteAssigment,
  getAllAssigment,
  getAssigment,
  updateAssigment,
} from "helpers/backendHelpers/assigment"
import { SaveToast } from "components/Common/SaveToast"
import {
  Col,
  Row,
  UncontrolledTooltip,
  Card,
  CardBody,
  Label,
  Input,
} from "reactstrap"

import {
  getAllNotification,
  updateNotification,
  deleteNotification,
} from "helpers/backendHelpers/Notification"
import {
  deleteAssigmentQuestion,
  getAllAssigmentQuestion,
  getAssigmentQuestionByAssignment,
  updateAssigmentQuestion,
} from "helpers/backendHelpers/assigmentQuestion"
import { getUserTypeInfo } from "helpers/authHelper"
import {
  deletePastPaperQuestion,
  getAllPastPaperQuestion,
  getAllPastPaperQuestionByPaper,
  updatePastPaperQuestion,
} from "helpers/backendHelpers/pastPaperQuestion"
import { getAllPastPaper } from "helpers/backendHelpers/pastPaper"

const AssigmentQuestion = props => {
  document.title = "Assignments | LMS Ghana"

  const [deleteModal, setDeleteModal] = useState(false)
  const [pastPaperQuestionList, setPastPaperQuestionList] = useState([])
  const [pastPaperList, setPastPaperList] = useState([])
  const [newAssigmentList, setNewAssigmentList] = useState([])
  const [pastPaperQuestion, setPastPaperQuestion] = useState({})
  const [saved, setSaved] = useState(false)
  const [temp, setTemp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [allSchool, setAllSchool] = useState([])
  const [asn_type, setAsn_type] = useState()
  const history = useHistory()
  const userType = getUserTypeInfo()

  useEffect(() => {
    fetchPastPaper()
  }, [saved])

  const handlePastPaperChange = async e => {
    setAsn_type(e.target.value)
    let pp_id = e.target.value

    fetchAssigmentsNew(pp_id)
    fetchPpQueByPaper(pp_id)
  }

  const fetchAssigmentsNew = async aid => {
    try {
      setLoading(true)
      const response = await getAllAssigment(aid)

      let { assignment } = response.data || {}
      assignment = assignment || []
      setNewAssigmentList(assignment)
      setLoading(false)
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Fetching Assignments"
      setNewAssigmentList([])
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const fetchPpQueByPaper = async pp_id => {
    try {
      setLoading(true)
      const response = await getAllPastPaperQuestionByPaper(pp_id)
      console.log(response)
      let { pastQuestionPaper } = response.data || {}
      pastQuestionPaper = pastQuestionPaper || []
      setPastPaperQuestionList(pastQuestionPaper)
      setLoading(false)
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Fetching Assignments"
      setPastPaperQuestionList([])
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const fetchPastPaper = async () => {
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
        "There Was A Problem Fetching Assignments"
      setPastPaperList([])
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  useEffect(() => {
    fetchAllPastPaperQuestion()
  }, [saved])

  const fetchAllPastPaperQuestion = async () => {
    try {
      setLoading(true)
      const response = await getAllPastPaperQuestion()
      console.log(response)
      let { pastQuestionPaper } = response.data || {}
      pastQuestionPaper = pastQuestionPaper || []
      setPastPaperQuestionList(pastQuestionPaper)
      setLoading(false)
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Fetching Assignments"
      setPastPaperQuestionList([])
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const onClickDelete = pastPaperQuestion => {
    setPastPaperQuestion(pastPaperQuestion)
    setDeleteModal(true)
  }

  const handleUpdatePastQuestionPaperStatus = async (id, status) => {
    if (!id) {
      return SaveToast({
        message: "Please Enter Past Question Paper Id",
        type: "error",
      })
    }
    try {
      const response = updatePastPaperQuestion(id, { pq_status: status })
      const message =
        response?.message || "Past Paper Question Status Updated Successfully"
      SaveToast({ message, type: "success" })

      setSaved(prevSaved => !prevSaved)
      return
    } catch (error) {
      const message =
        error?.message ||
        "There Was A Problem Updating Past Paper Question Status"
      return SaveToast({ message, type: "error" })
    }
  }

  const handleDeleteAssigmentQuestion = async () => {
    if (!pastPaperQuestion.pq_id) {
      return SaveToast({
        message: "Invalid Past Paper Question ID",
        type: "error",
      })
    }
    try {
      const response = await deletePastPaperQuestion(pastPaperQuestion.pq_id)
      const message =
        response?.message || "Past Paper Question Deleted Successfully"
      SaveToast({ message, type: "success" })

      setSaved(prevSaved => !prevSaved)
      setDeleteModal(false)
      return
    } catch (error) {
      const message =
        error?.message || "There was a problem deleting AssigmentQuestion"
      return SaveToast({ message, type: "error" })
    }
  }

  const handleAddButtonClick = () => {
    history.push({
      pathname: "/home",
      search: "?update=true", // query string
      state: {
        // location state
        update: true,
      },
    })
  }

  const columns = useMemo(
    () => [
      {
        Header: "Title",
        accessor: "pq_title",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Marks",
        accessor: "pq_mark",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Answer Type",
        accessor: "pq_questionType",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Past Paper",
        accessor: "pq_pastPaper.pp_title",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      // {
      //   Header: "Correct Answer",
      //   accessor: "aq_correntAns",
      //   filterable: true,
      //   Cell: cellProps => {
      //     return <SimpleDateFormate {...cellProps} />
      //   },
      // },
      {
        Header: "Status",
        accessor: "pq_status",
        disableFilters: true,
        Cell: cellProps => {
          const cellData = cellProps.row.original
          return (
            <div className="form-check form-switch form-switch-md">
              <input
                type="checkbox"
                className="form-check-input"
                id={`tc_status_checkbox-${cellData.pq_id}`}
                name={`tc_status_checkbox-${cellData.pq_id}`}
                defaultChecked={cellData.pq_status}
                onChange={e => {
                  let { checked, name } = e.target
                  document.getElementById(name).checked = checked
                  return handleUpdatePastQuestionPaperStatus(
                    cellData.pq_id,
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
              <Link
                to="#"
                className="text-dark"
                onClick={() => {
                  props.history.push(
                    "/past-paper-questions/view/" + cellProps.row.original.pq_id
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
                    "/past-paper-questions/edit/" + cellProps.row.original.pq_id
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
                  const pastPaperQuestionData = cellProps.row.original
                  onClickDelete(pastPaperQuestionData)
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
      accessor: "pq_title",
      filterable: false,
      Cell: cellProps => {
        return <SimpleStringValue {...cellProps} />
      },
    },
    {
      Header: "Marks",
      accessor: "pq_mark",
      filterable: true,
      Cell: cellProps => {
        return <SimpleStringValue {...cellProps} />
      },
    },
    {
      Header: "Answer Type",
      accessor: "pq_questionType",
      filterable: false,
      Cell: cellProps => {
        return <SimpleStringValue {...cellProps} />
      },
    },
    // {
    //   Header: "Correct Answer",
    //   accessor: "aq_correntAns",
    //   filterable: false,
    //   Cell: cellProps => {
    //     return <SimpleStringValue {...cellProps} />
    //   },
    // },
    {
      Header: "Status",
      accessor: "aq_status",
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
        onDeleteClick={handleDeleteAssigmentQuestion}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  {console.log("pastPaperQuestionList", pastPaperQuestionList)}
                  {allSchool && (
                    <TableContainer
                      columns={columns}
                      data={pastPaperQuestionList}
                      isGlobalFilter={true}
                      isAddOptions={true}
                      addButtonLabel="Add Questions"
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

export default AssigmentQuestion
