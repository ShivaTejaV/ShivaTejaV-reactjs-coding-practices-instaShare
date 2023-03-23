import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Post from '../Post'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProcess: 'IN_PROCESS',
}

class InstaPost extends Component {
  state = {apiStatus: apiStatusConstants.initial, posts: []}

  componentDidMount() {
    this.getInstaFeed()
  }

  modifyComment = ele => ({
    userName: ele.user_name,
    userId: ele.user_id,
    comment: ele.comment,
  })

  modifyAllComments = arr => arr.map(each => this.modifyComment(each))

  modifyData = ele => ({
    createdAt: ele.created_at,
    likesCount: ele.likes_count,
    userId: ele.user_id,
    userName: ele.user_name,
    profilePic: ele.profilePic,
    postId: ele.post_id,
    comments: this.modifyAllComments(ele.comments),
    postDetails: {
      caption: ele.post_details.caption,
      imageUrl: ele.post_details.image_url,
    },
  })

  getInstaFeed = async () => {
    const apiUrl = 'https://apis.ccbp.in/insta-share/posts'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const data = await response.json()
      const modifiedData = data.posts.map(each => this.modifyData(each))
      // console.log(modifiedData)
      this.setState({
        apiStatus: apiStatusConstants.success,
        posts: modifiedData,
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
    const {posts} = this.state
    return (
      <ul>
        {posts.map(each => (
          <Post postDetails={each} />
        ))}
      </ul>
    )
  }

  render() {
    const {apiStatus} = this.state
    // console.log(apiStatus)
    return <h1>Instafeed</h1>
  }
}

export default InstaPost
