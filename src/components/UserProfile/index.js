import {Component} from 'react'
import Cookies from 'js-cookie'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProcess: 'IN_PROCESS',
}

class UserProfile extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    myProfile: {},
    postDetails: [],
    storyDetails: [],
  }

  componentDidCatch() {
    this.getUserProfileData()
  }

  getUserProfileData = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {userId} = params
    const apiUrl = `https://apis.ccbp.in/insta-share/users/${userId}`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    this.setState({apiStatus: apiStatusConstants.inProcess})
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    console.log(`Data of User Profile ${data}`)
    const modifiedData = this.modifyData(data)
  }
}

export default UserProfile
