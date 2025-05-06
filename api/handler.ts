import { createRequestHandler } from '@remix-run/vercel';
// @ts-ignore
import * as build from '../build'; // wichtig: korrektes Build-Verzeichnis

export default createRequestHandler({
  build,
  mode: process.env.NODE_ENV,
});
