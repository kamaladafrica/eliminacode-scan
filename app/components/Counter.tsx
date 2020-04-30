import React, { useState } from 'react';
import logo from '../../resources/logo.svg';
import styles from './Counter.css';
import TextAttesa from './TextAttesa';

type Props = {
  newTag: () => void;
  progressivo: number;
  fila: number;
  tempoStimato: number;
  last: number;
  next: number;
  disableTime?: number;
};

const Counter = (props: Props) => {
  const {
    progressivo,
    fila,
    tempoStimato,
    newTag,
    disableTime,
    last,
    next,
  } = props;

  const [disabled, setDisabled] = useState(false);

  const onClick = () => {
    newTag();
    setDisabled(true);
    setTimeout(() => setDisabled(false), disableTime);
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center h-100">
      <div
        className={`${styles.card} card text-center shadow-lg rounded-lg border-0`}
      >
        <h1 className="card-header p-4 text-primary font-weight-bold">
          <img className="align-bottom" src={logo} alt="" /> City Capena
        </h1>
        <div className="card-body d-flex flex-column justify-content-between align-items-center">
          <h1 className="card-title font-weight-bold">
            <span className={styles['current-number']}>{progressivo}</span>
          </h1>
          <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            tabIndex={-1}
            className={`${styles['new-number']} btn btn-primary btn-lg w-50 h-25 mt-0 mb-5 text-nowrap`}
          >
            {disabled && (
              <span
                className={`${styles.spinner} spinner-border align-baseline mr-3`}
                role="status"
                aria-hidden="true"
              />
            )}
            Prendi numero
          </button>
        </div>
        <div className={`${styles['card-footer']} card-footer text-muted`}>
          <div className={`d-flex justify-content-between align-items-center`}>
            <div>
              <div>Hai {fila} persone davanti</div>
              {tempoStimato > 0 && (
                <div>
                  <TextAttesa minuti={tempoStimato} />
                </div>
              )}
            </div>
            <div className="d-flex justify-content-end align-items-end text-muted">
              <h2>
                Stiamo per servire il numero{' '}
                <span className={`${styles['text-lg']} font-weight-bold`}>
                  {next}
                </span>
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Counter.defaultProps = {
  disableTime: 2000,
} as Pick<Props, 'disableTime'>;

export default Counter;
