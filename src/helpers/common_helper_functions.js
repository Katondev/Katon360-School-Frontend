import { classRoomTypeStatic } from "common/data/dropdownVals"
import moment from "moment"

export const SimpleStringValue = cell => {
  return cell.value || ""
}

export const ShowTermNumber = cell => {
  return cell.value == 0 ? "First Term" : "Second Term"
}

// export const GetSchoolById = cell => {
//   console.log("cellProps", cell)
//   let renderedValue = ""
//   cell &&
//     cell.allSchool.find(data => {
//       return data.sc_id == cell.value
//     })
//   console.log("renderedValue", renderedValue)
// }

export const SimpleDateFormate = cell => {
  return cell.value ? moment(cell.value).format("YYYY/MM/DD") : ""
}

export const FreePaidValue = cell => {
  return cell.value ? "Free" : "Paid" || ""
}

export const ArrayToStringValue = cell => {
  return cell.value.toString() || ""
}

export const formatDate = (date, format = "DD MMM, YYYY") => {
  return date ? moment(date).format(format) : ""
}

export const stringToLowerCase = (str = "") => {
  return str.toLowerCase()
}

export const ClassRoomValue = cell => {
  return `${cell.value.cr_class || ""}-${cell.value.cr_division || ""} `
}

export const defaultRDCSeparator = ">>-<<"
