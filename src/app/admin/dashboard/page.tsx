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
import type { Course, Module as TModule, TheoryPage } from '@/lib/data';
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
import { Edit, Plus, Trash2, Settings, LogOut } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useTranslation } from '@/context/language-provider';

// --- FORMULARIOS Y DIÁLOGOS DE CREACIÓN ---

function NewCourseForm({ onCourseAdded }: { onCourseAdded: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageId, setImageId] = useState('');
  const { toast } = useToast();
  const { t } = useTranslation();

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
        description: 'El nuevo curso ha sido guardado.',
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
          <Label htmlFor="new-course-title">Título del Curso</Label>
          <Input id="new-course-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-course-desc">Descripción</Label>
          <Textarea
            id="new-course-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-course-image">Imagen del Curso</Label>
          <Select value={imageId} onValueChange={setImageId}>
            <SelectTrigger id="new-course-image">
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

  const handleRemovePage = (index: number) => {
    const newPages = pages.filter((_, i) => i !== index);
    setPages(newPages);
  };

  const handleSaveTheory = async () => {
    if (!title || !module || pages.some((p) => !p.title || !p.content)) {
      toast({
        variant: 'destructive',
        title: 'Faltan campos',
        description:
          'Asegúrate de que la lección y todas sus páginas tengan título y contenido.',
      });
      return;
    }

    try {
      const response = await fetch(`/api/courses/${courseId}/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonTitle: title,
          moduleType: module,
          pages: pages,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar la lección');
      }

      setTitle('');
      setModule('basico');
      setPages([{ title: '', content: '' }]);
      onTheoryAdded();
      toast({
        title: 'Lección guardada',
        description: 'La nueva lección se ha guardado exitosamente.',
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
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>Agregar Nueva Lección de Teoría</DialogTitle>
      </DialogHeader>
      <div className="max-h-[80vh] overflow-y-auto p-1 pr-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-lesson-title">Título de la Lección</Label>
            <Input id="new-lesson-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-lesson-module">Módulo</Label>
            <Select value={module} onValueChange={setModule}>
              <SelectTrigger id="new-lesson-module">
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
              <div
                key={index}
                className="relative space-y-2 rounded border p-3"
              >
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-3 -right-3 h-7 w-7"
                  onClick={() => handleRemovePage(index)}
                  aria-label={`Eliminar página ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Label htmlFor={`page-title-${index}`}>Página {index + 1}</Label>
                <Input
                  id={`page-title-${index}`}
                  placeholder="Título de la página"
                  value={page.title}
                  onChange={(e) =>
                    handlePageChange(index, 'title', e.target.value)
                  }
                />
                <Label htmlFor={`page-content-${index}`} className="sr-only">Contenido de la Página {index + 1}</Label>
                <Textarea
                  id={`page-content-${index}`}
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
              <Plus className="mr-2 h-4 w-4" />
              Agregar otra página
            </Button>
          </div>
          <DialogClose asChild>
            <Button onClick={handleSaveTheory} className="w-full">
              Guardar Lección
            </Button>
          </DialogClose>
        </div>
      </div>
    </DialogContent>
  );
}

function NewPageForm({ theoryId, onPageAdded }: { theoryId: string; onPageAdded: () => void; }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { toast } = useToast();

  const handleSavePage = async () => {
    if (!title || !content) {
      toast({
        variant: 'destructive',
        title: 'Faltan campos',
        description: 'Por favor, completa el título y el contenido de la página.',
      });
      return;
    }

    try {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, theoryId }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar la página');
      }

      setTitle('');
      setContent('');
      onPageAdded();
      toast({
        title: 'Página guardada',
        description: 'La nueva página se ha añadido a la lección.',
      });

    } catch (error) {
      console.error('Error saving page:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message,
      });
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Agregar Nueva Página</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="new-page-title">Título de la Página</Label>
          <Input id="new-page-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-page-content">Contenido (Markdown)</Label>
          <Textarea id="new-page-content" value={content} onChange={(e) => setContent(e.target.value)} rows={8} />
        </div>
        <DialogClose asChild>
          <Button onClick={handleSavePage} className="w-full">Guardar Página</Button>
        </DialogClose>
      </div>
    </DialogContent>
  );
}


// --- DIÁLOGOS Y COMPONENTES DE EDICIÓN ---

