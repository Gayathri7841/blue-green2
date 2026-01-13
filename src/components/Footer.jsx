import React from 'react'
import logo from '../assets/logo.png';
const Footer = () => {
  return (
    <div>
    <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
<div>
    <img src={logo} className='mb-5 w-32' alt="" />
    <p className='w-full md:w-2/3 text-gray-600'>Your one-stop destination for fresh groceries, vegetables, and fruits delivered right to your doorstep. At ClickIt, we combine convenience with quality, offering a seamless shopping experience with a wide range of products to meet all your daily needs. From farm-fresh produce to pantry essentials, we ensure premium quality and timely delivery.</p>
</div>
<div>
<p className='text-xl font-medium mb-5'>COMPANY</p>
<ul className='flex flex-col gap-1 text-gray-600'>
<li>HOME</li>
<li>ABOUT US</li>
<li>DELIVERY</li>
<li>PRIVACY POLICY</li>
</ul>

</div>
<div>

    <p className='text-xl font-medium mb-5'>
        GET IN TOUCH
    </p>
    <ul className='flex flex-col gap-1 text-gray-600'>
<li>+91 8756945321</li>
<li>contact@clickit.com</li>
    </ul>
</div>
    </div>
    <div>
<hr/>
<p className='py-5 text-sm text-center'>Copyright 2024@ clickit.com - All Right Reserverd.</p>

    </div>
    </div>
  )
}

export default Footer