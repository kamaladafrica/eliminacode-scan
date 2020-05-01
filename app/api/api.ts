import axios, { AxiosError } from 'axios';

export const bruciaTag = async (url: string) => {
  try {
    await axios.get(url);
    return true;
  } catch (e) {
    console.error(e);
    const err = e as AxiosError<unknown>;
    if (err.response) {
      return false;
    }
  }
};
