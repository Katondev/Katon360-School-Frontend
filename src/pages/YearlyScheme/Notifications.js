import React from "react"
import { Alert, Card, CardBody } from "reactstrap"

const Notifications = () => {
  return (
    <div>
      <Alert color="primary">A simple primary alert—check it out!</Alert>
      <Alert color="secondary" role="alert">
        A simple secondary alert—check it out!
      </Alert>
      <Alert color="success" role="alert">
        A simple success alert—check it out!
      </Alert>
      <Alert color="dark" role="alert">
        A simple danger alert—check it out!
      </Alert>
      <Alert color="warning" role="alert">
        A simple warning alert—check it out!
      </Alert>
      <Alert color="dark" className="mb-0" role="alert">
        A simple info alert—check it out!
      </Alert>
    </div>
  )
}

export default Notifications
