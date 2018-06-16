import React, {Component} from 'react';
import server from './server'
import './App.css';
import Table from "./components/Table";
import CurrencyConverter from "./components/CurrencyConverter";

class App extends Component {
  constructor(props) {
    super();
    this.state = {
      tableData: false,
      aggregatedTableData: false,
      supportedCurrencies: false,
      loading: true
    }
  }

  async componentDidMount() {
    await this.init()
  }

  getUpdatedData = async() => {
    try {
      await this.setState({loading: true});
      const tableData = await server.getTableData();
      const aggregatedTableData = await server.getAggregatedTableData();
      this.setState({tableData: tableData.data, aggregatedTableData: aggregatedTableData.data, loading: false});
    } catch (error) {
      console.log('getUpdatedData', error);
    }
  }

  init = async() => {
    try {
      const supportedCurrencies = await server.getSupportedCurrencies();
      await this.getUpdatedData();
      this.setState({supportedCurrencies: supportedCurrencies.data});
    } catch (error) {
      console.log('init', error);
    }

    const interval = setInterval(() => {
      this
        .getUpdatedData()
        .then((done) => {})
    }, 1000000);
  }

  render() {
    return (
      <div className="App">
        <section className="hero is-primary is-medium">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">
                <i className="fas fa-chart-area"></i>
                Foreign Exchange
              </h1>
              <h2 className="subtitle">
                Foreign exchange demo tool
              </h2>
            </div>
          </div>
        </section>
        <div className="container">
          <div className="columns">
            <nav className="panel column is-7">
              <p className="panel-heading">
                Financial unit and their value in USD {this.state.loading
                  ? <span className="is-pulled-right">
                      <i className="fas fa-spinner fa-pulse"></i>
                    </span>
                  : ''}
              </p>
              <div className="panel-block">
                {this.state.tableData
                  ? <Table data={this.state.tableData}/>
                  : <div className="spinner-container">
                    <i className="fas fa-spinner fa-pulse"></i>
                  </div>}
              </div>
            </nav>
            <div className="column is-5">
              <div className="columns">
                <nav className="panel column is-12">
                  <p className="panel-heading">
                    Financial unit and their total value in USD {this.state.loading
                      ? <span className="is-pulled-right">
                          <i className="fas fa-spinner fa-pulse fa-lg"></i>
                        </span>
                      : ''}
                  </p>
                  <div className="panel-block">
                    {this.state.aggregatedTableData
                      ? <Table data={this.state.aggregatedTableData}/>
                      : <div className="spinner-container">
                        <i className="fas fa-spinner fa-pulse fa-lg"></i>
                      </div>}
                  </div>
                </nav>
              </div>
              <div className="columns">
                <div className="column is-12">
                  {this.state.supportedCurrencies ? <CurrencyConverter supportedCurrencies={this.state.supportedCurrencies}/> : ''}                  
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="footer">
          <div className="container">
            <div className="content has-text-centered">
              <p>
                <strong>Foreign exchange demo</strong>&nbsp;by Nir Adler                
              </p>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
