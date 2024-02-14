import React, { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
} from "reactstrap"

// Formik Validation
import * as Yup from "yup"
import { useFormik, Formik } from "formik"

//redux
import { useSelector, useDispatch } from "react-redux"
import { Form as RBSForm } from "react-bootstrap"

import { withRouter } from "react-router-dom"

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb"
import { schoolType } from "common/data/dropdownVals"

import avatar from "../../assets/images/users/avatar-1.jpg"
// actions
import { editProfile, resetProfileFlag } from "../../store/actions"
import { getSchoolInfo } from "helpers/authHelper"
import UpdateModal from "components/Common/UpdateModal"
import { SaveToast } from "components/Common/SaveToast"
import { getSchool, updateSchool } from "helpers/backendHelpers/school"
import { defaultRDCSeparator } from "helpers/common_helper_functions"
import RegionDistrictCircuitDropDownAllSelectable from "common/RegionDistrictCircuitDropDownAllSelectable"

const UserProfile = props => {
  //meta title
  document.title = "Profile | Skote - React Admin & Dashboard Template"

  const [email, setemail] = useState("")
  const [name, setname] = useState("")
  const [idx, setidx] = useState(0)
  const [isEdit, setIsEdit] = useState(true)
  const [isView, setIsView] = useState(false)

  const [updateModal, setUpdateModal] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const userType = JSON.parse(localStorage.getItem("userInfoSchool"))
  const [form, setForm] = useState({
    sc_schoolName: "",
    sc_schoolType: "",
    sc_schoolId: "",
    sc_schoolHeadName: "",
    sc_region: "",
    sc_district: "",
    sc_circuit: "",
    sc_address: "",
    sc_email: "",
    sc_phoneNumber: "",
    sc_altPhoneNumber: "",
    sc_password: "",
    sc_town: "",
    sc_latitude: "",
    sc_longitude: "",
    sc_noOfClassroom: 0,
    sc_boardingFacilities: null,
    sc_sanitaryFacilities: null,
    sc_scienceLab: null,
    sc_assemblyHall: null,
    sc_libraryFacilities: null,
    sc_diningFacilities: null,
    sc_schoolBus: null,
    sc_sportingFacilities: null,
    sc_staffAccommodation: null,
    sc_description: "",
    areaValue: "",
  })

  const RDC = `${form.sc_region} / ${
    form.sc_district === null ? "District" : form.sc_district
  } / ${form.sc_circuit === null ? "Circuit" : form.sc_circuit}`

  const { error, success } = useSelector(state => ({
    error: state.Profile.error,
    success: state.Profile.success,
  }))

  useEffect(() => {
    if (getSchoolInfo()) {
      const obj = getSchoolInfo()
      setname(obj.sc_schoolName)
      setemail(obj.sc_email)
      setidx(obj.sc_id)
      setname(obj.sc_schoolName)
      setemail(obj.sc_email)
      setidx(obj.sc_id)
    }
  }, [])

  useEffect(() => {
    let { type } = props.match.params || {}
    switch (type) {
      case "edit":
        setIsEdit(true)
        setIsView(true)
        break
      default:
        setIsView(false)
        setIsEdit(false)
        break
    }
    fetchEditSchoolDetails()
  }, [isEdit])
  const fetchEditSchoolDetails = async () => {
    try {
      let body = {
        sc_id: userType?.sc_id,
      }
      const response = await getSchool(body)

      let { school } = response.data || {}
      school = school || {}
      let { sc_region, sc_district, sc_circuit } = school

      let areaValue = `${sc_region || ""}${defaultRDCSeparator}${
        sc_district || ""
      }${defaultRDCSeparator}${sc_circuit || ""}`
      school["areaValue"] = areaValue

      if (isEdit) {
        if (school.sc_boardingFacilities === true) {
          document.getElementById("boardingFacilities-available").checked = true
        } else if (school.sc_boardingFacilities === false) {
          document.getElementById(
            "boardingFacilities-unavailable"
          ).checked = true
        }
        if (school.sc_sanitaryFacilities === true) {
          document.getElementById("sanitaryFacilities-available").checked = true
        } else if (school.sc_sanitaryFacilities === false) {
          document.getElementById(
            "sanitaryFacilities-unavailable"
          ).checked = true
        }

        if (school.sc_scienceLab === true) {
          document.getElementById("scienceLab-available").checked = true
        } else if (school.sc_scienceLab === false) {
          document.getElementById("scienceLab-unavailable").checked = true
        }

        if (school.sc_assemblyHall === true) {
          document.getElementById("assemblyHall-available").checked = true
        } else if (school.sc_assemblyHall === false) {
          document.getElementById("assemblyHall-unavailable").checked = true
        }

        if (school.sc_libraryFacilities === true) {
          document.getElementById("libraryFacilities-available").checked = true
        } else if (school.sc_libraryFacilities === false) {
          document.getElementById(
            "libraryFacilities-unavailable"
          ).checked = true
        }

        if (school.sc_diningFacilities === true) {
          document.getElementById("diningFacilities-available").checked = true
        } else if (school.sc_diningFacilities === false) {
          document.getElementById("diningFacilities-unavailable").checked = true
        }

        if (school.sc_schoolBus === true) {
          document.getElementById("schoolBus-available").checked = true
        } else if (school.sc_schoolBus === false) {
          document.getElementById("schoolBus-unavailable").checked = true
        }

        if (school.sc_sportingFacilities === true) {
          document.getElementById("sportingFacilities-available").checked = true
        } else if (school.sc_sportingFacilities === false) {
          document.getElementById(
            "sportingFacilities-unavailable"
          ).checked = true
        }

        if (school.sc_staffAccommodation === true) {
          document.getElementById("staffAccommodation-available").checked = true
        } else if (school.sc_staffAccommodation === false) {
          document.getElementById(
            "staffAccommodation-unavailable"
          ).checked = true
        }
      }

      return setForm(school)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching freelance school details"

      setForm(form)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleUpdateSchool = () => {
    setUpdateModal(false)
    SaveToast({ message: "School Updated Successfully", type: "success" })
    props.history.push("/dashboard")
  }

  const handleEditSchoolSubmit = async data => {
    try {
      setSubmitLoading(true)
      const response = await updateSchool(data)
      let message = response?.message || "School Updated Successfully"
      SaveToast({ message, type: "success" })
      setSubmitLoading(false)
      props.history.push("/dashboard")
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Updating School"
      setSubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const passwordValidation = !isEdit
    ? Yup.string()
        .min(6, "Password Must Contain Atleast 6 characters")
        .required("Please Enter password")
    : Yup.string()
        .min(6, "Password Must Contain Atleast 6 characters")
        .optional("Please Enter password")

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      sc_schoolName: name || "",
      sc_email: form.sc_email || "",
      sc_schoolHeadName: form.sc_schoolHeadName || "",
      sc_schoolId: form.sc_schoolId || "",
      sc_phoneNumber: form.sc_phoneNumber || "",
      sc_address: form.sc_address || "",
      sc_noOfClassroom: form.sc_noOfClassroom || "",
      sc_latitude: form.sc_latitude || "",
      sc_longitude: form.sc_longitude || "",
      sc_schoolType: form.sc_schoolType || "",
      sc_region: form.sc_region || "",
      sc_district: form.sc_district || "",
      sc_circuit: form.sc_circuit || "",
      sc_altPhoneNumber: form.sc_altPhoneNumber || "",
      sc_password: form.sc_password || "",
      sc_town: form.sc_town || "",
      sc_boardingFacilities: form.sc_boardingFacilities || null,
      sc_sanitaryFacilities: form.sc_sanitaryFacilities || null,
      sc_scienceLab: form.sc_scienceLab || null,
      sc_assemblyHall: form.sc_assemblyHall || null,
      sc_libraryFacilities: form.sc_libraryFacilities || null,
      sc_diningFacilities: form.sc_diningFacilities || null,
      sc_schoolBus: form.sc_schoolBus || null,
      sc_sportingFacilities: form.sc_sportingFacilities || null,
      sc_staffAccommodation: form.sc_staffAccommodation || null,
      sc_description: form.sc_description || "",
      areaValue: form.areaValue || "",
    },
    validationSchema: Yup.object({
      sc_schoolName: Yup.string().required("Please Enter School Name"),
      sc_schoolType: Yup.string()
        .oneOf(
          schoolType.map(val => val.value),
          "Please Select Valid School Type"
        )
        .required("Please Select School Type"),

      sc_schoolHeadName: Yup.string().required("Please Enter School Head Name"),
      areaValue: Yup.mixed().test(
        "invalidInput",
        "Please Select Region-District-Circuit",
        value => {
          return !!value
        }
      ),
      sc_address: Yup.string().notRequired().nullable(),
      sc_phoneNumber: Yup.string()
        .required("Please Enter Phone Number")
        .matches(new RegExp(/^[0-9]{10}$/), "Please Enter Valid Phone Number"),
      sc_altPhoneNumber: Yup.string()
        .nullable()
        .matches(new RegExp(/^[0-9]{10}$/), "Please Enter Valid Phone Number"),
      sc_email: Yup.string()
        .required("Please Enter School Email")
        .email("Please Enter Valid Email"),
      sc_password: passwordValidation,
      sc_town: Yup.string().notRequired().nullable(),
      sc_latitude: Yup.string().notRequired().nullable(),
      sc_longitude: Yup.string().notRequired().nullable(),
      sc_description: Yup.string().notRequired().nullable(),
      sc_noOfClassroom: Yup.number().notRequired().nullable(),
    }),
    onSubmit: values => {
      let [sc_region, sc_district, sc_circuit] =
        (values?.areaValue + "" || "")?.split(defaultRDCSeparator) || []
      sc_region = sc_region || null
      sc_district = sc_district || null
      sc_circuit = sc_circuit || null

      let schoolData = values
      schoolData.sc_password =
        schoolData.sc_password === "" ? null : schoolData.sc_password
      if (isEdit) {
        if (!schoolData.sc_password) {
          delete schoolData.sc_password
        }
        schoolData["sc_region"] = sc_region
        schoolData["sc_district"] = sc_district
        schoolData["sc_circuit"] = sc_circuit
        return handleEditSchoolSubmit(schoolData)
      }
    },
  })

  return (
    <React.Fragment>
      <UpdateModal
        show={updateModal}
        onUpdateClick={handleUpdateSchool}
        onCloseClick={() => setUpdateModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          {/* <Breadcrumb showGoBackButton="Back" /> */}
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 className="mb-0 font-size-18">{RDC}</h4>

            <Col className="text-end">
              <Button
                color="dark"
                onClick={() => {
                  props.history.goBack()
                }}
              >
                Back
              </Button>
            </Col>
          </div>

          <Row>
            <Col lg="12">
              {error && error ? <Alert color="dark">{error}</Alert> : null}
              {success ? <Alert color="success">{success}</Alert> : null}

              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="ms-3">
                      <img
                        src={avatar}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>{name}</h5>
                        <p className="mb-1">{}</p>
                        <p className="mb-0">Id no: #{idx}</p>
                      </div>
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>Area</h5>
                        <p className="mb-1">
                          Region-District-Circuit:
                          {RDC}
                        </p>
                        <p className="mb-0">
                          Town: {form.sc_town ? form.sc_town : "Town"}
                        </p>

                        <p className="mb-0"></p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <h4 className="card-title mb-4">Edit School</h4>

          <Card>
            <CardBody>
              <Form
                className="form-horizontal"
                onSubmit={e => {
                  e.preventDefault()
                  validation.handleSubmit()
                  return false
                }}
              >
                <Row>
                  <Col>
                    <Row className="mb-3">
                      <Col md={4} sm={6} xs={12} className="mb-3">
                        <Label className="form-label">
                          School Name <span className="text-danger">*</span>
                        </Label>
                        <Input
                          name="sc_schoolName"
                          type="text"
                          placeholder="Enter School Name"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            validation.touched.sc_schoolName &&
                            validation.errors.sc_schoolName
                          }
                          defaultValue={form.sc_schoolName}
                        />
                        {validation.touched.sc_schoolName &&
                          validation.errors.sc_schoolName && (
                            <FormFeedback>
                              {validation.errors.sc_schoolName}
                            </FormFeedback>
                          )}
                      </Col>

                      <Col md={4} sm={6} xs={12} className="mt-2 mt-md-0 mb-3">
                        <Label className="form-label">
                          School Type <span className="text-danger">*</span>
                        </Label>
                        <Input
                          name="sc_schoolType"
                          type="select"
                          className="form-select"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.sc_schoolType || 0}
                          invalid={
                            validation.touched.sc_schoolType &&
                            validation.errors.sc_schoolType
                              ? true
                              : false
                          }
                        >
                          <option disabled value={0}>
                            Select School Type
                          </option>
                          {schoolType.map(type => {
                            return (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            )
                          })}
                        </Input>
                        {validation.touched.sc_schoolType &&
                          validation.errors.sc_schoolType && (
                            <FormFeedback>
                              {validation.errors.sc_schoolType}
                            </FormFeedback>
                          )}
                      </Col>

                      <Col md={4} sm={6} xs={12} className="mt-2 mt-sm-0 mb-3">
                        <Label className="form-label">
                          School Id <span className="text-danger">*</span>
                        </Label>
                        <Input
                          name="sc_schoolId"
                          type="text"
                          placeholder="Enter School Id"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            validation.touched.sc_schoolId &&
                            validation.errors.sc_schoolId
                          }
                          defaultValue={form.sc_schoolId}
                        />
                        {validation.touched.sc_schoolId &&
                          validation.errors.sc_schoolId && (
                            <FormFeedback>
                              {validation.errors.sc_schoolId}
                            </FormFeedback>
                          )}
                      </Col>

                      <Col md={4} sm={6} xs={12} className="mt-2 mt-sm-0 mb-3">
                        <Label className="form-label">
                          School Head Name{" "}
                          <span className="text-danger">*</span>
                        </Label>
                        <Input
                          name="sc_schoolHeadName"
                          type="text"
                          placeholder="Enter School Head Name"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            validation.touched.sc_schoolHeadName &&
                            validation.errors.sc_schoolHeadName
                          }
                          defaultValue={form.sc_schoolHeadName}
                        />
                        {validation.touched.sc_schoolHeadName &&
                          validation.errors.sc_schoolHeadName && (
                            <FormFeedback>
                              {validation.errors.sc_schoolHeadName}
                            </FormFeedback>
                          )}
                      </Col>

                      <Col md={4} sm={6} xs={12} className="mt-2 mt-sm-0 mb-3">
                        <RegionDistrictCircuitDropDownAllSelectable
                          isRequired={true}
                          fieldName="areaValue"
                          hasTouched={validation.touched.areaValue}
                          hasErrors={validation.errors.areaValue}
                          areaValue={validation.values.areaValue}
                          setFieldValue={validation.setFieldValue}
                          setFieldTouched={validation.setFieldTouched}
                        />
                      </Col>

                      <Col md={4} sm={6} xs={12} className="mt-2 mt-md-0 mb-3">
                        <Label className="form-label">
                          Email <span className="text-danger">*</span>
                        </Label>
                        <Input
                          name="sc_email"
                          type="email"
                          placeholder="Enter Email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            validation.touched.sc_email &&
                            validation.errors.sc_email
                          }
                          defaultValue={form.sc_email}
                        />
                        {validation.touched.sc_email &&
                          validation.errors.sc_email && (
                            <FormFeedback>
                              {validation.errors.sc_email}
                            </FormFeedback>
                          )}
                      </Col>

                      <Col md={4} sm={6} xs={12} className="mt-2 mt-md-0 mb-3">
                        <Label className="form-label">
                          Phone Number <span className="text-danger">*</span>
                        </Label>
                        <Input
                          name="sc_phoneNumber"
                          type="tel"
                          placeholder="Enter Phone Number"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            validation.touched.sc_phoneNumber &&
                            validation.errors.sc_phoneNumber
                          }
                          defaultValue={form.sc_phoneNumber}
                        />
                        {validation.touched.sc_phoneNumber &&
                          validation.errors.sc_phoneNumber && (
                            <FormFeedback>
                              {validation.errors.sc_phoneNumber}
                            </FormFeedback>
                          )}
                      </Col>
                      <Col md={4} sm={6} xs={12} className="mt-2 mt-md-0 mb-3">
                        <Label className="form-label">Alt. Phone Number</Label>
                        <Input
                          name="sc_altPhoneNumber"
                          type="tel"
                          placeholder="Enter Alt. Phone Number"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            validation.touched.sc_altPhoneNumber &&
                            validation.errors.sc_altPhoneNumber
                          }
                          defaultValue={form.sc_altPhoneNumber}
                        />
                        {validation.touched.sc_altPhoneNumber &&
                          validation.errors.sc_altPhoneNumber && (
                            <FormFeedback>
                              {validation.errors.sc_altPhoneNumber}
                            </FormFeedback>
                          )}
                      </Col>

                      <Col md={4} sm={6} xs={12} className="mt-2 mt-md-0 mb-3">
                        <Label className="form-label">
                          Password
                          {!isEdit && <span className="text-danger">*</span>}
                        </Label>
                        <Input
                          name="sc_password"
                          type="password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.sc_password || ""}
                          invalid={
                            validation.touched.sc_password &&
                            validation.errors.sc_password
                              ? true
                              : false
                          }
                        />
                        {validation.touched.sc_password &&
                        validation.errors.sc_password ? (
                          <FormFeedback type="invalid">
                            {validation.errors.sc_password}
                          </FormFeedback>
                        ) : null}
                      </Col>

                      <Col md={4} sm={6} xs={12} className="mt-2 mt-md-0 mb-3">
                        <Label className="form-label">Town</Label>
                        <Input
                          name="sc_town"
                          type="text"
                          placeholder="Enter Town Name"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            validation.touched.sc_town &&
                            validation.errors.sc_town
                          }
                          defaultValue={form.sc_town}
                        />
                        {validation.touched.sc_town &&
                          validation.errors.sc_town && (
                            <FormFeedback>
                              {validation.errors.sc_town}
                            </FormFeedback>
                          )}
                      </Col>

                      <Col md={4} sm={6} xs={12} className="mt-2 mt-md-0 mb-3">
                        <Label className="form-label">Latitude</Label>
                        <Input
                          name="sc_latitude"
                          type="text"
                          placeholder="Enter Area Latitude"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            validation.touched.sc_latitude &&
                            validation.errors.sc_latitude
                          }
                          defaultValue={form.sc_latitude}
                        />
                        {validation.touched.sc_latitude &&
                          validation.errors.sc_latitude && (
                            <FormFeedback>
                              {validation.errors.sc_latitude}
                            </FormFeedback>
                          )}
                      </Col>

                      <Col md={4} sm={6} xs={12} className="mt-2 mt-md-0 mb-3">
                        <Label className="form-label">Longitude</Label>
                        <Input
                          name="sc_longitude"
                          type="text"
                          placeholder="Enter Area Longitude"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            validation.touched.sc_longitude &&
                            validation.errors.sc_longitude
                          }
                          defaultValue={form.sc_longitude}
                        />
                        {validation.touched.sc_longitude &&
                          validation.errors.sc_longitude && (
                            <FormFeedback>
                              {validation.errors.sc_longitude}
                            </FormFeedback>
                          )}
                      </Col>

                      <Col md={4} sm={6} xs={12} className="mt-2 mt-md-0 mb-3">
                        <Label className="form-label">Number Of Classs </Label>
                        <Input
                          name="sc_noOfClassroom"
                          type="number"
                          min={1}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.sc_noOfClassroom || ""}
                          invalid={
                            validation.touched.sc_noOfClassroom &&
                            validation.errors.sc_noOfClassroom
                              ? true
                              : false
                          }
                        />
                        {validation.touched.sc_noOfClassroom &&
                        validation.errors.sc_noOfClassroom ? (
                          <FormFeedback type="invalid">
                            {validation.errors.sc_noOfClassroom}
                          </FormFeedback>
                        ) : null}
                      </Col>
                    </Row>

                    <Row className="mb-2">
                      <Col md={2} sm={4} xs={6} className="mt-2 mt-md-0 mb-3">
                        <Row>
                          <Col className="gap-3">
                            <Label className="form-label">
                              BoardingFacilities{" "}
                            </Label>
                            <div>
                              <RBSForm.Check
                                id="boardingFacilities-available"
                                name="sc_boardingFacilities"
                                type="checkbox"
                                inline
                                label="Yes"
                                onChange={event => {
                                  if (event.target.checked) {
                                    let temp = form
                                    temp["sc_boardingFacilities"] = true
                                    validation.values[
                                      "sc_boardingFacilities"
                                    ] = true
                                    setForm(temp)
                                  }
                                }}
                              />
                              <RBSForm.Check
                                id="boardingFacilities-unavailable"
                                name="sc_boardingFacilities"
                                type="radio"
                                inline
                                label="No"
                                onChange={event => {
                                  if (event.target.checked) {
                                    let temp = form
                                    temp["sc_boardingFacilities"] = false
                                    validation.values[
                                      "sc_boardingFacilities"
                                    ] = false
                                    setForm(temp)
                                  }
                                }}
                              />
                            </div>

                            {!!validation.touched.sc_boardingFacilities &&
                              !!validation.errors.sc_boardingFacilities && (
                                <FormFeedback>
                                  {validation.errors.sc_boardingFacilities}
                                </FormFeedback>
                              )}
                          </Col>
                        </Row>
                      </Col>

                      <Col md={2} sm={4} xs={6} className="mt-2 mt-md-0 mb-3">
                        <Row>
                          <Col className="gap-3">
                            <Label className="form-label">
                              SanitaryFacilities{" "}
                            </Label>
                            <div>
                              <RBSForm.Check
                                id="sanitaryFacilities-available"
                                name="sc_sanitaryFacilities"
                                type="radio"
                                inline
                                label="Yes"
                                onChange={event => {
                                  if (event.target.checked) {
                                    let temp = form
                                    temp["sc_sanitaryFacilities"] = true
                                    validation.values[
                                      "sc_sanitaryFacilities"
                                    ] = true
                                    setForm(temp)
                                  }
                                }}
                              />
                              <RBSForm.Check
                                id="sanitaryFacilities-unavailable"
                                name="sc_sanitaryFacilities"
                                type="radio"
                                inline
                                label="No"
                                onChange={event => {
                                  if (event.target.checked) {
                                    let temp = form
                                    temp["sc_sanitaryFacilities"] = false
                                    validation.values[
                                      "sc_sanitaryFacilities"
                                    ] = false
                                    setForm(temp)
                                  }
                                }}
                              />
                            </div>

                            {!!validation.touched.sc_sanitaryFacilities &&
                              !!validation.errors.sc_sanitaryFacilities && (
                                <FormFeedback>
                                  {validation.errors.sc_sanitaryFacilities}
                                </FormFeedback>
                              )}
                          </Col>
                        </Row>
                      </Col>

                      <Col md={2} sm={4} xs={6} className="mt-2 mt-md-0 mb-3">
                        <Row>
                          <Col className="gap-3">
                            <Label className="form-label">ScienceLab </Label>
                            <div>
                              <RBSForm.Check
                                id="scienceLab-available"
                                name="sc_scienceLab"
                                type="radio"
                                inline
                                label="Yes"
                                onChange={event => {
                                  if (event.target.checked) {
                                    let temp = form
                                    temp["sc_scienceLab"] = true
                                    validation.values["sc_scienceLab"] = true
                                    setForm(temp)
                                  }
                                }}
                              />
                              <RBSForm.Check
                                id="scienceLab-unavailable"
                                name="sc_scienceLab"
                                type="radio"
                                inline
                                label="No"
                                onChange={event => {
                                  if (event.target.checked) {
                                    let temp = form
                                    temp["sc_scienceLab"] = false
                                    validation.values["sc_scienceLab"] = false
                                    setForm(temp)
                                  }
                                }}
                              />
                            </div>

                            {!!validation.touched.sc_scienceLab &&
                              !!validation.errors.sc_scienceLab && (
                                <FormFeedback>
                                  {validation.errors.sc_scienceLab}
                                </FormFeedback>
                              )}
                          </Col>
                        </Row>
                      </Col>

                      <Col md={2} sm={4} xs={6} className="mt-2 mt-md-0 mb-3">
                        <Row>
                          <Col className="gap-3">
                            <Label className="form-label">SchoolBus </Label>
                            <div>
                              <RBSForm.Check
                                id="schoolBus-available"
                                name="sc_schoolBus"
                                type="radio"
                                inline
                                label="Yes"
                                onChange={event => {
                                  if (event.target.checked) {
                                    let temp = form
                                    temp["sc_schoolBus"] = true
                                    validation.values["sc_schoolBus"] = true
                                    setForm(temp)
                                  }
                                }}
                              />
                              <RBSForm.Check
                                id="schoolBus-unavailable"
                                name="sc_schoolBus"
                                type="radio"
                                inline
                                label="No"
                                onChange={event => {
                                  if (event.target.checked) {
                                    let temp = form
                                    temp["sc_schoolBus"] = false
                                    validation.values["sc_schoolBus"] = false
                                    setForm(temp)
                                  }
                                }}
                              />
                            </div>

                            {!!validation.touched.sc_schoolBus &&
                              !!validation.errors.sc_schoolBus && (
                                <FormFeedback>
                                  {validation.errors.sc_schoolBus}
                                </FormFeedback>
                              )}
                          </Col>
                        </Row>
                      </Col>

                      <Col md={2} sm={4} xs={6} className="mt-2 mt-md-0 mb-3">
                        <Row>
                          <Col className="gap-3">
                            <Label className="form-label">
                              SportingFacilities{" "}
                            </Label>
                            <div>
                              <RBSForm.Check
                                id="sportingFacilities-available"
                                name="sc_sportingFacilities"
                                type="radio"
                                inline
                                label="Yes"
                                onChange={event => {
                                  if (event.target.checked) {
                                    let temp = form
                                    temp["sc_sportingFacilities"] = true
                                    validation.values[
                                      "sc_sportingFacilities"
                                    ] = true
                                    setForm(temp)
                                  }
                                }}
                              />
                              <RBSForm.Check
                                id="sportingFacilities-unavailable"
                                name="sc_sportingFacilities"
                                type="radio"
                                inline
                                label="No"
                                onChange={event => {
                                  if (event.target.checked) {
                                    let temp = form
                                    temp["sc_sportingFacilities"] = false
                                    validation.values[
                                      "sc_sportingFacilities"
                                    ] = false
                                    setForm(temp)
                                  }
                                }}
                              />
                            </div>

                            {!!validation.touched.sc_sportingFacilities &&
                              !!validation.errors.sc_sportingFacilities && (
                                <FormFeedback>
                                  {validation.errors.sc_sportingFacilities}
                                </FormFeedback>
                              )}
                          </Col>
                        </Row>
                      </Col>

                      <Col md={2} sm={4} xs={6} className="mt-2 mt-md-0 mb-3">
                        <Row>
                          <Col className="gap-3">
                            <Label className="form-label">
                              StaffAccommodation{" "}
                            </Label>
                            <div>
                              <RBSForm.Check
                                id="staffAccommodation-available"
                                name="sc_staffAccommodation"
                                type="radio"
                                inline
                                label="Yes"
                                onChange={event => {
                                  if (event.target.checked) {
                                    let temp = form
                                    temp["sc_staffAccommodation"] = true
                                    validation.values[
                                      "sc_staffAccommodation"
                                    ] = true
                                    setForm(temp)
                                  }
                                }}
                              />
                              <RBSForm.Check
                                id="staffAccommodation-unavailable"
                                name="sc_staffAccommodation"
                                type="radio"
                                inline
                                label="No"
                                onChange={event => {
                                  if (event.target.checked) {
                                    let temp = form
                                    temp["sc_staffAccommodation"] = false
                                    validation.values[
                                      "sc_staffAccommodation"
                                    ] = false
                                    setForm(temp)
                                  }
                                }}
                              />
                            </div>

                            {!!validation.touched.sc_staffAccommodation &&
                              !!validation.errors.sc_staffAccommodation && (
                                <FormFeedback>
                                  {validation.errors.sc_staffAccommodation}
                                </FormFeedback>
                              )}
                          </Col>
                        </Row>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col sm={12} md={6} className="mt-2 mt-md-0">
                        <Row>
                          <Col>
                            <Label className="form-label">Address </Label>
                            <Input
                              name="sc_address"
                              type="textarea"
                              rows={6}
                              placeholder="Enter Address"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={
                                validation.touched.sc_address &&
                                validation.errors.sc_address
                              }
                              defaultValue={form.sc_address}
                            />
                            {validation.touched.sc_address &&
                              validation.errors.sc_address && (
                                <FormFeedback>
                                  {validation.errors.sc_address}
                                </FormFeedback>
                              )}
                          </Col>
                        </Row>
                      </Col>
                      <Col md={2} sm={4} xs={6} className="mt-2 mt-md-0 mb-3">
                        <Row>
                          <Col className="gap-3">
                            <Label className="form-label">AssemblyHall </Label>
                            <div>
                              <RBSForm.Check
                                id="assemblyHall-available"
                                name="sc_assemblyHall"
                                type="radio"
                                inline
                                label="Yes"
                                onChange={event => {
                                  if (event.target.checked) {
                                    let temp = form
                                    temp["sc_assemblyHall"] = true
                                    validation.values["sc_assemblyHall"] = true
                                    setForm(temp)
                                  }
                                }}
                              />
                              <RBSForm.Check
                                id="assemblyHall-unavailable"
                                name="sc_assemblyHall"
                                type="radio"
                                inline
                                label="No"
                                onChange={event => {
                                  if (event.target.checked) {
                                    let temp = form
                                    temp["sc_assemblyHall"] = false
                                    validation.values["sc_assemblyHall"] = false
                                    setForm(temp)
                                  }
                                }}
                              />
                            </div>

                            {!!validation.touched.sc_assemblyHall &&
                              !!validation.errors.sc_assemblyHall && (
                                <FormFeedback>
                                  {validation.errors.sc_assemblyHall}
                                </FormFeedback>
                              )}
                          </Col>
                        </Row>
                      </Col>

                      <Col md={2} sm={4} xs={6} className="mt-2 mt-md-0 mb-3">
                        <Row>
                          <Col className="gap-3">
                            <Label className="form-label">
                              LibraryFacilities{" "}
                            </Label>
                            <div>
                              <RBSForm.Check
                                id="libraryFacilities-available"
                                name="sc_libraryFacilities"
                                type="radio"
                                inline
                                label="Yes"
                                onChange={event => {
                                  if (event.target.checked) {
                                    let temp = form
                                    temp["sc_libraryFacilities"] = true
                                    validation.values[
                                      "sc_libraryFacilities"
                                    ] = true
                                    setForm(temp)
                                  }
                                }}
                              />
                              <RBSForm.Check
                                id="libraryFacilities-unavailable"
                                name="sc_libraryFacilities"
                                type="radio"
                                inline
                                label="No"
                                onChange={event => {
                                  if (event.target.checked) {
                                    let temp = form
                                    temp["sc_libraryFacilities"] = false
                                    validation.values[
                                      "sc_libraryFacilities"
                                    ] = false
                                    setForm(temp)
                                  }
                                }}
                              />
                            </div>

                            {!!validation.touched.sc_libraryFacilities &&
                              !!validation.errors.sc_libraryFacilities && (
                                <FormFeedback>
                                  {validation.errors.sc_libraryFacilities}
                                </FormFeedback>
                              )}
                          </Col>
                        </Row>
                      </Col>

                      <Col md={2} sm={4} xs={6} className="mt-2 mt-md-0 mb-3">
                        <Row>
                          <Col className="gap-3">
                            <Label className="form-label">
                              DiningFacilities{" "}
                            </Label>
                            <div>
                              <RBSForm.Check
                                id="diningFacilities-available"
                                name="sc_diningFacilities"
                                type="radio"
                                inline
                                label="Yes"
                                onChange={event => {
                                  if (event.target.checked) {
                                    let temp = form
                                    temp["sc_diningFacilities"] = true
                                    validation.values[
                                      "sc_diningFacilities"
                                    ] = true
                                    setForm(temp)
                                  }
                                }}
                              />
                              <RBSForm.Check
                                id="diningFacilities-unavailable"
                                name="sc_diningFacilities"
                                type="radio"
                                inline
                                label="No"
                                onChange={event => {
                                  if (event.target.checked) {
                                    let temp = form
                                    temp["sc_diningFacilities"] = false
                                    validation.values[
                                      "sc_diningFacilities"
                                    ] = false
                                    setForm(temp)
                                  }
                                }}
                              />
                            </div>

                            {!!validation.touched.sc_diningFacilities &&
                              !!validation.errors.sc_diningFacilities && (
                                <FormFeedback>
                                  {validation.errors.sc_diningFacilities}
                                </FormFeedback>
                              )}
                          </Col>
                        </Row>
                      </Col>
                    </Row>

                    <Row className="mb-3 text-center">
                      <Col>
                        <Button
                          size="md"
                          color="dark"
                          type="button"
                          disabled={submitLoading}
                          className="mx-2"
                          onClick={() => {
                            props.history.push("/dashboard")
                          }}
                        >
                          Cancel
                        </Button>
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
                {/* <div className="form-group mt-2">
                  <Label className="form-label">School Name</Label>
                  <Input
                    name="sc_schoolName"
                    // value={name}
                    className="form-control"
                    placeholder="Enter School Name"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.sc_schoolName || ""}
                    invalid={
                      validation.touched.sc_schoolName &&
                      validation.errors.sc_schoolName
                        ? true
                        : false
                    }
                  />
                  {validation.touched.sc_schoolName &&
                  validation.errors.sc_schoolName ? (
                    <FormFeedback type="invalid">
                      {validation.errors.sc_schoolName}
                    </FormFeedback>
                  ) : null}
                </div>

                <div className="form-group mt-2">
                  <Label className="form-label">Email</Label>
                  <Input
                    name="sc_email"
                    className="form-control"
                    placeholder="Enter Email"
                    type="email"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.sc_email || ""}
                    invalid={
                      validation.touched.sc_email && validation.errors.sc_email
                        ? true
                        : false
                    }
                  />
                  {validation.touched.sc_email && validation.errors.sc_email ? (
                    <FormFeedback type="invalid">
                      {validation.errors.sc_email}
                    </FormFeedback>
                  ) : null}
                </div>

                <div className="form-group mt-2">
                  <Label className="form-label">Head Name</Label>
                  <Input
                    name="sc_schoolHeadName"
                    className="form-control"
                    placeholder="Enter Name"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.sc_schoolHeadName || ""}
                    invalid={
                      validation.touched.sc_schoolHeadName &&
                      validation.errors.sc_schoolHeadName
                        ? true
                        : false
                    }
                  />
                  {validation.touched.sc_schoolHeadName &&
                  validation.errors.sc_schoolHeadName ? (
                    <FormFeedback type="invalid">
                      {validation.errors.sc_schoolHeadName}
                    </FormFeedback>
                  ) : null}
                </div>

                <div className="form-group mt-2">
                  <Label className="form-label">Address</Label>
                  <Input
                    name="sc_address"
                    className="form-control"
                    placeholder="Enter Address"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.sc_address || ""}
                    invalid={
                      validation.touched.sc_address &&
                      validation.errors.sc_address
                        ? true
                        : false
                    }
                  />
                  {validation.touched.sc_address &&
                  validation.errors.sc_address ? (
                    <FormFeedback type="invalid">
                      {validation.errors.sc_address}
                    </FormFeedback>
                  ) : null}
                </div>

                <div className="form-group mt-2">
                  <Label className="form-label">Phone Number</Label>
                  <Input
                    name="sc_phoneNumber"
                    className="form-control"
                    placeholder="Enter Phone Number"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.sc_phoneNumber || ""}
                    invalid={
                      validation.touched.sc_phoneNumber &&
                      validation.errors.sc_phoneNumber
                        ? true
                        : false
                    }
                  />
                  {validation.touched.sc_phoneNumber &&
                  validation.errors.sc_phoneNumber ? (
                    <FormFeedback type="invalid">
                      {validation.errors.sc_phoneNumber}
                    </FormFeedback>
                  ) : null}
                </div>

                <div className="form-group mt-2">
                  <Label className="form-label">Number of Class</Label>
                  <Input
                    name="sc_noOfClassroom"
                    className="form-control"
                    placeholder="Enter ClassRoom"
                    type="number"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.sc_noOfClassroom || ""}
                    invalid={
                      validation.touched.sc_noOfClassroom &&
                      validation.errors.sc_noOfClassroom
                        ? true
                        : false
                    }
                  />
                  {validation.touched.sc_noOfClassroom &&
                  validation.errors.sc_noOfClassroom ? (
                    <FormFeedback type="invalid">
                      {validation.errors.sc_noOfClassroom}
                    </FormFeedback>
                  ) : null}
                </div>

                <div className="form-group mt-2">
                  <Label className="form-label">Latitude</Label>
                  <Input
                    name="sc_latitude"
                    className="form-control"
                    placeholder="Enter Area Lattitude"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.sc_latitude || ""}
                    invalid={
                      validation.touched.sc_latitude &&
                      validation.errors.sc_latitude
                        ? true
                        : false
                    }
                  />
                  {validation.touched.sc_latitude &&
                  validation.errors.sc_latitude ? (
                    <FormFeedback type="invalid">
                      {validation.errors.sc_latitude}
                    </FormFeedback>
                  ) : null}
                </div>

                <div className="form-group mt-2">
                  <Label className="form-label">Longitude</Label>
                  <Input
                    name="sc_longitude"
                    className="form-control"
                    placeholder="Enter Phone Number"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.sc_longitude || ""}
                    invalid={
                      validation.touched.sc_longitude &&
                      validation.errors.sc_longitude
                        ? true
                        : false
                    }
                  />
                  {validation.touched.sc_longitude &&
                  validation.errors.sc_longitude ? (
                    <FormFeedback type="invalid">
                      {validation.errors.sc_longitude}
                    </FormFeedback>
                  ) : null}
                </div>

                <div className="text-center mt-4">
                  <button
                    type="submit"
                    className="btn btn-success save-user"
                    disabled={submitLoading}
                  >
                    Update
                  </button>
                </div> */}
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default withRouter(UserProfile)
