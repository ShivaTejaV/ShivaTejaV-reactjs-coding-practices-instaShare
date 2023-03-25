import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import UserStories from '../UserStories'
import InstaFeed from '../InstaFeed'
import Post from '../Post'
// import SearchPost from '../SearchPost'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  progress: 'PROGRESS',
  failure: 'Failure',
}

class Home extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    searchInput: '',
    searchResultPosts: [],
  }

  modifyData = data => ({
    caption: data.post_details.caption,
    imageUrl: data.post_details.image_url,
    postId: data.post_id,
    profilePicture: data.profile_pic,
    userId: data.user_id,
    userName: data.user_name,
    createdAt: data.created_at,
    likesCount: data.likes_count,
    userComments: data.comments,
  })

  getSearchResults = async () => {
    this.setState({apiStatus: apiStatusConstants.initial})
    const jwtToken = Cookies.get('jwt_token')
    const {searchInput} = this.state
    const apiUrl = `https://apis.ccbp.in/insta-share/posts?search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    console.log(`response from HomeRoute/getSearchResults`)
    console.log(response)
    if (response.ok) {
      const data = await response.json()
      console.log(response)
      const modifiedData = data.posts.map(eachItem => this.modifyData(eachItem))

      this.setState({
        apiStatus: apiStatusConstants.success,
        searchResultPosts: modifiedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickSearch = () => {
    this.getSearchResults()
  }

  onChangeSearchInput = searchInput => {
    this.setState({searchInput})
  }

  onEnterSearchInput = () => {
    this.getSearchResults()
  }

  renderSearchResultsView = () => {
    const {searchResultPosts} = this.setState
    return (
      <div className="search-results-container">
        <h1 className="search-result-heading">Search Results</h1>
        <ul className="list-item-container">
          {searchResultPosts.map(eachPost => (
            <Post key={eachPost.postId} userPostDetails={eachPost} />
          ))}
        </ul>
      </div>
    )
  }

  renderNoPostsView = () => (
    <div className="no-post-view">
      <img
        src="https://res.cloudinary.com/dngrmtiw7/image/upload/v1679730078/CCBP/REACT_MiniProject_instaShare/Home_Route/NoPostsToView_zf9ajr.jpg"
        className="no-post-img"
        alt="search not Found"
      />
      <h1 className="no-post-heading">Search Not Found</h1>
      <p className="no-post-description">
        Try different keyword or search again
      </p>
    </div>
  )

  renderSuccessView = () => {
    const {searchResultPosts} = this.state
    const showPostList = searchResultPosts.length > 0

    return showPostList
      ? this.renderSearchResultsView()
      : this.renderNoPostsView()
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="Oval" color="#0b69ff" height="80" width="80" />
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

  renderSearchResultsBasedOnApiStatus = () => {
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
    const {searchInput} = this.state
    return (
      <>
        <div className="main-container-home-route">
          <Header
            searchInput={searchInput}
            onClickSearch={this.onClickSearch}
            changeSearchInput={this.onChangeSearchInput}
            onEnterSearchInput={this.onEnterSearchInput}
          />

          {searchInput === '' ? (
            <>
              <UserStories />
              <InstaFeed />
            </>
          ) : (
            <>{this.renderSearchResultsBasedOnApiStatus()}</>
          )}
        </div>
      </>
    )
  }
}

export default Home
