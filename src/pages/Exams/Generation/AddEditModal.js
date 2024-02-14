import React from "react"
import PropTypes from "prop-types"
import { Modal, ModalBody, ModalHeader, Table } from "reactstrap"
import {
  Col,
  Row,
  UncontrolledTooltip,
  Form,
  Input,
  FormFeedback,
  Label,
  Card,
  CardBody,
} from "reactstrap"
const AddEditExamModal = props => {
  const { isOpen, toggle, validation, isEdit } = props
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle} tag="h4">
        {!!isEdit ? "Edit Exam" : "Add Exam"}
      </ModalHeader>
      <ModalBody>
        <Form
          onSubmit={e => {
            e.preventDefault()
            validation.handleSubmit()
            return false
          }}
        >
          <Row>
            <Col className="col-12">
              <div className="mb-3">
                <Label className="form-label">
                  Exam Title <span className="text-danger">*</span>
                </Label>
                <Input
                  name="ex_examTitle"
                  type="text"
                  placeholder="Enter Exam Title"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  invalid={
                    validation.touched.ex_examTitle &&
                    validation.errors.ex_examTitle
                  }
                  value={validation.values.ex_examTitle}
                />
                {validation.touched.ex_examTitle &&
                validation.errors.ex_examTitle ? (
                  <FormFeedback type="invalid">
                    {validation.errors.ex_examTitle}
                  </FormFeedback>
                ) : null}
              </div>

              <div className="mb-3">
                <Label className="form-label">
                  Start Date <span className="text-danger">*</span>
                </Label>
                <Input
                  name="ex_startDate"
                  type="date"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  min={new Date().toJSON().slice(0, 10)}
                  invalid={
                    validation.touched.ex_startDate &&
                    validation.errors.ex_startDate
                  }
                  defaultValue={validation.values.ex_startDate}
                />
                {validation.touched.ex_startDate &&
                  validation.errors.ex_startDate && (
                    <FormFeedback>
                      {validation.errors.ex_startDate}
                    </FormFeedback>
                  )}
              </div>
              <div className="mb-3">
                <Label className="form-label">
                  End Date <span className="text-danger">*</span>
                </Label>
                <Input
                  name="ex_endDate"
                  type="date"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  min={new Date(validation.values.ex_startDate)
                    ?.toJSON()
                    ?.slice(0, 10)}
                  invalid={
                    validation.touched.ex_endDate &&
                    validation.errors.ex_endDate
                  }
                  defaultValue={validation.values.ex_endDate}
                />
                {validation.touched.ex_endDate &&
                  validation.errors.ex_endDate && (
                    <FormFeedback>{validation.errors.ex_endDate}</FormFeedback>
                  )}
              </div>
              <div className="mb-3">
                <Label className="form-label">
                  Total Marks <span className="text-danger">*</span>
                </Label>
                <Input
                  name="ex_totalMarks"
                  type="number"
                  min={10}
                  max={1000}
                  placeholder="Enter Total Makrs"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.ex_totalMarks || ""}
                  invalid={
                    validation.touched.ex_totalMarks &&
                    validation.errors.ex_totalMarks
                      ? true
                      : false
                  }
                />
                {validation.touched.ex_totalMarks &&
                validation.errors.ex_totalMarks ? (
                  <FormFeedback type="invalid">
                    {validation.errors.ex_totalMarks}
                  </FormFeedback>
                ) : null}
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="text-end">
                <button type="submit" className="btn btn-success save-user">
                  Save
                </button>
              </div>
            </Col>
          </Row>
        </Form>
      </ModalBody>
    </Modal>
  )
}

AddEditExamModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
}

export default AddEditExamModal
