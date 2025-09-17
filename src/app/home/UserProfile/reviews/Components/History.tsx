import React from 'react';
const reviews = [
  {
    id: 1,
    name: 'Braun Silk-épil 9 Cordless Epilator',
    size: 'XL',
    color: 'Green',
    img: '/img/product/p-1.png',
    rating: 4,
    tag: 'Delightful',
    review:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
  },
  {
    id: 2,
    name: 'Braun Silk-épil 9 Cordless Epilator',
    size: 'XL',
    color: 'Green',
    img: '/img/product/p-1.png',
    rating: 4,
    tag: 'Delightful',
    review:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
  },
  {
    id: 3,
    name: 'Braun Silk-épil 9 Cordless Epilator',
    size: 'XL',
    color: 'Green',
    img: '/img/product/p-1.png',
    rating: 4,
    tag: 'Delightful',
    review:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
  },
  {
    id: 4,
    name: 'Braun Silk-épil 9 Cordless Epilator',
    size: 'XL',
    color: 'Green',
    img: '/img/product/p-1.png',
    rating: 4,
    tag: 'Delightful',
    review:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
  },
];
export default function History() {
  return (
    <div>
      <h3 className="font-semibold py-2 ">Your product rating & review:</h3>
      <div className="space-y-6 md:max-h-[500px] overflow-y-auto">
        {reviews.map(item => (
          <div key={item.id} className="border-b pb-4">
            <div className="flex gap-4">
              <img src={item.img} alt={item.name} className="w-16 h-16" />
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  Size: {item.size}, Color: {item.color}
                </p>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-yellow-400 ${
                    i < item.rating ? 'opacity-100' : 'opacity-30'
                  }`}>
                  ★
                </span>
              ))}
              <span className="text-blue-500 text-sm">{item.tag}</span>
            </div>

            <div className="mt-2 bg-gray-100 p-3 text-sm text-gray-700">
              {item.review}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
