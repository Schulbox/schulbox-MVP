import { getAuthUrl } from '~/lib/shopify/auth.server';
import { type LoaderFunctionArgs, redirect } from '@remix-run/node';

export async function loader({ request }: LoaderFunctionArgs) {
  const redirectUrl = await getAuthUrl(request);
  return redirect(redirectUrl);
}
