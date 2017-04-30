'use strict';

import React from 'react';
import request from 'superagent';

class Nodes extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      nodes: [],
      services: {},
    };
  }

  componentDidMount () {
    request.get('http://localhost:3000/nodes')
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (res && res.status === 200) {
          const serviceNames = {};
          res.body.forEach((node) => {
            if (node.type === 'instance') {
              if (!(node.service in serviceNames)) {
                serviceNames[node.service] = [];
              }
              serviceNames[node.service].push(node.name);
            }
          });

          this.setState({
            nodes: res.body,
            services: serviceNames
          });
        }
      });
  }

  render () {
    return (<div id='security-advisor'>
      <h1>Instances</h1>
      <table className='sg-table'>
        <tbody>
          <tr className='sg-tr-header'>
            <td className='sg-td-header'>NAME</td>
            <td className='sg-td-header'>IP</td>
            <td className='sg-td-header'>CONNECTION</td>
          </tr>
          { this.state.nodes.map((node, i) => {
            if (node.type === 'instance') {
              return (<tr key={i}>
                <td>{node.name}</td>
                <td>{node.private_ip}</td>
                <td>{node.connectionDetails}</td>
              </tr>);
            }
            return null;
          })}
        </tbody>
      </table>

      <h1>Services</h1>
      <table className='sg-table'>
        <tbody>
          <tr className='sg-tr-header'>
            <td className='sg-td-header'>NAME</td>
            <td className='sg-td-header'>INSTANCES</td>
            <td className='sg-td-header'>COUNT</td>
          </tr>
          { Object.keys(this.state.services).map((key, i) => {
            return (<tr key={i}>
              <td>{key}</td>
              <td>{this.state.services[key].join("\n")}</td>
              <td>{this.state.services[key].length}</td>
            </tr>);
          })}
        </tbody>
      </table>
    </div>);
  }
}

Nodes.propTypes = {
};

export default Nodes;
