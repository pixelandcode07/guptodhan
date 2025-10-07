'use client';

import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { githubDark } from '@uiw/codemirror-theme-github';
import { Button } from '@/components/ui/button';
import axios from 'axios';

import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

// Dynamically import CodeMirror
const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), {
  ssr: false,
});

interface CodeSnippetProps {
  initialData: {
    customCSS?: string;
    headerScript?: string;
    footerScript?: string;
  };
  error?: string | null;
}

export default function CodeSnippet({ initialData, error }: CodeSnippetProps) {
  const [cssCode, setCssCode] = useState(initialData.customCSS || '');
  const [headerScript, setHeaderScript] = useState(
    initialData.headerScript || ''
  );
  const [footerScript, setFooterScript] = useState(
    initialData.footerScript || ''
  );
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  // Update state if initialData changes
  useEffect(() => {
    setCssCode(initialData.customCSS || '');
    setHeaderScript(initialData.headerScript || '');
    setFooterScript(initialData.footerScript || '');
  }, [initialData]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const payload = {
        customCSS: cssCode,
        headerScript,
        footerScript,
      };

      const res = await axios.post('/api/v1/custom-code', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.data.success) {
        toast.success('Custom code updated successfully!');
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || 'Failed to update custom code'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setCssCode(initialData.customCSS || '');
    setHeaderScript(initialData.headerScript || '');
    setFooterScript(initialData.footerScript || '');
    toast('Changes reverted');
  };

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex justify-end gap-2 mt-2">
        <Button variant="destructive" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleUpdate} disabled={loading}>
          {loading ? 'Updating...' : 'Update Code'}
        </Button>
      </div>

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
    </div>
  );
}
