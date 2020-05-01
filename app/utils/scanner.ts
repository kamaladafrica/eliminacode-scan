import { app, BrowserWindow, dialog, ipcRenderer, shell } from 'electron';
import SerialPort, { parsers } from 'serialport';
import { bruciaTag } from '../api/api';
import env from '../environment';

const CLEAR_DONE_TIMEOUT = 60000;

const findReader = ({ vendorId, productId }: Device) =>
  vendorId === env.reader.vendorId && productId === env.reader.productId;

enum Event {
  SCAN_READ = 'scan-read',
}

export enum Result {
  SUCCESS = 'success',
  CONNECTION_ERROR = 'connection-error',
  FAILED = 'failed',
}

type Device = {
  manufacturer: string;
  serialNumber: string;
  pnpId?: string;
  locationId?: string;
  vendorId: string;
  productId: string;
  path: string;
};

type Done = { [key: string]: boolean };
const done: Done = {};

export const setupScannerMain = async (win: BrowserWindow) => {
  const devices = (await SerialPort.list()) as Device[];
  const reader = devices
    .filter((device) => device.serialNumber)
    .find(findReader);

  if (!reader) {
    dialog.showErrorBox(
      'Impossibile trovare il lettore di QRCode',
      "Collegare il lettore all'USB e riavviare l'applicazione"
    );
    app.exit(1);
  } else {
    console.log(reader);
    const parser = new parsers.Readline({ delimiter: '\r' });
    const port = new SerialPort(reader.path);
    port.pipe(parser);
    parser.on('data', async (data) => {
      console.log(data);
      const isDone = done[data] ?? false;
      if (!isDone) {
        done[data] = true;
        const success = await bruciaTag(data);
        const result =
          success === true
            ? Result.SUCCESS
            : success === false
            ? Result.FAILED
            : Result.CONNECTION_ERROR;

        if (result === Result.CONNECTION_ERROR) {
          done[data] = false;
        }

        if (result === Result.FAILED) {
          shell.beep();
        }

        setTimeout(() => delete done[data], CLEAR_DONE_TIMEOUT);

        win.webContents.send(Event.SCAN_READ, result);
      }
    });
  }
};

export const setupScannerRenderer = (callback: (data: string) => void) => {
  ipcRenderer.on(Event.SCAN_READ, (_, data: string) => {
    callback(data);
  });
};
