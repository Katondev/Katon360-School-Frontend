import React from "react"
import { Container, Row, Col } from "reactstrap"

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
            {/* <Col md={6}>{new Date().getFullYear()} © KATON.</Col> */}
            <Col md={12}>
              <div className="text-sm-end d-none d-sm-block">
              © KA Technologies {new Date().getFullYear()}. All rights Reserved.
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  )
}

export default Footer
