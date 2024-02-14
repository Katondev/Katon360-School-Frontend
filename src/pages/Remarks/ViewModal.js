import React from "react"
import PropTypes from "prop-types"
import { Modal, ModalBody, ModalHeader, Table } from "reactstrap"

const RemarkModal = props => {
  const { isOpen, toggle, remark } = props
  {
    if (remark !== null)
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
            <ModalHeader toggle={toggle}>Remark Details</ModalHeader>
            <ModalBody>
              <Table>
                <tbody>
                  <tr>
                    <th>StudentName</th>
                    <td>{remark.sr_student?.st_fullName}</td>
                  </tr>
                  <tr>
                    <th>TeacherName</th>
                    <td>{remark.sr_teacher?.tc_fullName}</td>
                  </tr>
                  <tr>
                    <th>Remark</th>
                    <td>{remark.sr_remarks}</td>
                  </tr>
                </tbody>
              </Table>
            </ModalBody>
          </Modal>
        </>
      )
  }
}

RemarkModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
}

export default RemarkModal
