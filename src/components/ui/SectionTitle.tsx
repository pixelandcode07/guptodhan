import React from 'react';

type TitleProps = {
  text: string;
};
const SectionTitle: React.FC<TitleProps> = ({ text }) => {
  return (
    <h4
      className="relative mb-3 pl-5 text-sm font-semibold text-gray-800 
      before:content-[''] before:absolute before:left-0 before:top-0 
      before:h-full before:w-[1px] before:bg-blue-500 ">
      {text}
    </h4>
  );
};

export default SectionTitle;
