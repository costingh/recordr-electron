import { app as i, ipcMain as r, desktopCapturer as p, BrowserWindow as a } from "electron";
import { fileURLToPath as u } from "node:url";
import t from "node:path";
const l = t.dirname(u(import.meta.url));
process.env.APP_ROOT = t.join(l, "..");
const c = process.env.VITE_DEV_SERVER_URL, g = t.join(process.env.APP_ROOT, "dist-electron"), d = t.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = c ? t.join(process.env.APP_ROOT, "public") : d;
let n, e;
function h() {
  n = new a({
    width: 350,
    height: 350,
    minHeight: 350,
    minWidth: 350,
    frame: !1,
    hasShadow: !1,
    transparent: !0,
    alwaysOnTop: !0,
    focusable: !0,
    icon: t.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0,
      // devTools: true,
      preload: t.join(l, "preload.mjs")
    }
  }), e = new a({
    width: 300,
    height: 300,
    minHeight: 70,
    maxHeight: 300,
    minWidth: 300,
    maxWidth: 300,
    frame: !1,
    transparent: !0,
    alwaysOnTop: !0,
    focusable: !0,
    resizable: !1,
    skipTaskbar: !0,
    icon: t.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0,
      preload: t.join(l, "preload.mjs")
    }
  }), n.setVisibleOnAllWorkspaces(!0, { visibleOnFullScreen: !0 }), n.setAlwaysOnTop(!0, "screen-saver", 1), e.setVisibleOnAllWorkspaces(!0, { visibleOnFullScreen: !0 }), e.setAlwaysOnTop(!0, "screen-saver", 1), n.webContents.on("did-finish-load", () => {
    n == null || n.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send(
      "main-process-message",
      (/* @__PURE__ */ new Date()).toLocaleString()
    );
  }), e.webContents.once("did-finish-load", () => {
    if (e && process.platform !== "darwin") {
      e.setBounds({ x: 100, y: 100, width: 400, height: 400 });
      try {
        e.setShape([
          { x: 148, y: 150, width: 103, height: 100 },
          // Circle camera
          { x: 132, y: 230, width: 135, height: 76 }
          // Control bar
        ]);
      } catch {
        console.warn("setShape is not supported, falling back to ignoreMouseEvents"), e.setIgnoreMouseEvents(!0, { forward: !0 });
      }
    }
  }), c ? (n.loadURL(c), e.loadURL("http://localhost:5173/studio.html")) : (n.loadFile(t.join(d, "index.html")), e.loadFile(t.join(d, "studio.html")));
}
i.on("window-all-closed", () => {
  process.platform !== "darwin" && (i.quit(), n = null, e = null);
});
r.on("closeApp", () => {
  process.platform !== "darwin" && (i.quit(), n = null, e = null);
});
r.handle("getSources", async () => await p.getSources({
  thumbnailSize: { height: 100, width: 150 },
  fetchWindowIcons: !0,
  types: ["window", "screen"]
}));
r.on("media-sources", (s, o) => {
  console.log("EVENT:media sources", o), e == null || e.webContents.send("profile-received", o);
});
r.on("resize-studio", (s, o) => {
  console.log("EVENT: resize studio", o), o.shrink && (e == null || e.setSize(400, 100)), o.shrink || e == null || e.setSize(400, 250);
});
r.on("hide-plugin", (s, o) => {
  console.log(s), n == null || n.webContents.send("hide-plugin", o);
});
i.on("activate", () => {
  a.getAllWindows().length === 0 && h();
});
i.whenReady().then(h);
export {
  g as MAIN_DIST,
  d as RENDERER_DIST,
  c as VITE_DEV_SERVER_URL
};
