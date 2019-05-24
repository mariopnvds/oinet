import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { compose } from 'recompose';
import withAuthorization from '../Session/withAuthorization';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';


class FirmsList extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      users: [],
      firms: [],
      loading: 1
    }
  }

  hubMount(snapshot){
    var users = [];
    var p = [];
    p.push(snapshot.val().uid);
    users.push({
      uid: snapshot.val().uid,
      ...snapshot.val(),
    });
    this.props.firebase.nodes().on("value", fullNodes => {
      Object.values(fullNodes.val()).map(node => {
        if(node.parents !== "") {
          Object.values(node.parents).map(parent => {
            if (parent.uid === node.uid) {
              console.log(node.username, parent)
              users.push({
                uid: node.uid,
                ...node,
              })
            }
          })
        }
      });
      for(var i = 0; i<p.length; i++){
        Object.values(fullNodes.val()).map(node => {
          if(node.parents !== "") {
            Object.values(node.parents).map(parent => {
              if (parent.uid === p[i]) {
                p.push(node.uid);
                users.push({
                  uid: node.uid,
                  ...node,
                })
              }
            })
          }
        });
      }
      this.setState({users: users})
    });
  }

  componentDidMount() {
    this.props.firebase.node(this.props.firebase.auth.currentUser.uid).on('value', snapshot => {
      this.hubMount(snapshot);
    })
  }

  componentWillUnmount() {
    this.props.firebase.nodes().off()
    this.props.firebase.node().off()
  }

  render(){
    const columns = [
      {
        dataField: 'username',
        text: 'Entity',
        filter: textFilter(),
        sort: true,
      },  {
        dataField: 'city',
        text: 'City',
        filter: textFilter(),
        sort: true
      }, {
        dataField: 'country',
        text: 'Country',
        filter: textFilter(),
        sort: true
      }, {
        dataField: 'category',
        text: 'Category',
        filter: textFilter(),
        sort: true
      },
      {
        dataField: 'dateIn',
        text: 'Date In',
        filter: textFilter(),
        sort: true
      }, {
        dataField: 'dateOut',
        text: 'Deleted on',
        filter: textFilter(),
        sort: true
      }, {
        dataField: '',
        text: 'Profile',
        formatter: (cellContent, row) => {
          return (
            <button className="pure-material-button-contained" onClick={() => {
                this.props.history.push({pathname: ROUTES.PROFILE, state: row})}}
            >
              <i className="far fa-user"></i>
            </button>
          )
        }
      }];
    const customTotal = (from, to, size) => (
      <span className="react-bootstrap-table-pagination-total"> Showing { from } to { to } of { size } Results</span>
    );
    const options = {
      paginationSize: 4,
      pageStartIndex: 0,
      firstPageText: 'First',
      prePageText: 'Back',
      nextPageText: 'Next',
      lastPageText: 'Last',
      nextPageTitle: 'First page',
      prePageTitle: 'Pre page',
      firstPageTitle: 'Next page',
      lastPageTitle: 'Last page',
      showTotal: true,
      paginationTotalRenderer: customTotal,
      sizePerPageList: [{
        text: '10', value: 10
      }, {
        text: '15', value: 15
      }, {
        text: '20', value: 20
      }, {
        text: 'All', value: 100
      }]
    };
    return (
      <div className="container" style={{marginTop: '2%'}}>
        <BootstrapTable
          bordered={false}
          className="react-bootstrap-table react-bs-container-header"
          keyField="uid"
          data={this.state.users}
          columns={columns}
          filter={filterFactory()}
          pagination={paginationFactory(options)}
        />
      </div>
    );
  }
};

const condition = authUser => !!authUser ;

export default compose(
  withAuthorization(condition),
  withFirebase,
)(FirmsList);