// Server Component
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';

type Props = {
  content: string;
};

const prettyCodeOptions = {
  theme: 'vsc-dark-plus',
  keepBackground: false,
  onVisitLine(node: any) {
    if (node.children.length === 0)
      node.children = [{ type: 'text', value: ' ' }];
  },
  onVisitHighlightedLine(node: any) {
    node.properties.className?.push('bg-zinc-800/60');
  },
};

export async function ContentRenderer({ content }: Props) {
  return (
    <div className="markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
          [rehypePrettyCode, prettyCodeOptions as any],
        ]}
        className="prose prose-invert max-w-none prose-pre:shadow-sm prose-code:before:hidden prose-code:after:hidden"
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
