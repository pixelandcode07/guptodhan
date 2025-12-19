
import RichTextEditor from "@/components/ReusableComponents/RichTextEditor";

interface Props {
  value: string
  onChange: (val: string) => void
}


export default function RichTextEditorPage({ value, onChange }: Props) {

  return (
    <div className="w-full border rounded-md">
      <RichTextEditor value={value} onChange={onChange} />
    </div>
  )
}
