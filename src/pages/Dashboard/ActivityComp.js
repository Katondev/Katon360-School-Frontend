import React from "react"
import { useState, useEffect } from "react"
import { Card, CardBody, CardTitle } from "reactstrap"
import { getLevelWiseStudentCount } from "helpers/backendHelpers/students"
import { SaveToast } from "components/Common/SaveToast"

const ActivityComp = () => {
  const [studentLevelCount, setStudentLevelCount] = useState([])

  useEffect(() => {
    fetchLevelWiseStudentCount()
  }, [])

  const fetchLevelWiseStudentCount = async () => {
    try {
      let response = await getLevelWiseStudentCount()
      let studentLevelCount = response.data.levelCount || []
      setStudentLevelCount(studentLevelCount)
    } catch (error) {
      let message = error?.message || "There was problem fetching students"
      return SaveToast({ message, type: "error" })
    }
  }

  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <CardTitle className="mb-4">Level-wise Students</CardTitle>
          {/* <ul className="verti-timeline list-unstyled">
            <li className="event-list">
              <div className="event-timeline-dot">
                <i className="bx bx-right-arrow-circle font-size-18" />
              </div>
              <div className="d-flex">
                <div className="me-3">
                  <h5 className="font-size-14">
                    22 Nov{" "}
                    <i className="bx bx-right-arrow-alt font-size-16 text-dark align-middle ms-2" />
                  </h5>
                </div>
                <div className="flex-grow-1">
                  <div>Responded to need “Volunteer Activities</div>
                </div>
              </div>
            </li>

            <li className="event-list">
              <div className="event-timeline-dot">
                <i className="bx bx-right-arrow-circle font-size-18" />
              </div>
              <div className="d-flex">
                <div className="me-3">
                  <h5 className="font-size-14">
                    17 Nov{" "}
                    <i className="bx bx-right-arrow-alt font-size-16 text-dark align-middle ms-2" />
                  </h5>
                </div>
                <div className="flex-grow-1">
                  <div id="activitytext">
                    Everyone realizes why a new common language would be
                    desirable...<Link to="#">Read More</Link>
                  </div>
                </div>
              </div>
            </li>
            <li className="event-list active">
              <div className="event-timeline-dot">
                <i className="bx bxs-right-arrow-circle font-size-18 bx-fade-right" />
              </div>
              <div className="d-flex">
                <div className="me-3">
                  <h5 className="font-size-14">
                    15 Nov{" "}
                    <i className="bx bx-right-arrow-alt font-size-16 text-dark align-middle ms-2" />
                  </h5>
                </div>
                <div className="flex-grow-1">
                  <div>Joined the group “Boardsmanship Forum”</div>
                </div>
              </div>
            </li>
            <li className="event-list">
              <div className="event-timeline-dot">
                <i className="bx bx-right-arrow-circle font-size-18" />
              </div>
              <div className="d-flex">
                <div className="me-3">
                  <h5 className="font-size-14">
                    12 Nov{" "}
                    <i className="bx bx-right-arrow-alt font-size-16 text-dark align-middle ms-2" />
                  </h5>
                </div>
                <div className="flex-grow-1">
                  <div>Responded to need “In-Kind Opportunity”</div>
                </div>
              </div>
            </li>
          </ul>
          <div className="text-center mt-4">
            <Link to="" className="btn btn-dark  btn-sm">
              View More <i className="mdi mdi-arrow-right ms-1" />
            </Link>
          </div> */}
          <div className="container">
            <table className="table table-hover">
              <tbody>
                {studentLevelCount.map(data => (
                  <tr key={data.st_level}>
                    <td>{data.st_level}</td>
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

export default ActivityComp
