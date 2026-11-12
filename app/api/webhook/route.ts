import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-28.acacia' as any,
});

// Inicializamos Supabase con la Service Role Key para tener permisos de escritura en la base de datos
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // Manejamos el evento cuando una sesión de pago se completa con éxito
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.supabaseUserId; // El ID de usuario que pasamos al crear la sesión
    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;

    if (userId) {
      // Actualizamos los datos del usuario en Supabase
      const { error } = await supabaseAdmin
        .from('profiles') // Ajusta el nombre de tu tabla de usuarios si es diferente (ej. 'users')
        .update({
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          subscription_status: 'active',
        })
        .eq('id', userId);

      if (error) {
        console.error('Error al actualizar Supabase:', error);
        return new NextResponse('Database Error', { status: 500 });
      }
    }
  }

  return new NextResponse(null, { status: 200 });
}