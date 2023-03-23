import {Component} from 'react'

import {Redirect} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {
    showError: false,
    username: '',
    password: '',
    errorMessage: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    console.log('Submitted')
    const {username, password} = this.state
    const userDetails = {
      username,
      password,
    }

    const url = 'https://apis.ccbp.in/login'

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    console.log(response)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      const jwtToken = data.jwt_token
      const {history} = this.props
      Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
      history.replace('/')
    } else {
      const errMsg = data.err_msg
      console.log(errMsg)
      this.setState({showError: true, errorMessage: errMsg})
    }
  }

  renderLoginPage = () => {
    const {username, password, showError, errorMessage} = this.state
    return (
      <div className="login-bg">
        <div className="left-section">
          <img
            alt="login-background"
            className="img-login-page"
            src="https://res.cloudinary.com/dngrmtiw7/image/upload/v1678621782/CCBP/REACT_MiniProject_instaShare/Login_Route/Layer_2_fzeeha.png"
          />
        </div>
        <div className="right-section">
          <div className="logo-and-title">
            <img
              className="logo"
              alt="logo"
              src="https://res.cloudinary.com/dngrmtiw7/image/upload/v1678625132/CCBP/REACT_MiniProject_instaShare/Login_Route/Standard_Collection_8_o7ow7t.jpg"
            />
            <h1 className="title">Insta Share</h1>
          </div>
          <form onSubmit={this.onSubmitForm}>
            <label htmlFor="user-name" className="label">
              USERNAME
            </label>
            <input
              className="input"
              id="user-name"
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={this.onChangeUsername}
            />
            <label htmlFor="password" className="label">
              PASSWORD
            </label>
            <input
              className="input"
              id="password"
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={this.onChangePassword}
            />
            {showError && <p className="error-message">{errorMessage}</p>}
            <button className="login-button" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    console.log(jwtToken)
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return this.renderLoginPage()
  }
}

export default Login
