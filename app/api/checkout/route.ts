import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const { plan } = await request.json();

    const priceMapping: Record<string, string> = {
      monthly: 'price_1UY98RLEgmrxU99QwODCEOM1',
      quarterly: 'price_1UY98RLEgmrxU99QlfIJAmA0',
      yearly: 'price_1UY98RLEgmrxU99QFHFrzeEh',
    };

    const priceId = priceMapping[plan];

    if (!priceId) {
      return NextResponse.json({ error: 'Plan no válido' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${request.headers.get('origin')}/?success=true`,
      cancel_url: `${request.headers.get('origin')}/?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}