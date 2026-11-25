import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: 'Falta STRIPE_SECRET_KEY en las variables de entorno' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(secretKey);
    const body = await request.json().catch(() => ({}));
    const plan = body?.plan || 'monthly';
    const couponId = typeof body?.couponId === 'string' ? body.couponId : undefined;

    const priceMapping: Record<string, string> = {
      monthly: 'price_1UY98RLEgmrxU99QwODCEOM1',
      quarterly: 'price_1UY98RLEgmrxU99QlfIJAmA0',
      yearly: 'price_1UY98RLEgmrxU99QFHFrzeEh',
    };

    const priceId = priceMapping[plan];

    if (!priceId) {
      return NextResponse.json({ error: 'Plan no válido' }, { status: 400 });
    }

    // Aplica LANZAMIENTO339 en el plan mensual (o si llega explícitamente en el cuerpo)
    const appliedCoupon = couponId || (plan === 'monthly' ? 'LANZAMIENTO339' : undefined);

    const origin = request.headers.get('origin') || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      ...(appliedCoupon ? { discounts: [{ coupon: appliedCoupon }] } : {}),
      success_url: `${origin}/?success=true`,
      cancel_url: `${origin}/?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}