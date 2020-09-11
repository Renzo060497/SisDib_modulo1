const { app, BrowserWindow, Menu, ipcMain } = require('electron');

const url = require('url');
const path = require('path');
// const zmq = require("zeromq"), sock = zmq.socket("push");

let mainWindow;
let newProductWindow;


if (process.env.NODE_ENV !== 'production') {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
    });
}


app.on('ready', () => {

    // The Main Window
    mainWindow = new BrowserWindow({ width: 1720, height: 1600 });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file',
        slashes: true
    }))

    // Menu
    const mainMenu = Menu.buildFromTemplate(templateMenu);
    // Set The Menu to the Main Window
    Menu.setApplicationMenu(mainMenu);

    // If we close main Window the App quit
    mainWindow.on('closed', () => {
        app.quit();
    });

});


function createNewProductWindow() {
    newProductWindow = new BrowserWindow({
        width: 600,
        height: 530,
        title: 'Add A New Product'
    });
    newProductWindow.setMenu(null);

    newProductWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/new-product.html'),
        protocol: 'file',
        slashes: true
    }));
    newProductWindow.on('closed', () => {
        newProductWindow = null;
    });
}

// Ipc Renderer Events
ipcMain.on('product:new', (e, newProduct) => {
    // send to the Main Window
    console.log(newProduct);
    mainWindow.webContents.send('product:new', newProduct);
    newProductWindow.close();
});


// Menu Template
const templateMenu = [{
    label: 'File',
    submenu: [{
            label: 'Nueva Orden',
            accelerator: 'Ctrl+N',
            click() {
                createNewProductWindow();
            }
        },
        {
            label: 'Eliminar todas las ordenes',
            click() {
                mainWindow.webContents.send('products:remove-all');
            }
        },
        {
            label: 'Salir',
            accelerator: process.platform == 'darwin' ? 'command+Q' : 'Ctrl+Q',
            click() {
                app.quit();
            }
        }
    ]
}];

// if you are in Mac, just add the Name of the App
if (process.platform === 'darwin') {
    templateMenu.unshift({
        label: app.getName(),
    });
};

// Developer Tools in Development Environment
if (process.env.NODE_ENV !== 'production') {
    templateMenu.push({
        label: 'DevTools',
        submenu: [{
                label: 'Show/Hide Dev Tools',
                accelerator: process.platform == 'darwin' ? 'Comand+D' : 'Ctrl+D',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}