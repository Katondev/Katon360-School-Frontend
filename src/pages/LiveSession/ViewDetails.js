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

import "react-image-lightbox/style.css"
import { getTeacher } from "helpers/backendHelpers/schoolTeachers"
import { IMAGE_URL } from "helpers/urlHelper"
import moment from "moment/moment"
import { getLiveSession } from "helpers/backendHelpers/liveSession"

const ViewDetails = props => {
  const [liveSessionId, setLiveSessionId] = useState(0)
  const [liveSessionData, setLiveSessionData] = useState(
    props.liveSessionData || {}
  )
  const [isEffects, setisEffects] = useState(false)
  const [activeAreaTab, setActiveAreaTab] = useState(1)

  useEffect(() => {
    let { id } = props.match.params || {}
    setLiveSessionId(parseInt(id))

    if (id) {
      let liveSession = {}
      getLiveSession(id)
        .then(resp => {

          liveSession = resp.data.liveSession
          Object.keys(liveSession).forEach(key => {
            if (liveSession[key] === null) {
              delete liveSession[key]
            }
          })
          setLiveSessionData(liveSession)
        })
        .catch(err => { })
    }
  }, [])

  return (
    <React.Fragment>
      <Row className="mt-3">
        <Col>
          <span className="text-info" style={{ fontSize: "2rem" }}>
            {liveSessionData.ls_title}
          </span>
        </Col>
        <Col className="text-end">
          <Button
            color="dark"
            onClick={() => {
              props.history.push("/live-session")
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
                      <CardText>Title: {liveSessionData.ls_title}</CardText>
                      <CardText>
                        Category: {liveSessionData.ls_category}
                      </CardText>
                      <CardText>
                        Main Category: {liveSessionData.ls_mainCategory}
                        {/* {moment(liveSessionData.ls_mainCategory).format("YYYY-MM-DD")} */}
                      </CardText>
                      <CardText>
                        Sub Category: {liveSessionData.ls_subCategory}
                      </CardText>
                    </Col>
                    <Col md={3}>
                      <CardText>
                        Date :
                        {moment(new Date(liveSessionData.ls_date)).format(
                          "YYYY-MM-DD"
                        )}
                      </CardText>
                      <CardText>Time: {liveSessionData.ls_time}</CardText>
                      <CardText>
                        Room Url: {liveSessionData.ls_roomURL}
                      </CardText>
                      <CardText>
                        Description : {liveSessionData.ls_desc}
                      </CardText>
                    </Col>
                    {/* <Col md={3}>
                      <CardText>
                        Sub Strand: {liveSessionData.tsc_subStrand}
                      </CardText>
                      <CardText>
                        Term Number: {liveSessionData.tsc_termNumber}
                      </CardText>
                      <CardText>
                        Term Number: {liveSessionData.tsc_weekNumber}
                      </CardText>
                      <CardText>Year: {liveSessionData.tsc_year}</CardText>
                    </Col> */}
                    {/* <Col md={3}>
                      <CardText>
                        Status:
                        <span>
                          <i
                            className={`mdi mdi-circle text-${
                              liveSessionData.tsc_status ? "success" : "danger"
                            } align-middle me-1`}
                          />
                        </span>
                        <span style={{ fontColor: "black" }}>
                          {liveSessionData.tsc_status ? "Active" : "Inactive"} 
                        </span>
                      </CardText>
                    </Col> */}
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
  liveSessionData: PropTypes.object.isRequired,
}

export default ViewDetails
