// Server Component
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

type Props = {
  content: string;
};

export function ContentRenderer({ content }: Props) {
  return (
    <div className="markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        ]}
        className="prose prose-invert max-w-none prose-pre:shadow-sm prose-code:before:hidden prose-code:after:hidden"
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
