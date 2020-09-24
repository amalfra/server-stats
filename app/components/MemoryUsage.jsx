import React from 'react';
import { Progress } from 'semantic-ui-react';

import OverallMemoryUsageStore from '../stores/OverallMemoryUsage';
import Utils from '../Utils';

class MemoryUsage extends React.Component {
  constructor(props) {
    super(props);

    this.state = OverallMemoryUsageStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    OverallMemoryUsageStore.listen(this.onChange);
  }

  componentWillUnmount() {
    OverallMemoryUsageStore.unlisten(this.onChange);
  }

  onChange = (state) => {
    this.setState(state);
  };

  render() {
    const { memoryTotal, memoryUsed, memoryColours } = this.state;

    return (
      <article id="memory-usage">
        {memoryTotal > 0
          ? (
            <Progress
              percent={(memoryUsed / memoryTotal)
                .toFixed(2) * 100}
              color={memoryColours.mem}
              size="small"
            >
              {(memoryUsed / memoryTotal).toFixed(2) * 100}
              %
              <br />
              {Utils.humanMemorySize(memoryUsed)}
&nbsp;of&nbsp;
              {Utils.humanMemorySize(memoryTotal)}
            </Progress>
          )
          : (
            <Progress
              percent={0}
              color={memoryColours.mem}
              size="small"
            >
              0%
              <br />
              0MB of 0MB
            </Progress>
          )}
      </article>
    );
  }
}

export default MemoryUsage;
