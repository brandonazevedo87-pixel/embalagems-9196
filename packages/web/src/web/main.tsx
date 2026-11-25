// Entry point referenced by index.html — composition only, real bootstrap
// lives in __main.tsx (template-managed).
import { authClient } from "./lib/auth";
if (location.pathname === "/admin") await authClient.managedAuth.handleRedirect().catch(() => {});
await import("./__main");
