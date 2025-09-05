'use client';

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { githubDark } from '@uiw/codemirror-theme-github';

// Dynamically import CodeMirror
const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), {
  ssr: false,
});

export default function CodeSnippet() {
  const [cssCode, setCssCode] = useState('');
  const [headerScript, setHeaderScript] = useState('');
  const [footerScript, setFooterScript] = useState('');

  const handleUpdate = () => {
    console.log('CSS:', cssCode);
    console.log('Header JS:', headerScript);
    console.log('Footer JS:', footerScript);
    // ekhane API call kore server e save kora jabe
  };

  return (
    <div className="grid p-4 pt-0 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
      {/* CSS Editor */}
      <div>
        <Label className="mb-2">Write Custom CSS</Label>
        <CodeMirror
          value={cssCode}
          height="300px"
          extensions={[css()]}
          onChange={setCssCode}
          className={cn('border rounded-md')}
          theme={githubDark}
        />
      </div>

      {/* Header JS Editor */}
      <div>
        <Label className="mb-2">Header Custom Script</Label>
        <CodeMirror
          value={headerScript}
          height="300px"
          extensions={[javascript()]}
          onChange={setHeaderScript}
          className={cn('border rounded-md')}
          theme={githubDark}
        />
      </div>

      {/* Footer JS Editor */}
      <div>
        <Label className="mb-2">Footer Custom Script</Label>
        <CodeMirror
          value={footerScript}
          height="300px"
          extensions={[javascript()]}
          onChange={setFooterScript}
          className={cn('border rounded-md')}
          theme={githubDark}
        />
      </div>
    </div>
  );
}
