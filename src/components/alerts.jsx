'use strict';

import React from 'react';
import request from 'superagent';


class Alerts extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      alerts: []
    };
  }

  componentDidMount () {
    request.get('http://localhost:3000/alerts')
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (res && res.status === 200) {
          const allAlerts = [];
          res.body.forEach((alert) => {
            alert.affected.forEach((node) => {
              allAlerts.push({
                type: alert.type,
                node: node.name
              });
            });
          });

          this.setState({ alerts: allAlerts });
        }
      });
  }

  render () {
    return (<div id='security-advisor'>
      <h1>Alerts</h1>
      <table className='sg-table'>
        <tbody>
          <tr className='sg-tr-header'>
            <td className='sg-td-header'>INSTANCE</td>
            <td className='sg-td-header'>ALERT</td>
            <td className='sg-td-header'>MESSAGE</td>
          </tr>
          { this.state.alerts.map((alert, j) => {
            let message = '';
            if (alert.type === 'instance_down') {
              message = 'Instance is unreachable.';
            }
            return (<tr key={j}>
              <td>{alert.node}</td>
              <td>{alert.type}</td>
              <td>{message}</td>
            </tr>);
          })}
        </tbody>
      </table>
    </div>);
  }
}

Alerts.propTypes = {
};

export default Alerts;
