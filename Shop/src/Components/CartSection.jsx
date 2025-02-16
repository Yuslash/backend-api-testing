import React from "react"

const CartSection = ({ cart, totalPrice, removeFromCart, updateQuantity }) => {
  return (
    <div className="cart-container overflow-hidden my-4 mx-6 rounded-md shadow-md bg-slate-50 flex justify-between items-center p-8 flex-col">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-medium text-center">This is Cart Section</h1>
        <span className="font-semibold text-center">Total Price: {totalPrice}₹</span>
      </div>
      <div
        className={`cart-section w-full min-h-24 bg-slate-100 rounded-md mt-4 flex flex-col p-4 ${
          cart.length === 0 ? "justify-center" : "justify-between"
        } items-center text-center`}
      >
        {!cart || cart.length === 0 ? (
          <p className="text-lg font-medium text-slate-300">Cart is Empty</p>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between w-full mb-2 items-center py-4 max-sm:flex-col max-sm:mb-8 border-b border-slate-700 overflow-hidden"
            >
              <h1 className="max-sm:mb-4 font-semibold">{item.product_title}</h1>
              <div className="flex flex-col">
                <div className="flex gap-3 items-center">
                  <p>Price: {item.quantity * item.unit_price}₹</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 w-[82px] h-[32px] text-xs font-medium rounded-md text-white cursor-pointer hover:bg-red-600 shadow-md"
                  >
                    Remove
                  </button>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="bg-red-500 px-2 text-white shadow-md rounded-md cursor-pointer hover:bg-red-600"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="bg-indigo-500 text-white shadow-md px-2 rounded-md cursor-pointer hover:bg-indigo-600"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CartSection
