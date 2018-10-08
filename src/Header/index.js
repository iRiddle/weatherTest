import React, { Component } from 'react'
import Navlink from './link'
import { Link } from 'react-router-dom'
import './style.css'
class Navbar extends Component {
    render() {
        return (
            <div className = 'container '>
                <div className='row pt-3 pb-3 justify-content-between'>
                    <div>
                        <Link to='/'><Navlink title='Поиск'></Navlink></Link>
                    </div>
                    <div>
                        <Link to='favorites'><Navlink title='Избранное'></Navlink></Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default Navbar