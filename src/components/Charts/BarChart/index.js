import React from 'react';
import Chart from "react-google-charts";
import { withFirebase } from '../../Firebase';

class BarChart extends React.Component{
  render() {
    return (
      <div className="card" style={{margin: 'auto', width: '45%', marginTop: '1%'}}>
        <div className="card-header">
          {this.props.title} <small>{`(${new Date().getFullYear().toString()})`}</small>
        </div>
        <div className="card-body">
          <Chart chartType="Bar" width="100%" height="100%" data={this.props.data} options={this.props.options}/>
        </div>
      </div>
    );
  }
}
export default withFirebase(BarChart);