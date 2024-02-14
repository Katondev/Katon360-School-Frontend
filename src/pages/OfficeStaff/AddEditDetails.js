import React, { useEffect, useState } from "react"

import PropTypes from "prop-types"
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  FormFeedback,
  Input,
  Label,
  Row,
} from "reactstrap"
import { Form, Formik } from "formik"
import * as Yup from "yup"
import { officeStaffRoles as dropDownValues } from "../../common/data/dropdownVals"
import ViewDetails from "./ViewDetails"
import { SaveToast } from "components/Common/SaveToast"

import {
  createStaffMember,
  updateStaffMember,
  getStaffMember,
} from "helpers/backendHelpers/officeStaff"

const StaffMemberModal = props => {
  const [isEdit, setIsEdit] = useState(false)
  const [isView, setIsView] = useState(false)
  const [ss_staffId, setStaffId] = useState(0)
  const [submitLoading, setSubmitLoading] = useState(false)

  const [form, setForm] = useState({
    ss_staffRole: "",
    ss_email: "",
    ss_staffId: "",
    ss_fullName: "",
    ss_phoneNumber: "",
    ss_altPhoneNumber: "",
  })

  useEffect(() => {
    document.getElementById("office-staff").classList.add("mm-active")

    let { type, id } = props.match.params || {}

    switch (type) {
      case "edit":
        setIsEdit(true)
        setIsView(false)
        setStaffId(parseInt(id))
        break
      case "view":
        setIsView(true)
        setIsEdit(false)
        setStaffId(parseInt(id))
        break
      case "add":
      default:
        setIsView(false)
        setIsEdit(false)
        setStaffId(0)
        break
    }

    if (id) {
      fetchStaffMemberForEdit(id)
    }
  }, [])

  const fetchStaffMemberForEdit = async ss_id => {
    try {
      let response = await getStaffMember(ss_id)
      let { officeStaff } = response.data
      officeStaff = officeStaff || {}
      // officeStaff.ss_altPhoneNumber =
      //   officeStaff.ss_altPhoneNumber === null
      //     ? ""
      //     : officeStaff.ss_altPhoneNumber
      return setForm(officeStaff)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Fetching Staff Member Details"

      setForm(form)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleCreateStaffMember = async data => {
    try {
      console.log("data12", data)
      setSubmitLoading(true)
      let response = await createStaffMember(data)
      let message = response?.message || "Member added successfully"
      setSubmitLoading(false)
      SaveToast({ message, type: "success" })
      props.history.push("/office-staff")
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was problem creating staff member"
      setSubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleEditStaffMember = async (ss_id, data) => {
    try {
      setSubmitLoading(true)
      let response = await updateStaffMember(ss_id, data)
      let message = response?.message || "Member updated successfully"
      setSubmitLoading(false)
      SaveToast({ message, type: "success" })
      props.history.push("/office-staff")
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was problem updating staff member"
      setSubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          {isView ? (
            <>
              <ViewDetails staffData={form} {...props} />
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>
                  {isView ? (
                    <Label>Staff Member Details</Label>
                  ) : (
                    <Label>{!isEdit ? "Enter" : "Update"} Details</Label>
                  )}
                </CardTitle>
              </CardHeader>
              <CardBody>
                <Formik
                  enableReinitialize={true}
                  initialValues={form}
                  validationSchema={Yup.object({
                    ss_staffRole: Yup.string()
                      .oneOf(dropDownValues, "Please Select Valid Staff Role")
                      .required("Please Select Staff Role"),
                    ss_email: Yup.string()
                      .required("Please Enter Email")
                      .email("Please Enter Valid Email"),
                    ss_staffId: Yup.string().required("Please Enter Staff Id"),
                    ss_fullName: Yup.string().required(
                      "Please Enter Your FullName"
                    ),
                    ss_phoneNumber: Yup.string()
                      .required("Please Enter Phone Number")
                      .matches(
                        /^[0-9]{10}$/,
                        "Please Enter Valid Phone Number"
                      ),
                    ss_altPhoneNumber: Yup.string()
                      .notRequired()
                      .matches(
                        /^[0-9]{10}$/,
                        "Please Enter Valid Phone Number"
                      ),
                  })}
                  onSubmit={values => {
                    let newStaffData = values
                    console.log("newStaffData12", newStaffData)
                    // newStaffData.ss_altPhoneNumber =
                    //   newStaffData.ss_altPhoneNumber === ""
                    //     ? null
                    //     : newStaffData.ss_altPhoneNumber
                    if (isEdit) {
                      delete newStaffData["ss_id"]
                      handleEditStaffMember(ss_staffId, newStaffData)
                    } else {
                      handleCreateStaffMember(newStaffData)
                    }
                  }}
                >
                  {({
                    touched,
                    errors,
                    values,
                    handleSubmit,
                    handleBlur,
                    setFieldValue,
                    setFieldTouched,
                    handleChange,
                  }) => (
                    <>
                      <Form
                        onSubmit={e => {
                          e.preventDefault()
                          handleSubmit(e)
                          return false
                        }}
                      >
                        <Row>
                          <Col>
                            <Row className="mb-3">
                              <Col md={4} sm={6} xs={12} className="mb-3">
                                <Label className="form-label">
                                  Staff Role{" "}
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="ss_staffRole"
                                  type="select"
                                  className="form-select"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.ss_staffRole || 0}
                                  invalid={
                                    !!touched.ss_staffRole &&
                                    !!errors.ss_staffRole
                                  }
                                >
                                  <option disabled value={0}>
                                    Select Role
                                  </option>
                                  {dropDownValues.map(val => {
                                    return (
                                      <option key={val} value={val}>
                                        {val}
                                      </option>
                                    )
                                  })}
                                </Input>
                                {touched.ss_staffRole &&
                                  errors.ss_staffRole && (
                                    <FormFeedback>
                                      {errors.ss_staffRole}
                                    </FormFeedback>
                                  )}
                              </Col>

                              <Col
                                md={4}
                                sm={6}
                                xs={12}
                                className="mt-2 mt-md-0 mb-3"
                              >
                                <Label className="form-label">
                                  Email <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="ss_email"
                                  type="ss_email"
                                  placeholder="Enter Email"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={
                                    !!touched.ss_email && !!errors.ss_email
                                  }
                                  defaultValue={values.ss_email}
                                />
                                {touched.ss_email && errors.ss_email && (
                                  <FormFeedback>{errors.ss_email}</FormFeedback>
                                )}
                              </Col>

                              <Col
                                md={4}
                                sm={6}
                                xs={12}
                                className="mt-2 mt-md-0 mb-3"
                              >
                                <Label className="form-label">
                                  Staff Id{" "}
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="ss_staffId"
                                  type="text"
                                  placeholder="Enter Staff Id"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={
                                    !!touched.ss_staffId && !!errors.ss_staffId
                                  }
                                  defaultValue={values.ss_staffId}
                                />
                                {touched.ss_staffId && errors.ss_staffId && (
                                  <FormFeedback>
                                    {errors.ss_staffId}
                                  </FormFeedback>
                                )}
                              </Col>

                              <Col md={4} sm={6} xs={12} className="mt-2 mb-3">
                                <Label className="form-label">
                                  Full Name{" "}
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="ss_fullName"
                                  type="text"
                                  placeholder="Enter Your Full Name"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={
                                    !!touched.ss_fullName &&
                                    !!errors.ss_fullName
                                  }
                                  value={values.ss_fullName}
                                />
                                {touched.ss_fullName && errors.ss_fullName && (
                                  <FormFeedback>
                                    {errors.ss_fullName}
                                  </FormFeedback>
                                )}
                              </Col>

                              <Col md={4} sm={6} xs={12} className="mt-2 mb-3">
                                <Label className="form-label">
                                  Phone Number{" "}
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  name="ss_phoneNumber"
                                  type="tel"
                                  placeholder="Enter Phone Number"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={
                                    touched.ss_phoneNumber &&
                                    errors.ss_phoneNumber
                                  }
                                  value={values?.ss_phoneNumber}
                                />
                                {touched.ss_phoneNumber &&
                                  errors.ss_phoneNumber && (
                                    <FormFeedback>
                                      {errors.ss_phoneNumber}
                                    </FormFeedback>
                                  )}
                              </Col>

                              <Col md={4} sm={6} xs={12} className="mt-2 mb-3">
                                <Label className="form-label">
                                  Alt. Phone Number
                                </Label>
                                <Input
                                  name="ss_altPhoneNumber"
                                  type="tel"
                                  placeholder="Enter Alt. Phone Number"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={
                                    touched.ss_altPhoneNumber &&
                                    errors.ss_altPhoneNumber
                                  }
                                  value={values?.ss_altPhoneNumber}
                                />
                                {touched.ss_altPhoneNumber &&
                                  errors.ss_altPhoneNumber && (
                                    <FormFeedback>
                                      {errors.ss_altPhoneNumber}
                                    </FormFeedback>
                                  )}
                              </Col>
                            </Row>

                            <Row className="mb-3"></Row>

                            <Row className="mb-3 text-center">
                              <Col>
                                <Button
                                  size="md"
                                  color="dark"
                                  type="submit"
                                  disabled={submitLoading}
                                >
                                  {!isEdit ? "Save" : "Update"}
                                </Button>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Form>
                    </>
                  )}
                </Formik>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </React.Fragment>
  )
}

StaffMemberModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
}

export default StaffMemberModal
