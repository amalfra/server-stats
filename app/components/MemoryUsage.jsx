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
        <Progress value={this.state.memoryUsed}
          total={this.state.memoryTotal} precision={1}
          progress='percent' color={this.state.memoryColours.mem} />
        <Label className='pull-right'>
          Last updated: { this.state.updatedAgo ?
            this.state.updatedAgo + ' seconds ago' : 'not yet'
          }
        </Label>
        <br className='clearfix' />
      </article>
    )
  }
}

export default MemoryUsage
