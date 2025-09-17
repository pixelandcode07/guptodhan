import React from 'react';
import MyReturn from './Components/MyReturns';

export default function ReturnsPage() {
  return (
    <div className="bg-white rounded-md p-6 pt-0">
      <h1 className="text-2xl font-semibold mb-4 ">My Returns</h1>
      <MyReturn />
    </div>
  );
}
