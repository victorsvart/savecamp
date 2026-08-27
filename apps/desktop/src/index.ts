import "dotenv/config";
import type { AppId } from "@savecamp/types";
import { app, BrowserWindow, ipcMain } from "electron";
import fs from "node:fs";
import path from "node:path";
import { detectGame } from "./functions/detect-game";
import { saveGameStateToCloud } from "./functions/save-game";

declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export const APP_ID: AppId = "desktop";

if (require("electron-squirrel-startup")) {
  app.quit();
}

function getRendererHtml(): string {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "renderer", "index.html");
  }

  return path.join(__dirname, "../../renderer/index.html");
}

const createWindow = (): void => {
  const rendererHtml = getRendererHtml();
  if (!fs.existsSync(rendererHtml)) {
    throw new Error(
      `Renderer not found at ${rendererHtml}. Run the web build first (pnpm --filter @savecamp/web build).`
    );
  }

  const mainWindow = new BrowserWindow({
    height: 680,
    width: 960,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  void mainWindow.loadFile(rendererHtml);
  mainWindow.webContents.openDevTools();
};

ipcMain.handle("detect-game", (_event, game: string) => {
  return detectGame(game);
});

ipcMain.handle(
  "save-game-state",
  async (_event, gameName: string, basePath: string, saveFilePath: string) => {
    return saveGameStateToCloud(gameName, basePath, saveFilePath);
  }
);

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
