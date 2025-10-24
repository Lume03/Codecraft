
'use client';

import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { theoryContent } from '@/lib/data.tsx';
import Link from 'next/link';
import { notFound, useSearchParams, useParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// A simple component to render markdown-like code blocks
function CodeBlock({ children }: { children: string }) {
  const code = children.replace(/```javascript\n|```/g, '');
  return (
    <pre className="my-4 rounded-md bg-card p-4 overflow-x-auto">
      <code className="font-code text-sm">{code}</code>
    </pre>
  );
}

function ContentRenderer({ content }: { content: string }) {
  const parts = content.split(/(```javascript\n[\s\S]*?```)/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('```javascript')) {
          return <CodeBlock key={index}>{part}</CodeBlock>;
        }
        return (
          <p key={index} className="leading-relaxed">
            {part}
          </p>
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

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const totalPages = content.pages.length;
  const pageContent = content.pages[currentPage - 1];

  if (!pageContent) {
    notFound();
  }

  const progress = (currentPage / totalPages) * 100;

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="flex min-h-screen flex-col">
      <Header title={content.title} showBackButton />

      <div className="p-4 md:p-6 flex-1">
        <div className="prose prose-invert mx-auto max-w-3xl text-foreground">
          <ContentRenderer>{pageContent}</ContentRenderer>
        </div>
      </div>

      <footer className="sticky bottom-0 border-t bg-background p-4">
        <div className="mx-auto max-w-3xl">
          <Progress value={progress} className="mb-4 h-2" />
          <div className="flex items-center justify-between">
            <Button variant="outline" disabled={!hasPrev} asChild>
              <Link href={`?page=${currentPage - 1}`}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
              </Link>
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </span>
            {isLastPage ? (
              <Button asChild>
                <Link href={`/course/${courseId}`}>Finalizar lección</Link>
              </Button>
            ) : (
              <Button disabled={!hasNext} asChild>
                <Link href={`?page=${currentPage + 1}`}>
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
