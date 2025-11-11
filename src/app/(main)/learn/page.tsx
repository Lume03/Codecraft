'use client';

import { CourseCard } from '@/components/course-card';
import { Header } from '@/components/header';
import { useCollection, useFirestore } from '@/firebase';
import { Course } from '@/lib/data';
import { collection } from 'firebase/firestore';
import { CodeXml } from 'lucide-react';
import Link from 'next/link';

export default function LearnPage() {
  const firestore = useFirestore();
  const coursesRef = firestore ? collection(firestore, 'courses') : null;
  const { data: courses, loading } = useCollection<Course>(coursesRef);

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
        {loading && <p>Cargando cursos...</p>}
        {courses?.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
