import React from "react"
import PropTypes from "prop-types"
import { Modal, ModalBody, ModalHeader, Table } from "reactstrap"

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
                    <th>Exam Title</th>
                    <td>{exam.ex_examTitle}</td>
                  </tr>
                  <tr>
                    <th>Start Date</th>
                    <td>{exam.ex_startDate}</td>
                  </tr>
                  <tr>
                    <th>End Date</th>
                    <td>{exam.ex_endDate}</td>
                  </tr>
                  <tr>
                    <th>Total marks</th>
                    <td>{exam.ex_totalMarks}</td>
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
