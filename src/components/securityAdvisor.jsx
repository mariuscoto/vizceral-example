'use strict';

import React from 'react';
import request from 'superagent';

import './securityAdvisor.css';

class SecurityAdvisor extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      sgs: [],
    };
  }

  componentDidMount () {
    request.get('http://localhost:3000/sg')
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (res && res.status === 200) {
          this.setState({ sgs: res.body });
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

                if (rule.IpProtocol === '-1') { port = 'ALL'; } else { port = `${rule.FromPort} - ${rule.ToPort}`; }
                if (rule.UserIdGroupPairs.length !== 0) {
                  destination = rule.UserIdGroupPairs[0].GroupId.toString();
                } else {
                  destination = rule.IpRanges[0].CidrIp.toString();
                }

                return (<tr key={j}>
                  <td>{port}</td>
                  <td>{destination}</td>
                  <td>TBD</td>
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
