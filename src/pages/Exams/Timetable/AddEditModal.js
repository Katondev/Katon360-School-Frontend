import React, { useState, useEffect } from "react"
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
import {
  classRoomType,
  standard as classesDropdown,
} from "../../../common/data/dropdownVals"
import { divisions as divisionDropdown } from "../../../common/data/dropdownVals"
import { teachers as classTeacherDropdown } from "../../../common/data/dropdownVals"
import { subjects as subjectDropdown } from "../../../common/data/dropdownVals"
import { exams as examsDropdown } from "../../../common/data/exams"
import Select from "react-select"

const AddEditExamModal = props => {
  const {
    isOpen,
    toggle,
    validation,
    isEdit,
    classDropDownVals,
    examDropDownVals,
    exam,
  } = props

  const [selectedClass, setSelectedClass] = useState("")

  useEffect(() => {
    if (exam) {
      setSelectedClass({
        label: exam.et_classId,
        value: exam.et_classId,
      })
    } else {
      setSelectedClass("")
    }
  }, [exam])

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle} tag="h4">
        {!!isEdit ? "Edit Exam Timetable" : "Add Exam Timetable"}
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
                  Select Exam <span className="text-danger">*</span>
                </Label>
                <Input
                  name="et_examId"
                  type="select"
                  className="form-select"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.et_examId || 0}
                  invalid={
                    validation.touched.et_examId && validation.errors.et_examId
                      ? true
                      : false
                  }
                >
                  <option value="0" disabled>
                    Select Exam
                  </option>
                  {examDropDownVals.map(val => {
                    return (
                      <option key={val.id} value={val.id}>
                        {val.value}
                      </option>
                    )
                  })}
                </Input>
                {validation.touched.et_examId && validation.errors.et_examId ? (
                  <FormFeedback type="invalid">
                    {validation.errors.et_examId}
                  </FormFeedback>
                ) : null}
              </div>

              <div className="mb-3">
                <Label className="form-label">
                  Date <span className="text-danger">*</span>
                </Label>
                <Input
                  name="et_date"
                  type="date"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  // max={new Date().toJSON().slice(0, 10)}
                  invalid={
                    validation.touched.et_date && validation.errors.et_date
                  }
                  defaultValue={validation.values.et_date}
                />
                {validation.touched.et_date && validation.errors.et_date && (
                  <FormFeedback>{validation.errors.et_date}</FormFeedback>
                )}
              </div>
              {/* <div className="mb-3">
                <Label className="form-label">
                  Select Class <span className="text-danger">*</span>
                </Label>
                <Input
                  name="et_classId"
                  type="select"
                  className="form-select"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.et_classId || 0}
                  invalid={
                    validation.touched.exam && validation.errors.et_classId
                      ? true
                      : false
                  }
                >
                  <option value="0" disabled>
                    Select Class
                  </option>
                  {classDropDownVals.map(val => {
                    return (
                      <option key={val.id} value={val.id}>
                        {val.value}
                      </option>
                    )
                  })}
                </Input>
                {validation.touched.et_classId &&
                validation.errors.et_classId ? (
                  <FormFeedback type="invalid">
                    {validation.errors.et_classId}
                  </FormFeedback>
                ) : null}
              </div> */}

              <div className="mb-3">
                <Label className="form-label">
                  Select Class <span className="text-danger">*</span>
                </Label>
                <Select
                  name="et_classId"
                  placeholder="Select Class"
                  onChange={value => {
                    setSelectedClass(value)
                    validation.setFieldValue(
                      "et_classId",
                      value ? value.value : ""
                    )
                  }}
                  value={selectedClass || ""}
                  options={classRoomType}
                  isClearable
                  invalid={
                    validation.touched.et_classId &&
                    validation.errors.et_classId
                  }
                />

                {validation.touched.et_classId &&
                  validation.errors.et_classId && (
                    <div className="invalid-react-select-dropdown">
                      {validation.errors.et_classId}
                    </div>
                  )}
              </div>

              <div className="mb-3">
                <Label className="form-label">
                  Select Subject <span className="text-danger">*</span>
                </Label>
                <Input
                  name="et_subject"
                  type="select"
                  className="form-select"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.et_subject || 0}
                  invalid={
                    validation.touched.et_subject &&
                    validation.errors.et_subject
                      ? true
                      : false
                  }
                >
                  <option value="0" disabled>
                    Select Subject
                  </option>
                  {subjectDropdown.map(val => {
                    return (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    )
                  })}
                </Input>
                {validation.touched.et_subject &&
                validation.errors.et_subject ? (
                  <FormFeedback type="invalid">
                    {validation.errors.et_subject}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="mb-3">
                <Label className="form-label">
                  Marks <span className="text-danger">*</span>
                </Label>
                <Input
                  name="et_marks"
                  type="number"
                  placeholder="Enter Marks"
                  min={10}
                  max={1000}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.et_marks || ""}
                  invalid={
                    validation.touched.et_marks && validation.errors.et_marks
                      ? true
                      : false
                  }
                />
                {validation.touched.et_marks && validation.errors.et_marks ? (
                  <FormFeedback type="invalid">
                    {validation.errors.et_marks}
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