function EditPageDialog({
  page,
  onPageUpdated,
  onPageDeleted,
}: {
  page: TheoryPage;
  onPageUpdated: () => void;
  onPageDeleted: () => void;
}) {
  const [title, setTitle] = useState(page.title);
  const [content, setContent] = useState(page.content);
  const { toast } = useToast();

  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/pages/${page.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) throw new Error('Failed to update page');
      toast({ title: 'Página actualizada' });
      onPageUpdated();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message,
      });
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/pages/${page.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete page');
      toast({ title: 'Página eliminada' });
      onPageDeleted();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message,
      });
    }
  };

  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>Editar Página</DialogTitle>
      </DialogHeader>
      <div className="max-h-[80vh] overflow-y-auto space-y-4 p-1 pr-4">
        <div className="space-y-2">
          <Label htmlFor="edit-page-title">Título de la Página</Label>
          <Input id="edit-page-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-page-content">Contenido (Markdown)</Label>
          <Textarea
            id="edit-page-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
          />
        </div>
        <div className="flex justify-between">
          <DialogClose asChild>
            <Button onClick={handleUpdate}>Guardar Cambios</Button>
          </DialogClose>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Eliminar Página</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>¿Estás seguro?</DialogTitle>
                <DialogDescription>
                  Esta acción no se puede deshacer. Se eliminará la página permanentemente.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                <DialogClose asChild><Button variant="destructive" onClick={handleDelete}>Sí, eliminar</Button></DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </DialogContent>
  );
}

function EditModuleDialog({
  module,
  onModuleUpdated,
  onModuleDeleted,
  onRefresh,
}: {
  module: TModule;
  onModuleUpdated: () => void;
  onModuleDeleted: () => void;
  onRefresh: () => void;
}) {
  const [title, setTitle] = useState(module.title);
  const { toast } = useToast();

  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/modules/${module.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error('Failed to update module');
      toast({ title: 'Lección actualizada' });
      onModuleUpdated();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message,
      });
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/modules/${module.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete module');
      toast({ title: 'Lección eliminada' });
      onModuleDeleted();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message,
      });
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Gestionar Lección</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="edit-module-title">Título de la Lección</Label>
          <Input id="edit-module-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="flex justify-between">
          <DialogClose asChild>
            <Button onClick={handleUpdate}>Guardar Cambios</Button>
          </DialogClose>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Eliminar Lección</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>¿Estás seguro?</DialogTitle>
                <DialogDescription>
                  Se eliminará la lección y todas sus páginas. Esta acción no se puede deshacer.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                <DialogClose asChild><Button variant="destructive" onClick={handleDelete}>Sí, eliminar</Button></DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <h3 className="mb-2 text-lg font-semibold">Páginas</h3>
          <div className="max-h-64 rounded-md border p-2">
            <PageList theoryId={module.contentId} onRefresh={onRefresh} />
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

