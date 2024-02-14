import React, { useEffect, useState } from "react"

//import components
import Breadcrumbs from "../../../components/Common/Breadcrumb"

import {
  Col,
  Row,
  Card,
  CardBody,
  Table,
  Input,
  Label,
  Button,
} from "reactstrap"

import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import moment from "moment"

import { students } from "common/data/students"
import {
  getAllStudentAttendances,
  updateStudentAttendance,
} from "helpers/backendHelpers/studentAttendance"
import { SaveToast } from "components/Common/SaveToast"
import { after, isEmpty } from "underscore"
import student from "common/data/Student-Remark/student"
import { date } from "yup/lib/locale"

const getTotalDaysInMonth = date => {
  date = date || new Date()
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

const StudentAttendance = props => {
  document.title = "Student Attendance V2 | LMS Ghana"

  const [isEdit, setIsEdit] = useState(false)
  const [studentAttendances, setStudentAttendances] = useState([])
  const [attendanceDatas, setAttendanceData] = useState([])
  const [loading, setLoading] = useState(false)
  const [obj, setObj] = useState([])

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [monthDays, setMonthDays] = useState(getTotalDaysInMonth(selectedDate))
  const [submitLoading, setSubmitLoading] = useState(false)
  const [selectedMonthDays, setSelectedMonthDays] = useState([])

  const [save, setSave] = useState(false)

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const d = selectedDate
  const month = months[d.getMonth()]
  const year = d.getFullYear()

  const monthYear = month + ", " + year

  // compare month and previous month validation
  const compareMonth = months.indexOf(month) === new Date().getMonth()

  useEffect(() => {
    let monthDays = getTotalDaysInMonth(selectedDate)
    setMonthDays(monthDays)

    let temp = []
    for (let i = 0; i < monthDays; ++i) {
      temp.push(
        moment(selectedDate)
          .set("date", i + 1)
          .format()
      )
    }
    fetchAllstudentAttendace()
    setSelectedMonthDays(temp)
  }, [selectedDate])
  useEffect(() => {
    fetchAllstudentAttendace()
  }, [save])

  const toggleIsEdit = () => {
    setIsEdit(!isEdit)
  }

  const fetchAllstudentAttendace = async () => {
    try {
      setLoading(true)

      let response = await getAllStudentAttendances(monthYear)
      let { attendanceData } = response?.data
      attendanceData = attendanceData || []
      setAttendanceData(attendanceData.sa_attendanceData)
      setStudentAttendances(attendanceData)
      setLoading(false)
    } catch (error) {
      let message =
        error?.message || "There was problem fetching studentAttendance"
      setStudentAttendances([])
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }
  const handleUpdateStudentSubmit = async (id, reqBody) => {
    if (!id) {
      return SaveToast({
        message: "Invalid StudentAttendance ID",
        type: "error",
      })
    }

    try {
      setSubmitLoading(true)
      let response = await updateStudentAttendance(id, reqBody)
      let message =
        response?.message || "StudentAttendance Updated Successfully"
      SaveToast({ message, type: "success" })
      setSubmitLoading(false)
      fetchAllstudentAttendace()
      setSave(preSave => !preSave)
      return
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem updating student"

      setSubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleAttendanceChange = e => {
    setObj({
      ...obj,
      [e.target.name]: e.target.checked,
    })
  }
  const handleSubmit = async e => {
    setIsEdit(!isEdit)

    const keys = Object.keys(obj || {})
    const values = Object.values(obj || {})
    let temp = []
    for (let i = 0; i < keys.length; i++) {
      var temp2 = []
      var tempVal = {}
      for (let j = 0; j < keys.length; j++) {
        const tempDate = keys[j].split(",")[1]
        if (keys[i].split(",")[0] === keys[j].split(",")[0]) {
          tempVal[tempDate] = values[j]
        }
      }
      temp.push({
        studentId: keys[i].split(",")[0],
        Date: tempVal,
        MonthYear: monthYear,
      })
    }

    await handleUpdateStudentSubmit(12, { attendanceData: temp })
    setObj({})
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Student" breadcrumbItem="Attendance V2" />

          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <Row className="mb-2">
                    <Col md={4} sm={12} xs={12}>
                      <div className="d-flex gap-2">
                        <Label className="m-auto">Month</Label>
                        <DatePicker
                          className="w-auto form-control"
                          selected={selectedDate}
                          onChange={date => {
                            setSelectedDate(date)
                          }}
                          dateFormat="MMMM, yyyy"
                          showMonthYearPicker
                          showFullMonthYearPicker
                          placeholderText="Select Month"
                        />
                        {compareMonth ? (
                          isEdit ? (
                            <>
                              <Button
                                onClick={handleSubmit}
                                color="success"
                                className="mb-2"
                              >
                                Save
                              </Button>
                              <Button
                                onClick={toggleIsEdit}
                                color="dark"
                                className="mb-2"
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                onClick={toggleIsEdit}
                                color="warning"
                                className="mb-2"
                              >
                                Edit
                              </Button>
                            </>
                          )
                        ) : null}
                      </div>
                    </Col>

                    <Col className="text-end">
                      <div>
                        <Button
                          color="dark"
                          onClick={() => {
                            props.history.push("/students")
                          }}
                        >
                          Back
                        </Button>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col className="w-auto overflow-auto">
                      <Table className="">
                        <thead>
                          <tr>
                            <td>Name</td>
                            {selectedMonthDays.map((date, index) => (
                              <td key={index}>{moment(date).date()}</td>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {studentAttendances.map(attendance => {
                            let {
                              sa_id,
                              sa_attendanceData,
                              sa_student,
                              sa_studentId,
                            } = attendance

                            const keys = Object.keys(
                              sa_attendanceData?.Date || {}
                            )
                            const values = Object.values(
                              sa_attendanceData?.Date || {}
                            )

                            let finalObj = []
                            for (let index = 0; index < keys?.length; index++) {
                              const element = keys[index]
                              finalObj.push({
                                date: element,
                                value: values[index],
                                studentId: sa_studentId,
                              })
                            }

                            if (
                              Number(finalObj[keys.length - 1]?.date) <
                              new Date().getDate()
                            ) {
                              finalObj.push({
                                date: new Date().getDate(),
                                value: false,
                                studentId: sa_studentId,
                              })
                            }

                            return (
                              <tr key={sa_id}>
                                <td>{sa_student?.st_fullName}</td>

                                {finalObj.map((data, index) => {
                                  let isToday =
                                    new Date().getDate() === Number(data.date)
                                  let afterToday =
                                    Number(data.date) - new Date().getDate() > 0
                                  return (
                                    <td
                                      key={index}
                                      style={{ verticalAlign: "middle" }}
                                    >
                                      {afterToday && compareMonth ? (
                                        ""
                                      ) : isToday && isEdit ? (
                                        <Input
                                          type="checkbox"
                                          name={
                                            data.studentId + "," + data.date
                                          }
                                          onChange={handleAttendanceChange}
                                          defaultChecked={data.value}
                                        />
                                      ) : data.value ? (
                                        <span
                                          style={{
                                            color: "green",
                                            fontSize: "20px",
                                          }}
                                          className="fs-4"
                                        >
                                          ✓
                                        </span>
                                      ) : (
                                        <span className="text-danger fs-4">
                                          ⅹ
                                        </span>
                                      )}
                                    </td>
                                  )
                                })}
                              </tr>
                            )
                          })}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
}

export default StudentAttendance
