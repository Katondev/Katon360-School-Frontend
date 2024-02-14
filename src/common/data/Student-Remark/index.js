import Classrooom from "./classroom"
import Students from "./student"


const createStudentDropDown = () => {
  let data = []

  for (let classroom of Classrooom) {


    let StudentClassRooom = Students.filter(
      students => students.classroom === classroom.classroom
    )

    for (let student of StudentClassRooom) {
      if (!student.studentName) {
        continue
      }

      let temp = student.studentName

      data.push({
        value: temp,
        label: temp,
        isDisabled: false,
      })
    }
  }

  return data
}



export default createStudentDropDown()
