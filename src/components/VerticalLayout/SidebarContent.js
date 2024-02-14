import PropTypes from "prop-types"
import React, { useEffect, useRef, useState } from "react"

// //Import Scrollbar
import SimpleBar from "simplebar-react"

// MetisMenu
import MetisMenu from "metismenujs"
import { withRouter } from "react-router-dom"
import { Link } from "react-router-dom"

//i18n
import { withTranslation } from "react-i18next"
import { getTeacher } from "helpers/backendHelpers/schoolTeachers"
import { getTeacherByTeacherId } from "helpers/backendHelpers/schoolTeachers"

const SidebarContent = props => {
  const ref = useRef()
  const [canCreateLiveClass, setCanCreateLiveClass] = useState(false)
  const [temp, setTemp] = useState(false)
  // Use ComponentDidMount and ComponentDidUpdate method symultaniously
  useEffect(() => {
    const pathName = props.location.pathname

    const initMenu = () => {
      new MetisMenu("#side-menu")
      let matchingMenuItem = null
      const ul = document.getElementById("side-menu")
      const items = ul.getElementsByTagName("a")
      for (let i = 0; i < items.length; ++i) {
        if (pathName === items[i].pathname) {
          matchingMenuItem = items[i]
          break
        }
      }
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem)
      }
    }
    initMenu()
  }, [props.location.pathname])

  useEffect(() => {
    ref.current.recalculate()
  })

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300
      }
    }
  }

  function activateParentDropdown(item) {
    item.classList.add("active")
    const parent = item.parentElement
    const parent2El = parent.childNodes[1]
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show")
    }

    if (parent) {
      parent.classList.add("mm-active")
      const parent2 = parent.parentElement

      if (parent2) {
        parent2.classList.add("mm-show") // ul tag

        const parent3 = parent2.parentElement // li tag

        if (parent3) {
          parent3.classList.add("mm-active") // li
          parent3.childNodes[0].classList?.add("mm-active") //a
          const parent4 = parent3.parentElement // ul
          if (parent4) {
            parent4.classList?.add("mm-show") // ul
            const parent5 = parent4.parentElement
            if (parent5) {
              parent5.classList.add("mm-show") // li
              parent5.childNodes[0].classList?.add("mm-active") // a tag
            }
          }
        }
      }
      scrollElement(item)
      return false
    }
    scrollElement(item)
    return false
  }

  const userType = JSON.parse(localStorage.getItem("userInfoSchool"))

  useEffect(() => {
    console.log("userType2233", userType)
    if (userType?.userType == "Teacher") {
      teacherLogin(userType?.tc_id)
    }
  }, [])

  const teacherLogin = async id => {
    try {
      let responseData = await getTeacherByTeacherId(id)

      if (!responseData?.status) {
        let message = responseData?.message || "Error while logging in"
        return setError(message)
      }
      let { teacher } = responseData.data

      setCanCreateLiveClass(teacher?.canCreateLiveClass)
      setTemp(!temp)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "Error while logging in"
      return setError(message)
    }
  }

  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          {/* School Sidebar */}
          {userType && userType?.userType == "School" && (
            <ul className="metismenu list-unstyled" id="side-menu">
              {/* <li className="menu-title">{props.t("Menu")} </li> */}
              <li>
                <Link to="/dashboard">
                  <i className="bx bx-home-circle"></i>
                  <span>{props.t("Dashboard")}</span>
                </Link>
              </li>
              <li>
                <Link to="/classroom">
                  <i className="mdi mdi-google-classroom"></i>
                  <span>{props.t("Classroom")}</span>
                </Link>
              </li>
              <li id="office-staff">
                <Link to="/office-staff">
                  <i className="dripicons-user-group"></i>
                  <span>{props.t("Office Staff")}</span>
                </Link>
              </li>

              {/* <li>
                <Link to="/#" className="has-arrow">
                  <i className="fas fa-book-reader"></i>
                  <span>{props.t("Students")}</span>
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link to="/students">List</Link>
                  </li>
                  <li>
                    <Link to="/student-attendance">Attendance</Link>
                  </li>

                </ul>
              </li> */}
              {/* <li id="question-bank">
                <Link to="/question-bank">
                  <i className="fas fa-book-reader"></i>
                  <span>{props.t("Question Bank")}</span>
                </Link>
              </li> */}
              <li id="teachers">
                <Link to="/teachers">
                  <i className="fas fa-chalkboard-teacher"></i>
                  <span>{props.t("Teachers")}</span>
                </Link>
              </li>
              <li id="event-calender">
                <Link to="/event-calender">
                  <i className="bx bx-calendar-check"></i>
                  <span>{props.t("Calender")}</span>
                </Link>
              </li>
              <li id="notification">
                <Link to="/notification">
                  <i className="bx bx-bell"></i>
                  <span>{props.t("Notification")}</span>
                </Link>
              </li>
              <li id="remarks">
                <Link to="/remarks">
                  <i className="fa fa-sticky-note"></i>
                  <span>{props.t("Remarks to Student")}</span>
                </Link>
              </li>
              <li id="exams">
                <Link to="/#" className="has-arrow">
                  <i className="fas fa-clipboard-list"></i>
                  <span>{props.t("Exam")}</span>
                </Link>
                <ul className="sub-menu">
                  <li id="exam-generation">
                    <Link to="/exam-generation">
                      {props.t("Exam Generation")}
                    </Link>
                  </li>
                  <li id="exam-timetable">
                    <Link to="/exam-timetable">
                      {props.t("Exam Timetable")}
                    </Link>
                  </li>
                  <li id="exam-old">
                    <Link to="/exam-old">{props.t("Old Exam")}</Link>
                  </li>
                </ul>
              </li>
            </ul>
          )}
          {userType && userType?.userType == "Teacher" && (
            <ul className="metismenu list-unstyled" id="side-menu">
              <li id="students">
                <Link to="/#" className="has-arrow">
                  <i className="fas fa-book-reader"></i>
                  <span>{props.t("Students")}</span>
                </Link>
                <ul className="sub-menu">
                  <li id="students-list">
                    <Link to="/students">List</Link>
                  </li>
                  <li>
                    <Link to="/student-attendance">Attendance</Link>
                  </li>
                </ul>
              </li>
              <li id="lesson-notes">
                <Link to="/lesson-notes">
                  <i className="bx bx-home-circle"></i>
                  <span>{props.t("Lesson Notes")}</span>
                </Link>
              </li>
              <li id="termly-scheme">
                <Link to="/termly-scheme">
                  <i className="bx bx-home-circle"></i>
                  <span>{props.t("Termly Scheme")}</span>
                </Link>
              </li>
              <li id="yearly-scheme">
                <Link to="/yearly-scheme">
                  <i className="bx bx-home-circle"></i>
                  <span>{props.t("Yearly Scheme")}</span>
                </Link>
              </li>
              
              {/* {canCreateLiveClass && (
                <li id="live-session">
                  <Link to="/live-session">
                    <i className="bx bx-home-circle"></i>
                    <span>{props.t("Live Session")}</span>
                  </Link>
                </li>
              )} */}

              <li id="Assignment">
                <Link to="/Assignment">
                  <i className="bx bx-home-circle"></i>
                  <span>{props.t("Assignment")}</span>
                </Link>
              </li>
              <li id="AssignmentQuestion">
                <Link to="/AssignmentQuestion">
                  <i className="bx bx-home-circle"></i>
                  <span>{props.t("All Questions")}</span>
                </Link>
              </li>
              {/* <li id="past-paper">
                <Link to="/past-paper">
                  <i className="bx bx-home-circle"></i>
                  <span>{props.t("Past Questions")}</span>
                </Link>
              </li> */}
              <li id="Send-message">
                <Link to="/Send-message">
                  <i className="bx bx-home-circle"></i>
                  <span>{props.t("Send Message")}</span>
                </Link>
              </li>
            </ul>
          )}
        </div>
      </SimpleBar>
    </React.Fragment>
  )
}

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
}

export default withRouter(withTranslation()(SidebarContent))
