import React from 'react';
import Floater from 'react-floater'
import { withFirebase } from '../Firebase';

class NetProjs extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      uploadValue: 0,
      error: '',
    }
  }

  render() {
    return (
      <div className="card card-1" style={{margin: 'auto', width: this.props.width, marginTop: '1%', borderRadius: '10px'}}>
        <div className="card-body">
          <div className="container">
            <a style={{display:'inline-block', margin: '4px 0px 0px 0px'}}><b>{this.props.project.project.title} </b></a>
            <p style={{margin: '4px 0', color: '#8294aa'}}>{this.props.project.project.partner1} - {this.props.project.project.partner2} </p>
            <p style={{margin: '4px 0'}}>{this.props.project.project.description}</p>
            {this.props.project.project.status === 'active' ?
              <p style={{margin: '4px 0'}}>Status: <b style={{color: '#28a745'}}>{this.props.project.project.status}</b></p> :
              (this.props.project.project.status === 'finished' ?
                <p style={{margin: '4px 0'}}>Status: <b style={{color: '#dc3545'}}>{this.props.project.project.status}</b></p> :
                null)}
            <a>Budget: <b>{this.props.project.project.budget} $</b></a>
            <div className="" align="center">
              {this.props.project.project.url !== '' ?
                <Floater
                  styles={{
                    tooltip: {
                      filter: "none"
                    }, container: {
                      backgroundColor: "#000",
                      borderRadius: 5,
                      color: "#fff",
                      filter: "none",
                      minHeight: "none",
                      maxWidth: 100,
                      padding: 10,
                      textAlign: "right"
                    }, arrow: {
                      color: "#000",
                      length: 8,
                      spread: 10
                    }
                  }}
                  content={
                    <div align="center">
                      Download Report
                    </div>
                  }
                  event="hover"
                  placement="top"
                >
                  <a className="butt2 mr-2" href={this.props.project.project.url} target="_blank">
                    <i className="far fa-download"> </i>
                  </a>
                </Floater>
                : null}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default  withFirebase(NetProjs);