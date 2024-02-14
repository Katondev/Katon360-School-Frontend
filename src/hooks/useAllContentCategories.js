import { getAllContentCategories } from "helpers/backendHelpers/category"
import { useCallback, useEffect, useState } from "react"

const useAllContentCategories = () => {
  const [contentCategories, setContentCategories] = useState([])

  useEffect(() => {
    async function fetchContentCategories() {
      try {
        const response = await getAllContentCategories()
        setContentCategories(response.data.topics)
      } catch (error) {
        console.log(error)
      }
    }
    fetchContentCategories()
  }, [])

  const getLevelFromClassName = className => {
    for (const levelItem of contentCategories) {
      for (const classItem of levelItem.classes) {
        if (classItem.class === className) return levelItem.level
      }
    }
    return ""
  }

  const getClasses = levelName => {
    let classes = []
    for (const levelItem of contentCategories) {
      if (!levelName || levelItem.level === levelName) {
        classes = [...classes, ...levelItem.classes.map(item => item.class)]
      }
    }

    return classes
  }

  const getSubjects = (levelName, className) => {
    let subjects = []

    for (const levelItem of contentCategories) {
      if (!levelName || levelItem.level === levelName) {
        for (const classItem of levelItem.classes) {
          if (!className || classItem.class === className) {
            if (classItem.subjects.length === 0) continue
            subjects = [
              ...subjects,
              ...classItem.subjects.map(item => item.subject),
            ]
          }
        }
      }
    }

    return subjects
  }

  const getTopics = (levelName, className, subjectName) => {
    for (const levelItem of contentCategories) {
      if (!levelName || levelItem.level === levelName) {
        for (const classItem of levelItem.classes) {
          if (!className || classItem.class === className) {
            for (const subjectItem of classItem.subjects) {
              if (subjectItem.subject === subjectName) {
                return subjectItem.topics.map(item => item.topic)
              }
            }
          }
        }
      }
    }

    return []
  }

  return {
    getClasses: useCallback(getClasses, [contentCategories]),
    getSubjects: useCallback(getSubjects, [contentCategories]),
    getTopics: useCallback(getTopics, [contentCategories]),
    getLevelFromClassName: useCallback(getLevelFromClassName, [
      contentCategories,
    ]),
  }
}

export default useAllContentCategories
