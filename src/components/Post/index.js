import {Component} from 'react'
import Cookies from 'js-cookie'
import Link from 'react-router-dom'
import {v4 as uuidv4} from 'uuid'

import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'
import {FcLike} from 'react-icons/fc'
import {BsHeart} from 'react-icons/bs'

import './index.css'

class Post extends Component {
  state = {
    isLiked: false,
    showComments: false,
  }

  rednerUserComments = userComments => {
    ;<ul>
      {userComments.map(each => {
        ;<li key={each.userId}>
          <p>
            {each.userName}
            <span>{each.comment}</span>
          </p>
        </li>
      })}
    </ul>
  }

  render() {
    const {postDetails} = this.props
    const {
      profilePicture,
      userId,
      userName,
      createdAt,
      likesCount,
      userComments,
      imageUrl,
      caption,
    } = postDetails

    const {isLiked, showComments} = this.state

    return (
      <li className="post-container">
        <div className="user-details-container">
          <img src={profilePicture} />
          <p>{userName}</p>
        </div>
        <div className="image-container">
          <img className="main-image" src={imageUrl} />
        </div>
        <div className="post-interactions">
          <div className="like-comment-share">
            <BsHeart />
          </div>
          <p className="likes-count">{likesCount} likes</p>
          <p className="caption">{caption}</p>
          <div className="comments-container"></div>
          <p className="time">{createdAt}</p>
        </div>
      </li>
    )
  }
}

export default Post
