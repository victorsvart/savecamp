import * as React from "react";
import { ActivityPulse } from "@/components/activity-pulse";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ActivityProvider } from "@/contexts/activity-context";
import { useTheme } from "@/components/theme-provider";
import { gameToSlug, getDetectionPath, isGameSupported } from "@/lib/games";
import { GAMES } from "@savecamp/types";
import { MoonIcon, SunIcon } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const resolvedTheme =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
  const Icon = resolvedTheme === "dark" ? SunIcon : MoonIcon;

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setTheme(nextTheme)}
            aria-label={
              nextTheme === "dark" ? "Ativar modo escuro" : "Ativar modo claro"
            }
          />
        }
      >
        <Icon className="size-4" />
      </TooltipTrigger>
      <TooltipContent>
        Alternar tema <Kbd className="ml-1">d</Kbd>
      </TooltipContent>
    </Tooltip>
  );
}

function AppShell() {
  const location = useLocation();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "13rem",
        } as React.CSSProperties
      }
    >
      <Sidebar collapsible="offcanvas" variant="sidebar">
        <SidebarHeader className="border-b px-3 py-3">
          <Link
            to="/home"
            className="font-heading text-sm font-medium tracking-tight text-sidebar-foreground lowercase"
          >
            savecamp
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-[11px] tracking-wide text-muted-foreground uppercase">
              Jogos
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {GAMES.map((game) => {
                  const slug = gameToSlug(game);
                  const path = getDetectionPath(slug);
                  const isActive = location.pathname.startsWith(path);
                  const supported = isGameSupported(slug);

                  return (
                    <SidebarMenuItem key={game}>
                      <SidebarMenuButton
                        isActive={isActive}
                        render={<Link to={path} />}
                        className="font-normal"
                      >
                        <span className="flex w-full items-center justify-between gap-2">
                          <span>{game}</span>
                          {!supported && (
                            <span className="text-[10px] text-muted-foreground">
                              em breve
                            </span>
                          )}
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="min-h-svh">
        <header className="flex h-11 shrink-0 items-center gap-2 border-b px-3 sm:px-4">
          <SidebarTrigger className="-ml-1 md:hidden" />
          <Separator orientation="vertical" className="mr-1 h-4 md:hidden" />
          <ActivityPulse className="min-w-0 flex-1" />
          <ThemeToggle />
        </header>
        <div className="flex min-h-0 flex-1 flex-col overflow-auto p-3 sm:p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export function AppLayout() {
  return (
    <ActivityProvider>
      <AppShell />
    </ActivityProvider>
  );
}
