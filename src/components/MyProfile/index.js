import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
// import {GoAlert} from 'react-icons/go'
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

class MyProfile extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    myProfile: {},
    postDetails: [],
    storyDetails: [],
  }

  componentDidMount() {
    this.getMyProfileData()
  }

  modifyProfileData = profile => ({
    id: profile.id,
    userId: profile.user_id,
    userName: profile.user_name,
    profilePicture: profile.profile_pic,
    userBio: profile.user_bio,
    followerCount: profile.followers_count,
    followingCount: profile.following_count,
    postCount: profile.posts_count,
  })

  modifyPostsAndStories = data => ({
    id: data.id,
    image: data.image,
  })

  getMyProfileData = async () => {
    const jwtToken = Cookies.get('jwt_token')
    this.setState({apiStatus: apiStatusConstants.inProcess})
    const apiUrl = 'https://apis.ccbp.in/insta-share/my-profile'
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }

    const response = await fetch(apiUrl, options)
    // console.log(response)
    if (response.ok !== true) {
      this.setState({apiStatus: apiStatusConstants.failure})
    } else {
      const data = await response.json()
      // console.log(data)
      const modifiedProfileData = this.modifyProfileData(data.profile)
      const modifiedPostsData = data.profile.posts.map(each =>
        this.modifyPostsAndStories(each),
      )
      const modifiedStoriesData = data.profile.stories.map(each =>
        this.modifyPostsAndStories(each),
      )

      this.setState({
        myProfile: modifiedProfileData,
        postDetails: modifiedPostsData,
        storyDetails: modifiedStoriesData,
        apiStatus: apiStatusConstants.success,
      })
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="Oval" color="#3b82f6" height="50" width="50" />
    </div>
  )

  retry() {
    this.getMyProfileData()
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
    const {myProfile, postDetails, storyDetails} = this.state
    const {
      followerCount,
      followingCount,

      postCount,
      profilePicture,
      userBio,
      userName,
      userId,
    } = myProfile
    // console.log(postDetails)
    return (
      <div className="main-container">
        <div className="user-details">
          <div className="profile-container">
            <img
              className="profile-pic"
              alt="my profile"
              src={profilePicture}
            />
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
              <img className="my-story" alt="my story" src={each.image} />
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
                    alt="my post"
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

  renderMyProfileBasedOnStatus = () => {
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
        <div>{this.renderMyProfileBasedOnStatus()}</div>
      </>
    )
  }
}

export default MyProfile
