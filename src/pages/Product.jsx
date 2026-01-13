import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import star_icon from '../assets/star_icon.png'; 
import star_icon1 from '../assets/star_icon.png'; 
import star_icon2 from '../assets/star_icon.png'; 
import star_icon3 from '../assets/star_icon.png';
import star_icon4 from '../assets/start_icon1.png'; 
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {

  const {productId} =useParams();
 const {products,currency,addToCart}=useContext(ShopContext);
 const[productData, setProductData]=useState(false);
 const[image,setImage]=useState('')

 const fetchProductData=async () =>{
products.map((item)=>{
if(item._id==productId){

  setProductData(item)
  setImage(item.image[0])
 
  return null;
}
})
 }
 useEffect(()=>{
 fetchProductData();

 },[productId])
  return productData ? (
    <div className="border-t2 pt-10 transition-opacity ease-in duration-500 opacity-100">
    {/* Product Data */}
    <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
      {/*-----------------------------------Product images------------------------------------*/}
      <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
        <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
          {productData.image.map((item, index) => (
            <img
              onClick={() => setImage(item)}
              src={item}
              key={index}
              className="w-[50%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
              alt=""
            />
          ))}
        </div>
        <div className="w-full sm:w-[70%]">
          <img className="w-full h-auto" src={image} alt="" />
        </div>
      </div>
  
      {/*-----------------------------------Product info-----------------------------------*/}
      <div className="flex-1 flex flex-col justify-top">
        <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
        <div className='flex items-center gap-1 mt-1'>
          <img src={star_icon} alt="" className='w-3 5' />
          <img src={star_icon1} alt="" className='w-3 5' />
          <img src={star_icon2} alt="" className='w-3 5' />
          <img src={star_icon3 } alt="" className='w-3 5' />
          <img src={star_icon4 } alt="" className='w-4 6' />
<p className='pl-2'>(122)</p>
        </div>
        <p className='mt-3 text-3xl font-medium'>{currency}{productData.price}</p>
        <p className='mt-3 text-gray-500 md:w-4/5'>{productData.description}</p>
        <div className='flex flex-col gap-4 my-8'>
<p className='text-1xl font-medium'>Pack sizes</p>
{/********************************************************* need to implement********************************************************/}
        </div>
        <div>

<button onClick={()=>addToCart(productData._id)} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'>ADD TO CART</button>
<hr className='mt-8 sm:w-4/5'/>
<div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
  <p>100% Fresh Products</p>
  <p>Cash on delivery is available on this product</p>
  <p>Easy return and exchange policy with in 7 days</p>

</div>
</div>
      </div>
     
    </div>
    <div className='mt-20'>
<div className='flex'>
<b className='border px-5 py-3 text-sm'>Description</b>
<p className='border px-5 py-3 text-sm'>Reviwes (122)</p>
</div>
<div className='flex flex-col gap-4 border px-6 py-6 text-gray-500'>
<p>Lorem Ipsum: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
<p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat</p>
</div>
    </div>

    <RelatedProducts  category={productData.category} subCategory={productData.subCategory}/>
  </div>
  
  ):<div className='opacity-0'></div>
}

export default Product