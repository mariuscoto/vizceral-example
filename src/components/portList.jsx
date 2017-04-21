'use strict';

import _ from 'lodash';
import React from 'react';
import { Table, Column, SortDirection } from 'react-virtualized';
import 'react-virtualized/styles.css';

const nameRenderer = function (data) {
  let className = 'glyphicon glyphicon-warning-sign';
  const mostSevereNotice = data.rowData.notices && data.rowData.notices.length > 0 && _.maxBy(data.rowData.notices, notice => notice.severity);
  if (mostSevereNotice) {
    className += ` severity${mostSevereNotice.severity}`;
  }

  const styles = {
    paddingLeft: '5px',
    opacity: data.rowData.disabled ? 0.3 : undefined
  };

  return (
    <span className={data.rowData.className} style={{ color: data.rowData.color }}>
      {data.cellData}
      {
        mostSevereNotice ?
        <span style={styles} className={className} />
        : undefined
      }
    </span>);
};

const portRenderer = function (data) {
  return (
    <span className={data.rowData.className} data-error-rate={data.rowData.port} style={{ color: data.rowData.color }} title="cevaTitle">{data.rowData.port}</span>
  );
};

const sorters = {
  name: (a, b) => {
    if (a.disabled && !b.disabled) { return 1; }
    if (!a.disabled && b.disabled) { return -1; }
    if (a.name < b.name) { return 1; }
    if (a.name > b.name) { return -1; }
    return 0;
  },
  errorRate: (a, b) => {
    if (a.disabled && !b.disabled) { return 1; }
    if (!a.disabled && b.disabled) { return -1; }
    if (a.errorRate < b.errorRate) { return 1; }
    if (a.errorRate > b.errorRate) { return -1; }
    return 0;
  }
};

class PortList extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      connections: props.connections,
      sortBy: 'errorRate',
      sortDirection: SortDirection.ASC
    };
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      connections: nextProps.connections
    });
  }

  render () {
    const headerHeight = 30;
    let estimatedRowHeight = 25;
    const maxTableHeight = 300;
    const connectionRows = this.state.connections.map((connection) => {
      const classNames = [];
      classNames.push('disabled');

      const port = connection[0];
      const dest = connection[1];

      return {
        name: dest,
        port: port,
        className: classNames.join(' '),
        disabled: false,
        notices: connection.notices
      };
    });

    connectionRows.sort(sorters[this.state.sortBy]);
    if (this.state.sortDirection !== SortDirection.ASC) { _.reverse(connectionRows); }

    if (this.refs.flexTable && this.refs.flexTable.props.estimatedRowSize) {
      estimatedRowHeight = this.refs.flexTable.props.estimatedRowSize - 4;
    }
    const tableHeight = Math.min(maxTableHeight, (estimatedRowHeight * connectionRows.length) + headerHeight);


    return (
      connectionRows.length > 0 ?
      <div className="connection-list">
        <Table
          ref="flexTable"
          width={300}
          height={tableHeight}
          headerHeight={headerHeight}
          rowHeight={25}
          rowCount={connectionRows.length}
          rowGetter={({ index }) => connectionRows[index]}
          sortBy={this.state.sortBy}
          sortDirection={this.state.sortDirection}
          sort={this.sort}
        >
          <Column label="Cluster" dataKey="name" cellRenderer={nameRenderer} width={220} />
          <Column label="Errors" dataKey="errorRate" cellRenderer={portRenderer} width={70}/>
        </Table>
      </div>
      : <span>None.</span>
    );
  }

  sort = ({ sortBy, sortDirection }) => {
    this.setState({ sortBy, sortDirection });
  }
}

PortList.propTypes = {
  direction: React.PropTypes.string.isRequired,
  connections: React.PropTypes.array.isRequired
};

export default PortList;
