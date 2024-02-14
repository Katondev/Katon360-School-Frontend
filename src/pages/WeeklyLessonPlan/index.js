import React, { useMemo, useState, useEffect } from "react"
import { Link } from "react-router-dom"
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
  deleteWeeklyLessonPlan,
  getAllWeeklyLessonPlan,
  updateWeeklyLessonPlan,
} from "helpers/backendHelpers/weeklyLessonPlan"
import { string } from "prop-types"
// import { Parser } from 'json2csv'

const Notification = props => {
  document.title = "Termly Scheme | LMS Ghana"

  const [deleteModal, setDeleteModal] = useState(false)
  const [weeklyLessonPlanList, setWeeklyLessonPlanList] = useState([])
  const [exportData, setExportData] = useState([])
  const [weeklyLessonPlan, setWeeklyLessonPlan] = useState({})
  const [saved, setSaved] = useState(false)
  const [temp, setTemp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [allSchool, setAllSchool] = useState([])

  useEffect(() => {
    fetchWeeklyLessonNotes()
  }, [saved])

  useEffect(() => {
    const filteredData = weeklyLessonPlanList.map(item => {
      const { mon, tue, wed, thu, fri, sat, wlp_school, ...rest } = item
      return rest
    })
    setExportData(filteredData)
  }, [weeklyLessonPlanList])

  const fetchWeeklyLessonNotes = async () => {
    try {
      setLoading(true)
      const response = await getAllWeeklyLessonPlan()
      let { weeklyLessonPlan } = response.data || {}
      weeklyLessonPlan = weeklyLessonPlan || []
      console.log("weeklyLessonPlan12", weeklyLessonPlan)
      setWeeklyLessonPlanList(weeklyLessonPlan)

      setLoading(false)
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Fetching Notification"
      setWeeklyLessonPlanList([])
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }
  const data = [
    {
      id: 1,
      mon: { dwad: "dwa" },
      thu: null,
      fri: null,
    },
    {
      id: 2,
      mon: { dwad: "dwa" },
      thu: null,
      fri: null,
    },
    {
      id: 3,
      mon: { dwad: "dwa" },
      thu: null,
      fri: null,
    },
  ]
  const onClickDelete = teacher => {
    setWeeklyLessonPlan(teacher)
    setDeleteModal(true)
  }

  const handleUpdateLessonPlanStatus = async (id, status) => {
    if (!id) {
      return SaveToast({
        message: "Please Enter Weekly Lesson Plan Id",
        type: "error",
      })
    }
    try {
      const response = updateWeeklyLessonPlan(id, { wlp_status: status })
      const message =
        response?.message || "Lesson Plan Status Updated Successfully"
      SaveToast({ message, type: "success" })

      setSaved(prevSaved => !prevSaved)
      return
    } catch (error) {
      const message =
        error?.message || "There Was A Problem Updating Notification Status"
      return SaveToast({ message, type: "error" })
    }
  }

  const handleDeleteWeeklyLessonPlan = async () => {
    if (!weeklyLessonPlan.wlp_id) {
      return SaveToast({
        message: "Invalid Weekly Lesson Plan ID",
        type: "error",
      })
    }
    try {
      const response = await deleteWeeklyLessonPlan(weeklyLessonPlan.wlp_id)
      const message =
        response?.message || "Weekly Lesson Plan Deleted Successfully"
      SaveToast({ message, type: "success" })

      setSaved(prevSaved => !prevSaved)
      setDeleteModal(false)
      return
    } catch (error) {
      const message =
        error?.message || "There was a problem deleting weeklyLessonPlan"
      return SaveToast({ message, type: "error" })
    }
  }

  const handleAddButtonClick = () => {
    props.history.push("/lesson-notes/add")
  }

  const columns = useMemo(
    () => [
      {
        Header: "School",
        accessor: "wlp_school.sc_schoolName",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Subject",
        accessor: "wlp_subject",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Class",
        accessor: "wlp_classId",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Status",
        accessor: "wlp_status",
        disableFilters: true,
        Cell: cellProps => {
          const cellData = cellProps.row.original
          return (
            <div className="form-check form-switch form-switch-md">
              <input
                type="checkbox"
                className="form-check-input"
                id={`tc_status_checkbox-${cellData.wlp_id}`}
                name={`tc_status_checkbox-${cellData.wlp_id}`}
                defaultChecked={cellData.wlp_status}
                onChange={e => {
                  let { checked, name } = e.target
                  document.getElementById(name).checked = checked
                  return handleUpdateLessonPlanStatus(cellData.wlp_id, checked)
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
                    "/lesson-notes/view/" + cellProps.row.original.wlp_id
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
                    "/lesson-notes/edit/" + cellProps.row.original.wlp_id
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
                  const termlySchemeData = cellProps.row.original
                  onClickDelete(termlySchemeData)
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

  const data1 = [
    {
      wlp_id: 1,
      wlp_name: "new name",
      mon: String({
        phase1: "Monday",
        phase2: "Tuesday",
        phase3: "Wedsnday",
      }),
    },
    {
      wlp_id: 2,
      wlp_name: "new name",
    },
    {
      wlp_id: 3,
      wlp_name: "new name",
    },
  ]

  const getCSVData = () => {
    const data = [
      {
        wlp_id: 1,
        wlp_name: "dwad",
        mon: JSON.stringify({ phase1: "mon", phase2: "tue", phase3: "wed" }),
      },
      {
        wlp_id: 2,
        wlp_name: "dwad2",
        mon: { phase1: "mon", phase2: "tue", phase3: "wed" },
      },
    ]

    const csvData = []

    // Add the header row
    csvData.push([
      "wlp_id",
      "wlp_name",
      "mon.phase1",
      "mon.phase2",
      "mon.phase3",
    ])

    // Add the data rows
    data.forEach(row => {
      csvData.push([
        row.wlp_id,
        row.wlp_name,
        row.mon.phase1,
        row.mon.phase2,
        row.mon.phase3,
      ])
    })

    return csvData
  }

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteWeeklyLessonPlan}
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
                      data1={data1}
                      columns={columns}
                      data={weeklyLessonPlanList}
                      exportData={exportData}
                      isGlobalFilter={true}
                      isAddOptions={true}
                      addButtonLabel="Add Lesson Notes"
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

export default Notification
