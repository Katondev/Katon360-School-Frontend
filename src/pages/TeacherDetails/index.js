// src/components/filter.
import React, { useMemo, useState, useEffect } from "react"
import PropTypes from "prop-types"
import { Link, useParams } from "react-router-dom"
import profile from "assets/images/teachers/teacher2.jpg"
import { teachers } from "../../common/data/teachers"

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
  CardTitle,
} from "reactstrap"

import AttendanceChart from "./AttendanceChart"
import Notifications from "./Notifications"
import certificate from "assets/images/teachers/certificate.jpg"

import Lightbox from "react-image-lightbox"
import "react-image-lightbox/style.css"

function TeacherDetails(props) {
  //meta title
  document.title = "Teacher Details | LMS Ghana"

  const [activeAreaTab, setActiveAreaTab] = useState(1)
  const [teacherData, setTeacherData] = useState({})
  const [isEffects, setisEffects] = useState(false)

  const { id } = useParams()
  useEffect(() => {
    if (props.match.params.id) {
      let student = teachers.find(s => s.id === parseInt(props.match.params.id))
      setTeacherData(student)
    }
  }, [teacherData])

  return (
    <div className="page-content">
      {isEffects ? (
        <Lightbox
          mainSrc={certificate}
          enableZoom={false}
          onCloseRequest={() => {
            setisEffects(!isEffects)
          }}
        />
      ) : null}
      <div className="container-fluid">
        <Row className="mt-3">
          <Col className="text-info">
            <span style={{ fontSize: "2rem" }}>{teacherData.fullName} </span>
          </Col>
          <Col className="text-end">
            <Button
              color="dark"
              onClick={() => {
                props.history.push("/teachers")
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
                  <CardImg className="img-fluid" src={profile} alt="Skote" />
                </Col>
                <Col md={9}>
                  <CardBody>
                    <Row>
                      <Col md={4}>
                        <CardText>
                          Status:{" "}
                          <i
                            className={`mdi mdi-circle text-${
                              teacherData.status ? "success" : "danger"
                            } align-middle me-1`}
                          />
                          {teacherData.status ? "Active" : "Inactive"}
                        </CardText>
                        <CardText>Staff Id: {teacherData.staffId}</CardText>
                        <CardText>{teacherData.phoneNumber}</CardText>
                        <CardText>{teacherData.email}</CardText>
                        <CardText>
                          {`${teacherData.circuit}, ${teacherData.district}, ${teacherData.region},`}
                        </CardText>
                      </Col>
                      <Col md={4}>
                        <CardText>
                          Class Teacher:{" "}
                          {`${teacherData.class + " " + teacherData.division}`}
                        </CardText>
                        <CardText>{teacherData.altPhoneNumber}</CardText>
                        <CardText>Education: {teacherData.education}</CardText>
                        <CardText>
                          Date Of Birth: {teacherData.dateOfBirth}
                        </CardText>
                        <CardText>{teacherData.address}</CardText>
                      </Col>
                      <Col md={4}>
                        <CardText>
                          Blood Group: {teacherData.bloodGroup}
                        </CardText>
                        <img
                          src={certificate}
                          alt="Degree_Certificate"
                          onClick={() => {
                            setisEffects(true)
                          }}
                          className="avatar-lg img-thumbnail"
                        />
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

TeacherDetails.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
}

export default TeacherDetails
