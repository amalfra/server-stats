import React from 'react'
import { Grid, Segment, Header, Icon } from 'semantic-ui-react'

import CpuUsageComponent from '../components/CpuUsage'

class Dashboard extends React.Component {
  constructor() {
    super()
  }

  render() {
    return(
      <section id='dashboard'>
        <Grid container>
          <Grid.Row>
            <Grid.Column>
              <Header as='h4' attached='top'>
                <Icon name='microchip' /> CPU usage percentage
              </Header>
              <Segment attached>
                <CpuUsageComponent />
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </section>
    )
  }
}

Dashboard.isPrivate = true

export default Dashboard
