'use client';

import { CourseCard } from '@/components/course-card';
import { Header } from '@/components/header';
import type { Course } from '@/lib/data';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function LearnPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        if (!res.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

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
        {!loading && courses.length === 0 && (
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
        {courses.map((course) => (
          // @ts-ignore _id is coming from MongoDB
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
}
