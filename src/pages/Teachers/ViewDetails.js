import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import {
  Button,
  Col,
  Row,
  Card,
  CardImg,
  CardBody,
  CardText,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap"
import AttendanceChart from "./AttendanceChart"
import Notifications from "./Notifications"
import Lightbox from "react-image-lightbox"
import "react-image-lightbox/style.css"
import { getTeacher } from "helpers/backendHelpers/schoolTeachers"
import { IMAGE_URL } from "helpers/urlHelper"

const ViewDetails = props => {
  const [teacherId, setTeacherId] = useState(0)
  const [teacherData, setTeacherData] = useState(props.teacherData || {})
  const [isEffects, setisEffects] = useState(false)
  const [activeAreaTab, setActiveAreaTab] = useState(1)

  useEffect(() => {
    let { id } = props.match.params || {}
    setTeacherId(parseInt(id))

    if (id) {
      let teacherData = {}
      getTeacher(id)
        .then(resp => {
          teacherData = resp.data.teacher

          Object.keys(teacherData).forEach(key => {
            if (teacherData[key] === null) {
              delete teacherData[key]
            }
          })
          setTeacherData(teacherData)
        })
        .catch(err => {})
    }
  }, [])

  return (
    <React.Fragment>
      {isEffects ? (
        <Lightbox
          mainSrc={`${IMAGE_URL}/${teacherData?.tc_degreeCertificate}`}
          enableZoom={false}
          onCloseRequest={() => {
            setisEffects(!isEffects)
          }}
        />
      ) : null}
      <Row className="mt-3">
        <Col>
          <span className="text-info" style={{ fontSize: "2rem" }}>
            {teacherData.tc_fullName}{" "}
          </span>
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
                <CardImg
                  style={{ objectFit: "cover", maxHeight: "200px" }}
                  className="img-fluid"
                  src={`${IMAGE_URL}/${teacherData?.tc_profilePic}`}
                  alt="Profile"
                />
              </Col>
              <Col md={9}>
                <CardBody>
                  <Row>
                    <Col md={4}>
                      <CardText>Staff Id: {teacherData.tc_staffId}</CardText>
                      <CardText>{teacherData.tc_phoneNumber}</CardText>
                      <CardText>{teacherData.tc_email}</CardText>
                    </Col>
                    <Col md={4}>
                      <CardText>{teacherData.tc_altPhoneNumber}</CardText>
                      <CardText>{teacherData.tc_education}</CardText>
                      <CardText>{teacherData.tc_address}</CardText>
                    </Col>
                    <Col md={4}>
                      <img
                        src={`${IMAGE_URL}/${teacherData?.tc_degreeCertificate}`}
                        alt="Degree Certificate"
                        onClick={() => {
                          setisEffects(true)
                        }}
                        className="avatar-lg img-thumbnail"
                      />
                      <CardText>
                        Status:{" "}
                        <span>
                          <i
                            className={`mdi mdi-circle text-${
                              teacherData.tc_status ? "success" : "danger"
                            } align-middle me-1`}
                          />
                        </span>
                        <span style={{ fontColor: "black" }}>
                          {teacherData.tc_status ? "Active" : "Inactive"} 
                        </span>
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
          {" "}
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
    </React.Fragment>
  )
}

ViewDetails.propTypes = {
  teacherData: PropTypes.object.isRequired,
}

export default ViewDetails
