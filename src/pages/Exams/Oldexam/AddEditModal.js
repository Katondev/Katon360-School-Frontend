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
  classRoomTypeStatic,
  subjects as subjectDropdown,
} from "../../../common/data/dropdownVals"
import SubmitLoader from "common/SubmitLoader"
import Select from "react-select"
import { getAllClassroom } from "helpers/backendHelpers/classroom"

const AddEditExamModal = props => {
  const {
    isOpen,
    toggle,
    validation,
    isEdit,
    classDropDownVals,
    examDropDownVals,
    submitLoading,
    exam,
  } = props
  const [selectedClass, setSelectedClass] = useState("")

  useEffect(() => {
    if (exam) {
      setSelectedClass({
        label: exam.et_classId,
        value: exam.et_classId,
      })
    }
  }, [exam])

  const fetchClassroomDropDownValues = async () => {
    try {
      let response = await getAllClassroom()
      let { classRooms } = response.data || {}
      classRooms = classRooms || []
      let classroomVals = classRooms
        .filter(classroom => {
          return classroom.cr_status
        })
        .map(classroom => {
          return {
            id: classroom.cr_id,
            value: `${classroom.cr_class}-${classroom.cr_division}`,
          }
        })
      setClassroomDropdownValues(classroomVals)
      return
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching classrooms"

      return SaveToast({ message, type: "error" })
    }
  }

  useEffect(() => {
    fetchClassroomDropDownValues()
  }, [])
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      {submitLoading ? <SubmitLoader /> : <></>}
      <ModalHeader toggle={toggle} tag="h4">
        {!!isEdit ? "Edit Old Exampaper" : "Add Old Exampaper"}
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
                    validation.touched.et_classId &&
                    validation.errors.et_classId
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
                <Label className="form-label">Upload Exam Paper</Label>
                <Input
                  name="et_oldExamPaper"
                  type="file"
                  accept=".png, .jpg, .jpeg, .gif, .pdf"
                  placeholder="Select Exam Paper"
                  onChange={e => {
                    validation.setFieldValue("et_oldExamPaper", {
                      file: e.target.files[0],
                      fileName: e.target.files[0].name,
                    })
                  }}
                  onBlur={validation.handleBlur}
                  invalid={
                    validation.touched.et_oldExamPaper &&
                    validation.errors.et_oldExamPaper
                  }
                  defaultValue={validation.values.et_oldExamPaper}
                />
                {validation.touched.et_oldExamPaper &&
                  validation.errors.et_oldExamPaper && (
                    <FormFeedback>
                      {validation.errors.et_oldExamPaper}
                    </FormFeedback>
                  )}
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
