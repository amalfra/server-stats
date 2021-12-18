import React from 'react';
import {
  Grid, Segment, Header, Icon,
} from 'semantic-ui-react';

import CpuUsageComponent from '../components/CpuUsage';
import OverallMemoryUsageComponent from '../components/OverallMemoryUsage';

const Dashboard = function () {
  return (
    <section id="dashboard">
      <Grid container>
        <Grid.Row>
          <Grid.Column>
            <Header as="h4" attached="top">
              <Icon name="microchip" />
              {' '}
              CPU usage percentage
            </Header>
            <Segment attached>
              <CpuUsageComponent />
            </Segment>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column width={16}>
            <Header as="h4" attached="top">
              <Icon name="server" />
              {' '}
              Memory and Swap usage
            </Header>
            <Segment attached>
              <OverallMemoryUsageComponent />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </section>
  );
};

Dashboard.isPrivate = true;

export default Dashboard;
