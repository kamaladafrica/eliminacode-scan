import axios, { AxiosError } from 'axios';
import logger from '../utils/logger';

export const bruciaTag = async (url: string) => {
  try {
    await axios.get(url);
    return true;
  } catch (e) {
    const err = e as AxiosError<unknown>;
    logger.error(err.message);
    if (err.response) {
      return false;
    }
  }
};
