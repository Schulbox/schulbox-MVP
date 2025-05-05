import { createRequestHandler } from "@remix-run/vercel";
// @ts-ignore
import * as build from "../../build"; // je nach Build-Pfad ggf. anpassen

export default createRequestHandler({ build, mode: process.env.NODE_ENV });
