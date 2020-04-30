import { BrowserWindow, ipcMain, ipcRenderer, dialog } from 'electron';
import { writeFile } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

enum Event {
  PRINT = 'print-qrcode',
  PRINTED = 'printed-qrcode',
}

type PrintTagParams = {
  progressivo: number;
  qrCodeImageUrl: string;
};

export const printTag = (params: PrintTagParams) => {
  ipcRenderer.send(Event.PRINT, params);
};

export const setupPrinterMain = () => {
  ipcMain.on(Event.PRINT, async (event, params: PrintTagParams) => {
    try {
      const printerWindow = new BrowserWindow({ show: false });
      await printerWindow.loadURL(`file://${__dirname}/../qrcode.html`);
      await printerWindow.webContents.executeJavaScript(
        `set('${params.progressivo}', '${params.qrCodeImageUrl}');`
      );

      if (process.env.NODE_ENV === 'production') {
        printerWindow.webContents.print({ silent: true }, (success, error) => {
          printerWindow.webContents.send(Event.PRINTED, success, error, params);
          setTimeout(() => printerWindow.close(), 5000);
        });
      } else {
        const pdf = await printerWindow.webContents.printToPDF({});
        const pdfPath = join(tmpdir(), 'tag.pdf');
        writeFile(pdfPath, pdf, (err) => {
          console.log(err);
          event.reply(Event.PRINTED, err == null, err?.message, params);
          printerWindow.close();
        });
      }
    } catch (error) {}
  });
};

export const setupPrinterRenderer = () => {
  ipcRenderer.on(
    Event.PRINTED,
    (
      _,
      success: boolean,
      error: 'cancelled' | 'failed',
      params: PrintTagParams
    ) => {
      if (!success) {
        const { dialog } = require('electron').remote;
        dialog.showErrorBox(
          'Errore',
          'Si è verificato un problema durante la stampa. Verificare che la carta sia presente.'
        );
      }
      console.log(Event.PRINTED, success, error, params);
    }
  );
};
