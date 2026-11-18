import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const eventType = body.type;
    const data = body.data;

    console.log(`Webhook de Polar recibido: ${eventType}`);

    // Cuando la suscripción se crea o se activa con éxito
    if (eventType === 'subscription.created' || eventType === 'subscription.active') {
      const customerEmail = data.customer?.email;
      console.log(`¡Suscripción activa para el correo: ${customerEmail}!`);

      if (customerEmail) {
        try {
          // 1. Buscar al usuario en Clerk por su correo electrónico
          const client = await clerkClient();
          const users = await client.users.getUserList({
            emailAddress: [customerEmail],
          });

          if (users.data.length > 0) {
            const userId = users.data[0].id;

            // 2. Actualizar sus metadatos para volverlo Pro
            await client.users.updateUserMetadata(userId, {
              publicMetadata: {
                isPro: true,
              },
            });

            console.log(`¡Usuario ${userId} (${customerEmail}) actualizado a PRO con éxito!`);
          } else {
            console.log(`No se encontró ningún usuario en Clerk con el email: ${customerEmail}`);
          }
        } catch (clerkError: any) {
          console.error('Error al actualizar el usuario en Clerk:', clerkError.message);
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error en el webhook de Polar:', error.message);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 400 });
  }
}