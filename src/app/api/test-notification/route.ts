import { NextResponse } from 'next/server';
import { adminMessaging } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Falta el token del dispositivo' }, { status: 400 });
    }

    const message = {
      notification: {
        title: '🎉 ¡Notificación de Prueba!',
        body: 'Si ves esto, el envío desde el servidor funciona.',
      },
      token: token,
    };

    console.log(`[API Test] Intentando enviar notificación al token: ${token.substring(0, 30)}...`);

    const response = await adminMessaging.send(message);

    console.log('[API Test] Notificación enviada exitosamente:', response);
    return NextResponse.json({ success: true, messageId: response });

  } catch (error: any) {
    console.error('[API Test] Error al enviar la notificación:', error);
    
    // Proporcionar un mensaje de error más detallado
    let errorMessage = 'Error desconocido al enviar la notificación.';
    if (error.code) {
        switch (error.code) {
            case 'messaging/invalid-argument':
                errorMessage = 'El token del dispositivo no es válido.';
                break;
            case 'messaging/registration-token-not-registered':
                errorMessage = 'El token del dispositivo ya no está registrado. El usuario puede haber desinstalado la app.';
                break;
            default:
                errorMessage = `Error de Firebase: ${error.message} (código: ${error.code})`;
        }
    } else {
        errorMessage = error.message;
    }
    
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
