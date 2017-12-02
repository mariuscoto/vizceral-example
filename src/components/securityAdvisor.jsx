'use strict';

import React from 'react';
import request from 'superagent';

import './securityAdvisor.css';

class SecurityAdvisor extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      sgs: [],
      ports: {}
    };
  }

  componentDidMount () {
    request.get('http://localhost:2000/sg')
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (res && res.status === 200) {
          // Save SG
          this.setState({ sgs: res.body });
          // Get port usage
          const ports = {};
          res.body.forEach((sg) => {
            request.get(`http://localhost:2000/inbound?sgID=${sg.GroupId}`)
              .set('Accept', 'application/json')
              .end((error, result) => {
                ports[sg.GroupId] = result.body;
                this.setState({ ports: ports });
              });
          });
        }
      });
  }

  render () {
    return (<div id='security-advisor'>
      <h1>Security Advisor</h1>
      { this.state.sgs.map((sg, i) => (<div key={i}>
          <h2>{sg.GroupName}</h2>
          <table className='sg-table'>
            <tbody>
              <tr className='sg-tr-header'>
                <td className='sg-td-header'>PORT</td>
                <td className='sg-td-header'>DESTINATION</td>
                <td className='sg-td-header'>RECOMMANDATION</td>
              </tr>

              { sg.IpPermissions.map((rule, j) => {
                let port = '';
                let destination = '';
                let recommandation = 'This port is NOT used. It can be CLOSED.';

                if (rule.IpProtocol === '-1') { port = 'ALL'; } else { port = `${rule.FromPort}`; }
                if (rule.UserIdGroupPairs.length !== 0) {
                  destination = rule.UserIdGroupPairs[0].GroupId.toString();
                } else {
                  destination = rule.IpRanges[0].CidrIp.toString();
                }
                if (sg.GroupId in this.state.ports && this.state.ports[sg.GroupId].indexOf(port) > -1) {
                  recommandation = 'This port is in use.';
                }

                return (<tr key={j}>
                  <td>{port}</td>
                  <td>{destination}</td>
                  <td>{recommandation}</td>
                </tr>);
              })}
            </tbody>
          </table>
        </div>))}
    </div>);
  }
}

SecurityAdvisor.propTypes = {
};

export default SecurityAdvisor;
