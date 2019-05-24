import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const PasswordForgetPage = () => (
  <div>
    <PasswordForgetForm />
  </div>
);

const INITIAL_STATE = {
  email: '',
  error: null,
};

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email } = this.state;

    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.setState({ error: '' });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, error } = this.state;

    const isInvalid = email === '';

    return (
      <div className="card" style={{margin: 'auto', width: '47%', marginTop: '1%'}}>
        <div className="card-header">
          Reset password via email
        </div>
        <div className="card-body">
          {/*<h4 className="card-title">Reset password via email</h4>*/}
          <form onSubmit={this.onSubmit}>
            {error && ((error.message === 'The email address is badly formatted.') ? (<small style={{color: 'red'}}>{error.message}</small>) : null)}
            {error && ((error.message === 'There is no user record corresponding to this identifier. The user may have been deleted.') ? (<small style={{color: 'red'}}>{error.message}</small>) : null)}
            <div className="input-group mb-2">
              <div className="input-group-prepend">
                  <span className="input-group-text inputGroup" id="basic-addon1">
                    {/*<i className="fas fa-key" style={{width: '16px'}}></i>*/}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                         className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline
                      points="22,6 12,13 2,6"></polyline>
                  </svg>
                  </span>
              </div>
             <input
                className="form-control input"
                name="email"
                value={this.state.email}
                onChange={this.onChange}
                type="text"
                placeholder="Email Address"
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

const PasswordForgetLink = () => (
    <Link to={ROUTES.PASSWORD_FORGET} className="col">Forgot Password?</Link>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };
