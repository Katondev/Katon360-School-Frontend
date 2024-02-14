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
  deleteTermlyScheme,
  getAllTermlyScheme,
  updateTermlyScheme,
} from "helpers/backendHelpers/TermlyScheme"
import {
  deleteYearlyScheme,
  getAllYearlyScheme,
  updateYearlyScheme,
} from "helpers/backendHelpers/YearlyScheme"

const YearlyScheme = props => {
  document.title = "Yearly Scheme | LMS Ghana"

  const [deleteModal, setDeleteModal] = useState(false)
  const [yearlySchemeList, setYearlySchemeList] = useState([])
  const [yearlySheme, setYearlyScheme] = useState({})
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [exportData, setExportData] = useState([])

  useEffect(() => {
    fetchYearlyScheme()
  }, [saved])

  useEffect(() => {
    const filteredData = yearlySchemeList.map(item => {
      const { ysc_school, ...rest } = item
      return rest
    })
    setExportData(filteredData)
  }, [yearlySchemeList])

  const fetchYearlyScheme = async () => {
    try {
      setLoading(true)
      const response = await getAllYearlyScheme()
      let { yearlyScheme } = response.data || {}
      yearlyScheme = yearlyScheme || []
      setYearlySchemeList(yearlyScheme)
      setLoading(false)
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Fetching Yearly Scheme"
      setYearlySchemeList([])
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const onClickDelete = yearlyScheme => {
    setYearlyScheme(yearlyScheme)
    setDeleteModal(true)
  }

  const handleUpdateYearlySchemeStatus = async (id, status) => {
    if (!id) {
      return SaveToast({
        message: "Please Enter Yearly Scheme Id",
        type: "error",
      })
    }
    try {
      const response = updateYearlyScheme(id, { ysc_status: status })
      const message =
        response?.message || "Yearly Scheme Status Updated Successfully"
      SaveToast({ message, type: "success" })

      setSaved(prevSaved => !prevSaved)
      return
    } catch (error) {
      const message =
        error?.message || "There Was A Problem Updating Yearly Scheme Status"
      return SaveToast({ message, type: "error" })
    }
  }

  const handleDeleteTermlyScheme = async () => {
    if (!yearlySheme.ysc_id) {
      return SaveToast({ message: "Invalid Yearly Scheme ID", type: "error" })
    }
    try {
      const response = await deleteYearlyScheme(yearlySheme.ysc_id)
      const message = response?.message || "Yearly Scheme Deleted Successfully"
      SaveToast({ message, type: "success" })

      setSaved(prevSaved => !prevSaved)
      setDeleteModal(false)
      return
    } catch (error) {
      const message =
        error?.message || "There was a problem deleting Yearly Scheme"
      return SaveToast({ message, type: "error" })
    }
  }

  const handleAddButtonClick = () => {
    props.history.push("/yearly-scheme/add")
  }

  const columns = useMemo(
    () => [
      {
        Header: "School",
        accessor: "ysc_school.sc_schoolName",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Subject",
        accessor: "ysc_subject",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Date",
        accessor: "ysc_date",
        filterable: true,
        Cell: cellProps => {
          return <SimpleDateFormate {...cellProps} />
        },
      },
      {
        Header: "Week Number",
        accessor: "ysc_weekNumber",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Status",
        accessor: "ysc_status",
        disableFilters: true,
        Cell: cellProps => {
          const cellData = cellProps.row.original
          return (
            <div className="form-check form-switch form-switch-md">
              <input
                type="checkbox"
                className="form-check-input"
                id={`tc_status_checkbox-${cellData.ysc_id}`}
                name={`tc_status_checkbox-${cellData.ysc_id}`}
                defaultChecked={cellData.ysc_status}
                onChange={e => {
                  let { checked, name } = e.target
                  document.getElementById(name).checked = checked
                  return handleUpdateYearlySchemeStatus(
                    cellData.ysc_id,
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
                    "/yearly-scheme/view/" + cellProps.row.original.ysc_id
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
                    "/yearly-scheme/edit/" + cellProps.row.original.ysc_id
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
                  const yearlySchemeData = cellProps.row.original
                  onClickDelete(yearlySchemeData)
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
                  <TableContainer
                    columns={columns}
                    data={yearlySchemeList}
                    exportData={exportData}
                    isGlobalFilter={true}
                    isAddOptions={true}
                    addButtonLabel="Add Yearly Scheme"
                    handleAddButtonClick={handleAddButtonClick}
                    customPageSize={10}
                    className="custom-header-css"
                    dataFetchLoading={loading}
                    canExportCsv={true}
                    canPrint={true}
                    printColumns={printColumns}
                    noDataMessage="No system activity found."
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

export default YearlyScheme
