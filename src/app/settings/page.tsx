'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import {
  Brush,
  Languages,
  Bell,
  Mail,
  User,
  ShieldCheck,
  LogOut,
  Sparkles,
  BookOpen,
  CalendarClock,
  ChevronRight,
} from 'lucide-react';
import { SettingsSection } from '@/components/settings/settings-section';
import { SettingsRow } from '@/components/settings/settings-row';

export default function SettingsPage() {
  const [theme, setTheme] = useState(true); // true for dark
  const [didacticMode, setDidacticMode] = useState(false);
  const [dailyChallenge, setDailyChallenge] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Ajustes" showBackButton />
      <main className="mx-auto w-full max-w-[420px] flex-1 space-y-4 px-4 pb-28 md:max-w-[720px] md:space-y-6 md:px-6 md:pb-32">
        <SettingsSection title="General">
          <SettingsRow
            icon={Brush}
            title="Tema"
            subtitle="Oscuro (recomendado para lectura prolongada)"
            trailing={{ type: 'toggle', checked: theme, onCheckedChange: setTheme }}
          />
          <SettingsRow
            icon={Languages}
            title="Tamaño de fuente"
            subtitle="Base 15px · Equilibrio entre legibilidad y contenido"
            trailing={{ type: 'text', value: 'Medio' }}
            href="#"
          />
          <SettingsRow
            icon={Languages}
            title="Idioma"
            subtitle="Español"
            trailing={{ type: 'text', value: 'Cambiar' }}
            href="#"
          />
        </SettingsSection>

        <SettingsSection title="Aprendizaje">
          <SettingsRow
            icon={Sparkles}
            title="Modo didáctico"
            subtitle="Explicaciones extendidas y ejemplos paso a paso"
            trailing={{ type: 'toggle', checked: didacticMode, onCheckedChange: setDidacticMode }}
          />
          <SettingsRow
            icon={BookOpen}
            title="Reto diario"
            subtitle="Recibe un ejercicio cada día para mantener el hábito"
            trailing={{ type: 'toggle', checked: dailyChallenge, onCheckedChange: setDailyChallenge }}
          />
          <SettingsRow
            icon={CalendarClock}
            title="Recordatorios"
            subtitle="Programa tu hora ideal para estudiar"
            trailing={{ type: 'text', value: '19:00' }}
            href="#"
          />
        </SettingsSection>

        <SettingsSection title="Notificaciones">
          <SettingsRow
            icon={Bell}
            title="Push"
            subtitle="Progreso, retos y recordatorios"
            trailing={{ type: 'toggle', checked: pushNotifications, onCheckedChange: setPushNotifications }}
          />
          <SettingsRow
            icon={Mail}
            title="Correo"
            subtitle="Resumen semanal de aprendizaje"
            trailing={{ type: 'toggle', checked: emailNotifications, onCheckedChange: setEmailNotifications }}
          />
        </SettingsSection>

        <SettingsSection title="Cuenta">
          <SettingsRow
            icon={User}
            title="Perfil"
            subtitle="Nombre, nivel, XP y logros"
            trailing={{ type: 'chevron' }}
            href="/profile"
          />
          <SettingsRow
            icon={ShieldCheck}
            title="Privacidad"
            subtitle="Controla datos y permisos"
            trailing={{ type: 'text', value: 'Gestionar' }}
            href="#"
          />
          <SettingsRow
            icon={LogOut}
            title="Cerrar sesión"
            subtitle="Desvincula este dispositivo"
            trailing={{ type: 'chevron' }}
            href="/auth"
          />
        </SettingsSection>
      </main>
    </div>
  );
}
