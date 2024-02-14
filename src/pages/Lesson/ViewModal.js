import React from "react"
import PropTypes from "prop-types"
import { Modal, ModalBody, ModalHeader, Table } from "reactstrap"

const LessonModal = props => {
  const { isOpen, toggle, lesson } = props
  {
    if (lesson !== null)
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
            <ModalHeader toggle={toggle}>Lesson Details</ModalHeader>
            <ModalBody>
              <Table>
                <tbody>
                <tr>
                    <th>Teacher</th>
                    <td>{lesson.tl_teacher?.tc_fullName}</td>
                  </tr>
                  <tr>
                    <th>Subject</th>
                    <td>{lesson.tl_subject}</td>
                  </tr>
                  <tr>
                    <th>Lesson</th>
                    <td>{lesson.tl_lesson}</td>
                  </tr>
                </tbody>
              </Table>
            </ModalBody>
          </Modal>
        </>
      )
  }
}

LessonModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
}

export default LessonModal
