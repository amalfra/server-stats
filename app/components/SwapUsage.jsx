import React from 'react';
import { number, string } from 'prop-types';
import { Progress } from 'semantic-ui-react';

import Utils from '../Utils';

const SwapUsage = function ({ swapTotal, swapUsed, memoryColour }) {
  return (
    <article id="swap-usage">
      {swapTotal > 0
        ? (
          <Progress
            percent={(swapUsed / swapTotal)
              .toFixed(2) * 100}
            color={memoryColour}
            size="small"
          >
            {(swapUsed / swapTotal).toFixed(2) * 100}
            %
            <br />
            {Utils.humanMemorySize(swapUsed)}
&nbsp;of&nbsp;
            {Utils.humanMemorySize(swapTotal)}
          </Progress>
        )
        : (
          <Progress
            percent={0}
            color={memoryColour}
            size="small"
          >
            0%
            <br />
            0MB of 0MB
          </Progress>
        )}
    </article>
  );
};

SwapUsage.propTypes = {
  swapTotal: number.isRequired,
  swapUsed: number.isRequired,
  memoryColour: string.isRequired,
};

export default SwapUsage;
