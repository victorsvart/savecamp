import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Route, Routes } from "react-router";

import "./index.css";
import RootRedirect from "./App.tsx";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { AppLayout } from "@/layouts/AppLayout.tsx";
import { createQueryClient } from "@/lib/query.ts";
import { Home } from "./routes/home/Home.tsx";
import { DetectionPage } from "./routes/home/DetectionPage.tsx";
import { NotFound } from "./routes/not-found/NotFound.tsx";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import { Toaster } from "./components/ui/toast.tsx";

const Router =
  window.location.protocol === "file:" ? HashRouter : BrowserRouter;

const queryClient = createQueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster>
            <Router>
              <Routes>
                <Route path="/" element={<RootRedirect />} />
                <Route element={<AppLayout />}>
                  <Route path="/home" element={<Home />} />
                  <Route
                    path="/home/:gameSlug/detection"
                    element={<DetectionPage />}
                  />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Router>
          </Toaster>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
