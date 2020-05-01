import React, { ChangeEvent, useCallback, useState } from 'react';
import logger from '../utils/logger';
import logo from '../../resources/logo.svg';

export default () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center h-100 w-100">
      <img
        className="align-bottom"
        src={logo}
        alt=""
        style={{ height: '5rem' }}
      />
      <h1
        className="text-primary font-weight-bold"
        style={{ fontSize: '6rem' }}
      >
        City Capena
      </h1>
    </div>
  );
};
