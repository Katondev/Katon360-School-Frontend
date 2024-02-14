import React from "react"
import { Spinner } from "reactstrap"
const SubmitLoader = () => {
  return (
    <>
      <Spinner
        className="ms-2"
        style={{
          position: "absolute",
          top: "50%",
          left: "45%",
          zIndex: "1000",
          width: "3rem",
          height: "3rem",
        }}
        color="primary"
      />
    </>
  )
}

export default SubmitLoader
