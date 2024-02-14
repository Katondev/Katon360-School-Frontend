import { classes } from "./classroom"
const standard = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
// Student List
const studentList = [
  "studentName 1",
  "studentName 2",
  "studentName 3",
  "studentName 4",
  "studentName 5",
  "studentName 6",
  "studentName 7",
  "studentName 8",
]
const divisions = ["A", "B", "C", "D", "E", "F"]
const schoolLoginUserType = ["schoolAdmin", "teacher", "accountant"]
const subjects = [
  "Animal Husbandry",
  "Auto Mechanic",
  "Basic Design And Technology",
  "Biology",
  "Building And Construction",
  "Business Management",
  "Ceramics",
  "Chemistry",
  "Christian Religious Studies",
  "Clothing And Textiles",
  "Core Mathematics",
  "Cost Accounting",
  "Creative Arts",
  "Economics",
  "Elective Information Communication Technology",
  "Elective Mathematics",
  "Electricals",
  "English Language",
  "Financial Accounting",
  "Food And Nutrition",
  "French",
  "General Agriculture",
  "General Knowledge In Arts",
  "Geography",
  "Ghanaian Language",
  "Government",
  "Graphic Designs",
  "History",
  "Information Communication And Technology",
  "Integrated Science",
  "Languages",
  "Literature",
  "Management In Living",
  "Metal Works",
  "Our World Our People",
  "Physical Education",
  "Physics",
  "Religious And Moral Education",
  "Social Studies",
  "Technical Drawing",
  "Textiles",
  "Wood Work",
]

const subjectsMaster = [
  { value: "Animal Husbandry", label: "Animal Husbandry" },
  { value: "Auto Mechanic", label: "Auto Mechanic" },
  {
    value: "Basic Design And Technology",
    label: "Basic Design And Technology",
  },
  { value: "Biology", label: "Biology" },
  { value: "Building And Construction", label: "Building And Construction" },
  { value: "Business Management", label: "Business Management" },
  { value: "Ceramics", label: "Ceramics" },
  { value: "Chemistry", label: "Chemistry" },
  {
    value: "Christian Religious Studies",
    label: "Christian Religious Studies",
  },
  { value: "Clothing And Textiles", label: "Clothing And Textiles" },
  { value: "Core Mathematics", label: "Core Mathematics" },
  { value: "Cost Accounting", label: "Cost Accounting" },
  { value: "Creative Arts", label: "Creative Arts" },
  { value: "Economics", label: "Economics" },
  {
    value: "Elective Information Communication Technology",
    label: "Elective Information Communication Technology",
  },
  { value: "Elective Mathematics", label: "Elective Mathematics" },
  { value: "Electricals", label: "Electricals" },
  { value: "English Language", label: "English Language" },
  { value: "Financial Accounting", label: "Financial Accounting" },
  { value: "Food And Nutrition", label: "Food And Nutrition" },
  { value: "French", label: "French" },
  { value: "General Agriculture", label: "General Agriculture" },
  { value: "General Knowledge In Arts", label: "General Knowledge In Arts" },
  { value: "Geography", label: "Geography" },
  { value: "Ghanaian Language", label: "Ghanaian Language" },
  { value: "Government", label: "Government" },
  { value: "Graphic Designs", label: "Graphic Designs" },
  { value: "History", label: "History" },
  {
    value: "Information Communication And Technology",
    label: "Information Communication And Technology",
  },
  { value: "Integrated Science", label: "Integrated Science" },
  { value: "Languages", label: "Languages" },
  { value: "Literature", label: "Literature" },
  { value: "Management In Living", label: "Management In Living" },
  { value: "Metal Works", label: "Metal Works" },
  { value: "Our World Our People", label: "Our World Our People" },
  { value: "Physical Education", label: "Physical Education" },
  { value: "Physics", label: "Physics" },
  {
    value: "Religious And Moral Education",
    label: "Religious And Moral Education",
  },
  { value: "Social Studies", label: "Social Studies" },
  { value: "Technical Drawing", label: "Technical Drawing" },
  { value: "Textiles", label: "Textiles" },
  { value: "Wood Work", label: "Wood Work" },
]

//teachers dropdown will come from teacher data need to implement after making teacher module
const teachers = [
  "Monika Jonhn",
  "Andrew Philip",
  "Marting Gupltil",
  "Ben Stokes",
  "Jonny Bairstow",
]

const officeStaffRoles = [
  "School Head",
  "School Sub Head",
  "Accountant",
  "Human Resource",
  "Exam Department Head",
]

