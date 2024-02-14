import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap"

//i18n
import { withTranslation } from "react-i18next"
// Redux
import { connect } from "react-redux"
import { withRouter, Link } from "react-router-dom"

// users
import user1 from "../../../assets/images/users/avatar-1.jpg"
import {
  getSchoolInfo,
  getTeacherInfo,
  getUserTypeInfo,
} from "helpers/authHelper"

const ProfileMenu = props => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false)

  const [username, setusername] = useState("Admin")
  const userType = getUserTypeInfo()

  useEffect(() => {
    if (getSchoolInfo()) {
      const obj = getSchoolInfo()
      setusername(obj.sc_schoolName)
      setusername(obj.sc_schoolName)
    }
    if (getTeacherInfo()) {
      const obj = getTeacherInfo()
      setusername(obj?.tc_fullName)
    }
  }, [props.success])

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item "
          id="page-header-user-dropdown"
          tag="button"
        >
          <img
            className="rounded-circle header-profile-user"
            src={user1}
            alt="Header Avatar"
          />
          <span className="d-none d-xl-inline-block ms-2 me-1">{username}</span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          {userType?.userType == "School" && (
            <DropdownItem tag="a" href="/profile/edit">
              {" "}
              <i className="bx bx-user font-size-16 align-middle me-1" />
              {props.t("Profile")}{" "}
            </DropdownItem>
          )}
          {userType?.userType == "Teacher" && (
            <DropdownItem
              tag="a"
              href={`/teacher/profile/edit/${userType?.tc_id}`}
            >
              {" "}
              <i className="bx bx-user font-size-16 align-middle me-1" />
              {props.t("Profile")}{" "}
            </DropdownItem>
          )}
          <div className="dropdown-divider" />
          <Link to="/logout" className="dropdown-item">
            <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
            <span>{props.t("Logout")}</span>
          </Link>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  )
}

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any,
}

const mapStatetoProps = state => {
  const { error, success } = state.Profile
  return { error, success }
}

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
)
