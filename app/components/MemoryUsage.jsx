import React from 'react'
import { Progress, Label } from 'semantic-ui-react'

import OverallMemoryUsageStore from '../stores/OverallMemoryUsage'

import Utils from '../Utils'

class MemoryUsage extends React.Component {
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
      <article id='memory-usage'>
        { this.state.memoryTotal > 0 ?
          <Progress percent={(this.state.memoryUsed/this.state.memoryTotal)
            .toFixed(2) * 100}
            color={this.state.memoryColours.mem} size='small'>
            {(this.state.memoryUsed/this.state.memoryTotal).toFixed(2) * 100}%
            <br />{Utils.humanMemorySize(this.state.memoryUsed)}&nbsp;of&nbsp;{Utils.humanMemorySize(this.state.memoryTotal)}
          </Progress> :
          <Progress percent={0} color={this.state.memoryColours.mem}
            size='small'>
            0%<br />0MB of 0MB
          </Progress>
        }
      </article>
    )
  }
}

export default MemoryUsage
