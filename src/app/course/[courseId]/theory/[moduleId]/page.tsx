'use client';

import * as React from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound, useSearchParams, useParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Theory, TheoryPage } from '@/lib/data';
import { ContentRenderer } from '@/components/content-renderer';


export default function TheoryLessonPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const { courseId, moduleId: theoryId } = params as {
    courseId: string;
    moduleId: string;
  };

  const [theory, setTheory] = useState<Theory | null>(null);
  const [pages, setPages] = useState<TheoryPage[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = pages?.length ?? 0;

  useEffect(() => {
    async function fetchData() {
        if (!theoryId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/theories?id=${theoryId}`);
            if (!res.ok) throw new Error('Failed to fetch theory');
            const data = await res.json();
            setTheory(data.theory);
            setPages(data.pages);
        } catch (error) {
            console.error(error);
            setTheory(null);
            setPages([]);
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, [theoryId]);


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

  if (loading) {
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

  const basePath = `/course/${courseId}/theory/${theoryId}`;

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
