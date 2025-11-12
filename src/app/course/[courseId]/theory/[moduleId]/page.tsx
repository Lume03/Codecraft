'use server';

import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Theory, TheoryPage as TheoryPageType } from '@/lib/data';
import { ContentRenderer } from '@/components/content-renderer';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

async function getTheoryData(theoryId: string): Promise<{
  theory: Theory;
  pages: TheoryPageType[];
} | null> {
  if (!theoryId || !ObjectId.isValid(theoryId)) {
    return null;
  }

  try {
    const client = await clientPromise;
    const db = client.db('ravencode');
    const id = new ObjectId(theoryId);

    const theory = await db.collection('theories').findOne({ _id: id });
    if (!theory) {
      return null;
    }

    const pages = await db
      .collection('theory-pages')
      .find({ theoryId: id })
      .sort({ order: 1 })
      .toArray();

    return {
      theory: {
        id: theory._id.toString(),
        title: theory.title,
      },
      pages: pages.map((page) => ({
        id: page._id.toString(),
        theoryId: page.theoryId.toString(),
        title: page.title,
        content: page.content,
        order: page.order,
      })),
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}

export default async function TheoryLessonPage({
  params,
  searchParams,
}: {
  params: { courseId: string; moduleId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { courseId, moduleId: theoryId } = params;

  const data = await getTheoryData(theoryId);

  if (!data) {
    notFound();
  }

  const { theory, pages } = data;
  const totalPages = pages.length;

  let currentPage = 1;
  const pageFromQuery = parseInt(searchParams?.page as string, 10);
  if (
    !isNaN(pageFromQuery) &&
    pageFromQuery > 0 &&
    pageFromQuery <= totalPages
  ) {
    currentPage = pageFromQuery;
  }

  const pageContent = pages[currentPage - 1]?.content;

  if (!pageContent) {
     if (pages.length > 0) {
      // Si hay páginas pero la actual no existe, redirige a la primera
       const basePath = `/course/${courseId}/theory/${theoryId}`;
       return (
        <div className="flex min-h-screen flex-col items-center justify-center">
          <p>Página no encontrada.</p>
          <Link href={`${basePath}?page=1`} className="text-primary underline">
            Ir a la primera página
          </Link>
        </div>
      );
    }
    notFound();
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