import { handleCallback } from '../lib/shopify/auth.server';
import type { LoaderFunctionArgs } from '@remix-run/node';

export async function loader({ request }: LoaderFunctionArgs) {
  return handleCallback(request);
}
