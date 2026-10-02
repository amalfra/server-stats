import React from 'react';
import { number, string } from 'prop-types';
import { Progress, Stack, Text } from '@mantine/core';

import Utils from '../Utils';

const MemoryUsage = function ({ memoryTotal, memoryUsed, memoryColour }) {
  return (
    <article id="memory-usage">
      {memoryTotal > 0
        ? (
          <Stack gap={4}>
            <Progress value={(memoryUsed / memoryTotal).toFixed(2) * 100} color={memoryColour} size="sm" />
            <Text size="sm">
            {Utils.humanMemorySize(memoryUsed)}
            {' of '}
            {Utils.humanMemorySize(memoryTotal)}
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

MemoryUsage.propTypes = {
  memoryTotal: number.isRequired,
  memoryUsed: number.isRequired,
  memoryColour: string.isRequired,
};

export default MemoryUsage;
