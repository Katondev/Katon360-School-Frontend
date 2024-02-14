//REGISTER
export const POST_FAKE_REGISTER = "/post-fake-register"

//LOGIN
export const POST_FAKE_LOGIN = "/post-fake-login"
export const POST_FAKE_JWT_LOGIN = "/post-jwt-login"
export const POST_FAKE_PASSWORD_FORGET = "/fake-forget-pwd"
export const POST_FAKE_JWT_PASSWORD_FORGET = "/jwt-forget-pwd"
export const SOCIAL_LOGIN = "/social-login"

//PROFILE
export const POST_EDIT_JWT_PROFILE = "/post-jwt-profile"
export const POST_EDIT_PROFILE = "/post-fake-profile"

//PRODUCTS
export const GET_PRODUCTS = "/products"
export const GET_PRODUCTS_DETAIL = "/product"

//Mails
export const GET_INBOX_MAILS = "/inboxmails"
export const ADD_NEW_INBOX_MAIL = "/add/inboxmail"
export const DELETE_INBOX_MAIL = "/delete/inboxmail"

//starred mail
export const GET_STARRED_MAILS = "/starredmails"

//important mails
export const GET_IMPORTANT_MAILS = "/importantmails"

//Draft mail
export const GET_DRAFT_MAILS = "/draftmails"

//Send mail
export const GET_SENT_MAILS = "/sentmails"

//Trash mail
export const GET_TRASH_MAILS = "/trashmails"

//CALENDER
export const GET_EVENTS = "/events"
export const ADD_NEW_EVENT = "/add/event"
export const UPDATE_EVENT = "/update/event"
export const DELETE_EVENT = "/delete/event"
export const GET_CATEGORIES = "/categories"

//CHATS
export const GET_CHATS = "/chats"
export const GET_GROUPS = "/groups"
export const GET_CONTACTS = "/contacts"
export const GET_MESSAGES = "/messages"
export const ADD_MESSAGE = "/add/messages"

//ORDERS
export const GET_ORDERS = "/orders"
export const ADD_NEW_ORDER = "/add/order"
export const UPDATE_ORDER = "/update/order"
export const DELETE_ORDER = "/delete/order"

//CART DATA
export const GET_CART_DATA = "/cart"

//CUSTOMERS
export const GET_CUSTOMERS = "/customers"
export const ADD_NEW_CUSTOMER = "/add/customer"
export const UPDATE_CUSTOMER = "/update/customer"
export const DELETE_CUSTOMER = "/delete/customer"

//SHOPS
export const GET_SHOPS = "/shops"

//CRYPTO
export const GET_WALLET = "/wallet"
export const GET_CRYPTO_ORDERS = "/crypto/orders"

//INVOICES
export const GET_INVOICES = "/invoices"
export const GET_INVOICE_DETAIL = "/invoice"

//PROJECTS
export const GET_PROJECTS = "/projects"
export const GET_PROJECT_DETAIL = "/project"
export const ADD_NEW_PROJECT = "/add/project"
export const UPDATE_PROJECT = "/update/project"
export const DELETE_PROJECT = "/delete/project"

//TASKS
export const GET_TASKS = "/tasks"

//CONTACTS
export const GET_USERS = "/users"
export const GET_USER_PROFILE = "/user"
export const ADD_NEW_USER = "/add/user"
export const UPDATE_USER = "/update/user"
export const DELETE_USER = "/delete/user"

//dashboard charts data
export const GET_WEEKLY_DATA = "/weekly-data"
export const GET_YEARLY_DATA = "/yearly-data"
export const GET_MONTHLY_DATA = "/monthly-data"

export const TOP_SELLING_DATA = "/top-selling-data"

export const GET_EARNING_DATA = "/earning-charts-data"

export const GET_PRODUCT_COMMENTS = "/comments-product"

export const ON_LIKNE_COMMENT = "/comments-product-action"

export const ON_ADD_REPLY = "/comments-product-add-reply"

export const ON_ADD_COMMENT = "/comments-product-add-comment"

