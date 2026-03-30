import React from 'react';

const Riding = () => {
  return (
    <div className='h-screen flex flex-col bg-white'>
      {/* 1. Map Section (Takes up the top half) */}
      <div className='h-1/2 w-full bg-blue-100 relative'>
        {/* Placeholder for Map - In a real app, use Google Maps/Mapbox here */}
        <img 
          className='h-full w-full object-cover' 
          src="https://miro.medium.com/v2/resize:fit:1400/0*Bv_Ym_v978YIAn-6.png" 
          alt="Map" 
        />
        
        {/* Logo Overlay */}
        <img
          className='w-16 absolute top-5 left-5' 
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" 
          alt="Uber Logo" 
        />
      </div>

      {/* 2. Trip Details Section (Bottom half) */}
      <div className='h-1/2 p-6 flex flex-col justify-between'>
        
        {/* Driver & Vehicle Info */}
        <div className='flex items-center justify-between'>
          <img 
            className='w-20' 
            src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_956,h_637/v1555367310/assets/30/51e602-10bb-4e65-b122-e394d809156d/original/Final_UberX.png" 
            alt="Car" 
          />
          <div className='text-right'>
            <h2 className='text-lg font-semibold text-gray-600'>Santhosh</h2>
            <h4 className='text-xl font-bold -mt-1 -mb-1'>KA 05 AB 1234</h4>
            <p className='text-sm text-gray-500'>White Suzuki Swift</p>
          </div>
        </div>

        <hr className='my-4' />

        {/* Destination & Payment Info */}
        <div className='space-y-4'>
          <div className='flex items-center gap-4'>
            <div className='h-8 w-8 bg-black text-white flex items-center justify-center rounded-full'>
                <i className="ri-map-pin-2-fill"></i>
            </div>
            <div>
              <h3 className='font-bold text-lg'>562/11-A</h3>
              <p className='text-gray-600 text-sm'>Kaikondrahalli, Bengaluru</p>
            </div>
          </div>

          <div className='flex items-center gap-4'>
            <div className='h-8 w-8 bg-gray-200 flex items-center justify-center rounded-full'>
                <i className="ri-bank-card-fill"></i>
            </div>
            <div>
              <h3 className='font-bold text-lg'>₹193.20</h3>
              <p className='text-gray-600 text-sm'>Cash Payment</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button className='w-full bg-green-600 text-white font-semibold p-3 rounded-lg mt-5 active:bg-green-700'>
          Make a Payment
        </button>
      </div>
    </div>
  );
};

export default Riding;