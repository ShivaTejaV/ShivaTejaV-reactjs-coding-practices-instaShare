import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'

import {BsHeart} from 'react-icons/bs'
/*
import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'
import {FcLike} from 'react-icons/fc'
*/
import './index.css'

class Post extends Component {
  state = {
    isLiked: false,
    showComments: false,
  }

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

  renderPostLikeStatus = async () => {
    const jwtToken = Cookies.get('jwt_token')

    const {userPostDetails} = this.props
    const {postId} = userPostDetails

    const {likedStatus} = this.state
    // console.log(likedStatus)

    const apiUrl = `https://apis.ccbp.in/insta-share/posts/${postId}/like`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'POST',
      body: JSON.stringify({like_status: likedStatus}),
    }
    const response = await fetch(apiUrl, options)
    console.log(response)
    if (response.ok === true) {
      const fetchedPostId = await response.json()
      console.log(fetchedPostId)
    }
  }

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
    } = postDetails

    const {isLiked, showComments} = this.state

    return (
      <li className="post-container" data-testid="postCard">
        <div className="post-content">
          <div className="user-details-container">
            <img className="user-profile-img" src={profilePic} />
            <Link to={`/users/${userId}`} className="link">
              <h1 className="user-namee">{userName}</h1>
            </Link>
          </div>
          <img alt="post" className="main-image" src={imageUrl} />
          <div className="post-interactions">
            <div className="like-comment-share">
              <BsHeart />
            </div>
            <p className="likes-count">{likesCount} likes</p>
            <p className="caption">{caption}</p>
            <div className="comments-container">
              {this.renderUserComments(comments)}
            </div>
            <p className="time">{createdAt}</p>
          </div>
        </div>
      </li>
    )
  }
}

export default Post
