import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link, withRouter} from 'react-router-dom'

import './index.css'

import {AiFillCloseCircle} from 'react-icons/ai'
import {GiHamburgerMenu} from 'react-icons/gi'
// import {HiOutlineLogout} from 'react-icons/hi'
import {FaSearch} from 'react-icons/fa'
// import useSticky from './useSticky'

class Header extends Component {
  state = {isShowMobileMenu: false, isShowSearch: false}

  onClickHamBergerMenu = () => {
    this.setState(prevState => ({
      isShowMobileMenu: !prevState.isShowMobileMenu,
    }))
  }

  onClickCloseButton = () => {
    this.setState({isShowMobileMenu: false})
  }

  onClickSearchTab = () => {
    this.setState(prevState => ({isShowSearch: !prevState.isShowSearch}))
  }

  onClickLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  // functions given from  Home Route //
  onClickSearchButton = () => {
    const {onClickSearch} = this.props
    onClickSearch()
  }

  onChangeInputSearch = event => {
    const {changeSearchInput} = this.props
    changeSearchInput(event.target.value)
  }

  onKeyChangeEnter = event => {
    const {onEnterSearchInput} = this.props
    if (event.key === 'Enter') {
      onEnterSearchInput()
    }
  }

  // functions given from  Home Route //

  renderSearchInput = () => {
    const {searchInput} = this.props
    return (
      <div className="search-bar-container">
        <input
          type="search"
          className="search-input"
          value={searchInput}
          placeholder="Search Caption"
          onChange={this.onChangeInputSearch}
          onKeyDown={this.onKeyChangeEnter}
        />
        <button
          type="button"
          data-testid="searchIcon"
          className="search-btn"
          onClick={this.onClickSearchButton}
        >
          <FaSearch className="search-icon" />
        </button>
      </div>
    )
  }

  render() {
    const {isShowMobileMenu, isShowSearch} = this.state
    const {searchInput} = this.props
    return (
      <nav className="nav-header">
        <div className="nav-content">
          <div className="nav-bar-mobile">
            <Link to="/" className="nav-link">
              <div className="logo-container">
                <img
                  className="logo-image"
                  alt="website logo"
                  src="https://res.cloudinary.com/dngrmtiw7/image/upload/v1678625132/CCBP/REACT_MiniProject_instaShare/Login_Route/Standard_Collection_8_o7ow7t.jpg"
                />
                <h1 className="logo-text-mobile">Insta Share</h1>
              </div>
            </Link>
            <div className="menu-container">
              <button
                type="button"
                className="nav-mobile-btn"
                onClick={this.onClickHamBergerMenu}
                data-testid="hamburgerMenuIcon"
              >
                <GiHamburgerMenu size={25} />
              </button>
            </div>
          </div>
          {isShowMobileMenu && (
            <div className="menu-mobile-container">
              <ul className="mobile-menu-nav-item-container">
                <li key="Home" className="nav-menu-item">
                  <Link to="/" className="nav-link">
                    <p className="mobile-menu-item"> Home</p>
                  </Link>
                </li>
                <li
                  key="Search"
                  className="nav-menu-item"
                  data-testid="searchIcon"
                  onClick={this.onClickSearchTab}
                >
                  <p className="mobile-menu-item"> Search</p>
                </li>
                <li key="Profile" className="nav-menu-item">
                  <Link to="/my-profile" className="nav-link">
                    <p className="mobile-menu-item">Profile</p>
                  </Link>
                </li>
                <li key="close" className="nav-item-mobile">
                  <button
                    type="button"
                    data-testid="closeIcon"
                    className="mobile-menu-btn"
                    onClick={this.onClickCloseButton}
                  >
                    <AiFillCloseCircle className="close-icon" />
                  </button>
                </li>
              </ul>
              <div className="nav-item-mobile">
                {isShowSearch && (
                  <div className="search-input-container">
                    <input
                      type="search"
                      className="search-input"
                      value={searchInput}
                      placeholder="Search Caption"
                      onChange={this.onChangeInputSearch}
                      onKeyDown={this.onKeyChangeEnter}
                    />
                    <button
                      type="button"
                      data-testid="searchIcon"
                      className="search-btn"
                      onClick={this.onClickSearchButton}
                    >
                      <FaSearch className="search-icon" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="nav-bar-large-screen">
            <Link to="/" className="nav-link">
              <div className="logo-container">
                <img
                  className="logo-image"
                  alt="website logo"
                  src="https://res.cloudinary.com/dngrmtiw7/image/upload/v1678625132/CCBP/REACT_MiniProject_instaShare/Login_Route/Standard_Collection_8_o7ow7t.jpg"
                />
                <h1 className="logo-text">Insta Share</h1>
              </div>
            </Link>
            <ul className="nav-menu">
              <li>{this.renderSearchInput()}</li>
              <li className="nav-menu-item">
                <Link to="/" className="nav-link">
                  <p className="menu-item">Home</p>
                </Link>
              </li>

              <li className="nav-menu-item">
                <Link to="/my-profile" className="nav-link">
                  <p className="menu-item">Profile</p>
                </Link>
              </li>
              <button
                type="button"
                className="logout-button"
                onClick={this.onClickLogout}
              >
                Logout
              </button>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}

export default withRouter(Header)
