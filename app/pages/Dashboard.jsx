import React from 'react';
import { Container, Group, Paper, Stack, Title } from '@mantine/core';
import { IconCpu, IconServer } from '@tabler/icons-react';

import CpuUsageComponent from '../components/CpuUsage';
import OverallMemoryUsageComponent from '../components/OverallMemoryUsage';

const Dashboard = function () {
  return (
    <section id="dashboard">
      <Container size="xl" py="md">
        <Stack gap="md">
          <Paper p="md" withBorder>
            <Group gap="xs" mb="md">
              <IconCpu size={20} />
              <Title order={4}>
              CPU usage percentage
              </Title>
            </Group>
            <div>
              <CpuUsageComponent />
            </div>
          </Paper>
          <Paper p="md" withBorder>
            <Group gap="xs" mb="md">
              <IconServer size={20} />
              <Title order={4}>
              Memory and Swap usage
              </Title>
            </Group>
            <div>
              <OverallMemoryUsageComponent />
            </div>
          </Paper>
        </Stack>
      </Container>
    </section>
  );
};

Dashboard.isPrivate = true;

export default Dashboard;
