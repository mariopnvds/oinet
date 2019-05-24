import React from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import withAuthorization from '../Session/withAuthorization';
import * as ROUTES from '../../constants/routes';

class Notification extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      children: [],
      uid: "",
      username: "",
    }
  }

  componentDidMount() {
    var children = [];
    this.props.firebase.node(this.props.firebase.auth.currentUser.uid).once("value", node => {
      if(node.val().notification !== undefined || node.val().notification !== ""){
        this.setState({uid: node.val().notification.uid, username: node.val().notification.username})
      }
      this.props.firebase.nodes().once("value", snapshot => {
        Object.values(snapshot.val()).map( item => {
          if(item.role !== "root" && item.parents !== "") {
            Object.values(item.parents).map(parent => { /////////
              if (parent.uid === node.val().notification.uid) {
                console.log(node.val().notification.uid)
                if (new Date(parent.dateIn) <= new Date() && (parent.dateOut === '' || new Date(parent.dateOut) > new Date().toDateString())) {
                  if((new Date(item.dateIn)) <= new Date() && (item.dateOut === '' || new Date(item.dateOut) > new Date().toDateString())){
                    children.push({username: item.username, uid: item.uid})
                  }
                }
              }
            })
          }
        })
        this.setState({children: children})
      })
    })
  }
  componentWillUnmount() {
    this.props.firebase.node().off();
    this.props.firebase.nodes().off();
  }

  onClickYes(){
    this.state.children.map( child => {
      this.props.firebase.findChildren(child.uid, this.state.uid).update({dateOut : new Date().toDateString().slice(4)})
      this.props.firebase.findChildren(child.uid, this.props.firebase.auth.currentUser.uid).set({
        uid: this.props.firebase.auth.currentUser.uid,
        dateIn: new Date().toDateString().slice(4),
        dateOut: ""
      })
    });
    this.props.firebase.node(this.props.firebase.auth.currentUser.uid).update({
      notification: ""
    });
    this.props.history.push(ROUTES.ACCOUNT);
    window.location.reload();
  }

  onClickNo(){
    this.state.children.map( child => {
      this.props.firebase.findChildren(child.uid, this.state.uid).update({dateOut : new Date().toDateString().slice(4)})
    });
    this.props.firebase.node(this.props.firebase.auth.currentUser.uid).update({
      notification: ""
    });
    this.props.history.push(ROUTES.ACCOUNT);
    window.location.reload();

  }

  render(){
    return (
      <div className="container" style={{margin: 'auto', marginTop: '3%'}}>
        <div className="card" style={{margin: 'auto', width: '50%', marginTop: '2%'}}>
          <div>
            <div className="card-body">
              <div className="container">
                <h5 align="center"><b>{this.state.username}</b> has left the network and it contained partners.</h5>
                <br/>
                <h5 align="center"><b>Would you like to be the hub?</b></h5>
              </div>
              <button className="btn btn-block pure-material-button-contained mb-2" onClick={ () => this.onClickYes()}> Yes </button>
              <button className="btn btn-block pure-material-button-contained-3 mb-2" onClick={ () => this.onClickNo()}> No </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
};

const condition = authUser => !!authUser ;

export default compose(
  withAuthorization(condition),
  withFirebase,
)(Notification);
