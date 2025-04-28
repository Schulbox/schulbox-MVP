import { createRequestHandler } from "@remix-run/express";
import express from "express";
import * as build from "@remix-run/dev/server-build";

const app = express();
app.use(express.static("public"));

// Alle Anfragen an Remix weiterleiten
app.all("*", createRequestHandler({ build }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
