'use strict';

import React from 'react';
import request from 'superagent';

import './alerts.css';


class Alerts extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      alerts: {
        connections: [],
        instance_down: []
      }
    };
  }

  componentDidMount () {
    request.get('http://localhost:2000/alerts')
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (res && res.status === 200) {
          const allAlerts = {
            connections: [],
            instance_down: []
          };

          res.body.forEach((alert) => {
            alert.affected.forEach((node) => {
              allAlerts[alert.type].push({
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
      <h1>Set a new alert</h1>
      <form id="add-alert-form">
        <span>WHEN </span>
        <select name="who">
          <option value="ANY">ANY</option>
          <option value="apache-lb-1">apache-lb-1</option>
          <option value="php-app-1">php-app-1</option>
          <option value="php-app-2">php-app-2</option>
          <option value="mysql-db-1">mysql-db-1</option>
        </select>
        <br/>
        <span>HAS </span>
        <select name="what">
          <option value="state">state</option>
          <option value="conns">number of connections</option>
        </select>
        <br/>
        <select name="how">
          <option value="eq">equal to</option>
          <option value="lt">less than</option>
          <option value="gt">greater than</option>
        </select>
        <input name="value" placeholder="VALUE"></input>
      </form>

      <br/>
      <h1>Alerts</h1>
      <h3>Instance state</h3>
      <table className='sg-table'>
        <tbody>
          <tr className='sg-tr-header'>
            <td className='sg-td-header'>INSTANCE</td>
            <td className='sg-td-header'>ALERT</td>
            <td className='sg-td-header'>MESSAGE</td>
          </tr>
          { this.state.alerts.instance_down ? <tr><td colSpan={3}>NO ALERTS AT THIS TIME</td></tr> : null }
          { this.state.alerts.instance_down.map((alert, j) => (<tr key={j}>
              <td>{alert.node}</td>
              <td>instance_down</td>
              <td>Instance is unreachable.</td>
            </tr>))}
        </tbody>
      </table>

      <h3>Connections count</h3>
      <table className='sg-table'>
        <tbody>
          <tr className='sg-tr-header'>
            <td className='sg-td-header'>INSTANCE</td>
            <td className='sg-td-header'>ALERT</td>
            <td className='sg-td-header'>MESSAGE</td>
          </tr>
          { this.state.alerts.instance_down ? <tr><td colSpan={3}>NO ALERTS AT THIS TIME</td></tr> : null }
          { this.state.alerts.connections.map((alert, j) => (<tr key={j}>
              <td>{alert.node}</td>
              <td>connections</td>
              <td>Max connections reached.</td>
            </tr>))}
        </tbody>
      </table>
    </div>);
  }
}

Alerts.propTypes = {
};

export default Alerts;
