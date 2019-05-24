import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const SignInPage = () => (
  <div>
    <div className="card" style={{margin: 'auto', width: '40%', marginTop: '7%'}}>
      <div className="card-header"> Log in</div>
      <div className="card-body">
        <SignInForm />
      </div>
      <div className="card-footer text-muted">
        <div align="center">
          <PasswordForgetLink />
        </div>
      </div>
    </div>
    <div style={{margin: 'auto', bottom: '20px', position: 'fixed', width: "100%", marginLeft: '-32px'}} align="center">&copy; Copyright 2019 <a href="https://montegancedo.upm.es/Transferencia/CAIT" target="_blank">CAIT</a> - <a href="http://www.upm.es" target="_blank">UPM</a>
      - Design by <a href="https://www.linkedin.com/in/mariopnvds" target="_blank">Mario Penavades Suárez</a></div>
  </div>

);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.ACCOUNT);
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
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <form onSubmit={this.onSubmit}>
        <svg className="profile-img-card mt-3" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" width="91px" height="110px" viewBox="-0.5 -0.5 91 110"><defs/>
          <g><path d="M 17 26 L 41 50" fill="none" stroke="#000000" strokeMiterlimit="10" pointerEvents="none"/>
            <ellipse cx="45" cy="54" rx="40" ry="40" fill="#ffffff" stroke="#000000" pointerEvents="none"/>
            <ellipse cx="85" cy="54" rx="5" ry="5" fill="#000000" stroke="#000000" pointerEvents="none"/> {/*66cc00*/}
            <ellipse cx="5" cy="54" rx="5" ry="5" fill="#000000" stroke="#000000" pointerEvents="none"/> {/*66cc00*/}
            <path d="M 19 28 L 73 82" fill="none" stroke="red" strokeMiterlimit="10" pointerEvents="none"/>
            <ellipse cx="15" cy="24" rx="5" ry="5" fill="#ffffff" stroke="#000000" pointerEvents="none"/>{/*ffff00*/}
            <ellipse cx="75" cy="24" rx="5" ry="5" fill="#ffffff" stroke="#000000" pointerEvents="none"/> {/*ffff00*/}
            <path d="M 75 79 L 75 29" fill="none" stroke="red" strokeMiterlimit="10" pointerEvents="none"/>
            <ellipse cx="75" cy="84" rx="5" ry="5" fill="#ffffff" stroke="#000000" pointerEvents="none"/>{/*ffff00*/}
            <path d="M 15 79 L 15 29" fill="none" stroke="red" strokeMiterlimit="10" pointerEvents="none"/>
            <ellipse cx="15" cy="84" rx="5" ry="5" fill="#ffffff" stroke="#000000" pointerEvents="none"/>{/*ffff00*/}
            <path d="M 45 99 Q 45 99 45 59" fill="none" stroke="blue" strokeMiterlimit="10" pointerEvents="none"/>
            <ellipse cx="45" cy="104" rx="5" ry="5" fill="#ffffff" stroke="#000000" pointerEvents="none"/> {/*3399ff*/}
            <ellipse cx="45" cy="5" rx="5" ry="5" fill="#ffffff" stroke="#000000" pointerEvents="none"/> {/*3399ff*/}
            <path d="M 45 49 Q 45 49 45 10" fill="none" stroke="blue" strokeMiterlimit="10" pointerEvents="none"/>
            <ellipse cx="45" cy="54" rx="5" ry="5" fill="gray" stroke="#000000" pointerEvents="none"/> {/*3399ff*/}
          </g>
        </svg>
        {/*<img id="profile-img" className="profile-img-card mt-3" src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"/>*/}
        {error && ((error.message === 'The email address is badly formatted.') ? (<small style={{color: 'red'}}>{error.message}</small>) : null)}
        {error && ((error.message === 'There is no user record corresponding to this identifier. The user may have been deleted.') ? (<small style={{color: 'red'}}>{error.message}</small>) : null)}
        <div className="input-group mb-2">
          <div className="input-group-prepend">
                <span className="input-group-text inputGroup" id="basic-addon1">
                  {/*<i className="fas fa-user" style={{width: '16px'}}></i>*/}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                       className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"> </path><polyline
                    points="22,6 12,13 2,6"></polyline>
                  </svg>
                </span>
          </div>
          <input value={email} onChange={this.onChange} type="text" name="email"
                 className="form-control input" placeholder="Email" style={{marginLeft: '0'}}/>
        </div>
        {error && ((error.message === 'The password is invalid or the user does not have a password.') ? (<small style={{color: 'red'}}>{error.message}</small>) : null)}
        <div className="input-group mb-2">
          <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1" style={{border: 'none', backgroundColor: 'white'}}>
                  {/*<i className="fas fa-key"></i>*/}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                       className="feather feather-key"><path
                    d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"> </path>
                  </svg>
                </span>
          </div>
          <input value={password} onChange={this.onChange} type="password" name="password"
                 className="form-control input" id="exampleInputPassword1" placeholder="Password" style={{marginLeft: '0'}}/>
        </div>
        <div className="form-group">
          <button disabled={isInvalid} type="submit" className="mt-2 btn btn-block pure-material-button-contained">
            Sign In
          </button>
        </div>
      </form>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

export default SignInPage;

export { SignInForm };
