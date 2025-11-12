
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Header } from '@/components/header';
import { useFirestore, useCollection } from '@/firebase';
import {
  collection,
  query,
  orderBy,
  addDoc,
  doc,
  writeBatch,
} from 'firebase/firestore';
import type { Course, Module as TModule, Theory, TheoryPage } from '@/lib/data';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { placeholderImages } from '@/lib/placeholder-images';

function NewCourseForm({ onCourseAdded }: { onCourseAdded: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageId, setImageId] = useState('');
  const firestore = useFirestore();

  const handleAddCourse = async () => {
    if (!firestore || !title || !description || !imageId) return;
    await addDoc(collection(firestore, 'courses'), {
      title,
      description,
      imageId,
    });
    setTitle('');
    setDescription('');
    setImageId('');
    onCourseAdded();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agregar Nuevo Curso</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Título del Curso</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Descripción</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Imagen del Curso</Label>
          <Select value={imageId} onValueChange={setImageId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una imagen" />
            </SelectTrigger>
            <SelectContent>
              {placeholderImages.map((img) => (
                <SelectItem key={img.id} value={img.id}>
                  {img.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleAddCourse}>Agregar Curso</Button>
      </CardContent>
    </Card>
  );
}

function NewTheoryForm({
  courseId,
  onTheoryAdded,
}: {
  courseId: string;
  onTheoryAdded: () => void;
}) {
  const [title, setTitle] = useState('');
  const [module, setModule] = useState('basico');
  const [pages, setPages] = useState([{ title: '', content: '' }]);
  const firestore = useFirestore();

  const handleAddPage = () => {
    setPages([...pages, { title: '', content: '' }]);
  };

  const handlePageChange = (
    index: number,
    field: 'title' | 'content',
    value: string
  ) => {
    const newPages = [...pages];
    newPages[index][field] = value;
    setPages(newPages);
  };

  const handleSaveTheory = async () => {
    if (!firestore || !title || !module) return;

    try {
      const batch = writeBatch(firestore);

      // 1. Create Theory document
      const theoryRef = doc(collection(firestore, 'theories'));
      batch.set(theoryRef, { title });

      // 2. Create pages subcollection
      pages.forEach((page, index) => {
        const pageRef = doc(
          collection(firestore, `theories/${theoryRef.id}/pages`)
        );
        batch.set(pageRef, { ...page, order: index + 1 });
      });

      // 3. Create Module document in the course
      const moduleRef = doc(
        collection(firestore, `courses/${courseId}/modules`)
      );
      batch.set(moduleRef, {
        title,
        type: 'theory',
        contentId: theoryRef.id,
        duration: 5, // Default duration
        order: Date.now(), // Simple ordering for now
      });

      await batch.commit();

      // Reset form
      setTitle('');
      setModule('basico');
      setPages([{ title: '', content: '' }]);
      onTheoryAdded();
    } catch (error) {
      console.error('Error saving theory:', error);
    }
  };

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="font-semibold">Agregar Nueva Lección (Teoría)</h3>
      <div className="space-y-2">
        <Label>Título de la Lección</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Módulo</Label>
        <Select value={module} onValueChange={setModule}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basico">Básico</SelectItem>
            <SelectItem value="intermedio">Intermedio</SelectItem>
            <SelectItem value="avanzado">Avanzado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Páginas de la lección</h4>
        {pages.map((page, index) => (
          <div key={index} className="space-y-2 rounded border p-3">
            <Label>Página {index + 1}</Label>
            <Input
              placeholder="Título de la página"
              value={page.title}
              onChange={(e) =>
                handlePageChange(index, 'title', e.target.value)
              }
            />
            <Textarea
              placeholder="Contenido en Markdown..."
              value={page.content}
              onChange={(e) =>
                handlePageChange(index, 'content', e.target.value)
              }
              rows={5}
            />
          </div>
        ))}
        <Button variant="outline" onClick={handleAddPage}>
          Agregar otra página
        </Button>
      </div>
      <Button onClick={handleSaveTheory} className="w-full">
        Guardar Lección
      </Button>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const firestore = useFirestore();
  const [refreshKey, setRefreshKey] = useState(0);

  const coursesQuery = firestore
    ? query(collection(firestore, 'courses'), orderBy('title'))
    : null;
  const { data: courses, loading } = useCollection<Course>(coursesQuery, {
    key: `courses-${refreshKey}`,
  } as any);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
      router.replace('/admin');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Dashboard del Administrador" />
      <main className="container mx-auto max-w-4xl flex-1 space-y-6 p-4">
        <NewCourseForm onCourseAdded={() => setRefreshKey((k) => k + 1)} />

        <Card>
          <CardHeader>
            <CardTitle>Gestionar Cursos Existentes</CardTitle>
            <CardDescription>
              Agrega lecciones a los cursos existentes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && <p>Cargando cursos...</p>}
            <Accordion type="single" collapsible className="w-full">
              {courses?.map((course) => (
                <AccordionItem key={course.id} value={course.id}>
                  <AccordionTrigger>{course.title}</AccordionTrigger>
                  <AccordionContent>
                    <NewTheoryForm
                      courseId={course.id}
                      onTheoryAdded={() => setRefreshKey((k) => k + 1)}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
