'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type DescriptionSectionProps = {
  text: string;
  maxLength?: number;
};

const text =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius quaerat nesciunt sint, consectetur veritatis, harum, reprehenderit odit non aliquam iure at laboriosam explicabo cum sapiente? Eius, sequi rerum? Veniam delectus, amet repellendus sint enim exercitationem modi quae perspiciatis! Laudantium repellat suscipit alias provident, molestiae aspernatur, dignissimos, quas porro rem quo molestias illo dolores distinctio. Illo error tempore voluptates, nesciunt libero enim aspernatur in praesentium aut, beatae minus ratione, eos tempora suscipit velit ullam quidem nostrum eaque saepe? Tempora, ab blanditiis at, et reiciendis voluptates amet animi sunt vero ullam eaque in? Illo veritatis distinctio aliquam aut amet voluptate ducimus velit error incidunt quam, modi quidem cumque animi iste expedita cum repellat. Similique et at iste odio. Itaque illum perspiciatis animi corrupti hic recusandae eaque enim blanditiis minus a rem nihil neque quaerat, earum ea repellendus voluptate eveniet? Soluta, voluptates. Alias accusamus veniam expedita quibusdam, iure quo illo at quis deserunt nam, libero ut esse repellendus odit exercitationem? Officiis cumque, velit animi quas inventore id quidem ut, aliquam, unde deleniti corrupti. Ex culpa non, minima nemo, perspiciatis animi provident voluptates expedita nobis qui cumque saepe! Saepe adipisci ex alias modi qui ratione reprehenderit, inventore quas nisi est error beatae, soluta vero.';
const maxLength = 250;

// ({ text, maxLength = 200 }: DescriptionSectionProps)
export function DescriptionBox() {
  const [expanded, setExpanded] = useState(false);

  const isLong = text.length > maxLength;
  const displayText = expanded
    ? text
    : text.slice(0, maxLength) + (isLong ? '...' : '');

  return (
    <div className="p-6 pl-0">
      <h2 className="text-lg font-semibold mb-3">Description</h2>
      <p className="text-gray-700 whitespace-pre-line">{displayText}</p>
      {isLong && (
        <Button
          variant="link"
          className="text-blue-600 px-0 mt-2"
          onClick={() => setExpanded(!expanded)}>
          {expanded ? 'See Less' : 'See More'}
        </Button>
      )}
    </div>
  );
}
