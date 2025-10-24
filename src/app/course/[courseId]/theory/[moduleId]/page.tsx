
'use client';

import * as React from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { theoryContent } from '@/lib/data.tsx';
import Link from 'next/link';
import { notFound, useSearchParams, useParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

// A simple component to render markdown-like code blocks
function CodeBlock({ children }: { children: string }) {
  const code = children.replace(/```(python|javascript)\n|```/g, '');
  return (
    <pre className="my-4 rounded-xl bg-card p-4 overflow-x-auto">
      <code className="font-code text-sm">{code}</code>
    </pre>
  );
}

function ContentRenderer({ content }: { content: string }) {
  const parts = content.split(/(```(?:python|javascript)\n[\s\S]*?```)/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          return <CodeBlock key={index}>{part}</CodeBlock>;
        }
        // Replace markdown-like bold and italics
        const formattedPart = part
          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/`([^`]+)`/g, '<code class="font-code bg-secondary px-1.5 py-0.5 rounded-md">$1</code>');
          
        return (
          <p key={index} className="text-base leading-relaxed my-2 text-foreground/90" dangerouslySetInnerHTML={{ __html: formattedPart.replace(/\n/g, '<br />') }} />
        );
      })}
    </>
  );
}

export default function TheoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { courseId, moduleId } = params as {
    courseId: string;
    moduleId: string;
  };

  const content = theoryContent[moduleId];
  if (!content) {
    notFound();
  }

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = content.pages.length;

  useEffect(() => {
    const pageFromQuery = parseInt(searchParams.get('page') || '1', 10);
    if (!isNaN(pageFromQuery) && pageFromQuery > 0 && pageFromQuery <= totalPages) {
      setCurrentPage(pageFromQuery);
    }
  }, [searchParams, totalPages]);

  const pageContent = content.pages[currentPage - 1];

  if (!pageContent) {
    notFound();
  }

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;
  const isLastPage = currentPage === totalPages;

  const basePath = `/course/${courseId}/theory/${moduleId}`;

  return (
    <div className="flex min-h-screen flex-col">
      <Header title={content.title} showBackButton />
      
      <div className="flex-1 p-4 md:p-6 pb-40">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-center gap-2 mb-8">
            {Array.from({ length: totalPages }).map((_, index) => (
              <Link key={index} href={`${basePath}?page=${index + 1}`} className="flex-1">
                <div
                  className={cn(
                    'h-1.5 w-full rounded-full bg-secondary',
                    index < currentPage && 'bg-primary'
                  )}
                />
              </Link>
            ))}
          </div>
          <div className="space-y-4">
             <ContentRenderer content={pageContent} />
          </div>
        </div>
      </div>

      <footer className="fixed bottom-0 inset-x-0 border-t bg-background/80 p-4 backdrop-blur-sm pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between gap-4">
            <Button variant="outline" disabled={!hasPrev} asChild className="flex-1">
              <Link href={`${basePath}?page=${currentPage - 1}`}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
              </Link>
            </Button>
            
            {isLastPage ? (
              <Button asChild className="flex-1" style={{ borderRadius: '9999px', boxShadow: '0 0 20px 0 hsl(var(--primary) / 0.5)' }}>
                <Link href={`/course/${courseId}`}>Finalizar lección</Link>
              </Button>
            ) : (
              <Button disabled={!hasNext} asChild className="flex-1" style={{ borderRadius: '9999px', boxShadow: '0 0 20px 0 hsl(var(--primary) / 0.5)' }}>
                <Link href={`${basePath}?page=${currentPage + 1}`}>
                  Siguiente <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
