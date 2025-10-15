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
import { Loader2 } from 'lucide-react';

const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), { ssr: false });

interface CodeSnippetProps {
  initialData: {
    customCSS?: string;
    headerScript?: string;
    footerScript?: string;
  } | null;
}

export default function CodeSnippet({ initialData }: CodeSnippetProps) {
  const [cssCode, setCssCode] = useState('');
  const [headerScript, setHeaderScript] = useState('');
  const [footerScript, setFooterScript] = useState('');
  const [loading, setLoading] = useState(false);
  
  // ✅ FIX: Added a state to manage and display errors
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  useEffect(() => {
    if (initialData) {
      setCssCode(initialData.customCSS || '');
      setHeaderScript(initialData.headerScript || '');
      setFooterScript(initialData.footerScript || '');
    }
  }, [initialData]);

  const handleUpdate = async () => {
    if (!token) return toast.error("Authentication required.");
    setLoading(true);
    setError(null); // Clear previous errors
    
    try {
      const payload = { customCSS: cssCode, headerScript, footerScript };
      await axios.post('/api/v1/custom-code', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Custom code updated successfully!');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update custom code';
      toast.error(errorMessage);
      setError(errorMessage); // Set the error state to display it in the UI
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (initialData) {
      setCssCode(initialData.customCSS || '');
      setHeaderScript(initialData.headerScript || '');
      setFooterScript(initialData.footerScript || '');
      toast.info('Changes reverted');
    }
  };

  return (
    <div>
      {/* ✅ FIX: Display the error message from the state */}
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}

      <div className="flex justify-end gap-2 mb-4">
        <Button variant="destructive" onClick={handleCancel} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleUpdate} disabled={loading}>
          {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
          {loading ? 'Updating...' : 'Update Code'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* CSS Editor */}
        <div>
          <Label className="mb-2 block">Write Custom CSS</Label>
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
          <Label className="mb-2 block">Header Custom Script</Label>
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
          <Label className="mb-2 block">Footer Custom Script</Label>
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