// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  detectGame: (game: string) => ipcRenderer.invoke("detect-game", game),
  saveGameState: (gameName: string, basePath: string, saveFilePath: string) =>
    ipcRenderer.invoke("save-game-state", gameName, basePath, saveFilePath),
});
