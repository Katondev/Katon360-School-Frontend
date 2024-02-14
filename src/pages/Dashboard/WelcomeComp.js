import React from "react"

import { Row, Col, Card, CardBody } from "reactstrap"
import { Link } from "react-router-dom"

import avatar1 from "../../assets/images/users/avatar-1.jpg"
import profileImg from "../../assets/images/profile-img.png"

const WelcomeComp = props => {
  return (
    <React.Fragment>
      <Card className="overflow-hidden">
        <div className="bg-dark bg-soft">
          <Row>
            <Col xs="7">
              <div className="text-dark p-3">
                <h5 className="text-dark">Welcome Back !</h5>
                <p>School Dashboard</p>
              </div>
            </Col>
            <Col xs="5" className="align-self-end">
              <img src={profileImg} alt="" className="img-fluid" />
            </Col>
          </Row>
        </div>
        <CardBody className="pt-0">
          <Row>
            <Col sm="10">
              <div className="avatar-md profile-user-wid mb-4">
                <img
                  src={avatar1}
                  alt=""
                  className="img-thumbnail rounded-circle"
                />
              </div>
              <h5 className="font-size-15 text-truncate">
                {props.school.sc_schoolName}
              </h5>
              {/* <p className="text-muted mb-0 text-truncate">
                Type: {props.school.sc_schoolType}
              </p> */}
            </Col>

            <Col sm="8">
              <div className="pt-4">
                <Row>
                  <Col xs="6">
                    <h5 className="font-size-15">
                      {props.school.sc_schoolType}
                    </h5>
                    <p className="text-muted mb-0">SchoolType</p>
                  </Col>
                  <Col xs="6">
                    <h5 className="font-size-15">
                      {props.school.sc_town === null
                        ? "Town"
                        : props.school.sc_town}
                    </h5>
                    <p className="text-muted mb-0">Town</p>
                  </Col>
                </Row>
                <div className="mt-4">
                  <Link to="/profile/edit" className="btn btn-dark  btn-sm">
                    Edit Profile <i className="mdi mdi-arrow-right ms-1"></i>
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </React.Fragment>
  )
}
export default WelcomeComp
