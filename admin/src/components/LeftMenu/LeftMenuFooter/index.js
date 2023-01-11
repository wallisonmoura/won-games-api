import React from 'react';
import Wrapper, { A } from './Wrapper';

function LeftMenuFooter() {

  return (
    <Wrapper>
      <div className="poweredBy">
        <A key="website" href="https://github.com/wallisonmoura" target="_blank" rel="noopener noreferrer">
          Wallison Moura - Software Developer
        </A>
      </div>
    </Wrapper>
  );
}

export default LeftMenuFooter;
