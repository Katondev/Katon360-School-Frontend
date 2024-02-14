import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { Modal, ModalBody, ModalHeader, Table } from "reactstrap"
import { exams } from "common/data/exams"
import oldPaper from "assets/images/exams/exampaper.png"
import { IMAGE_URL } from "helpers/urlHelper"

const NotificationModal = props => {
  const { isOpen, toggle, form } = props
  {
    if (form !== null)
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
            <ModalHeader toggle={toggle}>Saved Image</ModalHeader>
            <ModalBody>
              <img
                src={`${IMAGE_URL}/${form?.nt_file_old}`}
                className="w-100"
              />
            </ModalBody>
          </Modal>
        </>
      )
  }
}

NotificationModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
}

export default NotificationModal
