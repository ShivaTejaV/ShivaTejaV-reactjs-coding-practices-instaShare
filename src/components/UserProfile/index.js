import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProcess: 'IN_PROCESS',
}

class UserProfile extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    userProfile: {},
    postDetails: [],
    storyDetails: [],
  }

  componentDidMount() {
    this.getUserProfileData()
  }

  modifyData = data => ({
    id: data.id,
    userId: data.user_id,
    userName: data.user_name,
    profilePic: data.profile_pic,
    followerCount: data.followerCount,
    followingCount: data.followingCount,
    userBio: data.user_bio,
    postsCount: data.posts_count,
    stories: data.stories,
    posts: data.posts,
  })

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
    if (response.ok) {
      const data = await response.json()
      // console.log(`Data of User Profile`, data)
      const modifiedData = this.modifyData(data.user_details)
      // console.log(modifiedData)
      this.setState({
        apiStatus: apiStatusConstants.success,
        userProfile: modifiedData,
        postDetails: modifiedData.posts,
        storyDetails: modifiedData.stories,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="Oval" color="#3b82f6" height="50" width="50" />
    </div>
  )

  retry() {
    this.getUserProfileData()
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://res.cloudinary.com/dngrmtiw7/image/upload/v1679554270/CCBP/REACT_MiniProject_instaShare/Home_Route/alert-traingle_ib484g.png"
        alt="failure view"
        className="failure-image"
      />
      <p className="failure-view-heading">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        className="retry-button"
        data-testid="button"
        onClick={this.retry}
      >
        Try again
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {userProfile, postDetails, storyDetails} = this.state
    const {
      followerCount,
      followingCount,
      postCount,
      profilePic,
      userBio,
      userName,
      userId,
    } = userProfile

    return (
      <div className="main-container">
        <div className="user-details">
          <div className="profile-container">
            <img className="profile-pic" alt="user profile" src={profilePic} />
          </div>
          <div className="username-and-stats">
            <h1 className="user-name">{userName}</h1>
            <ul className="user-stats">
              <li>
                <p className="stat-name">
                  <span className="stat-value">{postCount} </span>
                  posts
                </p>
              </li>
              <li>
                <p className="stat-name">
                  <span className="stat-value">{followerCount} </span>
                  followers
                </p>
              </li>
              <li>
                <p className="stat-name">
                  <span className="stat-value">{followingCount} </span>
                  following
                </p>
              </li>
            </ul>
            <p className="user-id">{userId}</p>
            <p className="user-bio">{userBio}</p>
          </div>
        </div>
        <ul className="story-list">
          {storyDetails.map(each => (
            <li className="story-item" key={each.id}>
              <img className="my-story" alt="user story" src={each.image} />
            </li>
          ))}
        </ul>
        <div className="post-container-main">
          <div className="post-heading">
            <BsGrid3X3 size={15} className="" />
            <h1 className="posts-text">Posts</h1>
          </div>
          {postDetails.length > 0 ? (
            <ul className="all-post-container">
              {postDetails.map(eachPost => (
                <li className="post-img-container" key={eachPost.id}>
                  <img
                    className="post-img"
                    src={eachPost.image}
                    alt="user post"
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-post-container">
              <BiCamera className="No-post-available" />
              <h1 className="post-count">No Posts Yet</h1>
            </div>
          )}
        </div>
      </div>
    )
  }

  renderUserProfileBasedOnStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProcess:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div>{this.renderUserProfileBasedOnStatus()}</div>
      </>
    )
  }
}

export default UserProfile
