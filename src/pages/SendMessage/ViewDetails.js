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
  Toast,
} from "reactstrap"

import "react-image-lightbox/style.css"
import { getTeacher } from "helpers/backendHelpers/schoolTeachers"
import { IMAGE_URL } from "helpers/urlHelper"
import moment from "moment/moment"
import { getAssigment } from "helpers/backendHelpers/assigment"

const ViewDetails = props => {
  const [AssigmentId, setAssigmentId] = useState(0)
  const [AssigmentData, setAssigmentData] = useState(props.AssigmentData || {})
  const [isEffects, setisEffects] = useState(false)
  const [activeAreaTab, setActiveAreaTab] = useState(1)

  useEffect(() => {
    let { id } = props.match.params || {}
    setAssigmentId(parseInt(id))

    if (id) {

      let assignment = {}
      getAssigment(id)
        .then(resp => {
          assignment = resp.data.assignment
          Object.keys(assignment).forEach(key => {
            if (assignment[key] === null) {
              delete assignment[key]
            }
          })
          console.log(assignment)
          setAssigmentData(assignment)
        })
        .catch(err => { })
    }
  }, [])

  return (
    <React.Fragment>
      <Row className="mt-3">
        <Col>
          <span className="text-info" style={{ fontSize: "2rem" }}>
            {AssigmentData.asn_title}
          </span>
        </Col>
        <Col className="text-end">
          <Button
            color="dark"
            onClick={() => {
              props.history.push("/Assignment")
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
                      <CardText>Title: {AssigmentData.asn_title}</CardText>
                      <CardText>
                        Category: {AssigmentData.asn_category}
                      </CardText>
                      <CardText>
                        Main Category: {AssigmentData.asn_mainCategory}
                        {/* {moment(AssigmentData.ls_mainCategory).format("YYYY-MM-DD")} */}
                      </CardText>
                      <CardText>
                        Sub Category: {AssigmentData.asn_subCategory}
                      </CardText>
                    </Col>
                    <Col md={3}>
                      <CardText>
                        Duration: {AssigmentData.asn_duration}
                      </CardText>
                      <CardText>
                        Mark Per Question: {AssigmentData.asn_markPerQue}
                      </CardText>
                      <CardText>
                        Passing Marks: {AssigmentData.asn_passingMarks}
                      </CardText>
                      <CardText>
                        Question Set Type : {AssigmentData.asn_questionSetType}
                      </CardText>
                    </Col>
                    {/* <Col md={3}>
                      <CardText>
                        Sub Strand: {AssigmentData.tsc_subStrand}
                      </CardText>
                      <CardText>
                        Term Number: {AssigmentData.tsc_termNumber}
                      </CardText>
                      <CardText>
                        Term Number: {AssigmentData.tsc_weekNumber}
                      </CardText>
                      <CardText>Year: {AssigmentData.tsc_year}</CardText>
                    </Col> */}
                    {/* <Col md={3}>
                      <CardText>
                        Status:
                        <span>
                          <i
                            className={`mdi mdi-circle text-${
                              AssigmentData.tsc_status ? "success" : "danger"
                            } align-middle me-1`}
                          />
                        </span>
                        <span style={{ fontColor: "black" }}>
                          {AssigmentData.tsc_status ? "Active" : "Inactive"} 
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
  AssigmentData: PropTypes.object.isRequired,
}

export default ViewDetails
