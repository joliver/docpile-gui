import React, { Component } from 'react'
import Logo from './logo'
import Navlink from './navlink'
import toggler from './../../assets/icons/nav-toggler.png'
import './../../css/navigation/navbar.css'

class Navbar extends Component {
  state = { mobCSS: 'navbar-list mobile-list hidden' }

  toggleNav = () => {
    if (this.state.mobCSS === 'navbar-list mobile-list hidden') {
      this.setState({ mobCSS: 'navbar-list mobile-list'})
    } else {
      this.setState({ mobCSS: 'navbar-list mobile-list hidden'})
    }
  }

  render () {
    return (
      <div role='navigation'>
        <div className='navbar-custom'>
          <Logo />
          <div className='navbar-toggler' onClick={this.toggleNav}>
            <img className='nb-toggler-img' alt='Toggle Navigation' src={toggler} />
          </div>
          <div className='navbar-spread'>
            <Navlink to='/tags' label='Tags' />
            <Navlink to='/documents' label='Documents' />
            <Navlink to='/upload' label='Upload' />
            <Navlink to='/' label='Home' />
          </div>
        </div>
        <div className={this.state.mobCSS}>
          <div className='nav-separator'></div>
          <div className='nb-mobile-list-item'><Navlink to='/' label='Home' /></div>
          <div className='nb-mobile-list-item'><Navlink to='/upload' label='Upload' /></div>
          <div className='nb-mobile-list-item'><Navlink to='/documents' label='Documents' /></div>
          <div className='nb-mobile-list-item'><Navlink to='/tags' label='Tags' /></div>
        </div>
      </div>
    )
  }
}

export default Navbar