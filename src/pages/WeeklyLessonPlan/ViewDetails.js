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
import { getTermlyScheme } from "helpers/backendHelpers/TermlyScheme"
import moment from "moment/moment"
import { getWeeklyLessonPlan } from "helpers/backendHelpers/weeklyLessonPlan"

const ViewDetails = props => {
  const [termlySchemeId, setTermlySchemeId] = useState(0)
  const [weeklyLessonNoteData, setWeeklyLessonNoteData] = useState(
    props.weeklyLessonNoteData || {}
  )
  const [isEffects, setisEffects] = useState(false)
  const [activeAreaTab, setActiveAreaTab] = useState(1)

  useEffect(() => {
    let { id } = props.match.params || {}
    setTermlySchemeId(parseInt(id))

    if (id) {
      let weeklyLessonNoteData = {}
      getWeeklyLessonPlan(id)
        .then(resp => {
          weeklyLessonNoteData = resp.data.weeklyLessonPlan

          Object.keys(weeklyLessonNoteData).forEach(key => {
            if (weeklyLessonNoteData[key] === null) {
              delete weeklyLessonNoteData[key]
            }
          })
          setWeeklyLessonNoteData(weeklyLessonNoteData)
        })
        .catch(err => { })
    }
  }, [])

  return (
    <React.Fragment>
      <Row className="mt-3">
        <Col>
          <span className="text-info" style={{ fontSize: "2rem" }}>
            {weeklyLessonNoteData.tc_fullName}{" "}
          </span>
        </Col>
        <Col className="text-end">
          <Button
            color="dark"
            onClick={() => {
              props.history.push("/lesson-notes")
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
              <Col md={12}>
                <CardBody>
                  <Row>
                    <Col md={3}>
                      <CardText>
                        Subject: {weeklyLessonNoteData.wlp_subject}
                      </CardText>
                      <CardText>
                        Class: {weeklyLessonNoteData.wlp_classId}
                      </CardText>
                      <CardText>
                        School:{" "}
                        {weeklyLessonNoteData?.wlp_school?.sc_schoolName}
                      </CardText>
                    </Col>
                    <Col md={3}>
                      <CardText>
                        Learning Indicator:{" "}
                        {weeklyLessonNoteData.wlp_learningIndicator}
                      </CardText>
                      <CardText>
                        Performance Indicator:{" "}
                        {weeklyLessonNoteData?.wlp_performanceIndicator}
                      </CardText>
                      <CardText>
                        Reference: {weeklyLessonNoteData.wlp_reference}
                      </CardText>
                    </Col>
                    <Col md={3}>
                      <CardText>
                        Week Number: {weeklyLessonNoteData?.wlp_weekNumber}
                      </CardText>
                      <CardText>
                        Week Ending: {weeklyLessonNoteData?.wlp_weekEnding}
                      </CardText>
                      <CardText>
                        Teaching Material:{" "}
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href={`${IMAGE_URL}/${weeklyLessonNoteData?.wlp_teachingMaterial || ""
                            }`}
                        >
                          {"(Saved Teaching Material)"}
                        </a>
                      </CardText>
                    </Col>
                    <Col md={3}>
                      <CardText>
                        Status:{" "}
                        <span>
                          <i
                            className={`mdi mdi-circle text-${weeklyLessonNoteData.wlp_status
                                ? "success"
                                : "danger"
                              } align-middle me-1`}
                          />
                        </span>
                        <span style={{ fontColor: "black" }}>
                          {weeklyLessonNoteData.wlp_status
                            ? "Active"
                            : "Inactive"}

                        </span>
                      </CardText>
                    </Col>
                    <Col md={12} className="mt-3">
                      <table className="table">
                        <thead>
                          <tr>
                            <th scope="col">Day</th>
                            <th scope="col">Phase 1</th>
                            <th scope="col">Phase 2</th>
                            <th scope="col">Phase 3</th>
                          </tr>
                        </thead>
                        {Object.keys(weeklyLessonNoteData).length > 0 && (
                          <tbody>
                            <tr>
                              <td scope="row">Monday</td>
                              {weeklyLessonNoteData?.mon &&
                                Object.keys(weeklyLessonNoteData?.mon).map(
                                  key => {
                                    return (
                                      <td key={1}>
                                        {weeklyLessonNoteData?.mon[key]}
                                      </td>
                                    )
                                  }
                                )}
                            </tr>
                            <tr>
                              <td scope="row">Tuesday</td>
                              {weeklyLessonNoteData?.tue &&
                                Object.keys(weeklyLessonNoteData?.tue).map(
                                  key => {
                                    return (
                                      <td key={1}>
                                        {weeklyLessonNoteData?.tue[key]}
                                      </td>
                                    )
                                  }
                                )}
                            </tr>
                            <tr>
                              <td scope="row">Wednesday</td>
                              {weeklyLessonNoteData?.wed &&
                                Object.keys(weeklyLessonNoteData?.wed).map(
                                  key => {
                                    return (
                                      <td key={1}>
                                        {weeklyLessonNoteData?.wed[key]}
                                      </td>
                                    )
                                  }
                                )}
                            </tr>
                            <tr>
                              <td scope="row">Thursday</td>
                              {weeklyLessonNoteData?.thu &&
                                Object.keys(weeklyLessonNoteData?.thu).map(
                                  key => {
                                    return (
                                      <td key={1}>
                                        {weeklyLessonNoteData?.thu[key]}
                                      </td>
                                    )
                                  }
                                )}
                            </tr>
                            <tr>
                              <td scope="row">Friday</td>
                              {weeklyLessonNoteData?.fri &&
                                Object.keys(weeklyLessonNoteData?.fri).map(
                                  key => {
                                    return (
                                      <td key={1}>
                                        {weeklyLessonNoteData?.fri[key]}
                                      </td>
                                    )
                                  }
                                )}
                            </tr>
                            <tr>
                              <td scope="row">Saturday</td>
                              {weeklyLessonNoteData?.sat &&
                                Object.keys(weeklyLessonNoteData?.sat).map(
                                  key => {
                                    return (
                                      <td key={1}>
                                        {weeklyLessonNoteData?.sat[key]}
                                      </td>
                                    )
                                  }
                                )}
                            </tr>
                          </tbody>
                        )}
                      </table>
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
  weeklyLessonNoteData: PropTypes.object.isRequired,
}

export default ViewDetails
