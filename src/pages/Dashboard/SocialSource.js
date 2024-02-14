import React, { useState, useEffect } from "react"
import { Card, CardBody, CardTitle } from "reactstrap"
import { getLevelWiseTeacherCount } from "helpers/backendHelpers/schoolTeachers"
import { SaveToast } from "components/Common/SaveToast"

const SocialSource = levelWiseTeachers => {
  const [teacherLevelCount, setTeacherLevelCount] = useState([])

  useEffect(() => {
    fetchLevelWiseTeacherCount()
  }, [])

  const fetchLevelWiseTeacherCount = async () => {
    try {
      let response = await getLevelWiseTeacherCount()
      let teacherLevelCount = response.data.levelCount || []
      setTeacherLevelCount(teacherLevelCount)
    } catch (error) {
      let message = error?.message || "There was problem fetching students"
      return SaveToast({ message, type: "error" })
    }
  }

  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <CardTitle className="mb-4">Level-wise Teachers</CardTitle>
          {/* <div className="text-center">
            <div className="avatar-sm mx-auto mb-4">
              <span className="avatar-title rounded-circle bg-dark bg-soft font-size-24">
                <i className="mdi mdi-facebook text-dark"></i>
              </span>
            </div>
            <p className="font-16 text-muted mb-2"></p>
            <h5>
              <Link to="#" className="text-dark">
                Facebook - <span className="text-muted font-16">125 sales</span>{" "}
              </Link>
            </h5>
            <p className="text-muted">
              Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut
              libero venenatis faucibus tincidunt.
            </p>
            <Link to="#" className="text-dark font-16">
              Learn more <i className="mdi mdi-chevron-right"></i>
            </Link>
          </div>
          <Row className="mt-4">
            {socials.map((social, key) => (
              <Col xs="4" key={"_li_" + key}>
                <div className="social-source text-center mt-3">
                  <div className="avatar-xs mx-auto mb-3">
                    <span
                      className={
                        "avatar-title rounded-circle " +
                        social.bgColor +
                        " font-size-16"
                      }
                    >
                      <i
                        className={"mdi " + social.iconClass + " text-white"}
                      ></i>
                    </span>
                  </div>
                  <h5 className="font-size-15">{social.title}</h5>
                  <p className="text-muted mb-0">{social.description} sales</p>
                </div>
              </Col>
            ))}
          </Row> */}
          <div className="container">
            <table className="table table-hover">
              <tbody>
                {teacherLevelCount.map(data => (
                  <tr key={data.tc_level}>
                    <td>{data.tc_level}</td>
                    <td>{data.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  )
}

export default SocialSource
