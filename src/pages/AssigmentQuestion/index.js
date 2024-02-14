import React, { useMemo, useState, useEffect } from "react"
import { Link, useHistory } from "react-router-dom"
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import TableContainer from "../../components/Common/TableContainer"

//import components
// import Breadcrumbs from "../../components/Common/Breadcrumb"
import DeleteModal from "../../components/Common/DeleteModal"

import { SimpleStringValue } from "helpers/common_helper_functions"
import { SaveToast } from "components/Common/SaveToast"
import { Col, Row, UncontrolledTooltip, Card, CardBody } from "reactstrap"

import {
  deleteAssigmentQuestion,
  getAllAssigmentQuestion,
  updateAssigmentQuestion,
} from "helpers/backendHelpers/assigmentQuestion"
import { getUserTypeInfo } from "helpers/authHelper"

const AssigmentQuestion = props => {
  document.title = "Assignments | LMS Ghana"

  const [deleteModal, setDeleteModal] = useState(false)
  const [assigmentQuestionList, setAssigmentQuestionList] = useState([])
  const [AssigmentQuestion, setAssigmentQuestion] = useState({})
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [allSchool, setAllSchool] = useState([])
  const history = useHistory()
  const userType = getUserTypeInfo()

  useEffect(() => {
    fetchAssigmentQuestions()
  }, [saved])

  const fetchAssigmentQuestions = async () => {
    try {
      setLoading(true)
      const response = await getAllAssigmentQuestion()
      console.log(response)
      let { assignmentQuestions } = response.data || {}
      assignmentQuestions = assignmentQuestions || []
      setAssigmentQuestionList(assignmentQuestions)
      setLoading(false)
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Fetching Assignments"
      setAssigmentQuestionList([])
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const onClickDelete = AssigmentQuestionData => {
    setAssigmentQuestion(AssigmentQuestionData)
    setDeleteModal(true)
  }

  const handleUpdateAssigmentQuestionStatus = async (id, status) => {
    if (!id) {
      return SaveToast({
        message: "Please Enter Assignments Id",
        type: "error",
      })
    }
    try {
      const response = updateAssigmentQuestion(id, { aq_status: status })
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

  const handleDeleteAssigmentQuestion = async () => {
    if (!AssigmentQuestion.aq_id) {
      return SaveToast({ message: "Invalid Assignments ID", type: "error" })
    }
    try {
      const response = await deleteAssigmentQuestion(AssigmentQuestion.aq_id)
      const message = response?.message || "Assignments Deleted Successfully"
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
      pathname: "/AssignmentQuestion/add",
      state: {
        // 1 = Assigment,2 = Past Questions
        type: 1,
        id: userType?.tc_id,
      },
    })
  }

  const columns = useMemo(
    () => [
      {
        Header: "Title",
        accessor: "aq_title",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Class/Grade",
        accessor: "aq_category",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Subjects",
        accessor: "aq_subCategory",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      // {
      //   Header: "Assignment",
      //   accessor: "aq_assignment.asn_title",
      //   filterable: true,
      //   Cell: cellProps => {
      //     return <SimpleStringValue {...cellProps} />
      //   },
      // },
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
        accessor: "aq_status",
        disableFilters: true,
        Cell: cellProps => {
          const cellData = cellProps.row.original
          return (
            <div className="form-check form-switch form-switch-md">
              <input
                type="checkbox"
                className="form-check-input"
                id={`tc_status_checkbox-${cellData.aq_id}`}
                name={`tc_status_checkbox-${cellData.aq_id}`}
                defaultChecked={cellData.aq_status}
                onChange={e => {
                  let { checked, name } = e.target
                  document.getElementById(name).checked = checked
                  return handleUpdateAssigmentQuestionStatus(
                    cellData.aq_id,
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
                    "/AssignmentQuestion/view/" + cellProps.row.original.aq_id
                  )
                  // history.push({
                  //   pathname: "/AssignmentQuestion/view/" + cellProps.row.original.aq_id,
                  //   state: {
                  //     // 1 = Assigment,2 = Past Questions
                  //     type: 1,
                  //     id: userType?.tc_id
                  //   },
                  // });
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
                    "/AssignmentQuestion/edit/" + cellProps.row.original.aq_id
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
                  const AssigmentQuestionData = cellProps.row.original
                  onClickDelete(AssigmentQuestionData)
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
      accessor: "aq_title",
      filterable: false,
      Cell: cellProps => {
        return <SimpleStringValue {...cellProps} />
      },
    },
    {
      Header: "Marks",
      accessor: "aq_mark",
      filterable: true,
      Cell: cellProps => {
        return <SimpleStringValue {...cellProps} />
      },
    },
    {
      Header: "Answer Type",
      accessor: "aq_answerType",
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
                  {allSchool && (
                    <TableContainer
                      columns={columns}
                      data={assigmentQuestionList}
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
