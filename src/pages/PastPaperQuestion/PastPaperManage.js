import React, { useMemo, useState, useEffect } from "react"
import { Link, useHistory, useLocation, useParams } from "react-router-dom"
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import TableContainer from "../../components/Common/TableContainer"

//import components
import DeleteModal from "../../components/Common/DeleteModal"

import { SimpleStringValue } from "helpers/common_helper_functions"
import { SaveToast } from "components/Common/SaveToast"
import { Col, Row, UncontrolledTooltip, Card, CardBody } from "reactstrap"

import { updateLiveSession } from "helpers/backendHelpers/liveSession"
import { getUserTypeInfo } from "helpers/authHelper"
import {
  deleteAssigmentQuestion,
  getAllAssigmentQuestion,
  getAllAssigQueByAssignFilter,
  getAllAssigQueByPastPaper,
} from "helpers/backendHelpers/assigmentQuestion"
import {
  createAssigmentQset,
  getAssigmentQsetByAssign,
  updateAssigmentQuestion,
} from "helpers/backendHelpers/assigmentQset"
import { getAssigment } from "helpers/backendHelpers/assigment"
import { getPastPaper } from "helpers/backendHelpers/pastPaper"

const AssignmentManage = props => {
  document.title = "Live Session | LMS Ghana"
  const { id } = useParams()
  const location = useLocation()
  const type = location.state?.type
  const [deleteModal, setDeleteModal] = useState(false)
  const [assigmentQuestionList, setAssigmentQuestionList] = useState([])

  const [assignmentQue, setAssignmentQue] = useState({})
  const [saved, setSaved] = useState(false)
  const [temp, setTemp] = useState(true)
  const [loading, setLoading] = useState(false)
  const [allSchool, setAllSchool] = useState([])
  const [assigmentQueId, setAssigmentQueId] = useState([])
  const [category, setCategory] = useState("")
  const [subCategory, setSubCategory] = useState("")
  const [topic, setTopic] = useState("")
  const userType = getUserTypeInfo()
  const history = useHistory()

  useEffect(() => {
    if (type == 0) {
      fetchAssigmentDetailsForEdit(id)
      fetchAssigmentQsetByAssign(id)
    } else {
      fetchPastPaperDetailsForEdit(id)
    }
    fetchQuestionsByPastPaper(id)
    fetchAssigmentQuestions(category, subCategory, topic, userType?.tc_id)
  }, [saved])

  useEffect(() => {
    if (
      category != undefined &&
      subCategory != undefined &&
      topic != undefined &&
      userType?.tc_id != undefined
    ) {
      fetchAssigmentQuestions(category, subCategory, topic, userType?.tc_id)
    }
  }, [category, subCategory, topic])

  const fetchAssigmentDetailsForEdit = async asn_id => {
    try {
      let response = await getAssigment(asn_id)
      let { assignment } = response.data || {}
      assignment = assignment || {}
      setCategory(assignment?.asn_category)
      setSubCategory(assignment?.asn_subCategory)
      setTopic(assignment?.asn_topic)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching Assignment Details details"
      return SaveToast({ message, type: "error" })
    }
  }

  const fetchAssigmentQsetByAssign = async asn_id => {
    try {
      let response = await getAssigmentQsetByAssign(asn_id)
      let { assignmentQset } = response.data || {}
      assignmentQset = assignmentQset || {}
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching Assignment Details details"
      return SaveToast({ message, type: "error" })
    }
  }
  const fetchPastPaperDetailsForEdit = async pp_id => {
    try {
      let response = await getPastPaper(pp_id)
      let { pastPaper } = response.data || {}
      pastPaper = pastPaper || {}
      setCategory(pastPaper?.pp_category)
      setSubCategory(pastPaper?.pp_subCategory)
      setTopic(pastPaper?.pp_topic)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching freelance teacher details"
      setForm(form)
      return SaveToast({ message, type: "error" })
    }
  }

  const fetchAssigmentQuestions = async (
    category,
    subCategory,
    topic,
    tc_id
  ) => {
    try {
      setLoading(true)
      const response = await getAllAssigQueByAssignFilter(
        category,
        subCategory,
        topic,
        tc_id
      )
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

  const fetchQuestionsByPastPaper = async id => {
    try {
      setLoading(true)
      const response = await getAllAssigQueByPastPaper(id)
      console.log("response11", response)
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

  const onClickDelete = assignmentQueData => {
    setAssignmentQue(assignmentQueData)
    setDeleteModal(true)
  }

  const handleUpdateAssigmentQuestionStatus = async (id, status) => {
    if (!id) {
      return SaveToast({
        message: "Please Enter Assigment Question Id",
        type: "error",
      })
    }
    try {
      const response = updateAssigmentQuestion(id, { aq_status: status })
      const message =
        response?.message || "Assigment Question Status Updated Successfully"
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
    if (!assignmentQue.aq_id) {
      return SaveToast({
        message: "Invalid AssignmentQuestion ID",
        type: "error",
      })
    }
    try {
      const response = await deleteAssigmentQuestion(assignmentQue.aq_id)
      const message =
        response?.message || "AssignmentQuestion Deleted Successfully"
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
  // Array Destructuring
  const handleAddButtonClick = async () => {
    // 1 = Assigment,2 = Past Questions
    history.push({
      pathname: "/AssignmentQuestion/add",
      state: {
        type: 2,
        id: id,
      },
    })
  }

  const toggleCheckbox = e => {
    if (e.target.checked) {
      setAssigmentQueId(pre => [...pre, parseInt(e.target.value)])
      setTemp(!temp)
    } else {
      setAssigmentQueId(pre => pre.filter(data => data != e.target.value))
    }
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
        Header: "Subject",
        accessor: "aq_subCategory",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Topic",
        accessor: "aq_topic",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
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
                }}
              >
                <i className="mdi mdi-eye font-size-18" id="viewtooltip" />
                <UncontrolledTooltip placement="top" target="viewtooltip">
                  View
                </UncontrolledTooltip>
              </Link>
              <Link
                // to="#"
                className="text-success"
                onClick={() => {
                  // props.history.push(
                  //   "/AssigmentQuestion/edit/" + cellProps.row.original.aq_id
                  // )
                  history.push({
                    pathname:
                      "/AssignmentQuestion/edit/" +
                      cellProps.row.original.aq_id,
                    state: {
                      // 1 = Assigment,2 = Past Questions
                      type: 2,
                    },
                  })
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
                  const assignmentQueData = cellProps.row.original
                  onClickDelete(assignmentQueData)
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

export default AssignmentManage
