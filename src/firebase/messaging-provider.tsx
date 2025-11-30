'use client';

import { useEffect } from 'react';
import { onMessage } from 'firebase/messaging';
import { messaging } from '.';
import { useToast } from '@/hooks/use-toast';
import type { MessagePayload } from './types';

export const FirebaseMessagingProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined' && messaging) {
      const unsubscribe = onMessage(messaging, (payload: MessagePayload) => {
        console.log('[Foreground] 📨 Mensaje recibido en primer plano:', payload);
        
        // Muestra una notificación nativa del navegador
        if (payload.notification) {
          const { title, body, image } = payload.notification;
          new Notification(title || 'RavenCode', {
            body: body,
            icon: image || '/gato.png', // Fallback a un ícono por defecto
          });
        }
        
        // También puedes usar un toast para una notificación menos intrusiva dentro de la app
        // toast({
        //   title: payload.notification?.title,
        //   description: payload.notification?.body,
        // });
      });

      return () => {
        unsubscribe();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
};
