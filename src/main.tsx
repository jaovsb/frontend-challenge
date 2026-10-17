import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './app/query-client.ts'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './app/router.tsx'
import { worker } from './mocks/browser.ts'
import './index.css'

async function bootstrap() {
  await worker.start({
    onUnhandledFrame: "bypass",
  });

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  );
}

bootstrap();