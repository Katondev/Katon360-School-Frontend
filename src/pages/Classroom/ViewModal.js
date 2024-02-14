import React from "react"
import PropTypes from "prop-types"
import { Modal, ModalBody, ModalHeader, Table } from "reactstrap"

const ClassroomModal = props => {
  const { isOpen, toggle, classroom } = props
  {
    if (classroom !== null)
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
            <ModalHeader toggle={toggle}>Classroom Details</ModalHeader>
            <ModalBody>
              <Table>
                <tbody>
                  <tr>
                    <th>Class</th>
                    <td>{classroom.cr_class}</td>
                  </tr>
                  <tr>
                    <th>Division</th>
                    <td>{classroom.cr_division}</td>
                  </tr>
                  <tr>
                    <th>Number Of Students</th>
                    <td>{classroom.cr_noOfStudents}</td>
                  </tr>
                  <tr>
                    <th>Class Teacher</th>
                    <td>{classroom.cr_classTeacher?.tc_fullName}</td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    <td>{classroom.cr_status ? "Active" : "Inactive"}</td>
                  </tr>
                </tbody>
              </Table>
            </ModalBody>
          </Modal>
        </>
      )
  }
}

ClassroomModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
}

export default ClassroomModal
