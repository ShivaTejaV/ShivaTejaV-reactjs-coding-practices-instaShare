import {Component} from 'react'
// import Cookies from 'js-cookie'
// import Loader from 'react-loader-spinner'

import Header from '../Header'
import UserStories from '../UserStories'
import InstaFeed from '../InstaFeed'

import './index.css'

/*
const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  progress: 'PROGRESS',
  failure: 'Failure',
}
*/

class Home extends Component {
  state = {
    searchResult: [],
  }

  render() {
    const {searchResult} = this.state
    console.log(searchResult)
    return (
      <>
        <div className="main-container-home-route">
          <Header />
          <UserStories />
          <InstaFeed />
        </div>
      </>
    )
  }
}

export default Home
