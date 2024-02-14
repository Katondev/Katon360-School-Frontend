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
import moment from "moment/moment"
import { getYearlyScheme } from "helpers/backendHelpers/YearlyScheme"

const ViewDetails = props => {
  const [yearlySchemeId, setYearlySchemeId] = useState(0)
  const [yearlySchemeData, setYearlySchemeData] = useState(
    props.yearlySchemeData || {}
  )
  const [isEffects, setisEffects] = useState(false)
  const [activeAreaTab, setActiveAreaTab] = useState(1)

  useEffect(() => {
    let { id } = props.match.params || {}
    setYearlySchemeId(parseInt(id))

    if (id) {
      let yearlySchemeData = {}
      getYearlyScheme(id)
        .then(resp => {
          yearlySchemeData = resp.data.yearlyScheme

          Object.keys(yearlySchemeData).forEach(key => {
            if (yearlySchemeData[key] === null) {
              delete yearlySchemeData[key]
            }
          })
          setYearlySchemeData(yearlySchemeData)
        })
        .catch(err => { })
    }
  }, [])

  return (
    <React.Fragment>
      <Row className="mt-3">
        <Col>
          <span className="text-info" style={{ fontSize: "2rem" }}>
            {yearlySchemeData.tc_fullName}{" "}
          </span>
        </Col>
        <Col className="text-end">
          <Button
            color="dark"
            onClick={() => {
              props.history.push("/yearly-scheme")
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
                        Subject: {yearlySchemeData.ysc_subject}
                      </CardText>
                      <CardText>Class: {yearlySchemeData.ysc_classId}</CardText>
                      <CardText>
                        Date:{" "}
                        {moment(yearlySchemeData.ysc_date).format("YYYY-MM-DD")}
                      </CardText>
                    </Col>
                    <Col md={3}>
                      <CardText>
                        School: {yearlySchemeData?.ysc_school?.sc_schoolName}
                      </CardText>
                      <CardText>
                        Week Number: {yearlySchemeData.ysc_weekNumber}
                      </CardText>

                      <CardText>Year: {yearlySchemeData.ysc_year}</CardText>
                    </Col>
                    <Col md={3}>
                      <CardText>
                        Term 1 SubStrand: {yearlySchemeData.term1_subStrand}
                      </CardText>
                      <CardText>
                        Term 2 SubStrand: {yearlySchemeData.term2_subStrand}
                      </CardText>
                      <CardText>
                        Term 3 SubStrand: {yearlySchemeData.term3_subStrand}
                      </CardText>
                    </Col>
                    <Col md={3}>
                      <CardText>
                        Status:{" "}
                        <span>
                          <i
                            className={`mdi mdi-circle text-${yearlySchemeData.ysc_status ? "success" : "danger"
                              } align-middle me-1`}
                          />
                        </span>
                        <span style={{ fontColor: "black" }}>
                          {yearlySchemeData.ysc_status ? "Active" : "Inactive"}
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
  yearlySchemeData: PropTypes.object.isRequired,
}

export default ViewDetails
