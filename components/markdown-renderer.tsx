"use client"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism"

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "")
          return !inline && match ? (
            <SyntaxHighlighter style={tomorrow} language={match[1]} PreTag="div" {...props}>
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          )
        },
        table({ node, ...props }) {
          return (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" {...props} />
            </div>
          )
        },
        thead({ node, ...props }) {
          return <thead className="bg-gray-50 dark:bg-gray-800" {...props} />
        },
        th({ node, ...props }) {
          return (
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              {...props}
            />
          )
        },
        td({ node, ...props }) {
          return <td className="px-6 py-4 whitespace-nowrap text-sm" {...props} />
        },
        tr({ node, ...props }) {
          return <tr className="bg-white dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800" {...props} />
        },
        a({ node, ...props }) {
          return <a className="text-blue-500 hover:underline" {...props} />
        },
        img({ node, ...props }) {
          return <img className="max-w-full h-auto rounded-lg" {...props} />
        },
        blockquote({ node, ...props }) {
          return (
            <blockquote
              className="border-l-4 border-gray-200 dark:border-gray-700 pl-4 italic text-gray-600 dark:text-gray-300"
              {...props}
            />
          )
        },
        ul({ node, ...props }) {
          return <ul className="list-disc pl-5 space-y-1" {...props} />
        },
        ol({ node, ...props }) {
          return <ol className="list-decimal pl-5 space-y-1" {...props} />
        },
        li({ node, ...props }) {
          return <li className="my-1" {...props} />
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
