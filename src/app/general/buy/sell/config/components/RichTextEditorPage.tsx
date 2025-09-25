// 'use client';
import RichTextEditor from "@/components/ReusableComponents/RichTextEditor";
// import { useState } from "react";

interface Props {
  value: string
  onChange: (val: string) => void
}


export default function RichTextEditorPage({ value, onChange }: Props) {

  // const [content, setContent] = useState('');
  return (
    <div className="w-full border rounded-md">
      <RichTextEditor value={value} onChange={onChange} />
    </div>
  )
}
