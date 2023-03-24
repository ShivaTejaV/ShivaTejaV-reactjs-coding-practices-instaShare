import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import {v4 as uuidv4} from 'uuid'

import {FcLike} from 'react-icons/fc'
import {BsHeart} from 'react-icons/bs'
import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'

import './index.css'

class Post extends Component {
  state = {
    isLiked: false,
    showComments: false,
    counter: 0,
    commentInput: '',
    commentList: [],
  }

  renderMyComments = commentList => (
    <ul className="comment-list">
      {commentList.map(each => (
        <li key={each.id} className="comment-container">
          <p className="comment-text">{each.comment}</p>
        </li>
      ))}
    </ul>
  )

  renderUserComments = userComments => (
    <ul className="comment-list">
      {userComments.map(each => (
        <li key={each.userId} className="comment-container">
          <p className="comment">
            {each.userName}
            {'  '}
            {<span className="comment-text">{each.comment}</span>}
          </p>
        </li>
      ))}
    </ul>
  )

  onClickLikeButton = async () => {
    const {postDetails} = this.props
    const {postId} = postDetails
    this.setState({isLiked: false})
    this.setState(prevState => ({counter: prevState.counter - 1}))
    const apiUrl = `https://apis.ccbp.in/insta-share/posts/${postId}/like`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({like_status: false}),
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    console.log(data)
  }

  onClickUnlikeButton = async () => {
    const {postDetails} = this.props
    const {postId} = postDetails
    this.setState({isLiked: true})
    this.setState(prevState => ({counter: prevState.counter + 1}))
    const apiUrl = `https://apis.ccbp.in/insta-share/posts/${postId}/like`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({like_status: true}),
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    console.log(data)
  }

  renderLikeButton = () => {
    const {isLiked} = this.state
    return isLiked ? (
      <button
        className="like-button"
        type="button"
        data-testid="unLikeIcon"
        onClick={this.onClickLikeButton}
      >
        <FcLike size={30} />
      </button>
    ) : (
      <button
        className="like-button"
        type="button"
        data-testid="unLikeIcon"
        onClick={this.onClickUnlikeButton}
      >
        <BsHeart size={25} />
      </button>
    )
  }

  onClickCommentButton = () => {
    this.setState(prevState => ({showComments: !prevState.showComments}))
  }

  onChangeCommentInput = event => {
    this.setState({commentInput: event.target.value})
  }

  onAddComment = event => {
    event.preventDefault()
    const {commentList, commentInput} = this.state
    const newComment = {
      id: uuidv4(),
      comment: commentInput,
    }
    this.setState({commentList: [...commentList, newComment], commentInput: ''})
  }

  renderAddCommentForm = () => {
    const {commentInput} = this.state
    return (
      <form className="comment-form-container" onSubmit={this.onAddComment}>
        <textarea
          className="input-comment"
          value={commentInput}
          rows="2"
          onChange={this.onChangeCommentInput}
        />
        <button className="add-comment-button" type="submit">
          comment
        </button>
      </form>
    )
  }

  renderCommentButton = () => (
    <button
      type="button"
      className="comment-button"
      onClick={this.onClickCommentButton}
    >
      <FaRegComment size={25} />
    </button>
  )

  render() {
    const {postDetails} = this.props
    const {
      profilePic,
      userId,
      userName,
      createdAt,
      likesCount,
      comments,
      imageUrl,
      caption,
      postId,
    } = postDetails

    const {showComments, counter, commentList} = this.state
    return (
      <li key={postId} className="post-container" data-testid="postCard">
        <div className="post-content">
          <div className="user-details-container">
            <img
              alt="post author profile"
              className="user-profile-img"
              src={profilePic}
            />
            <Link to={`/users/${userId}`} className="link">
              <h1 className="user-namee">{userName}</h1>
            </Link>
          </div>
          <img alt="post" className="main-image" src={imageUrl} />
          <div className="post-interactions">
            <div className="like-comment-share">
              <div className="interaction">{this.renderLikeButton()}</div>
              <div className="interaction">{this.renderCommentButton()}</div>
              <div className="interaction">
                <BiShareAlt size={25} />
              </div>
            </div>
            <p className="likes-count">
              {parseInt(likesCount) + parseInt(counter)} likes
            </p>
            <p className="caption">{caption}</p>
            <div className="comments-container">
              {this.renderMyComments(commentList)}
              {this.renderUserComments(comments)}
              {showComments && this.renderAddCommentForm()}
            </div>
            <p className="time">{createdAt}</p>
          </div>
        </div>
      </li>
    )
  }
}

export default Post
