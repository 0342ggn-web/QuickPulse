import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Polar envía eventos de suscripción aquí (ej. subscription.created, subscription.active)
    const eventType = body.type;
    const data = body.data;

    console.log(`Webhook de Polar recibido: ${eventType}`);

    // Aquí puedes manejar cuando una suscripción se activa con éxito
    if (eventType === 'subscription.created' || eventType === 'subscription.active') {
      const customerEmail = data.customer?.email;
      console.log(`¡Suscripción activa para el correo: ${customerEmail}!`);
      
      // Más adelante, cuando guardemos usuarios en base de datos, 
      // actualizaremos su estado 'isPro' aquí mismo.
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error en el webhook de Polar:', error.message);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 400 });
  }
}