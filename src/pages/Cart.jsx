import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';

const Cart = () => {
  const { products, currency, cartItems } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];

    Object.entries(cartItems).forEach(([itemId, quantityData]) => {
      console.log("Processing itemId:", itemId, "quantityData:", quantityData);

      Object.entries(quantityData).forEach(([productId, quantity]) => {
        if (productId.trim() && quantity > 0) { // Ensure productId is valid
          console.log("Adding to cartData:", { _id: productId, quantity });
          tempData.push({
            _id: productId,
            quantity,
          });
        } else {
          console.warn("Skipping item with missing productId:", { itemId, productId, quantity });
        }
      });
    });

    console.log("Final Processed cartData:", tempData);
    setCartData(tempData);
  }, [cartItems]);

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={'Your'} text2={'Basket'} />
      </div>

      <div>
        {cartData.map((item, index) => {
          const productData = products.find(
            (product) => product._id === item._id
          );
          if (!productData) return null;

          return (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              <div className="flex items-start gap-6">
                <img
                  src={productData.image[0]}
                  alt={productData.name}
                  className="w-16 sm:w-20"
                />
                <div>
                  <p className="text-xs sm:text-lg font-medium">
                    {productData.name}
                  </p>
                  <div className="flex items-center gap-5 mt-2">
                    <p>
                      {currency}
                      {productData.price}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Cart;
