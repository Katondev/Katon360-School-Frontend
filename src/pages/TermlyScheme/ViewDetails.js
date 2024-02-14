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

const ViewDetails = props => {
  const [termlySchemeId, setTermlySchemeId] = useState(0)
  const [termlySchemeData, setTermlySchemeData] = useState(
    props.termlySchemeData || {}
  )
  const [isEffects, setisEffects] = useState(false)
  const [activeAreaTab, setActiveAreaTab] = useState(1)

  useEffect(() => {
    let { id } = props.match.params || {}
    setTermlySchemeId(parseInt(id))

    if (id) {
      let termlySchemeData = {}
      getTermlyScheme(id)
        .then(resp => {
          termlySchemeData = resp.data.termlyScheme

          Object.keys(termlySchemeData).forEach(key => {
            if (termlySchemeData[key] === null) {
              delete termlySchemeData[key]
            }
          })
          setTermlySchemeData(termlySchemeData)
        })
        .catch(err => { })
    }
  }, [])

  return (
    <React.Fragment>
      <Row className="mt-3">
        <Col>
          <span className="text-info" style={{ fontSize: "2rem" }}>
            {termlySchemeData.tc_fullName}{" "}
          </span>
        </Col>
        <Col className="text-end">
          <Button
            color="dark"
            onClick={() => {
              props.history.push("/termly-scheme")
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
                        Subject: {termlySchemeData.tsc_subject}
                      </CardText>
                      <CardText>Class: {termlySchemeData.tsc_classId}</CardText>
                      <CardText>
                        Date:{" "}
                        {moment(termlySchemeData.tsc_date).format("YYYY-MM-DD")}
                      </CardText>
                      <CardText>
                        Indicators: {termlySchemeData.tsc_indicators}
                      </CardText>
                    </Col>
                    <Col md={3}>
                      <CardText>
                        Resources: {termlySchemeData.tsc_resources}
                      </CardText>
                      <CardText>
                        School: {termlySchemeData?.tsc_school?.sc_schoolName}
                      </CardText>
                      <CardText>Strand: {termlySchemeData.tsc_strand}</CardText>
                      <CardText>
                        Content Standards:{" "}
                        {termlySchemeData.tsc_contentStandards}
                      </CardText>
                    </Col>
                    <Col md={3}>
                      <CardText>
                        Sub Strand: {termlySchemeData.tsc_subStrand}
                      </CardText>
                      <CardText>
                        Term Number: {termlySchemeData.tsc_termNumber}
                      </CardText>
                      <CardText>
                        Term Number: {termlySchemeData.tsc_weekNumber}
                      </CardText>
                      <CardText>Year: {termlySchemeData.tsc_year}</CardText>
                    </Col>
                    <Col md={3}>
                      <CardText>
                        Status:{" "}
                        <span>
                          <i
                            className={`mdi mdi-circle text-${termlySchemeData.tsc_status ? "success" : "danger"
                              } align-middle me-1`}
                          />
                        </span>
                        <span style={{ fontColor: "black" }}>
                          {termlySchemeData.tsc_status ? "Active" : "Inactive"}
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
  termlySchemeData: PropTypes.object.isRequired,
}

export default ViewDetails
