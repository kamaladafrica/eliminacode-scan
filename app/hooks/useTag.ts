import { useCallback, useEffect, useState } from 'react';
import * as api from '../api/api';
import env from '../environment';

const STATS_DELAY = env.fetchStatsDelay;

type TagHookReturn = [State, () => void];

export type State = {
  fila: number[];
  posizione: number;
  tempoMedio: number;
  tempoStimato: number;
  tempoLimite: Date;
  loaded: boolean;
  progressivo: number;
  lastBruciato: number;
  prossimo: number;
};

const EMPTY_STATE: State = {
  fila: [],
  loaded: false,
  posizione: 0,
  tempoLimite: new Date(),
  tempoMedio: 0,
  tempoStimato: 0,
  progressivo: 1,
  lastBruciato: 0,
  prossimo: 1,
};

const toState = ({
  fila,
  tempoStimato,
  tempoLimite,
  progressivo,
  lastBruciato,
}: api.Stats): State => ({
  progressivo,
  posizione: fila.length,
  tempoMedio: tempoStimato,
  tempoStimato: fila.length * tempoStimato,
  tempoLimite,
  fila,
  loaded: true,
  lastBruciato,
  prossimo: fila[0] ?? progressivo,
});

type PrintTagAction = (progressivo: number, qrCodeImageUrl: string) => void;

export const useTag = (printTag: PrintTagAction): TagHookReturn => {
  const [state, setState] = useState(EMPTY_STATE);

  const fetchStats = async () => {
    const stats = await api.stats();
    const newState = toState(stats);
    setState(newState);
    return newState;
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, STATS_DELAY);
    return () => clearInterval(interval);
  }, []);

  const newTag = useCallback(async () => {
    try {
      const tag = await api.newTag();
      printTag(tag.progressivo, tag.qrCodeImageUrl);
      fetchStats();
    } catch (error) {
      console.log(error);
      // clearTagState();
    }
  }, [state]);

  return [state, newTag];
};
