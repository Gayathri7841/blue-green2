import React from 'react';
import heroimage from '../assets/heroimage.png';
const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row border border-gray-400">
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
        <div className="text-[#414141]">
          {/* Title Section */}
          <div className="flex items-center gap-2">
            {/* Decorative Line */}
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            {/* Bestseller Text */}
            <p className="font-medium text-sm md:text-base">Shop Fresh Now!</p>
          </div>
          <h1 className=' prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed'>Today's Special Deals</h1>
<div className='flex items-center gap-2'>
    <p className='font-semibold text-sm md:text-base'>Fill Your Cart</p>
    <p className='w-8 md:w-11 h-[1px] bg-[#414141]'></p>


</div>
        </div>
      </div>
      <img src={heroimage} alt="" className='w-full sm:w-1/2'/>
    </div>
);
};
export default Hero;
