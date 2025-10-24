'use client';

import { CourseCard } from '@/components/course-card';
import { Header } from '@/components/header';
import { courses } from '@/lib/data.tsx';
import { CodeXml } from 'lucide-react';
import Link from 'next/link';

export default function LearnPage() {
  return (
    <div>
      <Header
        title="Aprender"
        action={
          <Link href="/">
            <CodeXml className="h-8 w-8 text-primary" />
          </Link>
        }
      />
      <div className="container space-y-4 px-4 py-6 md:px-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
