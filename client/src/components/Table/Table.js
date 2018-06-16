import React, { Component } from 'react';
import './Table.css';

class Table extends Component {

  tableBody(c) {
    return this.props.data.columns.map(tr => {
    })
  }

  render() {
    return <div className="Table">
      <table className="table is-hoverable">
      <thead>
        <tr>
          {this.props.data.titles.map(t => <th key={t}>{t}</th>)}
        </tr>
      </thead>
      <tbody>
      {this.props.data.titles.length == 2 ? 
        this.props.data.columns.map((tr, i) => 
      <tr key={tr.financialUnitName + i}>
      <td key={tr.financialUnitName}>{tr.financialUnitName}</td>
      <td key={tr.calculatedValue}>{tr.calculatedValue}</td>
      </tr>
    )
      : 
      this.props.data.columns.map((tr, i) => 
      <tr key={tr.financialUnitName + i}>
      <td key={tr.financialUnitName}>{tr.financialUnitName}</td>
      <td key={tr.nationalValue}>{tr.nationalValue}</td>
      <td key={tr.rate}>{tr.rate}</td>
      <td key={tr.currency}>{tr.currency}</td>
      <td key={tr.calculatedValue}>{tr.calculatedValue}</td>
      </tr>
    )}   
      </tbody>
    </table>
    </div>;
  }
}

export default Table;
