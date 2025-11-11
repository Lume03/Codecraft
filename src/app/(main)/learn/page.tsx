'use client';

import { CourseCard } from '@/components/course-card';
import { Header } from '@/components/header';
import { useCollection, useFirestore } from '@/firebase';
import type { Course } from '@/lib/data';
import { collection, query, orderBy } from 'firebase/firestore';
import { CodeXml, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function LearnPage() {
  const firestore = useFirestore();
  const coursesQuery = firestore
    ? query(collection(firestore, 'courses'), orderBy('title'))
    : null;
  const { data: courses, loading } = useCollection<Course>(coursesQuery);

  return (
    <div>
      <Header
        title="Aprender"
        action={
          <Link href="/admin">
            <PlusCircle className="h-8 w-8 text-primary" />
          </Link>
        }
      />
      <div className="container space-y-4 px-4 py-6 md:px-6">
        {loading && <p>Cargando cursos...</p>}
        {!loading && courses?.length === 0 && (
          <div className="text-center text-muted-foreground">
            <p>No hay cursos disponibles.</p>
            <p>
              Ve al{' '}
              <Link href="/admin" className="text-primary underline">
                panel de administrador
              </Link>{' '}
              para agregar uno.
            </p>
          </div>
        )}
        {courses?.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
