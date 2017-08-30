import React from 'react'

import { Line as LineChart } from 'react-chartjs-2'

import DashboardActions from '../actions/Dashboard'
import AppStore from '../stores/App'

class Dashboard extends React.Component {
  constructor() {
    super()

    this.appState = AppStore.getState()

    // TODO: replace with original data
    this.chartData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First dataset',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [65, 59, 80, 81, 56, 55, 40]
        }
      ]
    }
  }

  render() {
    return(
      <section id='dashboard'>
        <LineChart data={this.chartData} width={600} height={250} />
      </section>
    )
  }
}

Dashboard.isPrivate = true

export default Dashboard
