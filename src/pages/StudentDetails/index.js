// src/components/filter.
import React, { useMemo, useState, useEffect } from "react"
import PropTypes from "prop-types"
import {
  Button,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Card,
  CardImg,
  CardText,
  CardBody,
} from "reactstrap"
import AttendanceChart from "./AttendanceChart"
import ExamScoreChart from "./ExamScoreChart"
import ExamScoreChart1 from "./ExamScoreChart1"
import Notifications from "./Notifications"
import { getStudent } from "helpers/backendHelpers/students"

import { IMAGE_URL } from "helpers/urlHelper"

function StudentDetails(props) {
  //meta title
  document.title = "Student Details | LMS Ghana"

  const [activeAreaTab, setActiveAreaTab] = useState(1)
  const [studentData, setStudentData] = useState({})
  const [studentId, setStudentId] = useState("")
  const userType = JSON.parse(localStorage.getItem("userInfoSchool"))
  useEffect(() => {
    fetchStudentData()
  }, [])

  const fetchStudentData = async () => {
    let { id } = props.match.params || {}
    setStudentId(id ? id : "")
    if (id) {
      try {
        let body = {
          sc_id: userType?.sc_id
        }
        let response = await getStudent(id, body)
        let { student } = response.data
        setStudentData(student)
      } catch (error) {
        let message =
          error?.response?.data?.message ||
          error?.message ||
          "There was problem fetching student"
        return SaveToast({ message, type: "error" })
      }
    }
  }

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Row className="mt-3">
          <Col className="text-info">
            <span style={{ fontSize: "2rem" }}>{studentData.st_fullName} </span>
          </Col>

          <Col className="text-end">
            <Button
              color="dark"
              onClick={() => {
                props.history.push("/students")
              }}
            >
              Back
            </Button>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col xs={12} className="mb-3">
            <Card>
              <Row className="no-gutters align-items-center">
                <Col md={3}>
                  <CardImg
                    className="img-fluid"
                    src={`${IMAGE_URL}/${studentData.st_profilePic}`}
                    alt={studentData.st_fullName}
                  />
                </Col>

                <Col md={9}>
                  <CardBody>
                    <Row>
                      <Col></Col>
                    </Row>
                    <Row>
                      <Col>
                        <CardText>
                          Status:{" "}
                          <i
                            className={`mdi mdi-circle text-${studentData.st_status ? "success" : "danger"
                              } align-middle me-1`}
                          />
                          {studentData.st_status ? "Active" : "Inactive"}
                        </CardText>
                        <CardText>{studentData.st_phoneNumber}</CardText>
                        <CardText>{studentData.st_address}</CardText>
                      </Col>
                      <Col md={4}>
                        <CardText>
                          Classroom:{" "}
                          {`${studentData.st_classRoom?.cr_class}-${studentData.st_classRoom?.cr_division}`}
                        </CardText>
                        <CardText>{studentData.st_altPhoneNumber}</CardText>
                        <CardText>
                          {`${studentData.st_circuit}, ${studentData.st_district}, ${studentData.st_region},`}
                        </CardText>
                      </Col>
                      <Col md={4}>
                        <CardText>{studentData.st_email}</CardText>
                        <CardText>
                          Date Of Birth: {studentData.st_dateOfBirth}
                        </CardText>
                        <CardText>
                          Blood Group: {studentData.st_bloodGroup}
                        </CardText>
                      </Col>
                    </Row>
                  </CardBody>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Nav tabs>
          <NavItem>
            <NavLink
              className={activeAreaTab === 1 && "active"}
              onClick={() => {
                setActiveAreaTab(1)
              }}
            >
              Attendance
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeAreaTab === 2 && "active"}
              onClick={() => {
                setActiveAreaTab(2)
              }}
            >
              Exam Score
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeAreaTab === 3 && "active"}
              onClick={() => {
                setActiveAreaTab(3)
              }}
            >
              Notifications
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeAreaTab}>
          <TabPane tabId={1}>
            <Row className="mt-3">
              <Col>
                <Card>
                  <CardBody>
                    <AttendanceChart />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId={2}>
            <Row className="mt-3">
              <Col md={6} sm={12} xs={12}>
                <Card>
                  <CardBody>
                    <ExamScoreChart />
                  </CardBody>
                </Card>
              </Col>
              <Col md={6} sm={12} xs={12}>
                <Card>
                  <CardBody>
                    <ExamScoreChart1 />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId={3}>
            <Row className="mt-3">
              <Col>
                <Card>
                  <CardBody>
                    <Notifications />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </div>
    </div>
  )
}

StudentDetails.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
}

export default StudentDetails