const classRoomType = [
  {
    label: "Kindergarten",
    options: [
      { label: "KG 1", value: "KG 1" },
      { label: "KG 2", value: "KG 2" },
    ],
  },
  {
    label: "Primary School",
    options: [
      { label: "Primary 1", value: "Primary 1" },
      { label: "Primary 2", value: "Primary 2" },
      { label: "Primary 3", value: "Primary 3" },
      { label: "Primary 4", value: "Primary 4" },
      { label: "Primary 5", value: "Primary 5" },
      { label: "Primary 6", value: "Primary 6" },
    ],
  },
  {
    label: "Junior High School",
    options: [
      { label: "JHS 1", value: "JHS 1" },
      { label: "JHS 2", value: "JHS 2" },
    ],
  },
  {
    label: "Senior High School ",
    options: [
      { label: "SHS 1", value: "SHS 1" },
      { label: "SHS 2", value: "SHS 2" },
      { label: "SHS 3", value: "SHS 3" },
    ],
  },
  {
    label: "Vocational and Technical Education",
    options: [
      { label: "Level 1", value: "Level 1" },
      { label: "Level 2", value: "Level 2" },
      { label: "Level 3", value: "Level 3" },
      { label: "Level 4", value: "Level 4" },
    ],
  },
]

const classRoomTypeStatic = [
  {
    label: "Kindergarten",
    options: [
      { label: "KG 1", value: 1 },
      { label: "KG 2", value: 2 },
    ],
  },
  {
    label: "Primary School",
    options: [
      { label: "Primary 1", value: 3 },
      { label: "Primary 2", value: 4 },
      { label: "Primary 3", value: 5 },
      { label: "Primary 4", value: 6 },
      { label: "Primary 5", value: 7 },
      { label: "Primary 6", value: 8 },
    ],
  },
  {
    label: "Junior High School",
    options: [
      { label: "JHS 1", value: 9 },
      { label: "JHS 2", value: 10 },
    ],
  },
  {
    label: "Senior High School ",
    options: [
      { label: "SHS 1", value: 11 },
      { label: "SHS 2", value: 12 },
      { label: "SHS 3", value: 13 },
    ],
  },
  {
    label: "Vocational and Technical Education",
    options: [
      { label: "Level 1", value: 14 },
      { label: "Level 2", value: 15 },
      { label: "Level 3", value: 16 },
      { label: "Level 4", value: 17 },
    ],
  },
]

const schoolType = [
  { value: "KG", label: "Kindergarten" },
  { value: "PR", label: "Primary School" },
  { value: "JHS", label: "Junior High School" },
  { value: "SHS", label: "Senior High School" },
  { value: "TVET", label: "Vocational and technical Education" },
]

const eventType = [
  { value: "Holiday", label: "Holiday" },
  { value: "Exam", label: "Exam" },
  { value: "Event", label: "Event" },
]

const classrooms = classes.map(cls => {
  return cls.class + "-" + cls.division
})
const bloodGroups = [
  "A+VE",
  "A-VE",
  "B+VE",
  "B-VE",
  "O+VE",
  "O-VE",
  "AB+VE",
  "AB-VE",
]
const countryCodes = [
  { label: "GHA", value: 233 },
  { label: "IN", value: 91 },
  { label: "HK", value: 852 },
  { label: "GY", value: 592 },
]

const divisionsforClass = [
  { label: "A", value: "A" },
  { label: "B", value: "B" },
  { label: "C", value: "C" },
  { label: "D", value: "D" },
  { label: "E", value: "E" },
]

const section = [
  { label: "Section A", value: "section a" },
  { label: "Section B", value: "section b" },
  { label: "Section C", value: "section c" },
  { label: "Section D", value: "section d" },
  { label: "Section E", value: "section e" },
]

const participantsCount = [
  { value: "50", label: 50 },
  { value: "100", label: 100 },
  { value: "150", label: 150 },
  { value: "200", label: 200 },
  { value: "250", label: 250 },
  { value: "300", label: 300 },
]

export {
  standard,
  classes,
  classRoomType,
  classRoomTypeStatic,
  divisions,
  teachers,
  officeStaffRoles,
  classrooms,
  bloodGroups,
  studentList,
  subjects,
  countryCodes,
  schoolType,
  divisionsforClass,
  eventType,
  schoolLoginUserType,
  subjectsMaster,
  section,
  participantsCount,
}
