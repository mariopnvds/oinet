import React from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: null,
        loading: true
      };
    }

    componentDidMount() {
      this.listener = this.props.firebase.onAuthUserListener(
        authUser => {
          this.setState({ authUser, loading: false });
        },
        () => {
          this.setState({ authUser: null, loading: false });
        },
      );
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      if(this.state.loading === true){
        return(<div style={{ textAlign: "center", position: "absolute", top: "30%", left: "50%", marginLeft: '-30px' }}>
          <div className="spinner"> </div>
        </div>)
      }

      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  return withFirebase(WithAuthentication);
};

export default withAuthentication;
