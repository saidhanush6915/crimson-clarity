import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-extrabold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-elegant"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "HemoAI — Smart Blood Group Detection" },
      { name: "description", content: "AI-powered blood group prediction from sample images. Fast, accurate, clinic-friendly." },
      { property: "og:title", content: "HemoAI — Smart Blood Group Detection" },
      { name: "twitter:title", content: "HemoAI — Smart Blood Group Detection" },
      { property: "og:description", content: "AI-powered blood group prediction from sample images. Fast, accurate, clinic-friendly." },
      { name: "twitter:description", content: "AI-powered blood group prediction from sample images. Fast, accurate, clinic-friendly." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/cf8fbe2d-6e4a-4845-ac34-bff5f0cb53e5/id-preview-666bfa5f--0233fde7-533c-47b3-8d17-07a23110d8c1.lovable.app-1777016066952.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/cf8fbe2d-6e4a-4845-ac34-bff5f0cb53e5/id-preview-666bfa5f--0233fde7-533c-47b3-8d17-07a23110d8c1.lovable.app-1777016066952.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <Outlet />
    </div>
  );
}
