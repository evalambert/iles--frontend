//middleweare.js

import { defineMiddleware } from "astro/middleware";

export const onRequest = defineMiddleware(({ url, redirect }, next) => {
  const lang = url.pathname.split("/")[1];
  if (!["fr", "en"].includes(lang)) {
    return redirect(`/fr${url.pathname}`);
  }
  return next();
});
