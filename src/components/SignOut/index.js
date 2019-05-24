import React from 'react';

import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase }) => (
  <button className="butt d-inline" type="button" onClick={firebase.doSignOut}>
    <i className="fas fa-fw fa-power-off" style={{ fontSize: '2.3em' }}> </i>
  </button>
);


export default withFirebase(SignOutButton);

