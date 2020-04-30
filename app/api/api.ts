import env from '../environment';
import { toDataURL } from '../utils/utils';

export const newTag = async () => {
  const response = await fetch(`${env.baseUrl}/tags`, { method: 'POST' });
  const json = await bodyOf(response);
  return json && toTag(json);
};

export const fetchTag = async (key: string) => {
  const response = await fetch(`${env.baseUrl}/tags/${key}`);
  const json = await bodyOf(response);
  return json && toTag(json);
};

export const checkTag = async (key: string) => {
  const response = await fetch(`${env.baseUrl}/tags/${key}/check`);
  await bodyOf(response, async () => {});
};

export const stats = async () => {
  const response = await fetch(`${env.baseUrl}/stats`);
  const json = await bodyOf(response);
  return json && toStats(json);
};

export const qrCodeImageUrl = async (
  key: string,
  size: number = env.qrCodeSize
) => {
  const response = await fetch(`${env.baseUrl}/tags/${key}.png?s=${size}`);
  const blob = await bodyOf(response, (r) => r.blob());
  return blob && toDataURL(blob);
};

export const annullaTag = (key: string) =>
  fetch(`${env.baseUrl}/tags/${key}`, { method: 'DELETE' });

const toTag = (json: any): Tag => ({
  key: json.key,
  progressivo: json.progressivo,
  staccato: new Date(json.staccato),
  qrCodeImageUrl: json.qrCodeImageUrl,
});

const toStats = (json: any): Stats => ({
  fila: json.fila,
  tempoStimato: json.tempoStimato,
  tempoLimite: new Date(json.tempoLimite),
  progressivo: json.progressivo,
  lastBruciato: json.lastBruciato,
});

export interface Tag {
  key: string;
  progressivo: number;
  staccato: Date;
  qrCodeImageUrl: string;
}

export interface Stats {
  fila: Array<number>;
  tempoStimato: number;
  tempoLimite: Date;
  progressivo: number;
  lastBruciato: number;
}

export interface TagCheck {
  isExpired: boolean;
}

const toJson = (res: Response) => res.json();

const bodyOf = async (response: Response, content = toJson) => {
  const { ok, status, statusText } = response;
  if (ok) {
    return content(response);
  }
  if (status === 403 || status === 404) {
    throw new Error(`${status} - ${statusText}`);
  }
  return null;
};
