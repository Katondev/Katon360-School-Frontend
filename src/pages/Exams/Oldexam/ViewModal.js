import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { Modal, ModalBody, ModalHeader, Table } from "reactstrap"
import { exams } from "common/data/exams"
import oldPaper from "assets/images/exams/exampaper.png"
import { getExam } from "../../../helpers/backendHelpers/exam"
import { IMAGE_URL } from "helpers/urlHelper"
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
                    <td>{exam?.et_exam?.ex_examTitle}</td>
                  </tr>

                  <tr>
                    <th>Class</th>
                    <td>{exam.et_classId}</td>
                  </tr>
                  <tr>
                    <th>Subject</th>
                    <td>{exam?.et_subject}</td>
                  </tr>
                  <tr>
                    <th>Old Exam Paper</th>
                    <td>
                      {exam?.et_oldExamPaper ? (
                        <>
                          <a
                            href={IMAGE_URL + "/" + exam?.et_oldExamPaper}
                            target="#"
                          >
                            View Paper
                          </a>
                        </>
                      ) : (
                        <>Not Available</>
                      )}
                    </td>
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
