import React from "react"
import { Redirect } from "react-router-dom"

// Profile
import SchoolProfile from "../pages/Authentication/SchoolProfile"
import TeacherProfile from "../pages/Authentication/TeacherProfile"

// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import ForgetPwd from "../pages/Authentication/ForgetPassword"

// Dashboard
import Dashboard from "../pages/Dashboard/index"

//Classroom
import Classroom from "pages/Classroom"

//OfficeStaff
import OfficeStaff from "../pages/OfficeStaff"
import AddEditOfficeStaff from "../pages/OfficeStaff/AddEditDetails"

//Students
import Students from "pages/Students"
import AddEditStudent from "pages/Students/AddEditDetails"

//Student Attendance
import StudentAttendance from "pages/Students/Attendance"
import StudentAttendanceV2 from "pages/Students/Attendance/indexV2"
//StudentDetails
import StudentDetails from "pages/StudentDetails"

// QuestionBank
import QuestionBank from "pages/QuestionBank"
import AddEditQuestionBank from "pages/QuestionBank/AddEditDetails"

// Teachers
import Teachers from "pages/Teachers"
import AddEditTeacher from "pages/Teachers/AddEditDetails"

// EventCalender
import EventCalender from "pages/EventCalender"
import AddEditEventCalender from "../pages/EventCalender/AddEditDetails"

// Notification
import Notification from "pages/Notification"
import AddEditNotification from "../pages/Notification/AddEditDetails"

// Termly Scheme
import TermlyScheme from "pages/TermlyScheme"
import AddEditTermlyScheme from "../pages/TermlyScheme/AddEditDetails"

// Live Session
import LiveSession from "pages/LiveSession"
import AddEditLiveSession from "../pages/LiveSession/AddEditDetails"
// Assigment
import Assigment from "pages/Assigment"
import AddEditAssigment from "../pages/Assigment/AddEditDetails"

// Assigment Question
import AssigmentQuestion from "pages/AssigmentQuestion"
import AddEditAssigmentQuestion from "../pages/AssigmentQuestion/AddEditDetails"

// Assigment
import SendMessage from "pages/SendMessage"
import AddEditSendMessage from "../pages/SendMessage/AddEditDetails"

// Past Paper
import PastPaper from "pages/PastPaper"
import AddEditPastPaer from "../pages/PastPaper/AddEditDetails"

// Past Question Paper
import PastPaperQuestion from "pages/PastPaperQuestion"
import AddEditPastPaerQuestion from "../pages/PastPaperQuestion/AddEditDetails"

// Past Question Manage
import PastPaperManage from "pages/PastPaperQuestion/PastPaperManage"

// Lesson Notes
import LessonNotes from "pages/WeeklyLessonPlan"
import AddEditLessonNotes from "../pages/WeeklyLessonPlan/AddEditDetails"

// Yearly Scheme
import YearlyScheme from "pages/YearlyScheme"
import AddEditYearlyScheme from "../pages/YearlyScheme/AddEditDetails"

//TeacherDetails
import TeacherDetails from "pages/TeacherDetails"

// Remarks
import Remark from "pages/Remarks"

// Exams
// Exam Generation
import ExamGeneration from "pages/Exams/Generation"
// Exam Timetable
import ExamTimetable from "pages/Exams/Timetable"
// Exam Old Papers
import OldExam from "pages/Exams/Oldexam"

// Teacher-Lesson-Note
import Lesson from "pages/Lesson"
import AssignmentManage from "pages/Assigment/AssignmentManage"

const authProtectedRoutes = [
  { path: "/dashboard", component: Dashboard },

  // //profile
  { path: "/profile/:type?", component: SchoolProfile },

  // //Teacher profile
  { path: "/teacher/profile/:type?/:id?", component: TeacherProfile },

  //classroom
  { path: "/classroom", component: Classroom },

  // Exam
  // Exam Generation
  { path: "/exam-generation", component: ExamGeneration },
  // Exam Time Table
  { path: "/exam-timetable", component: ExamTimetable },
  // Old Exam papers
  { path: "/exam-old", component: OldExam },

  // OfficeStaff
  // Main Table Page
  { path: "/office-staff", component: OfficeStaff },
  // Add-Edit-View Page
  { path: "/office-staff/:type?/:id?", component: AddEditOfficeStaff },

  //students
  //MainTablePage
  { path: "/students", component: Students },
  //AddEditPage
  { path: "/students/:type?/:id?", component: AddEditStudent },

  //student attendance
  { path: "/student-attendance", component: StudentAttendance },
  { path: "/student-attendance-v2", component: StudentAttendanceV2 },

  //Details Page
  { path: "/student-details/:id?", component: StudentDetails },

  // Question Bank
  // MainTablePage
  { path: "/question-bank", component: QuestionBank },
  // AddEditPage
  { path: "/question-bank/:type?/:id?", component: AddEditQuestionBank },

  //teachers
  //MainTablePage
  { path: "/teachers", component: Teachers },
  //AddEditPage
  { path: "/teachers/:type?/:id?", component: AddEditTeacher },
  //Details Page
  { path: "/teacher-details/:id?", component: TeacherDetails },

  // EventCalender
  { path: "/event-calender", component: EventCalender },
  { path: "/event-calender/:type?/:id?", component: AddEditEventCalender },

  // Notification
  { path: "/notification", component: Notification },
  { path: "/notification/:type?/:id?", component: AddEditNotification },

  // Termly Scheme
  { path: "/termly-scheme", component: TermlyScheme },
  { path: "/termly-scheme/:type?/:id?", component: AddEditTermlyScheme },

  // Live Session
  // { path: "/live-session", component: LiveSession },
  // { path: "/live-session/:type?/:id?", component: AddEditLiveSession },

  // Assigment
  { path: "/Assignment", component: Assigment },
  { path: "/Assignment/:type?/:id?", component: AddEditAssigment },

  // Assigment
  { path: "/AssignmentQuestion", component: AssigmentQuestion },
  {
    path: "/AssignmentQuestion/:type?/:id?",
    component: AddEditAssigmentQuestion,
  },
  {
    path: "/assignment-manage/:id?",
    component: AssignmentManage,
  },

  //Send Message
  { path: "/Send-message", component: SendMessage },
  { path: "/Send-message/:type?/:id?", component: AddEditSendMessage },

  //Past Paper
  { path: "/past-paper", component: PastPaper },
  { path: "/past-paper/:type?/:id?", component: AddEditPastPaer },

  //Past Paper
  { path: "/past-paper-questions", component: PastPaperQuestion },
  {
    path: "/past-paper-questions/:type?/:id?",
    component: AddEditPastPaerQuestion,
  },
  //Past Questions
  { path: "/past-questions/:id", component: PastPaperManage },

  // Lesson Notes
  { path: "/lesson-notes", component: LessonNotes },
  { path: "/lesson-notes/:type?/:id?", component: AddEditLessonNotes },

  // Yearly Scheme
  { path: "/yearly-scheme", component: YearlyScheme },
  { path: "/yearly-scheme/:type?/:id?", component: AddEditYearlyScheme },

  // remarks
  // Main-Table-Page
  { path: "/remarks", component: Remark },

  // teacher-lesson-note
  { path: "/lesson", component: Lesson },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
]

const publicRoutes = [
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/forgot-password", component: ForgetPwd },
  { path: "/register", component: Register },
]

export { publicRoutes, authProtectedRoutes }
