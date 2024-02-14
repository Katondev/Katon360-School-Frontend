import React from "react"
import PropTypes from "prop-types"

import RDCDropDownOptions from "common/data/Region-District-Circuit"
import Select from "react-select"
import { Label } from "reactstrap"

const RegionDistrictCircuitDropDown = ({
  isRequired,
  hasTouched,
  hasErrors,
  fieldName,
  selectedRegion,
  setSelectedRegion,
  setFieldValue,
  setFieldTouched,
}) => {
  return (
    <>
      <Label className="form-label">
        Region - District - Circuit{" "}
        {isRequired && <span className="text-danger">*</span>}
      </Label>
      <Select
        name={fieldName}
        placeholder="Select Region - District - Circuit"
        value={selectedRegion}
        onChange={value => {
          setSelectedRegion(value)
          setFieldValue(fieldName, value ? value.value : "")
        }}
        onBlur={evt => {
          setFieldTouched(fieldName, true, true)
        }}
        options={RDCDropDownOptions}
        isClearable
        invalid={hasTouched && hasErrors}
      />
      {hasTouched && hasErrors && (
        <div className="invalid-react-select-dropdown">{hasErrors}</div>
      )}
    </>
  )
}

RegionDistrictCircuitDropDown.propTypes = {
  isRequired: PropTypes.bool,
  hasTouched: PropTypes.bool.isRequired,
  hasErrors: PropTypes.string.isRequired,
  fieldName: PropTypes.string,
  selectedRegion: PropTypes.object.isRequired,
  setSelectedRegion: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
}

RegionDistrictCircuitDropDown.defaultProps = {
  isRequired: true,
  fieldName: "region",
}

export default RegionDistrictCircuitDropDown
