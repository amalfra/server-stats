import React from 'react';
import { number, string } from 'prop-types';
import { Progress } from 'semantic-ui-react';

import Utils from '../Utils';

const MemoryUsage = function ({ memoryTotal, memoryUsed, memoryColour }) {
  return (
    <article id="memory-usage">
      {memoryTotal > 0
        ? (
          <Progress
            percent={(memoryUsed / memoryTotal)
              .toFixed(2) * 100}
            color={memoryColour}
            size="small"
            progress
          >
            {Utils.humanMemorySize(memoryUsed)}
&nbsp;of&nbsp;
            {Utils.humanMemorySize(memoryTotal)}
          </Progress>
        )
        : (
          <Progress
            percent={0}
            color={memoryColour}
            size="small"
            progress
          >
            0MB of 0MB
          </Progress>
        )}
    </article>
  );
};

MemoryUsage.propTypes = {
  memoryTotal: number.isRequired,
  memoryUsed: number.isRequired,
  memoryColour: string.isRequired,
};

export default MemoryUsage;
