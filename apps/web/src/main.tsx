import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, HashRouter, Route, Routes } from "react-router";

import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { MinecraftDetection } from "./routes/home/minecraft/MinecraftDetection.tsx";
import { Home } from "./routes/home/Home.tsx";
import { NotFound } from "./routes/not-found/NotFound.tsx";
import { BigWalkDetection } from "./routes/home/bigwalk/BigWalkDetection.tsx";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import { Toaster } from "./components/ui/toast.tsx";

const Router =
  window.location.protocol === "file:" ? HashRouter : BrowserRouter;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster>
          <Router>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/home" element={<Home />} />
              <Route
                path="/home/minecraft/detection"
                element={<MinecraftDetection />}
              />
              <Route
                path="/home/bigwalk/detection"
                element={<BigWalkDetection />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </Toaster>
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>
);
