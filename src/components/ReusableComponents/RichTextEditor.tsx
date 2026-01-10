'use client';

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import ListItem from '@tiptap/extension-list-item';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import CodeBlock from '@tiptap/extension-code-block';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Table as TableIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  HelpCircle,
  X,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Image,
      CodeBlock,
      BulletList,
      OrderedList,
      ListItem,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  if (!editor) return null;

  const ToolbarButton = ({
    onClick,
    label,
    children,
  }: {
    onClick: () => void;
    label: string;
    children: React.ReactNode;
  }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={onClick}
          variant="outline"
          size="sm"
          className="px-2 py-1"
          type="button"
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <div className="w-full border rounded-lg shadow-sm">
      <TooltipProvider>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} label="Bold">
            <Bold size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} label="Italic">
            <Italic size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} label="Underline">
            <UnderlineIcon size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} label="Bullet List">
            <List size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} label="Numbered List">
            <ListOrdered size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} label="Align Left">
            <AlignLeft size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} label="Align Center">
            <AlignCenter size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} label="Align Right">
            <AlignRight size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            label="Insert Table"
          >
            <TableIcon size={16} />
          </ToolbarButton>
          {/* <ToolbarButton
            onClick={() => editor.chain().focus().setLink({ href: 'https://example.com' }).run()}
            label="Insert Link"
          >
            <LinkIcon size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setImage({ src: 'https://placekitten.com/200/200' }).run()}
            label="Insert Image"
          >
            <ImageIcon size={16} />
          </ToolbarButton> */}
          <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} label="Code Block">
            <Code size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().clearContent().run()} label="Clear">
            <X size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => alert('Help clicked')} label="Help">
            <HelpCircle size={16} />
          </ToolbarButton>
        </div>
      </TooltipProvider>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="editor-content min-h-[250px] max-h-[350px] overflow-auto p-4 focus:outline-none"
      />
    </div>
  );
}
