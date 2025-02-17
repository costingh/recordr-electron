import { app, BrowserWindow, desktopCapturer, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import unhandled from 'electron-unhandled';

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.jsl̥
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null
let studio: BrowserWindow | null

async function setupUnhandled() {
    const { default: unhandled } = await import('electron-unhandled');

    unhandled({
        showDialog: true, // Show error dialog
        logger: console.error, // Log errors to console
        reportButton: (error) => {
            return `Report this error: ${error.message}`;
        },
    });
}

app.whenReady().then(setupUnhandled);

function createWindow() {
	win = new BrowserWindow({
		width: 350,
		height: 350,
		minHeight: 350,
		minWidth: 350,
		frame: false,
		hasShadow: false,
		transparent: true,
		alwaysOnTop: true,
		focusable: true,
		icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			// devTools: true,
			preload: path.join(__dirname, 'preload.mjs'),
		},
	})

	studio = new BrowserWindow({
		width: 300,
		height: 300,
		minHeight: 70,
		maxHeight: 300,
		minWidth: 300,
		maxWidth: 300,
		frame: false,
		transparent: true,
		alwaysOnTop: true,
		focusable: true,
		resizable: false,
		skipTaskbar: true,
		icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			preload: path.join(__dirname, "preload.mjs"),
		},
	});
	

	win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
	win.setAlwaysOnTop(true, 'screen-saver', 1)
	studio.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
	studio.setAlwaysOnTop(true, 'screen-saver', 1)
	// studio.setIgnoreMouseEvents(true, { forward: true })

	// Test active push message to Renderer-process.
	win.webContents.on('did-finish-load', () => {
		win?.webContents.send('main-process-message', (new Date).toLocaleString())
	})

	
	studio.webContents.on('did-finish-load', () => {
		studio?.webContents.send(
			'main-process-message',
			new Date().toLocaleString()
		)
	})

	studio.webContents.once("did-finish-load", () => {
		// Apply shape masking ONLY for Windows/Linux
		if(studio) {
			if (process.platform !== "darwin") {
				studio.setBounds({ x: 100, y: 100, width: 400, height: 400 });
	
				// Use setShape if Electron supports it
				try {
					studio.setShape([
						{ x: 148, y: 150, width: 103, height: 100 }, // Circle camera
						{ x: 132, y: 230, width: 135, height: 76 }, // Control bar
					]);
				} catch (error) {
					console.warn("setShape is not supported, falling back to ignoreMouseEvents");
					studio.setIgnoreMouseEvents(true, { forward: true });
				}
			}
		}
	});

	// win.webContents.once("did-finish-load", () => {
	// 	// Apply shape masking ONLY for Windows/Linux
	// 	if(win) {
	// 		if (process.platform !== "darwin") {
	// 			win.setBounds({ x: 100, y: 100, width: 400, height: 400 });
	
	// 			// Use setShape if Electron supports it
	// 			try {
	// 				win.setShape([
	// 					{ x: 148, y: 150, width: 103, height: 100 }, // Circle camera
	// 				]);
	// 			} catch (error) {
	// 				console.warn("setShape is not supported, falling back to ignoreMouseEvents");
	// 				win.setIgnoreMouseEvents(true, { forward: true });
	// 			}
	// 		}
	// 	}
	// });


	if (VITE_DEV_SERVER_URL) {
		win.loadURL(VITE_DEV_SERVER_URL)
		studio.loadURL(`${import.meta.env.VITE_APP_URL}/studio.html`)
	} else {
		// win.loadFile('dist/index.html')
		win.loadFile(path.join(RENDERER_DIST, 'index.html'))
		studio.loadFile(path.join(RENDERER_DIST, 'studio.html'))
	}
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
		win = null
		studio = null
	}
})

ipcMain.on('closeApp', () => {
	if (process.platform !== 'darwin') {
		app.quit()
		win = null
		studio = null
	}
})

ipcMain.handle('getSources', async () => {
	const data = await desktopCapturer.getSources({
		thumbnailSize: { height: 100, width: 150 },
		fetchWindowIcons: true,
		types: ['window', 'screen'],
	})
	return data
})

ipcMain.on('media-sources', (_, payload) => {
	console.log('EVENT:media sources', payload);
	studio?.webContents.send("profile-received", payload)
})

ipcMain.on('resize-studio', (_, payload) => {
	console.log('EVENT: resize studio', payload)
	if (payload.shrink) {
		studio?.setSize(400, 100)
	}
	if (!payload.shrink) {
		studio?.setSize(400, 250)
	}
})

ipcMain.on('hide-plugin', (event, payload) => {
	console.log(event)
	win?.webContents.send('hide-plugin', payload)
})

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})

app.whenReady().then(createWindow)
