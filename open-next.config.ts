import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Default single-Worker configuration. Incremental cache / R2 can be added
// later if the blog's static pages benefit from it; the site works without it.
export default defineCloudflareConfig({});
