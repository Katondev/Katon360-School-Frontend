import React, { useMemo, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import TableContainer from "../../components/Common/TableContainer"

//import components
import DeleteModal from "../../components/Common/DeleteModal"

import { SimpleStringValue } from "helpers/common_helper_functions"

import { Col, Row, UncontrolledTooltip, Card, CardBody } from "reactstrap"
import { SaveToast } from "components/Common/SaveToast"

import {
  deleteQuestionBank,
  getAllQuestionBank,
} from "helpers/backendHelpers/questionBank"
const QuestionBanks = props => {
  document.title = "Question Bank | LMS Ghana"

  const [deleteModal, setDeleteModal] = useState(false)
  const [questions, setQuestions] = useState([])
  const [saved, setSaved] = useState(false)

  const [question, setQuestion] = useState({})
  const [loading, setLoading] = useState(false)
  const [exportData, setExportData] = useState([])

  useEffect(() => {
    fetchAllQuestion()
  }, [saved])

  useEffect(() => {
    const filteredData = questions.map(item => {
      const { qb_class, ...rest } = item
      return rest
    })
    setExportData(filteredData)
  }, [questions])

  const fetchAllQuestion = async () => {
    try {
      setLoading(true)
      const response = await getAllQuestionBank()
      let { questions } = response.data
      questions = questions || []
      setQuestions(questions)
      setLoading(false)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was problem fetching questions"
      setQuestions([])
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }
  const onClickDelete = questionBank => {
    setQuestion(questionBank)
    setDeleteModal(true)
  }

  const handleDeleteQuestionBank = async () => {
    if (!question.qb_id) {
      return SaveToast({ message: "Invalid Question ID", type: "error" })
    }
    try {
      const response = await deleteQuestionBank(question.qb_id)
      const message = response?.message || "Question Deleted Successfully"
      SaveToast({ message, type: "success" })
      setSaved(prevSaved => !prevSaved)
      setDeleteModal(false)
      return
    } catch (error) {
      const message = error?.message || "There Was A Problem Deleting Question"
      return SaveToast({ message, type: "error" })
    }
  }

  const handleAddButtonClick = () => {
    props.history.push("/question-bank/add")
  }

  const columns = useMemo(
    () => [
      {
        Header: "Class",
        accessor: "qb_class",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Subject",
        accessor: "qb_subject",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Question Title",
        accessor: "qb_questionTitle",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
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
                    "/question-bank/view/" + cellProps.row.original.qb_id
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
                    "/question-bank/edit/" + cellProps.row.original.qb_id
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
                  onClickDelete(cellProps.row.original)
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
        onDeleteClick={handleDeleteQuestionBank}
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
                    data={questions}
                    exportData={exportData}
                    isGlobalFilter={true}
                    isAddOptions={true}
                    addButtonLabel="Add Question"
                    handleAddButtonClick={handleAddButtonClick}
                    customPageSize={10}
                    className="custom-header-css"
                    canExportCsv={true}
                    canPrint={true}
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

export default QuestionBanks
