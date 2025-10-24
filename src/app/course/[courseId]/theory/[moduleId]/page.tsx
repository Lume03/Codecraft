import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { theoryContent } from '@/lib/data.tsx';
import Link from 'next/link';
import { notFound } from 'next/navigation';
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
                return <p key={index} className="leading-relaxed">{part}</p>;
            })}
        </>
    );
}

export default function TheoryPage({
  params,
  searchParams,
}: {
  params: { courseId: string; moduleId: string };
  searchParams: { page?: string };
}) {
  const { courseId, moduleId } = params;
  const content = theoryContent[moduleId];
  if (!content) {
    notFound();
  }

  const currentPage = parseInt(searchParams.page || '1', 10);
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
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Link>
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            {isLastPage ? (
                 <Button asChild>
                    <Link href={`/course/${courseId}`}>Finish Lesson</Link>
                </Button>
            ) : (
                <Button disabled={!hasNext} asChild>
                    <Link href={`?page=${currentPage + 1}`}>
                        Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
