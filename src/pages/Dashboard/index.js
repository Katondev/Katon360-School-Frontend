import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
} from "reactstrap"
import { Link } from "react-router-dom"

import classNames from "classnames"

//import Charts
import StackedColumnChart from "./StackedColumnChart"

//import action
import { getChartsData as onGetChartsData } from "../../store/actions"

import modalimage1 from "../../assets/images/product/img-7.png"
import modalimage2 from "../../assets/images/product/img-4.png"

// Pages Components
import WelcomeComp from "./WelcomeComp"
import MonthlyEarning from "./MonthlyEarning"
import SocialSource from "./SocialSource"
import ActivityComp from "./ActivityComp"
import TopCities from "./TopCities"
import LatestTranaction from "./LatestTranaction"

//i18n
import { withTranslation } from "react-i18next"

//redux
import { useSelector, useDispatch } from "react-redux"
import { getSchool } from "helpers/backendHelpers/school"
import { getAllClassroom } from "helpers/backendHelpers/classroom"
import { getAllStudents } from "helpers/backendHelpers/students"
import { getAllSchoolTeachers } from "helpers/backendHelpers/schoolTeachers"
import { SaveToast } from "components/Common/SaveToast"
import { getBookDownloadCount } from "helpers/backendHelpers/schoolBook"