function EditCourseDialog({ course, onCourseUpdated, onCourseDeleted }: { course: Course; onCourseUpdated: () => void; onCourseDeleted: () => void; }) {
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description);
  const [imageId, setImageId] = useState(course.imageId);
  const { toast } = useToast();

  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/courses/${course.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, imageId }),
      });
      if (!res.ok) throw new Error('Failed to update course');
      toast({ title: 'Curso actualizado' });
      onCourseUpdated();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/courses/${course.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete course');
      toast({ title: 'Curso eliminado' });
      onCourseDeleted();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
    }
  };

  return (
    <DialogContent className="max-w-xl">
      <DialogHeader>
        <DialogTitle>Gestionar Curso: {course.title}</DialogTitle>
      </DialogHeader>
      <div className="max-h-[80vh] overflow-y-auto p-1 pr-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="edit-course-title">Título del Curso</Label>
          <Input id="edit-course-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-course-desc">Descripción</Label>
          <Textarea id="edit-course-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-course-image">Imagen del Curso</Label>
          <Select value={imageId} onValueChange={setImageId}>
            <SelectTrigger id="edit-course-image"><SelectValue /></SelectTrigger>
            <SelectContent>
              {placeholderImages.map((img) => (
                <SelectItem key={img.id} value={img.id}>
                  {img.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-between pt-4">
          <DialogClose asChild>
            <Button onClick={handleUpdate}>Guardar Cambios</Button>
          </DialogClose>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Eliminar Curso</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>¿Estás seguro de que quieres eliminar este curso?</DialogTitle>
                <DialogDescription>
                  Esta acción no se puede deshacer. Se eliminará permanentemente el curso y todas sus lecciones y páginas asociadas.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                <DialogClose asChild><Button variant="destructive" onClick={handleDelete}>Sí, eliminar curso</Button></DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </DialogContent>
  )
}

// --- COMPONENTES DE LISTA ---

function PageList({ theoryId, onRefresh }: { theoryId: string; onRefresh: () => void; }) {
  const [pages, setPages] = useState<TheoryPage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPages() {
      if (!theoryId) {
        setLoading(false);
        setPages([]);
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(`/api/theories?id=${theoryId}`);
        if (!res.ok) {
          // If the theory was deleted (e.g., by deleting the parent module),
          // the API returns 404. We can gracefully handle this.
          if (res.status === 404) {
            setPages([]);
          } else {
            throw new Error('Failed to fetch pages');
          }
        } else {
          const data = await res.json();
          setPages(data.pages);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchPages();
  }, [theoryId, onRefresh]);

  if (loading)
    return (
      <p className="px-4 py-2 text-sm text-muted-foreground" aria-live="polite">
        Cargando páginas...
      </p>
    );

  return (
    <div className="space-y-2">
      {pages.length === 0 && (
        <p className="px-4 py-2 text-center text-sm text-muted-foreground" aria-live="polite">
          No hay páginas en esta lección.
        </p>
      )}
      {pages.map((page) => (
        <div
          key={page.id}
          className="flex items-center justify-between rounded-lg border bg-secondary/50 p-2"
        >
          <span className="flex-1 truncate pl-2 text-sm font-medium">
            {page.title}
          </span>
          <Dialog onOpenChange={(open) => !open && onRefresh()}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()} aria-label={`Editar página ${page.title}`}>
                <Edit className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <EditPageDialog
              page={page}
              onPageUpdated={onRefresh}
              onPageDeleted={onRefresh}
            />
          </Dialog>
        </div>
      ))}
      <Dialog onOpenChange={(open) => !open && onRefresh()}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="w-full mt-2">
            <Plus className="mr-2 h-4 w-4" />
            Agregar Nueva Página
          </Button>
        </DialogTrigger>
        <NewPageForm theoryId={theoryId} onPageAdded={onRefresh} />
      </Dialog>
    </div>
  );
}

function ModuleList({
  courseId,
  onRefresh,
}: {
  courseId: string;
  onRefresh: () => void;
}) {
  const [modules, setModules] = useState<TModule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchModules() {
      try {
        setLoading(true);
        const res = await fetch(`/api/courses/${courseId}/modules`);
        if (!res.ok) throw new Error('Failed to fetch modules');
        const data = await res.json();
        setModules(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchModules();
  }, [courseId, onRefresh]);

  if (loading) return <p aria-live="polite">Cargando lecciones...</p>;

  return (
    <div className="space-y-2">
      {modules.length === 0 && (
        <p className="text-center text-sm text-muted-foreground" aria-live="polite">
          No hay lecciones en este curso.
        </p>
      )}
      <Accordion type="single" collapsible className="w-full">
        {modules.map((module) => (
          <AccordionItem key={module.id} value={module.id}>
            <div className="flex w-full items-center justify-between rounded-lg pr-2 hover:bg-secondary/20">
              <AccordionTrigger className="flex-1 px-4 py-2 text-left font-medium hover:no-underline">
                {module.title}
              </AccordionTrigger>
              <Dialog onOpenChange={(open) => !open && onRefresh()}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-2"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Editar lección ${module.title}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <EditModuleDialog
                  module={module}
                  onModuleUpdated={onRefresh}
                  onModuleDeleted={onRefresh}
                  onRefresh={onRefresh}
                />
              </Dialog>
            </div>
            <AccordionContent>
              <PageList theoryId={module.contentId} onRefresh={onRefresh} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

// --- COMPONENTES PRINCIPALES ---

function CourseManager({
  courses,
  onRefresh,
}: {
  courses: Course[];
  onRefresh: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionar Cursos Existentes</CardTitle>
        <CardDescription>
          Edita, elimina o agrega contenido a los cursos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {courses.map((course) => (
            <AccordionItem key={course.id} value={course.id}>
              <div className="flex w-full items-center justify-between rounded-lg pr-2 hover:bg-secondary/20">
                <AccordionTrigger className="flex-1 px-4 py-3 text-left hover:no-underline">
                  {course.title}
                </AccordionTrigger>
                <Dialog onOpenChange={(open) => !open && onRefresh()}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()} aria-label={`Gestionar curso ${course.title}`}>
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <EditCourseDialog course={course} onCourseUpdated={onRefresh} onCourseDeleted={onRefresh} />
                </Dialog>
              </div>
              <AccordionContent>
                <div className="space-y-4 p-2">
                  <ModuleList courseId={course.id} onRefresh={onRefresh} />
                  <Dialog onOpenChange={(open) => !open && onRefresh()}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Nueva Lección
                      </Button>
                    </DialogTrigger>
                    <NewTheoryForm
                      courseId={course.id}
                      onTheoryAdded={onRefresh}
                    />
                  </Dialog>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const { t } = useTranslation();

  const handleRefresh = () => setRefreshKey((k) => k + 1);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    router.replace('/admin');
  };

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
    <div className="min-h-screen flex-col">
      <Header
        title={t('admin_dashboard_title')}
        action={
          <Button variant="ghost" size="icon" onClick={handleLogout} aria-label={t('log_out')}>
            <LogOut className="h-5 w-5" />
            <span className="sr-only">{t('log_out')}</span>
          </Button>
        }
      />
      <main className="container mx-auto max-w-4xl flex-1 space-y-6 p-4">
        <NewCourseForm onCourseAdded={handleRefresh} />

        {loading ? (
          <p aria-live="polite">{t('loading_courses')}</p>
        ) : (
          <CourseManager courses={courses} onRefresh={handleRefresh} />
        )}
      </main>
    </div>
  );
}
