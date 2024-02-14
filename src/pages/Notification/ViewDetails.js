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
import { getNotification } from "../../helpers/backendHelpers/Notification"
import Lightbox from "react-image-lightbox"
import "react-image-lightbox/style.css"
import { getTeacher } from "helpers/backendHelpers/schoolTeachers"
import { IMAGE_URL } from "helpers/urlHelper"

const ViewDetails = props => {
  const [notificationId, setNotificationId] = useState(0)
  const [notificationData, setNotificationData] = useState(
    props.NotificationData || {}
  )
  const [isEffects, setisEffects] = useState(false)
  const [activeAreaTab, setActiveAreaTab] = useState(1)

  useEffect(() => {
    let { id } = props.match.params || {}
    setNotificationId(parseInt(id))

    if (id) {
      let notificationData = {}
      getNotification(id)
        .then(resp => {
          notificationData = resp.data.notification
          Object.keys(notificationData).forEach(key => {
            if (notificationData[key] === null) {
              delete notificationData[key]
            }
          })
          setNotificationData(notificationData)
        })
        .catch(err => { })
    }
  }, [])

  return (
    <React.Fragment>
      {isEffects ? (
        <Lightbox
          mainSrc={`${IMAGE_URL}/${notificationData?.tc_degreeCertificate}`}
          enableZoom={false}
          onCloseRequest={() => {
            setisEffects(!isEffects)
          }}
        />
      ) : null}
      <Row className="mt-3">
        <Col>
          <span className="text-info" style={{ fontSize: "2rem" }}>
            {notificationData.tc_fullName}{" "}
          </span>
        </Col>
        <Col className="text-end">
          <Button
            color="dark"
            onClick={() => {
              props.history.push("/notification")
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
                {notificationData.nt_file != null ? (
                  <CardImg
                    style={{ objectFit: "cover", maxHeight: "200px" }}
                    className="img-fluid"
                    src={`${IMAGE_URL}/${notificationData?.nt_file}`}
                    alt="Profile"
                  />
                ) : (
                  ""
                )}
              </Col>
              <Col md={9}>
                <CardBody>
                  <Row>
                    <Col md={4}>
                      {/* <CardText>
                        Notification Id: {notificationData.nt_id}
                      </CardText> */}
                      <CardText>Title: {notificationData.nt_title}</CardText>
                      <CardText>Class: {notificationData.nt_class}</CardText>
                    </Col>
                    <Col md={4}>
                      <CardText>Desc: {notificationData.nt_desc}</CardText>
                      {/* <CardText>{notificationData.tc_education}</CardText>
                      <CardText>{notificationData.tc_address}</CardText> */}
                    </Col>
                    <Col md={4}>
                      {/* <img
                        src={`${IMAGE_URL}/${notificationData?.tc_degreeCertificate}`}
                        alt="Degree Certificate"
                        onClick={() => {
                          setisEffects(true)
                        }}
                        className="avatar-lg img-thumbnail"
                      /> */}
                      <CardText>
                        Status:{" "}
                        <span>
                          <i
                            className={`mdi mdi-circle text-${notificationData.nt_status ? "success" : "danger"
                              } align-middle me-1`}
                          />
                        </span>
                        <span style={{ fontColor: "black" }}>
                          {notificationData.nt_status ? "Active" : "Inactive"}
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
    </React.Fragment>
  )
}

ViewDetails.propTypes = {
  notificationData: PropTypes.object.isRequired,
}

export default ViewDetails
