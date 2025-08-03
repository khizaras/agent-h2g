"use client";

import React, { useState } from "react";
import dynamic from 'next/dynamic';
import { Form, Button, Space } from "antd";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";

// Dynamically import MD Editor to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

interface MarkdownEditorProps {
  value?: string;
  onChange?: (value?: string) => void;
  placeholder?: string;
  height?: number;
  preview?: 'edit' | 'preview' | 'live';
  'data-color-mode'?: 'light' | 'dark';
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your content in markdown...",
  height = 300,
  preview = 'live',
  ...props
}) => {
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview' | 'live'>(preview);

  return (
    <div className="markdown-editor-wrapper">
      <div className="editor-controls" style={{ marginBottom: 8 }}>
        <Space>
          <Button
            size="small"
            type={previewMode === 'edit' ? 'primary' : 'default'}
            icon={<EditOutlined />}
            onClick={() => setPreviewMode('edit')}
          >
            Edit
          </Button>
          <Button
            size="small"
            type={previewMode === 'preview' ? 'primary' : 'default'}
            icon={<EyeOutlined />}
            onClick={() => setPreviewMode('preview')}
          >
            Preview
          </Button>
          <Button
            size="small"
            type={previewMode === 'live' ? 'primary' : 'default'}
            onClick={() => setPreviewMode('live')}
          >
            Live
          </Button>
        </Space>
      </div>
      
      <MDEditor
        value={value}
        onChange={onChange}
        preview={previewMode as any}
        height={height}
        data-color-mode="light"
        visibleDragbar={false}
        textareaProps={{
          placeholder,
          style: {
            fontSize: 14,
            lineHeight: 1.6,
          },
        }}
        {...props}
      />
      
      <style jsx global>{`
        .markdown-editor-wrapper .w-md-editor {
          background: #fff;
          border: 1px solid #d9d9d9;
          border-radius: 6px;
        }
        
        .markdown-editor-wrapper .w-md-editor:hover {
          border-color: #4096ff;
        }
        
        .markdown-editor-wrapper .w-md-editor-focus {
          border-color: #4096ff;
          box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
        }
        
        .markdown-editor-wrapper .w-md-editor-text-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        
        .markdown-editor-wrapper .w-md-editor-text {
          font-size: 14px !important;
          line-height: 1.6 !important;
        }
        
        .markdown-editor-wrapper .wmde-markdown {
          font-size: 14px;
          line-height: 1.6;
        }
        
        .markdown-editor-wrapper .wmde-markdown h1 {
          font-size: 24px;
          margin-top: 0;
          margin-bottom: 16px;
        }
        
        .markdown-editor-wrapper .wmde-markdown h2 {
          font-size: 20px;
          margin-top: 24px;
          margin-bottom: 16px;
        }
        
        .markdown-editor-wrapper .wmde-markdown h3 {
          font-size: 16px;
          margin-top: 24px;
          margin-bottom: 16px;
        }
        
        .markdown-editor-wrapper .wmde-markdown p {
          margin-bottom: 16px;
        }
        
        .markdown-editor-wrapper .wmde-markdown ul,
        .markdown-editor-wrapper .wmde-markdown ol {
          margin-bottom: 16px;
          padding-left: 24px;
        }
        
        .markdown-editor-wrapper .wmde-markdown li {
          margin-bottom: 4px;
        }
        
        .markdown-editor-wrapper .wmde-markdown blockquote {
          border-left: 4px solid #d9d9d9;
          padding-left: 16px;
          margin: 16px 0;
          color: #666;
        }
        
        .markdown-editor-wrapper .wmde-markdown code {
          background: #f5f5f5;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: 'Monaco', 'Consolas', monospace;
          font-size: 12px;
        }
        
        .markdown-editor-wrapper .wmde-markdown pre {
          background: #f5f5f5;
          padding: 16px;
          border-radius: 6px;
          overflow-x: auto;
          margin: 16px 0;
        }
        
        .markdown-editor-wrapper .wmde-markdown pre code {
          background: none;
          padding: 0;
        }
        
        .markdown-editor-wrapper .wmde-markdown table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
        }
        
        .markdown-editor-wrapper .wmde-markdown th,
        .markdown-editor-wrapper .wmde-markdown td {
          border: 1px solid #d9d9d9;
          padding: 8px 12px;
          text-align: left;
        }
        
        .markdown-editor-wrapper .wmde-markdown th {
          background: #fafafa;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default MarkdownEditor;