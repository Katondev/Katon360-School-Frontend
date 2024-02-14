import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { Button, Col, Row, Table } from "reactstrap"
import { getQuestionBank } from "helpers/backendHelpers/questionBank"
const ViewDetails = props => {
  const [questionData, setQuestionData] = useState({})
  const [questionId, setQuestionId] = useState(0)
  const {
    qb_questionTitle,
    qb_option1,
    qb_option2,
    qb_option3,
    qb_option4,
    qb_correctAnswer,
    qb_subject,
  } = questionData

  useEffect(() => {
    fetchQuestionData()
  }, [])

  const fetchQuestionData = async () => {
    let { id } = props.match.params || {}
    setQuestionId(id ? id : "")
    if (id) {
      try {
        let response = await getQuestionBank(id)
        let { question } = response.data
        setQuestionData(question)
      } catch (error) {
        let message =
          error?.response?.data?.message ||
          error?.message ||
          "There was problem fetching question"
        return SaveToast({ message, type: "error" })
      }
    }
  }

  return (
    <React.Fragment>
      <Row>
        <Col className="text-end">
          <Button
            color="dark"
            onClick={() => {
              props.history.push("/question-bank")
            }}
          >
            Back
          </Button>
        </Col>
      </Row>

      <Table>
        <tbody>
          <tr colSpan={2}>
            <td>
              <strong>Question Title: </strong>
              {qb_questionTitle}
            </td>
          </tr>
          <tr>
            <th>Class</th>
            <td>
              {questionData?.qb_classRoom?.cr_class}-
              {questionData?.qb_classRoom?.cr_division}
            </td>
          </tr>
          <tr>
            <th>Subject</th>
            <td>{qb_subject}</td>
          </tr>
          <tr>
            <th>Answer Options</th>
            <td>
              {qb_option1}, {qb_option2}, {qb_option3}, {qb_option4}
            </td>
          </tr>
          <tr>
            <th>Correct Answer</th>
            <td>{qb_correctAnswer}</td>
          </tr>
        </tbody>
      </Table>
    </React.Fragment>
  )
}

ViewDetails.propTypes = {
  questionData: PropTypes.object.isRequired,
}

export default ViewDetails
