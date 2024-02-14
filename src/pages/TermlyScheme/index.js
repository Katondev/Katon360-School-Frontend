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
  ShowTermNumber,
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
  deleteTermlyScheme,
  getAllTermlyScheme,
  updateTermlyScheme,
} from "helpers/backendHelpers/TermlyScheme"
import { getAllSchool } from "helpers/backendHelpers/school"

const Notification = props => {
  document.title = "Termly Scheme | LMS Ghana"

  const [deleteModal, setDeleteModal] = useState(false)
  const [termlySchemeList, setTermlySchemeList] = useState([])
  const [termlySheme, setTermlyScheme] = useState({})
  const [saved, setSaved] = useState(false)
  const [temp, setTemp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [allSchool, setAllSchool] = useState([])
  const [exportData, setExportData] = useState([])

  useEffect(() => {
    fetchTermlyScheme()
  }, [saved])

  useEffect(() => {
    const filteredData = termlySchemeList.map(item => {
      const { tsc_allData, tsc_school, ...rest } = item
      return rest
    })
    setExportData(filteredData)
  }, [termlySchemeList])

  const fetchTermlyScheme = async () => {
    try {
      setLoading(true)
      const response = await getAllTermlyScheme()
      let { termlyScheme } = response.data || {}
      termlyScheme = termlyScheme || []

      setTermlySchemeList(termlyScheme)
      setLoading(false)
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Fetching Notification"
      setTermlySchemeList([])
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const onClickDelete = teacher => {
    setTermlyScheme(teacher)
    setDeleteModal(true)
  }

  const handleUpdateTermlySchemeStatus = async (id, status) => {
    if (!id) {
      return SaveToast({
        message: "Please Enter Termly Scheme Id",
        type: "error",
      })
    }
    try {
      const response = updateTermlyScheme(id, { tsc_status: status }, 2)
      const message =
        response?.message || "Termly Scheme Status Updated Successfully"
      SaveToast({ message, type: "success" })

      setSaved(prevSaved => !prevSaved)
      return
    } catch (error) {
      const message =
        error?.message || "There Was A Problem Updating Notification Status"
      return SaveToast({ message, type: "error" })
    }
  }

  const handleDeleteTermlyScheme = async () => {
    if (!termlySheme.tsc_id) {
      return SaveToast({ message: "Invalid Termly Scheme ID", type: "error" })
    }
    try {
      const response = await deleteTermlyScheme(termlySheme.tsc_id)
      const message = response?.message || "Termly Scheme Deleted Successfully"
      SaveToast({ message, type: "success" })

      setSaved(prevSaved => !prevSaved)
      setDeleteModal(false)
      return
    } catch (error) {
      const message =
        error?.message || "There was a problem deleting termlySheme"
      return SaveToast({ message, type: "error" })
    }
  }

  const handleAddButtonClick = () => {
    props.history.push("/termly-scheme/add")
  }

  const columns = useMemo(
    () => [
      {
        Header: "School",
        accessor: "tsc_school.sc_schoolName",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Subject",
        accessor: "tsc_subject",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Date",
        accessor: "tsc_date",
        filterable: true,
        Cell: cellProps => {
          return <SimpleDateFormate {...cellProps} />
        },
      },
      {
        Header: "Term Number",
        accessor: "tsc_termNumber",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Status",
        accessor: "tsc_status",
        disableFilters: true,
        Cell: cellProps => {
          const cellData = cellProps.row.original
          return (
            <div className="form-check form-switch form-switch-md">
              <input
                type="checkbox"
                className="form-check-input"
                id={`tc_status_checkbox-${cellData.tsc_id}`}
                name={`tc_status_checkbox-${cellData.tsc_id}`}
                defaultChecked={cellData.tsc_status}
                onChange={e => {
                  let { checked, name } = e.target
                  document.getElementById(name).checked = checked
                  return handleUpdateTermlySchemeStatus(
                    cellData.tsc_id,
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
                className="text-success"
                onClick={() => {
                  props.history.push(
                    "/termly-scheme/edit/" + cellProps.row.original.tsc_id
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

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteTermlyScheme}
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
                      data={termlySchemeList}
                      exportData={exportData}
                      isGlobalFilter={true}
                      isAddOptions={true}
                      addButtonLabel="Add Termly Scheme"
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
