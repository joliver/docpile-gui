import React from 'react'
import loader from './../../assets/icons/loader.svg'
import './../../css/atoms/loader.css'

const Loader = () => (
    <div className='loader'>
        <img className='loader-img' src={loader} alt='Loading, please wait.' />
    </div>
)

export default Loader