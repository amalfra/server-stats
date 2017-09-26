import React from 'react'
import { Progress, Label } from 'semantic-ui-react'

import OverallMemoryUsageStore from '../stores/OverallMemoryUsage'

import Utils from '../Utils'

class SwapUsage extends React.Component {
  constructor(props) {
    super(props)

    this.state = OverallMemoryUsageStore.getState()
    this.onChange = this.onChange.bind(this)
  }

  componentDidMount() {
    OverallMemoryUsageStore.listen(this.onChange)
  }

  componentWillUnmount() {
    OverallMemoryUsageStore.unlisten(this.onChange)
  }

  onChange(state) {
    this.setState(state)
  }

  render() {
    return(
      <article id='swap-usage'>
        { this.state.swapTotal > 0 ?
          <Progress percent={(this.state.swapUsed/this.state.swapTotal)
            .toFixed(2) * 100}
            color={this.state.memoryColours.swap} size='small'>
            {(this.state.swapUsed/this.state.swapTotal).toFixed(2) * 100}%<br />
            {Utils.humanMemorySize(this.state.swapUsed)}&nbsp;of&nbsp;{Utils.humanMemorySize(this.state.swapTotal)}
          </Progress> :
          <Progress percent={0} color={this.state.memoryColours.swap}
            size='small'>
            0%<br />0MB of 0MB
          </Progress>
        }
      </article>
    )
  }
}

export default SwapUsage
