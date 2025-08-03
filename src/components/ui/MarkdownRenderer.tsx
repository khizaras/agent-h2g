"use client";

import React from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  style?: React.CSSProperties;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = "",
  style,
}) => {
  if (!content) {
    return null;
  }

  return (
    <div className={`markdown-content ${className}`} style={style}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          code({ node, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const inline = !match;
            return !inline ? (
              <SyntaxHighlighter
                style={oneLight}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          h1: ({ children }) => (
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', marginTop: '0' }}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', marginTop: '24px' }}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', marginTop: '24px' }}>
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p style={{ marginBottom: '16px', lineHeight: '1.6', color: '#333' }}>
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul style={{ marginBottom: '16px', paddingLeft: '24px' }}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol style={{ marginBottom: '16px', paddingLeft: '24px' }}>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li style={{ marginBottom: '4px', lineHeight: '1.6' }}>
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote style={{
              borderLeft: '4px solid #d9d9d9',
              paddingLeft: '16px',
              margin: '16px 0',
              color: '#666',
              fontStyle: 'italic'
            }}>
              {children}
            </blockquote>
          ),
          a: ({ children, href }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#1890ff', textDecoration: 'underline' }}
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div style={{ overflowX: 'auto', margin: '16px 0' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                border: '1px solid #d9d9d9'
              }}>
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th style={{
              border: '1px solid #d9d9d9',
              padding: '8px 12px',
              backgroundColor: '#fafafa',
              fontWeight: 'bold',
              textAlign: 'left'
            }}>
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td style={{
              border: '1px solid #d9d9d9',
              padding: '8px 12px'
            }}>
              {children}
            </td>
          ),
          hr: () => (
            <hr style={{
              border: 'none',
              borderTop: '1px solid #d9d9d9',
              margin: '24px 0'
            }} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
      
      <style jsx global>{`
        .markdown-content {
          line-height: 1.6;
          color: #333;
        }
        
        .markdown-content code {
          background-color: #f5f5f5;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
          font-size: 12px;
        }
        
        .markdown-content pre {
          background-color: #f5f5f5;
          border-radius: 6px;
          overflow-x: auto;
          margin: 16px 0;
        }
        
        .markdown-content pre code {
          background: none;
          padding: 0;
        }
        
        .markdown-content strong {
          font-weight: bold;
        }
        
        .markdown-content em {
          font-style: italic;
        }
        
        .markdown-content img {
          max-width: 100%;
          height: auto;
          border-radius: 6px;
          margin: 16px 0;
        }
      `}</style>
    </div>
  );
};

export default MarkdownRenderer;