// CUSTOM URLS

// const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8001"
// export const API_URL = `${BASE_URL}/api/v1/school`
// export const API_URL_ADMIN_AREA = `${BASE_URL}/api/v1/admin`
// export const IMAGE_BASE_URL =
//   process.env.REACT_APP_IMAGE_URL ||
//   'https://katon-dev-uploads.s3.eu-central-1.amazonaws.com'

// Production Environment
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8001"
export const API_URL = `${BASE_URL}/api/v1/school`
export const API_URL_ADMIN_AREA = `${BASE_URL}/api/v1/admin`
export const IMAGE_BASE_URL =
  process.env.REACT_APP_IMAGE_URL ||
  // "https://katon-prod-uploads.s3.eu-central-1.amazonaws.com"
  "https://katon-prod-uploads.s3.amazonaws.com"

// export const IMAGE_BASE_URL =
// process.env.REACT_APP_IMAGE_URL ||
// 'https://katon-prod-uploads.s3.eu-central-1.amazonaws.com'

//IMAGE_URL
export const IMAGE_URL = `${IMAGE_BASE_URL}`

//REGISTER
export const USER_LOGIN = "/auth/login"

//LOGIN TEACHER
export const TEACHER_LOGIN = "/teacher/auth/login"

//LOGOUT TEACHER
export const TEACHER_LOGOUT = "/teacher/auth/logout"

//LOGOUT
export const USER_LOGOUT = "/auth/logout"

//Area
export const MANAGE_AREA = "/area"
export const REGION = "/area/regions"
export const DISTRICT = "/area/district"
export const CIRCUIT = "/area/circuit"

//CLASSROOM
export const CLASSROOM = "classroom"

//OFFICE_STAFF
export const OFFICE_STAFF = "office-staff"

//STUDENTS
export const STUDENTS = "student"

//SCHOOL_TEACHERS
export const SCHOOL_TEACHERS = "teacher"

// STUDENT_REMARK
export const STUDENT_REMARK = "studentremark"

// TEACHER_LESSON
export const TEACHER_LESSON = "lesson"

// QUESTION_BANK
export const QUESTION_BANK = "question"

//KATON School
export const SCHOOL = ""

//KATON School Profile
export const SCHOOLPROFILE = "schoolProfile"

//EXAM
export const EXAM = "exam"

//EXAMTIMETABLE
export const EXAMTIMETABLE = "examTimeTable"

//OLDEXAMPAPER
export const OLDEXAMPAPER = "examTimeTable"

//EVENT_CALENDER
export const EVENTCALENDER = "event-calender"

//NOTIFICATION
export const NOTIFICATION = "notification"

//TERMLY SCHEME
export const TERMLYSCHEME = "termlyScheme"

//LIVE SESSION
export const LIVESESSION = "liveSession"

//ASSIGMENT
export const ASSIGMENT = "assignment"

//ASSIGMENTQUESTION
export const ASSIGMENTQUESTION = "assignment-Questions"

//ASSIGMENTQSET
export const ASSIGMENTQSET = "assignmentQset"

//PAST PAPER
export const PASTPAPER = "pastPaper"

//PAST PAPER QUESTION
export const PASTPAPERQUESTION = "pastQuestionPaper"

//CATEGORY
export const CATEGORY = "contentCategory"

//WEEKLY LESSON PLANS
export const WEEKLYLESSONPLAN = "weeklyLessonPlan"

//YEARLY SCHEME
export const YEARLYSCHEME = "yearlyScheme"

//STUDENTATTENDANCE
export const STUDENTATTENDANCE = "studentAttendance"

//CONTENT CATEGORY
export const BOOK_CATEGORY = "/contentCategory"

//Send Message
export const SENDMESSAGE = "/sendMessage"

//Attendance Entry
export const ATTENDANCEENTRY = "/attendanceEntry"

//Send Message
export const TERMLYSCHEMEMASTER = "/termlySchemeMaster"

// BOOK
export const BOOK = "/book"
