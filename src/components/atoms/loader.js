import React from 'react'
import loader from './../../assets/icons/loader.svg'
import clouds from './../../assets/icons/clouds.svg'
import './../../css/atoms/loader.css'

const Loader = () => (
    <div className='loader'>
        <img className='loader-side-img-1' src={clouds} alt='clouds' />
        <img className='loader-img' src={loader} alt='Loading, please wait.' />
        <img className='loader-side-img-2' src={clouds} alt='clouds' />
    </div>
)

export default Loader