// src/components/content-renderer.tsx  (Server Component)
import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrism from 'rehype-prism-plus'

// tema oscuro parecido a VS Code
import 'prism-themes/themes/prism-vsc-dark-plus.css'

type Props = { content: string }

export function ContentRenderer({ content }: Props) {
  return (
    <div className="markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
          rehypePrism,
        ]}
        className="max-w-none prose-pre:shadow-sm prose-code:before:hidden prose-code:after:hidden"
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
