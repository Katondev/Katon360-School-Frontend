import React, { useMemo, useState, useEffect } from "react"
import { Link, useLocation, useParams } from "react-router-dom"
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
} from "helpers/backendHelpers/assigmentQuestion"
import {
  createAssigmentQset,
  getAssigmentQsetByAssign,
} from "helpers/backendHelpers/assigmentQset"
import { getAssigment } from "helpers/backendHelpers/assigment"
import { getPastPaper } from "helpers/backendHelpers/pastPaper"

const AssignmentManage = props => {
  document.title = "Live Session | LMS Ghana"
  const { id } = useParams()
  const location = useLocation()
  const type = location.state?.type
  const selectedCategory = location.state?.category
  const selectedSubCategory = location.state?.subCategory
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
  const [values, setValues] = useState({})

  useEffect(() => {
    if (type == 0) {
      fetchAssigmentQsetByAssign(id)
      fetchAssigmentDetailsForEdit(id)
    } else {
      fetchPastPaperDetailsForEdit(id)
    }

    fetchAssigmentQuestions()
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
      setAssigmentQueId(assignmentQset?.aq_id ? assignmentQset?.aq_id : [])
      setTemp(!temp)
      assignmentQset?.aq_id &&
        assignmentQset?.aq_id.map(data => {
          return setValues(pre => ({
            ...pre,
            [`${data}`]: true,
          }))
        })
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

  const fetchAssigmentQuestions = async () => {
    try {
      setLoading(true)
      const response = await getAllAssigQueByAssignFilter(
        selectedCategory,
        selectedSubCategory
      )

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

  useEffect(() => {
    console.log("values11", values)
  }, [values])

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

  const handleAddButtonClick = async () => {
    let tempVals = Object.entries(values)
    let finalIds = []
    tempVals.map(([key, val]) => {
      if (val) {
        finalIds.push(key)
      }
    })
    let selectedAssignQue = {}
    if (type == 0) {
      selectedAssignQue = {
        asn_id: id,
        aq_id: finalIds.toString(),
      }
    } else {
      selectedAssignQue = {
        pp_id: id,
        aq_id: finalIds.toString(),
      }
    }
    try {
      const response = await createAssigmentQset(selectedAssignQue)
      const message = response?.message || "AssignmentQset Added Successfully"
      SaveToast({ message, type: "success" })

      setSaved(prevSaved => !prevSaved)
      setDeleteModal(false)
      return
    } catch (error) {
      console.log("error11", error)
      const errorMsg = error?.response?.data?.error?.errors?.aq_id
      const message = errorMsg || "There was a problem deleting liveSession"
      return SaveToast({ message, type: "error" })
    }
  }

  const toggleCheckbox = e => {
    setValues(pre => ({
      ...pre,
      [e.target.name]: e.target.checked,
    }))
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
        Header: "select",
        accessor: "",
        disableFilters: true,
        Cell: cellProps => {
          const cellData = cellProps.row.original
          return (
            <div className="">
              <input
                type="checkbox"
                className="form-check-input"
                id={`tc_status_checkbox-${cellData.aq_id}`}
                name={`${cellData.aq_id}`}
                value={values[`${cellData.aq_id}`]}
                onChange={toggleCheckbox}
                onClick={e => {
                  setValues(pre => ({
                    ...pre,
                    [e.target.name]: e.target.checked,
                  }))
                }}
                defaultChecked={values && values[`${cellData.aq_id}`]}
              />
            </div>
          )
        },
      },
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
    ],
    [temp]
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
                  {assigmentQueId && (
                    <TableContainer
                      columns={columns}
                      data={assigmentQuestionList}
                      isGlobalFilter={true}
                      isAddOptions={true}
                      addButtonLabel="Save Questions"
                      handleAddButtonClick={handleAddButtonClick}
                      customPageSize={10}
                      isShowPlusIcon={false}
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
