import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: '',
      passwordOne: '',
      passwordTwo: '',
      success: '',
      error: null,
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit = event => {
    const { passwordOne, oldPassword } = this.state;

    var cred = this.props.firebase.doGet(this.props.firebase.auth.currentUser.email, oldPassword);
    this.props.firebase.auth.currentUser.reauthenticateAndRetrieveDataWithCredential(cred).then(() => {
      this.props.firebase
        .doPasswordUpdate(passwordOne)
        .then(() => {
          this.setState({success: 'Password successfully updated'});
          this.setState({error: ''});
          this.setState({ ...this.state });
        })
        .catch(error => {
          this.setState({ error });
        });
    }).catch(error => {
      this.setState({ error });
    });
    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { oldPassword, passwordOne, passwordTwo, success, error } = this.state;

    const isInvalid = passwordOne !== passwordTwo || passwordOne === '' || oldPassword === '';

    return (
      <div className="card" style={{margin: 'auto', width: '47%', marginTop: '1%'}}>
        <div className="card-header">
          Reset password
        </div>
        <div className="card-body">
          {/*<h4 className="card-title"></h4>*/}
          <form onSubmit={this.onSubmit}>
            {success ==='Password successfully updated' ? (<small style={{color: 'green'}}>{success}</small>) : null}
            {error && ((error.message === "Password should be at least 6 characters") ? (<small style={{color: 'red', marginLeft:"10px"}}>{error.message}</small>) : null)}
            {error && ((error.message === 'The password is invalid or the user does not have a password.') ? (<small style={{color: 'red', marginLeft:"10px"}}>{error.message}</small>) : null)}
            <div className="input-group mb-2">
              <div className="input-group-prepend">
                  <span className="input-group-text inputGroup" id="basic-addon1">
                    {/*<i className="fas fa-key" style={{width: '16px'}}></i>*/}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                         className="feather feather-key"><path
                      d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                    </svg>
                  </span>
              </div>
              <input
                className="form-control input"
                name="oldPassword"
                value={oldPassword}
                onChange={this.onChange}
                type="password"
                placeholder="Password"
                style={{marginLeft: '0'}}
              />
            </div>
            <div className="input-group mb-2">
              <div className="input-group-prepend">
                  <span className="input-group-text inputGroup" id="basic-addon1">
                    {/*<i className="fas fa-key" style={{width: '16px'}}></i>*/}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                         className="feather feather-key"><path
                      d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                    </svg>
                  </span>
              </div>
              <input
                className="form-control input"
                name="passwordOne"
                value={passwordOne}
                onChange={this.onChange}
                type="password"
                placeholder="New Password"
                style={{marginLeft: '0'}}
              />
            </div>
            <div className="input-group mb-2">
              <div className="input-group-prepend">
                  <span className="input-group-text inputGroup" id="basic-addon1">
                    {/*<i className="fas fa-key" style={{width: '16px'}}></i>*/}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                         className="feather feather-key"><path
                      d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                    </svg>
                  </span>
              </div>
              <input
                className="form-control input"
                name="passwordTwo"
                value={passwordTwo}
                onChange={this.onChange}
                type="password"
                placeholder="Confirm New Password"
                style={{marginLeft: '0'}}
              />
            </div>
            <div className="form-group">
              <button disabled={isInvalid} type="submit" className="btn btn-block pure-material-button-contained">
                Reset My Password
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withFirebase(PasswordChangeForm);
