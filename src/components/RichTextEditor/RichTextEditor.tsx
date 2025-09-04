'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Image as ImageIcon,
  Table,
  Code,
  HelpCircle,
  X,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface EditorProps {
  value?: string; // Controlled value
  defaultValue?: string; // Initial value (uncontrolled, plain text বা HTML)
  onChange?: (val: string) => void;
  className?: string;
}

// ✅ plain text → html converter
const plainToHtml = (text: string) => {
  if (!text) return '';
  // যদি text এর মধ্যে "<" থাকে, ধরে নিচ্ছি user html পাঠাচ্ছে → 그대로 দেখাবো
  if (/<[a-z][\s\S]*>/i.test(text)) {
    return text;
  }
  return text
    .split('\n')
    .map(line => `<p>${line || '<br>'}</p>`)
    .join('');
};

export const RichTextEditor: React.FC<EditorProps> = ({
  value,
  defaultValue = '',
  onChange,
  className,
}) => {
  const [content, setContent] = useState(value ?? plainToHtml(defaultValue));
  const editorRef = useRef<HTMLDivElement>(null);

  // ✅ Sync controlled value
  useEffect(() => {
    if (value !== undefined && value !== content && editorRef.current) {
      const html = plainToHtml(value);
      editorRef.current.innerHTML = html;
      setContent(html);
    }
  }, [value]);

  const handleInput = () => {
    const html = editorRef.current?.innerHTML || '';
    if (value === undefined) {
      setContent(html); // uncontrolled
    }
    onChange?.(html);
  };

  const execCmd = (command: string, arg?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    handleInput();
  };

  return (
    <div className={cn('w-full border rounded-md shadow-sm', className)}>
      <TooltipProvider>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 border-b p-2 bg-gray-50">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => execCmd('bold')}>
                <Bold className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => execCmd('italic')}>
                <Italic className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Italic</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => execCmd('underline')}>
                <Underline className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Underline</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => execCmd('insertUnorderedList')}>
                <List className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bullet List</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => execCmd('insertOrderedList')}>
                <ListOrdered className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Numbered List</TooltipContent>
          </Tooltip>

          {/* Alignment */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => execCmd('justifyLeft')}>
                <AlignLeft className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align Left</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => execCmd('justifyCenter')}>
                <AlignCenter className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align Center</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => execCmd('justifyRight')}>
                <AlignRight className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align Right</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => execCmd('justifyFull')}>
                <AlignJustify className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Justify</TooltipContent>
          </Tooltip>

          {/* Link */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  const url = prompt('Enter URL');
                  if (url) execCmd('createLink', url);
                }}>
                <Link className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Insert Link</TooltipContent>
          </Tooltip>

          {/* Image */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  const imgUrl = prompt('Enter Image URL');
                  if (imgUrl) execCmd('insertImage', imgUrl);
                }}>
                <ImageIcon className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Insert Image</TooltipContent>
          </Tooltip>

          {/* Table */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() =>
                  execCmd(
                    'insertHTML',
                    `<table style="border:1px solid #000;border-collapse:collapse;width:100%">
                      <tr>
                        <td style="border:1px solid #000;padding:4px;">Cell</td>
                        <td style="border:1px solid #000;padding:4px;">Cell</td>
                      </tr>
                    </table>`
                  )
                }>
                <Table className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Insert Table</TooltipContent>
          </Tooltip>

          {/* Code Block */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() =>
                  execCmd(
                    'insertHTML',
                    `<pre style="background:#f4f4f4;padding:8px;border-radius:4px;"><code>your code here</code></pre>`
                  )
                }>
                <Code className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Code Block</TooltipContent>
          </Tooltip>

          {/* Help */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost">
                <HelpCircle className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Help</TooltipContent>
          </Tooltip>

          {/* Clear */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  if (value === undefined) setContent('');
                  if (editorRef.current) editorRef.current.innerHTML = '';
                  onChange?.('');
                }}>
                <X className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      {/* Editable Area */}
      <div
        ref={editorRef}
        className="min-h-[200px] p-3 outline-none text-left"
        dir="ltr"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};
