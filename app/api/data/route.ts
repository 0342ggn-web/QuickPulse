import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';

// Obtener todas las listas y recibos del usuario autenticado
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const [listsRes, txRes] = await Promise.all([
      supabase
        .from('user_lists')
        .select('id, name, icon')
        .eq('user_id', userId)
        .order('created_at', { ascending: true }),
      supabase
        .from('user_transactions')
        .select('id, list_id, text, amount, date')
        .eq('user_id', userId)
        .order('id', { ascending: false }),
    ]);

    if (listsRes.error) {
      return NextResponse.json({ error: listsRes.error.message }, { status: 500 });
    }
    if (txRes.error) {
      return NextResponse.json({ error: txRes.error.message }, { status: 500 });
    }

    const transactions = (txRes.data || []).map((t) => ({
      id: Number(t.id),
      listId: t.list_id,
      text: t.text,
      amount: Number(t.amount),
      date: t.date,
    }));

    return NextResponse.json({
      lists: listsRes.data || [],
      transactions,
    });
  } catch {
    return NextResponse.json({ error: 'Error al cargar datos' }, { status: 500 });
  }
}

// Ejecutar acciones de crear/borrar listas y recibos o migrar datos de prueba
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await req.json();
    const { action } = body;

    if (action === 'sync_initial') {
      const lists = Array.isArray(body.lists) ? body.lists : [];
      const transactions = Array.isArray(body.transactions) ? body.transactions : [];

      if (lists.length > 0) {
        const listRows = lists.map((l: { id: string; name: string; icon: string }) => ({
          id: l.id,
          user_id: userId,
          name: l.name,
          icon: l.icon || '📁',
        }));
        await supabase.from('user_lists').upsert(listRows, { onConflict: 'user_id,id' });
      }

      if (transactions.length > 0) {
        const txRows = transactions.map(
          (t: { id: number; listId: string; text: string; amount: number; date: string }) => ({
            id: t.id,
            user_id: userId,
            list_id: t.listId,
            text: t.text,
            amount: t.amount,
            date: t.date,
          })
        );
        await supabase.from('user_transactions').upsert(txRows, { onConflict: 'user_id,id' });
      }

      return NextResponse.json({ ok: true });
    }

    if (action === 'add_transaction') {
      const { transaction } = body;
      const { error } = await supabase.from('user_transactions').insert({
        id: transaction.id,
        user_id: userId,
        list_id: transaction.listId,
        text: transaction.text,
        amount: transaction.amount,
        date: transaction.date,
      });

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true });
    }

    if (action === 'delete_transaction') {
      const { id } = body;
      const { error } = await supabase
        .from('user_transactions')
        .delete()
        .eq('user_id', userId)
        .eq('id', id);

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true });
    }

    if (action === 'add_list') {
      const { list } = body;
      const { error } = await supabase.from('user_lists').insert({
        id: list.id,
        user_id: userId,
        name: list.name,
        icon: list.icon || '📁',
      });

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true });
    }

    if (action === 'delete_list') {
      const { listId } = body;
      await supabase
        .from('user_transactions')
        .delete()
        .eq('user_id', userId)
        .eq('list_id', listId);

      const { error } = await supabase
        .from('user_lists')
        .delete()
        .eq('user_id', userId)
        .eq('id', listId);

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}