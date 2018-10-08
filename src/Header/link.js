import React, { Component } from 'react'

class NavLink extends Component {
    render() {
        return (
            <h4 className="nav-link nav-link" href="#">{this.props.title}</h4>
        )
    }
}

export default NavLink