const Dashboard = props => {
  const [modal, setmodal] = useState(false)
  const [subscribemodal, setSubscribemodal] = useState(false)
  const [school, setSchool] = useState({})
  const [classRooms, setClassRooms] = useState({})
  const [student, setStudents] = useState({})
  const [teacher, setTeachers] = useState({})
  const userType = JSON.parse(localStorage.getItem("userInfoSchool"))
  const [studentCount, setStudentCount] = useState(0)
  const [teacherCount, setTeacherCount] = useState(0)
  const [downloadCount, setDownloadCount] = useState(null)

  const { chartsData } = useSelector(state => ({
    chartsData: state.Dashboard.chartsData,
  }))

  const reports = [
    {
      title: "Total Teachers",
      iconClass: "bx-user",
      // description: `${classRooms.length ? classRooms.length : 0}`,
      description: teacherCount ? teacherCount : " - ",
    },
    {
      title: "Total Students",
      iconClass: "bx-user",
      // description: `${teacher.length ? teacher.length : 0}`,
      description: studentCount ? studentCount : " - ",
    },
    {
      title: "E-Books Download",
      iconClass: "bx-book",
      // description: `${student.length ? student.length : 0}`,
      description:
        downloadCount && downloadCount.eBookDownload
          ? downloadCount.eBookDownload
          : " - ",
    },
    {
      title: "Videos Download",
      iconClass: "bx-video",
      // description: `${student.length ? student.length : 0}`,
      description:
        downloadCount && downloadCount.videoDownload
          ? downloadCount.videoDownload
          : " - ",
    },
  ]

  useEffect(() => {
    setTimeout(() => {
      setSubscribemodal(false)
    }, 2000)
  }, [])

  const [periodData, setPeriodData] = useState([])
  const [periodType, setPeriodType] = useState("yearly")

  useEffect(() => {
    setPeriodData(chartsData)
  }, [chartsData])

  const onChangeChartPeriod = pType => {
    setPeriodType(pType)
    dispatch(onGetChartsData(pType))
  }

  // const dispatch = useDispatch()
  // useEffect(() => {
  //   dispatch(onGetChartsData("yearly"))
  // }, [dispatch])

  useEffect(() => {
    fetchEditSchoolDetails()
    getAllClassrooms()
    fetchAllStudents()
    fetchAllTeachers()
    fetchBookDownloadDetails()
  }, [])

  const fetchEditSchoolDetails = async () => {
    try {
      let body = {
        sc_id: userType?.sc_id,
      }
      const response = await getSchool(body)

      let { school } = response.data || {}
      school = school || {}

      return setSchool(school)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching freelance school details"

      setSchool({})
      return SaveToast({ message, type: "error" })
    }
  }

  const getAllClassrooms = async () => {
    try {
      let response = await getAllClassroom()
      let { classRooms } = response.data || {}
      classRooms = classRooms || []
      setClassRooms(classRooms)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching classrooms"
      setClassRooms([])
      return SaveToast({ message, type: "error" })
    }
  }

  const fetchAllStudents = async () => {
    try {
      let response = await getAllStudents()
      let { students } = response.data
      students = students || []
      setStudents(students)
      setStudentCount(students.length)
    } catch (error) {
      let message = error?.message || "There was problem fetching students"
      setStudents([])

      return SaveToast({ message, type: "error" })
    }
  }

  const fetchAllTeachers = async () => {
    try {
      const response = await getAllSchoolTeachers()
      let { teachers } = response.data || {}
      teachers = teachers || []
      setTeachers(teachers)
      setTeacherCount(teachers.length)
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Fetching Teachers"
      setTeachers([])

      return SaveToast({ message, type: "error" })
    }
  }

  const fetchBookDownloadDetails = async () => {
    try {
      const response = await getBookDownloadCount()
      setDownloadCount(response.data.bookCountDetail)
    } catch (error) {}
  }

  //meta title
  document.title = "Dashboard | Skote - React Admin & Dashboard Template"

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            {/* <Col xl="4">
              <WelcomeComp school={school} />
              <MonthlyEarning />
            </Col> */}
            <Col xl="12">
              <Row>
                {/* Reports Render */}
                {reports.map((report, key) => (
                  <Col md="3" key={"_col_" + key}>
                    <Card className="mini-stats-wid">
                      <CardBody>
                        <div className="d-flex">
                          <div className="flex-grow-1">
                            <p className="text-muted fw-medium">
                              {report.title}
                            </p>
                            <h4 className="mb-0">{report.description}</h4>
                          </div>
                          <div className="avatar-sm rounded-circle bg-dark align-self-center mini-stat-icon">
                            <span className="avatar-title rounded-circle bg-dark">
                              <i
                                className={
                                  "bx " + report.iconClass + " font-size-24"
                                }
                              ></i>
                            </span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* <Card>
                <CardBody>
                  <div className="d-sm-flex flex-wrap">
                    <h4 className="card-title mb-4">Email Sent</h4>
                    <div className="ms-auto">
                      <ul className="nav nav-pills">
                        <li className="nav-item">
                          <Link
                            to="#"
                            className={classNames(
                              { active: periodType === "weekly" },
                              "nav-link"
                            )}
                            onClick={() => {
                              onChangeChartPeriod("weekly")
                            }}
                            id="one_month"
                          >
                            Week
                          </Link>{" "}
                        </li>
                        <li className="nav-item">
                          <Link
                            to="#"
                            className={classNames(
                              { active: periodType === "monthly" },
                              "nav-link"
                            )}
                            onClick={() => {
                              onChangeChartPeriod("monthly")
                            }}
                            id="one_month"
                          >
                            Month
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            to="#"
                            className={classNames(
                              { active: periodType === "yearly" },
                              "nav-link"
                            )}
                            onClick={() => {
                              onChangeChartPeriod("yearly")
                            }}
                            id="one_month"
                          >
                            Year
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <StackedColumnChart periodData={periodData} />
                </CardBody>
              </Card> */}
            </Col>
          </Row>

          <Row>
            <Col xl="6">
              <SocialSource />
            </Col>
            <Col xl="6">
              <ActivityComp />
            </Col>

            {/* <Col xl="4">
              <TopCities />
            </Col> */}
          </Row>

          {/* <Row>
            <Col lg="12">
              <LatestTranaction />
            </Col>
          </Row> */}
        </Container>
      </div>

      {/* subscribe ModalHeader */}
      <Modal
        isOpen={subscribemodal}
        role="dialog"
        autoFocus={true}
        centered
        data-toggle="modal"
        toggle={() => {
          setSubscribemodal(!subscribemodal)
        }}
      >
        <div>
          <ModalHeader
            className="border-bottom-0"
            toggle={() => {
              setSubscribemodal(!subscribemodal)
            }}
          ></ModalHeader>
        </div>
        <div className="modal-body">
          <div className="text-center mb-4">
            <div className="avatar-md mx-auto mb-4">
              <div className="avatar-title bg-light  rounded-circle text-dark h1">
                <i className="mdi mdi-email-open"></i>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-xl-10">
                <h4 className="text-dark">Subscribe !</h4>
                <p className="text-muted font-size-14 mb-4">
                  Subscribe our newletter and get notification to stay update.
                </p>

                <div className="input-group rounded bg-light">
                  <Input
                    type="email"
                    className="form-control bg-transparent border-0"
                    placeholder="Enter Email address"
                  />
                  <Button color="primary" type="button" id="button-addon2">
                    <i className="bx bxs-paper-plane"></i>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={modal}
        role="dialog"
        autoFocus={true}
        centered={true}
        className="exampleModal"
        tabIndex="-1"
        toggle={() => {
          setmodal(!modal)
        }}
      >
        <div>
          <ModalHeader
            toggle={() => {
              setmodal(!modal)
            }}
          >
            Order Details
          </ModalHeader>
          <ModalBody>
            <p className="mb-2">
              Product id: <span className="text-dark">#SK2540</span>
            </p>
            <p className="mb-4">
              Billing Name: <span className="text-dark">Neal Matthews</span>
            </p>

            <div className="table-responsive">
              <Table className="table table-centered table-nowrap">
                <thead>
                  <tr>
                    <th scope="col">Product</th>
                    <th scope="col">Product Name</th>
                    <th scope="col">Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">
                      <div>
                        <img src={modalimage1} alt="" className="avatar-sm" />
                      </div>
                    </th>
                    <td>
                      <div>
                        <h5 className="text-truncate font-size-14">
                          Wireless Headphone (Black)
                        </h5>
                        <p className="text-muted mb-0">$ 225 x 1</p>
                      </div>
                    </td>
                    <td>$ 255</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <div>
                        <img src={modalimage2} alt="" className="avatar-sm" />
                      </div>
                    </th>
                    <td>
                      <div>
                        <h5 className="text-truncate font-size-14">
                          Hoodie (Blue)
                        </h5>
                        <p className="text-muted mb-0">$ 145 x 1</p>
                      </div>
                    </td>
                    <td>$ 145</td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <h6 className="m-0 text-end">Sub Total:</h6>
                    </td>
                    <td>$ 400</td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <h6 className="m-0 text-end">Shipping:</h6>
                    </td>
                    <td>Free</td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <h6 className="m-0 text-end">Total:</h6>
                    </td>
                    <td>$ 400</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              color="secondary"
              onClick={() => {
                setmodal(!modal)
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </React.Fragment>
  )
}

Dashboard.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
}

export default withTranslation()(Dashboard)
