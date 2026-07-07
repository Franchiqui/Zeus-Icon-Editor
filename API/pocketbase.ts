import PocketBase from 'pocketbase';
import dotenv from 'dotenv';

dotenv.config();

const pbUrl = process.env.PB_URL || 'http://127.0.0.1:8090';
export const pb = new PocketBase(pbUrl);

export async function authAsAdmin() {
  const email = process.env.PB_ADMIN_EMAIL || 'francisco@gmail.com';
  const password = process.env.PB_ADMIN_PASSWORD || '1234512345';
  try {
    await pb.collection('_superusers').authWithPassword(email, password);
    console.log('[PocketBase] Admin autenticado');
  } catch {
    try {
      await pb.admins.authWithPassword(email, password);
      console.log('[PocketBase] Admin autenticado (legacy)');
    } catch (e) {
      console.warn('[PocketBase] No se pudo autenticar como admin:', e);
    }
  }
}
