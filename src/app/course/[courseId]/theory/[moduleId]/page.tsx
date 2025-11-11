'use client';

import * as React from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound, useSearchParams, useParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState, useMemo } from 'react';
import { useDoc, useCollection, useFirestore } from '@/firebase';
import { doc, collection, query, orderBy } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import { Skeleton } from '@/components/ui/skeleton';

function ContentRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-invert max-w-none text-foreground/90">
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => (
            <h1
              className="my-4 text-3xl font-bold text-foreground"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="my-3 border-b border-border pb-2 text-2xl font-bold text-foreground"
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <p className="my-4 text-base leading-relaxed" {...props} />
          ),
          code: ({ node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <pre className="my-4 overflow-x-auto rounded-xl bg-card p-4">
                <code className="font-code text-sm">{children}</code>
              </pre>
            ) : (
              <code
                className="font-code rounded-md bg-secondary px-1.5 py-0.5 text-primary"
                {...props}
              >
                {children}
              </code>
            );
          },
          table: ({ node, ...props }) => (
            <table
              className="my-4 w-full border-collapse border border-border"
              {...props}
            />
          ),
          th: ({ node, ...props }) => (
            <th
              className="border border-border bg-secondary px-4 py-2 text-left font-semibold"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-border px-4 py-2" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="my-4 ml-5 list-disc space-y-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="my-4 ml-5 list-decimal space-y-2" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="leading-relaxed" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-bold text-foreground" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default function TheoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const firestore = useFirestore();
  const { courseId, moduleId } = params as {
    courseId: string;
    moduleId: string;
  };

  const theoryRef = useMemo(
    () => firestore ? doc(firestore, `theories/${moduleId}`) : null,
    [firestore, moduleId]
  );
  const { data: theory, loading: theoryLoading } = useDoc(theoryRef);

  const pagesQuery = useMemo(
    () =>
      firestore
        ? query(
            collection(firestore, `theories/${moduleId}/pages`),
            orderBy('order')
          )
        : null,
    [firestore, moduleId]
  );
  const { data: pages, loading: pagesLoading } = useCollection(pagesQuery);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = pages?.length ?? 0;

  useEffect(() => {
    const pageFromQuery = parseInt(searchParams.get('page') || '1', 10);
    if (
      !isNaN(pageFromQuery) &&
      pageFromQuery > 0 &&
      totalPages > 0 &&
      pageFromQuery <= totalPages
    ) {
      setCurrentPage(pageFromQuery);
    } else if (totalPages > 0) {
      setCurrentPage(1);
    }
  }, [searchParams, totalPages]);

  if (theoryLoading || pagesLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header title="..." showBackButton />
        <div className="flex-1 p-4 pb-40 md:p-6">
          <div className="mx-auto max-w-3xl space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!theory || !pages || pages.length === 0) {
    return notFound();
  }

  const pageContent = pages[currentPage - 1]?.content;

  if (!pageContent) {
    // This can happen briefly while currentPage is being set, or if a page is missing.
    return <div>Cargando página...</div>;
  }

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;
  const isLastPage = currentPage === totalPages;

  const basePath = `/course/${courseId}/theory/${moduleId}`;

  return (
    <div className="flex min-h-screen flex-col">
      <Header title={theory.title} showBackButton />

      <div className="flex-1 p-4 pb-40 md:p-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <Link
                key={index}
                href={`${basePath}?page=${index + 1}`}
                className="flex-1"
              >
                <div
                  className={cn(
                    'h-1.5 w-full rounded-full bg-secondary',
                    index < currentPage && 'bg-primary'
                  )}
                  aria-label={`Ir a la página ${index + 1}`}
                />
              </Link>
            ))}
          </div>
          <div className="space-y-4">
            <ContentRenderer content={pageContent} />
          </div>
        </div>
      </div>

      <footer className="fixed inset-x-0 bottom-0 border-t bg-background/80 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur-sm">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              disabled={!hasPrev}
              asChild
              className="flex-1"
            >
              <Link href={`${basePath}?page=${currentPage - 1}`}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
              </Link>
            </Button>

            {isLastPage ? (
              <Button
                asChild
                className="flex-1"
                style={{
                  borderRadius: '9999px',
                  boxShadow: '0 0 20px 0 hsl(var(--primary) / 0.5)',
                }}
              >
                <Link href={`/course/${courseId}`}>Finalizar lección</Link>
              </Button>
            ) : (
              <Button
                disabled={!hasNext}
                asChild
                className="flex-1"
                style={{
                  borderRadius: '9999px',
                  boxShadow: '0 0 20px 0 hsl(var(--primary) / 0.5)',
                }}
              >
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
