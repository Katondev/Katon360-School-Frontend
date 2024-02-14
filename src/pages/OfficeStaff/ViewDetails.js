import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import {
  Button,
  Col,
  Row,
  Card,
  CardBody,
  CardText,
  CardTitle,
} from "reactstrap"
import { SaveToast } from "components/Common/SaveToast"
import { getStaffMember } from "helpers/backendHelpers/officeStaff"

const ViewDetails = props => {
  const [staffData, setStaffData] = useState(props.staffData || {})
  const [memberId, setMemberId] = useState("")

  useEffect(() => {
    getOfficeStaffMemeber()
  }, [])

  const getOfficeStaffMemeber = async () => {
    let { id } = props.match.params || {}
    setMemberId(id ? id : "")
    if (id) {
      try {
        let response = await getStaffMember(id)
        let { officeStaff } = response.data
        setStaffData(officeStaff)
      } catch (error) {
        let message =
          error?.response?.data?.message ||
          error?.message ||
          "There was problem fetching staff member"
        return SaveToast({ message, type: "error" })
      }
    }
  }
  return (
    <React.Fragment>
      <Row className="mt-3">
        <Col className="text-end">
          <Button
            color="dark"
            onClick={() => {
              props.history.push("/office-staff")
            }}
          >
            Back
          </Button>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col xl="6">
          <Card>
            <CardBody className="border-bottom">
              <div>
                <CardTitle className="d-flex">
                  <i className="mdi mdi-account-circle h1 text-secondary me-1" />
                  <span style={{ fontSize: "1.4rem" }} className="text-info">
                    {staffData.ss_fullName}{" "}
                  </span>
                </CardTitle>

                <div>
                  <Row>
                    <Col xl="6">
                      <CardText>
                        Status:{" "}
                        <i
                          className={`mdi mdi-circle text-${
                            staffData.ss_status ? "success" : "danger"
                          } align-middle me-1`}
                        />
                        {staffData.ss_status ? "Active" : "Inactive"}
                      </CardText>
                      <CardText>Staff Id: {staffData.ss_staffId}</CardText>
                      <CardText>
                        Phone Number: {staffData.ss_phoneNumber}
                      </CardText>
                    </Col>
                    <Col xl="6">
                      <CardText>Role: {staffData.ss_staffRole}</CardText>
                      <CardText>Email: {staffData.ss_email}</CardText>
                      <CardText>
                        Alt. Phone Number: {staffData.ss_altPhoneNumber}
                      </CardText>
                    </Col>
                  </Row>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}

ViewDetails.propTypes = {
  staffData: PropTypes.object.isRequired,
}

export default ViewDetails
