import React, {Component} from 'react';
import server from '../../server';

class CurrencyConverter extends Component {
  constructor(props) {
    super();

    this.state = {
      ccy: '',
      value: '',
      convertedValue:false
    }
  }
  submit = (e) => {
    e.preventDefault();
    if(this.state.ccy.length === 3)
     server.currencyConvert(this.state.ccy, this.state.value).then(res => this.setState({convertedValue : res.data.calculatedValue.toFixed(4)}))
  }

  onChange = (e) => {
    e.target.name
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    return <nav className="panel ">
      <p className="panel-heading">
        Currency Converter to USD
      </p>
      <div className="panel-block">
        <form onSubmit={this.submit}>
          <div className="columns">
            <div className="field column is-5">
              <div className="control">
                <div className="select">
                  <select name="ccy" onChange={this.onChange}>
                    <option>Select Currency</option>
                    {this
                      .props
                      .supportedCurrencies
                      .map(c => <option key = {c}
                      value = {c} > {c} </option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="field column is-5">
              <div className="control">
                <input
                  className="input"
                  type="number"
                  placeholder="Notional Value"
                  required
                  onChange={this.onChange}
                  name="value"/>
              </div>
            </div>
            <div className="field column is-3">
              <div className="control">
                <button type="submit" className="button">Convert</button>
              </div>
            </div>
          </div>
          {this.state.convertedValue ? <p>Calculated value is USD = {this.state.convertedValue}</p> : ''}
          
        </form>
      </div>
    </nav>;
  }
}

export default CurrencyConverter;
