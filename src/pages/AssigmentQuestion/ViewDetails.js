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
import { getAssigmentQuestion } from "helpers/backendHelpers/assigmentQuestion"
import { useLocation } from "react-router-dom"

const ViewDetails = props => {
  const [liveSessionId, setLiveSessionId] = useState(0)
  const [assignmentQuestionsData, setAssignmentQuestionsData] = useState(
    props.assignmentQuestionsData || {}
  )
  const [isEffects, setisEffects] = useState(false)
  const location = useLocation()
  const asn_id = location.state?.asn_id
  console.log("asn_id12", asn_id)
  const [activeAreaTab, setActiveAreaTab] = useState(1)

  useEffect(() => {
    let { id } = props.match.params || {}
    setLiveSessionId(parseInt(id))

    if (id) {
      let assignmentQuestions = {}
      getAssigmentQuestion(id)
        .then(resp => {
          assignmentQuestions = resp.data.assignmentQuestions
          Object.keys(assignmentQuestions).forEach(key => {
            if (assignmentQuestions[key] === null) {
              delete assignmentQuestions[key]
            }
          })
          setAssignmentQuestionsData(assignmentQuestions)
        })
        .catch(err => {})
    }
  }, [])

  return (
    <React.Fragment>
      <Row className="mt-3">
        <Col>
          <span className="text-info" style={{ fontSize: "2rem" }}>
            {assignmentQuestionsData.aq_title}
          </span>
        </Col>
        <Col className="text-end">
          <Button
            color="dark"
            onClick={() => {
              props.history.push(`/assignment-manage/${asn_id}`)
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
                        Title: {assignmentQuestionsData.aq_title}
                      </CardText>
                      <CardText>
                        Answer Type: {assignmentQuestionsData.aq_answerType}
                      </CardText>
                      <CardText>
                        Correct Answer: {assignmentQuestionsData.aq_correntAns}
                        {/* {moment(assignmentQuestionsData.ls_mainCategory).format("YYYY-MM-DD")} */}
                      </CardText>
                      <CardText>
                        Marks: {assignmentQuestionsData.aq_mark}
                      </CardText>
                    </Col>
                    <Col md={3}>
                      <CardText>
                        Option 1: {assignmentQuestionsData.aq_option1}
                      </CardText>
                      <CardText>
                        Option 2: {assignmentQuestionsData.aq_option2}
                      </CardText>
                      <CardText>
                        Option 3: {assignmentQuestionsData.aq_option3}
                      </CardText>
                      <CardText>
                        Option 4 : {assignmentQuestionsData.aq_option4}
                      </CardText>
                    </Col>
                    <Col md={3}>
                      <CardText>
                        Option 5 : {assignmentQuestionsData.aq_option5}
                      </CardText>
                    </Col>
                    {/* <Col md={3}>
                      <CardText>
                        Status:
                        <span>
                          <i
                            className={`mdi mdi-circle text-${
                              assignmentQuestionsData.tsc_status ? "success" : "danger"
                            } align-middle me-1`}
                          />
                        </span>
                        <span style={{ fontColor: "black" }}>
                          {assignmentQuestionsData.tsc_status ? "Active" : "Inactive"} 
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
  assignmentQuestionsData: PropTypes.object.isRequired,
}

export default ViewDetails
