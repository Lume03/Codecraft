
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
import { useToast } from '@/hooks/use-toast';

function NewCourseForm({ onCourseAdded }: { onCourseAdded: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageId, setImageId] = useState('');
  const { toast } = useToast();

  const handleAddCourse = async () => {
    if (!title || !description || !imageId) {
      toast({
        variant: 'destructive',
        title: 'Faltan campos',
        description: 'Por favor, completa todos los campos del curso.',
      });
      return;
    }
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, imageId }),
      });
      if (!response.ok) {
        throw new Error('Error al crear el curso');
      }
      setTitle('');
      setDescription('');
      setImageId('');
      onCourseAdded();
      toast({
        title: 'Curso agregado',
        description: 'El nuevo curso ha sido guardado en MongoDB.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message,
      });
    }
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
  const { toast } = useToast();

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
    if (!title || !module || pages.some(p => !p.title || !p.content)) {
       toast({
        variant: 'destructive',
        title: 'Faltan campos',
        description: 'Asegúrate de que la lección y todas sus páginas tengan título y contenido.',
      });
      return;
    }

    try {
      const response = await fetch(`/api/courses/${courseId}/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonTitle: title,
          moduleType: module, // e.g., 'basico'
          pages: pages,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar la lección');
      }

      // Reset form
      setTitle('');
      setModule('basico');
      setPages([{ title: '', content: '' }]);
      onTheoryAdded();
       toast({
        title: 'Lección guardada',
        description: 'La nueva lección se ha guardado en MongoDB.',
      });
    } catch (error) {
      console.error('Error saving theory:', error);
       toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message,
      });
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
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
      router.replace('/admin');
    }
  }, [router]);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/courses');
        if (!res.ok) throw new Error('Failed to fetch courses');
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [refreshKey]);


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
