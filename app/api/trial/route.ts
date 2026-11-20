import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';

const TRIAL_DURATION_DAYS = 30;

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // 1. Buscar si el usuario ya tiene registro de prueba en Supabase
    let { data: trial, error } = await supabase
      .from('user_trials')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 2. Si es su primera vez iniciando sesión, registrar el inicio de sus 30 días gratis
    if (!trial) {
      const { data: newTrial, error: insertError } = await supabase
        .from('user_trials')
        .insert({
          user_id: userId,
          trial_started_at: new Date().toISOString(),
          last_nudge_milestone: 0,
        })
        .select()
        .single();

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
      trial = newTrial;
    }

    // 3. Calcular días transcurridos y días restantes
    const startedAt = new Date(trial.trial_started_at).getTime();
    const now = Date.now();
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysElapsed = Math.floor((now - startedAt) / msPerDay);
    const daysRemaining = Math.max(0, TRIAL_DURATION_DAYS - daysElapsed);
    const isTrialExpired = daysElapsed >= TRIAL_DURATION_DAYS;

    // 4. Comprobar si toca mostrar el globo de cada 10 días (hito 10, 20 o 30)
    const currentMilestone = Math.floor(daysElapsed / 10) * 10;
    const shouldShowNudge =
      currentMilestone >= 10 && currentMilestone > (trial.last_nudge_milestone ?? 0);

    return NextResponse.json({
      daysElapsed,
      daysRemaining,
      isTrialExpired,
      shouldShowNudge,
      currentMilestone,
    });
  } catch {
    return NextResponse.json({ error: 'Error interno al verificar la prueba' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await req.json();
    const milestone = Number(body?.milestone);

    if (!milestone || milestone < 10) {
      return NextResponse.json({ error: 'Hito inválido' }, { status: 400 });
    }

    // Marcar que el usuario ya vio y cerró el globo de ese hito de 10 días
    const { error } = await supabase
      .from('user_trials')
      .update({ last_nudge_milestone: milestone })
      .eq('user_id', userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Error al actualizar el aviso' }, { status: 500 });
  }
}