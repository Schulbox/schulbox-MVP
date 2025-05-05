// app/routes/api/auth.ts
import { getAuthUrl } from '../../lib/shopify/auth.server';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';

export async function loader({ request }: LoaderFunctionArgs) {
  const redirectUrl = await getAuthUrl(request);
  return redirect(redirectUrl);
}

