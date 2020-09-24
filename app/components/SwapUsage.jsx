import React from 'react';
import { Progress } from 'semantic-ui-react';

import OverallMemoryUsageStore from '../stores/OverallMemoryUsage';
import Utils from '../Utils';

class SwapUsage extends React.Component {
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
    const { swapTotal, swapUsed, memoryColours } = this.state;

    return (
      <article id="swap-usage">
        {swapTotal > 0
          ? (
            <Progress
              percent={(swapUsed / swapTotal)
                .toFixed(2) * 100}
              color={memoryColours.swap}
              size="small"
            >
              {(swapUsed / swapTotal).toFixed(2) * 100}
              %
              <br />
              {Utils.humanMemorySize(swapUsed)}
&nbsp;of&nbsp;
              {Utils.humanMemorySize(swapTotal)}
            </Progress>
          )
          : (
            <Progress
              percent={0}
              color={memoryColours.swap}
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

export default SwapUsage;
