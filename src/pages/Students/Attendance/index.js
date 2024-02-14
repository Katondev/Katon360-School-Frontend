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
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap"

import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import moment from "moment"

import {
  getAllStudentsBySchool,
  getAllStudentsByTeacher,
} from "helpers/backendHelpers/students"
import {
  createStudentAttendance,
  getAllStudentAttendances,
  updateStudentAttendanceWithBulk,
} from "helpers/backendHelpers/studentAttendance"
import { SaveToast } from "components/Common/SaveToast"
import {
  getTeacher,
  getTeacherByTeacherId,
  updateTeacher,
} from "helpers/backendHelpers/schoolTeachers"
import { getAllClassroomByClassRoomId } from "helpers/backendHelpers/classroom"
import {
  getAttendanceEntry,
  updateAttendanceEntry,
} from "helpers/backendHelpers/attendanceEntry"
import {
  getSchool,
  updateSchool,
  updateSchoolById,
} from "helpers/backendHelpers/school"

const getTotalDaysInMonth = date => {
  date = date || new Date()
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

const StudentAttendance = props => {
  const [students, setStudents] = useState([])
  document.title = "Student Attendance | LMS Ghana"
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedMonthWithDate, setSelectedMonthWithDate] = useState()
  const [monthDays, setMonthDays] = useState(getTotalDaysInMonth(selectedDate))
  const [selectedMonthDays, setSelectedMonthDays] = useState([])
  const [attendanceData, setAttendanceData] = useState([])
  const [getAttendanceData, setGetAttendanceData] = useState([])
  const [loading, setLoading] = useState(false)
  const userType = JSON.parse(localStorage.getItem("userInfoSchool"))
  const userInfo = JSON.parse(localStorage.getItem("teacherInfo"))
  const [values, setValues] = useState({})
  const [classRoomIds, setClassRoomIds] = useState([])
  const [classRooms, setClassRooms] = useState([])
  const [activeClassRoomTab, setActiveClassRoomTab] = useState(1)
  const [flagAtten1, setflagAtten] = useState()
  const [mainStudentList, setMainStudentList] = useState([])
  const [temp, setTemp] = useState(false)

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

  useEffect(() => {
    setSelectedMonthWithDate(monthYear)
    fetchTeacherDetails()
    fetchAllStudents()
  }, [])

  useEffect(() => {
    if (selectedMonthWithDate) {
      fetchAllstudentAttendace(selectedMonthWithDate)
    }

    setAttendanceData(attendanceData)
  }, [selectedMonthWithDate])
  useEffect(() => {
    let currentDay = `day${new Date().getDate()}`
    console.log("getAttendanceData12", getAttendanceData)
    getAttendanceData.length > 0 &&
      getAttendanceData.map(data => {
        setValues(pre => ({
          ...pre,
          [`${data.sa_student.st_id}${currentDay}`]: data[currentDay],
        }))
      })
    let attenData = []
    if (getAttendanceData.length > 0) {
      getAttendanceData.map(data => {
        attenData.push({
          sa_studentId: data.sa_studentId,
          sa_schoolId: data.sa_schoolId,
          [currentDay]: data[currentDay],
          monthYear: selectedMonthWithDate,
        })
      })
      setAttendanceData(attenData)
    }
  }, [getAttendanceData])

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

    setSelectedMonthDays(temp)
  }, [selectedDate])

  useEffect(() => {
    async function assignStudentAttendance() {
      if (mainStudentList.length > 0) {
        let currentMonth = new Date().getMonth() + 1

        let flagAtten

        // if (localStorage.getItem("flagAtten") === null) {
        //   localStorage.setItem("flagAtten", currentMonth)
        //   flagAtten = localStorage.getItem("flagAtten")
        // } else {
        //   flagAtten = localStorage.getItem("flagAtten")
        // }

        let body = {
          sc_id: userType?.sc_id,
        }
        const schoolData = await getSchool(body)

        let { school } = schoolData.data || {}
        flagAtten = school?.flagAtten
        let tempData = []
        mainStudentList.map(data => {
          tempData.push({
            sa_studentId: data.st_id,
            sa_schoolId: data.st_schoolId,
            monthYear: selectedMonthWithDate,
          })
        })

        let attendData = {
          attendanceData: JSON.stringify(tempData),
        }

        let response = await getAttendanceEntry(userType?.sc_id)
        let { attendanceEntry } = response.data
        attendanceEntry = attendanceEntry || []

        let data = {
          ae_flagAttendance: currentMonth == 12 ? 1 : currentMonth + 1,
        }
        let updateAttenFlag = {
          flagAtten: currentMonth == 12 ? 1 : currentMonth + 1,
        }

        if (currentMonth == 1 && flagAtten && flagAtten == 1) {
          let response = await createStudentAttendance(attendData)
          if (response.status) {
            localStorage.setItem("flagAtten", 2)
            const school = await updateSchoolById(
              userType?.sc_id,
              updateAttenFlag
            )
            updateAttendanceEntryAPI(data, userType?.sc_id)
            fetchAllstudentAttendace(selectedMonthWithDate)
          }
        } else if (currentMonth == 2 && flagAtten && flagAtten == 2) {
          let response = await createStudentAttendance(attendData)
          if (response.status) {
            localStorage.setItem("flagAtten", 3)
            const school = await updateSchoolById(
              userType?.sc_id,
              updateAttenFlag
            )
            updateAttendanceEntryAPI(data, userType?.sc_id)
            fetchAllstudentAttendace(selectedMonthWithDate)
          }
        } else if (currentMonth == 3 && flagAtten && flagAtten == 3) {
          let response = await createStudentAttendance(attendData)
          if (response.status) {
            localStorage.setItem("flagAtten", 4)
            const school = await updateSchoolById(
              userType?.sc_id,
              updateAttenFlag
            )
            updateAttendanceEntryAPI(data, userType?.sc_id)
            fetchAllstudentAttendace(selectedMonthWithDate)
          }
        } else if (currentMonth == 4 && flagAtten && flagAtten == 4) {
          let response = await createStudentAttendance(attendData)
          if (response.status) {
            localStorage.setItem("flagAtten", 5)
            const school = await updateSchoolById(
              userType?.sc_id,
              updateAttenFlag
            )
            updateAttendanceEntryAPI(data, userType?.sc_id)
            fetchAllstudentAttendace(selectedMonthWithDate)
          }
        } else if (currentMonth == 5 && flagAtten && flagAtten == 5) {
          let response = await createStudentAttendance(attendData)
          if (response.status) {
            localStorage.setItem("flagAtten", 6)
            const school = await updateSchoolById(
              userType?.sc_id,
              updateAttenFlag
            )
            updateAttendanceEntryAPI(data, userType?.sc_id)
            fetchAllstudentAttendace(selectedMonthWithDate)
          }
        } else if (currentMonth == 6 && flagAtten && flagAtten == 6) {
          let response = await createStudentAttendance(attendData)
          if (response.status) {
            localStorage.setItem("flagAtten", 7)
            const school = await updateSchoolById(
              userType?.sc_id,
              updateAttenFlag
            )
            updateAttendanceEntryAPI(data, userType?.sc_id)
            fetchAllstudentAttendace(selectedMonthWithDate)
          }
        } else if (currentMonth == 7 && flagAtten && flagAtten == 7) {
          let response = await createStudentAttendance(attendData)
          if (response.status) {
            localStorage.setItem("flagAtten", 8)
            const school = await updateSchoolById(
              userType?.sc_id,
              updateAttenFlag
            )
            updateAttendanceEntryAPI(data, userType?.sc_id)
            fetchAllstudentAttendace(selectedMonthWithDate)
          }
        } else if (currentMonth == 8 && flagAtten && flagAtten == 8) {
          let response = await createStudentAttendance(attendData)
          if (response.status) {
            localStorage.setItem("flagAtten", 9)
            const school = await updateSchoolById(
              userType?.sc_id,
              updateAttenFlag
            )
            updateAttendanceEntryAPI(data, userType?.sc_id)
            fetchAllstudentAttendace(selectedMonthWithDate)
          }
        } else if (currentMonth == 9 && flagAtten && flagAtten == 9) {
          let response = await createStudentAttendance(attendData)
          if (response.status) {
            localStorage.setItem("flagAtten", 10)
            const school = await updateSchoolById(
              userType?.sc_id,
              updateAttenFlag
            )
            updateAttendanceEntryAPI(data, userType?.sc_id)
            fetchAllstudentAttendace(selectedMonthWithDate)
          }
        } else if (currentMonth == 10 && flagAtten && flagAtten == 10) {
          let response = await createStudentAttendance(attendData)
          if (response.status) {
            localStorage.setItem("flagAtten", 11)
            const school = await updateSchoolById(
              userType?.sc_id,
              updateAttenFlag
            )
            updateAttendanceEntryAPI(data, userType?.sc_id)
            fetchAllstudentAttendace(selectedMonthWithDate)
          }
        } else if (currentMonth == 11 && flagAtten && flagAtten == 11) {
          let response = await createStudentAttendance(attendData)
          if (response.status) {
            localStorage.setItem("flagAtten", 12)
            const school = await updateSchoolById(
              userType?.sc_id,
              updateAttenFlag
            )
            updateAttendanceEntryAPI(data, userType?.sc_id)
            fetchAllstudentAttendace(selectedMonthWithDate)
          }
        } else if (currentMonth == 12 && flagAtten && flagAtten == 12) {
          let response = await createStudentAttendance(attendData)
          if (response.status) {
            localStorage.setItem("flagAtten", 1)
            const school = await updateSchoolById(
              userType?.sc_id,
              updateAttenFlag
            )
            updateAttendanceEntryAPI(data, userType?.sc_id)
            fetchAllstudentAttendace(selectedMonthWithDate)
          }
        }
      }
    }
    assignStudentAttendance()
  }, [mainStudentList])

  const handleUpdateSchool = async data => {
    try {
      setSubmitLoading(true)
      const response = await updateSchool(data)
      let message = response?.message || "School Updated Successfully"
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Updating School"
      // return SaveToast({ message, type: "error" })
    }
  }

  useEffect(() => {
    if (classRoomIds && classRoomIds.length > 0) {
      fetchAllClassRoomByClassRoomId(classRoomIds)
    }
  }, [classRoomIds])

  useEffect(() => {
    fetchAllStudentsByClassRoomId(activeClassRoomTab)
  }, [activeClassRoomTab])

  const fetchAllClassRoomByClassRoomId = async classRoomIds => {
    try {
      let body = {
        cr_id: JSON.stringify(classRoomIds),
      }
      setLoading(true)
      let response = await getAllClassroomByClassRoomId(body)
      let { classRooms } = response.data
      setClassRooms(classRooms)
      setActiveClassRoomTab(classRooms[0]?.cr_id)
      setLoading(false)
    } catch (error) {
      let message = error?.message || "There was problem fetching ClassRooms"
      setClassRooms([])
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const fetchAllStudentsByClassRoomId = async activeClassRoomTab => {
    try {
      let body = {
        sc_id: userType?.sc_id,
        tc_classRoomId: JSON.stringify(activeClassRoomTab),
      }
      setLoading(true)
      let response = await getAllStudentsByTeacher(body)
      let { students } = response.data
      students = students || []
      console.log("students12", students)
      setStudents(students)

      setLoading(false)
    } catch (error) {
      let message = error?.message || "There was problem fetching students"
      setStudents([])
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const fetchTeacherDetails = async () => {
    try {
      setLoading(true)
      let response = await getTeacherByTeacherId(userInfo?.tc_id)
      let { teacher } = response.data
      setClassRoomIds(teacher?.tc_classRoomId)
    } catch (error) {
      let message = error?.message || "There was problem fetching students"
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const fetchAllStudents = async () => {
    try {
      let body = {
        sc_id: userType?.sc_id,
      }
      let response = await getAllStudentsBySchool(body)
      let { students } = response.data
      students = students || []
      setMainStudentList(students)
      setTemp(!temp)
    } catch (error) {
      let message = error?.message || "There was problem fetching students"
      setMainStudentList([])

      return SaveToast({ message, type: "error" })
    }
  }

  const fetchAttendanceEntry = async () => {
    try {
      let response = await getAttendanceEntry(1)
      let { attendanceEntry } = response.data
      attendanceEntry = attendanceEntry || []
      setflagAtten(attendanceEntry?.ae_flagAttendance)
    } catch (error) {
      let message = error?.message || "There was problem fetching students"
      setStudents([])

      return SaveToast({ message, type: "error" })
    }
  }

  const fetchAllstudentAttendace = async monthYear => {
    try {
      setLoading(true)
      let response = await getAllStudentAttendances(monthYear, userType?.sc_id)
      let { attendanceData } = response?.data
      console.log("attendanceData12", attendanceData)
      attendanceData = attendanceData || []
      setGetAttendanceData(attendanceData)
      setLoading(false)
      setTemp(!temp)
    } catch (error) {
      let message =
        error?.message || "There was problem fetching studentAttendance"
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const updateAttendanceEntryAPI = async (data, sc_id) => {
    try {
      setLoading(true)
      let response = await updateAttendanceEntry(data, sc_id)
      let { attendanceData } = response?.data
      attendanceData = attendanceData || []
      setGetAttendanceData(attendanceData)
      setLoading(false)
    } catch (error) {
      let message =
        error?.message || "There was problem fetching studentAttendance"
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleChange = async (
    event,
    st_id,
    st_schoolId,
    date,
    selectedMonthWithDate
  ) => {
    let dayMaker = `day${date}`

    if (attendanceData && attendanceData.length > 0)
      attendanceData.forEach((element, index) => {
        if (element.sa_studentId === st_id) {
          attendanceData.splice(index, 1)
        }
      })

    setAttendanceData(pre => {
      return [
        ...pre,
        {
          sa_studentId: st_id,
          sa_schoolId: st_schoolId,
          [dayMaker]: event.target.checked,
          monthYear: selectedMonthWithDate,
        },
      ]
    })
  }

  const handleSubmit = async () => {
    attendanceData.length > 0 &&
      attendanceData.map(data => {
        data.monthYear = selectedMonthWithDate
      })

    let data = {
      attendanceData: JSON.stringify(attendanceData),
    }
    try {
      let response = await updateStudentAttendanceWithBulk(
        data,
        userType?.sc_id
      )

      if (response.status) {
        SaveToast({ message: response.message, type: "success" })
      }
      fetchAllstudentAttendace(selectedMonthWithDate)
    } catch (e) {
      console.log("error", e)
    }
  }
  const setMonthWithDate = async date => {
    setSelectedDate(date)
    const d = date
    const month = months[d.getMonth()]
    const year = d.getFullYear()
    const monthYear = month + ", " + year
    setSelectedMonthWithDate(monthYear)
  }
  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Student" breadcrumbItem="Attendance" />
          <Nav tabs>
            {classRooms.length > 0 &&
              classRooms.map((data, i) => {
                return (
                  <NavItem key={i}>
                    <NavLink
                      className={activeClassRoomTab === data.cr_id && "active"}
                      onClick={() => {
                        setActiveClassRoomTab(data.cr_id)
                      }}
                    >
                      {data.cr_class}-{data.cr_division}
                    </NavLink>
                  </NavItem>
                )
              })}
          </Nav>
          <TabContent activeTab={activeClassRoomTab}>
            {classRooms.length > 0 ? (
              classRooms.map((data, i) => {
                return (
                  <TabPane tabId={data.cr_id} key={i}>
                    <Row>
                      <Col xs="12">
                        <Card>
                          <CardBody>
                            <Row className="mb-4">
                              <Col xs={12} className="d-flex gap-3">
                                <Label className="m-auto">Month</Label>
                                <DatePicker
                                  className="form-control w-auto"
                                  selected={selectedDate}
                                  onChange={date => {
                                    setMonthWithDate(date)
                                  }}
                                  dateFormat="MMMM, yyyy"
                                  showMonthYearPicker
                                  showFullMonthYearPicker
                                  placeholderText="Select Month"
                                />
                                <Col className="text-end">
                                  <div className="d-flex">
                                    <Button
                                      color="dark"
                                      className="ms-3"
                                      onClick={() => {
                                        handleSubmit()
                                      }}
                                    >
                                      Submit
                                    </Button>
                                  </div>
                                </Col>
                              </Col>
                            </Row>

                            <Row>
                              <Col className="w-auto overflow-auto">
                                <Table className="">
                                  <thead>
                                    <tr>
                                      <td>Name</td>
                                      {selectedMonthDays.map((date, index) => (
                                        <td key={index}>
                                          {moment(date).date()}
                                        </td>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {students.map(student => {
                                      let { st_id, st_fullName, st_schoolId } =
                                        student

                                      return (
                                        <tr key={st_id}>
                                          <td>{st_fullName}</td>
                                          {selectedMonthDays.map(
                                            (date, index) => {
                                              let random = Math.ceil(
                                                Math.random() - 0.5
                                              )
                                              let dateColumnName = ""
                                              let isToday =
                                                moment(date).format(
                                                  "DD-MM-YYYY"
                                                ) ===
                                                moment(new Date()).format(
                                                  "DD-MM-YYYY"
                                                )
                                              let afterToday =
                                                moment(date).diff(new Date()) >
                                                0

                                              let currentDate = new Date(
                                                date
                                              ).getDate()

                                              dateColumnName = `day${currentDate}`
                                              let currentDay = `day${new Date().getDate()}`

                                              return (
                                                <td
                                                  key={index}
                                                  style={{
                                                    verticalAlign: "middle",
                                                  }}
                                                >
                                                  {getAttendanceData &&
                                                    getAttendanceData.length >
                                                      0 &&
                                                    getAttendanceData.map(
                                                      data => {
                                                        if (
                                                          st_id ==
                                                          data.sa_student.st_id
                                                        ) {
                                                          if (isToday) {
                                                            return (
                                                              <Input
                                                                name={`${st_id}${currentDay}`}
                                                                key={"1"}
                                                                type="checkbox"
                                                                value={
                                                                  values[
                                                                    `${st_id}${currentDay}`
                                                                  ]
                                                                }
                                                                onClick={e => {
                                                                  let {
                                                                    checked,
                                                                    name,
                                                                  } = e.target

                                                                  setValues(
                                                                    pre => ({
                                                                      ...pre,
                                                                      [name]:
                                                                        checked,
                                                                    })
                                                                  )

                                                                  handleChange(
                                                                    e,
                                                                    st_id,
                                                                    st_schoolId,
                                                                    new Date().getDate(),
                                                                    selectedMonthWithDate
                                                                  )
                                                                }}
                                                                defaultChecked={
                                                                  values[
                                                                    `${st_id}${currentDay}`
                                                                  ]
                                                                }
                                                              />
                                                            )
                                                          } else {
                                                            return data[
                                                              dateColumnName
                                                            ] == true ? (
                                                              <span
                                                                key={"1"}
                                                                style={{
                                                                  color:
                                                                    "green",
                                                                }}
                                                                className="fs-4"
                                                              >
                                                                ✓
                                                              </span>
                                                            ) : (
                                                              data[
                                                                dateColumnName
                                                              ] == false && (
                                                                <>
                                                                  <span
                                                                    className="text-danger fs-4"
                                                                    key={"1"}
                                                                  >
                                                                    x
                                                                  </span>
                                                                </>
                                                              )
                                                            )
                                                          }
                                                        }
                                                      }
                                                    )}
                                                </td>
                                              )
                                            }
                                          )}
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
                  </TabPane>
                )
              })
            ) : (
              <h4 className="text-center">No system activity found</h4>
            )}
          </TabContent>
        </div>
      </div>
    </React.Fragment>
  )
}

export default StudentAttendance
