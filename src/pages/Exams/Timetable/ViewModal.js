import React from "react"
import PropTypes from "prop-types"
import { Modal, ModalBody, ModalHeader, Table } from "reactstrap"
import { exams } from "common/data/exams"

const ExamModal = props => {
  const { isOpen, toggle, exam } = props
  {
    if (exam !== null)
      return (
        <>
          <Modal
            isOpen={isOpen}
            role="dialog"
            autoFocus={true}
            centered={true}
            className="teamMemberModal"
            tabIndex="-1"
            toggle={toggle}
          >
            <ModalHeader toggle={toggle}>Exam Details</ModalHeader>
            <ModalBody>
              <Table>
                <tbody>
                  <tr>
                    <th>Exam</th>
                    <td>{exam.et_exam?.ex_examTitle}</td>
                  </tr>
                  <tr>
                    <th> Date</th>
                    <td>{exam.et_date}</td>
                  </tr>
                  <tr>
                    <th>Class</th>
                    <td>{exam.et_classId}</td>
                  </tr>
                  <tr>
                    <th>Subject</th>
                    <td>{exam.et_subject}</td>
                  </tr>
                  <tr>
                    <th>Marks</th>
                    <td>{exam.et_marks}</td>
                  </tr>
                </tbody>
              </Table>
            </ModalBody>
          </Modal>
        </>
      )
  }
}

ExamModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
}

export default ExamModal
