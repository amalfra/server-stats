import React from 'react';
import { number, string } from 'prop-types';
import { Progress, Stack, Text } from '@mantine/core';

import Utils from '../Utils';

const SwapUsage = function ({ swapTotal, swapUsed, memoryColour }) {
  return (
    <article id="swap-usage">
      {swapTotal > 0
        ? (
          <Stack gap={4}>
            <Progress value={(swapUsed / swapTotal).toFixed(2) * 100} color={memoryColour} size="sm" />
            <Text size="sm">
            {Utils.humanMemorySize(swapUsed)}
            {' of '}
            {Utils.humanMemorySize(swapTotal)}
            </Text>
          </Stack>
        )
        : (
          <Stack gap={4}>
            <Progress value={0} color={memoryColour} size="sm" />
            <Text size="sm">0MB of 0MB</Text>
          </Stack>
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
