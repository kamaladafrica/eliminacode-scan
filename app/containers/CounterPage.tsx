import React, { ChangeEvent, useCallback, useState } from 'react';

export default () => {
  const [text, setText] = useState('');
  const [code, setCode] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setText(code);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(e.key, e.keyCode);
    if (e.key === 'Enter') {
      const code = e.currentTarget.value;
      setCode((buf) => buf + '\n' + code);
      setText('');
    }
  };

  return (
    <div>
      <div className="form-group row">
        <div className="col-sm-10">
          <input
            type="text"
            className="form-control form-control-lg"
            onChange={onChange}
            onKeyDown={onKeyDown}
            value={text}
          />
          <button type="button" onClick={() => setCode('')}>
            Reset
          </button>
        </div>
      </div>
      <pre>{code}</pre>
    </div>
  );
};
