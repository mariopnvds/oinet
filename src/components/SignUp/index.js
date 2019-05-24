import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import MultiToggle from 'react-multi-toggle';
import MapboxAutocomplete from 'react-mapbox-autocomplete';
import continents from '../../data';
import { compose } from 'recompose';
import withAuthorization from '../Session/withAuthorization';

const TOKEN = 'pk.eyJ1IjoibWFyaW9wbiIsImEiOiJjanJ0NTBmN28waHZkNDluOGlna29keGxwIn0.Wp6-w3f9R3tf_F5vaBjN4w'

const SignUpPage = () => (
  <div className="card" style={{margin: 'auto', width: '50%', marginTop: '1.5%'}}>
    <div className="card-header">
      Sign Up
    </div>
    <div className="card-body">
      <SignUpForm />
    </div>
  </div>
);

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      passwordOne: '',
      passwordTwo: '',
      continent: '',
      country: '',
      city: '',
      latitude: '',
      longitude:'',
      type: '',
      category:'',
      description: '',
      parent: '',
      dateIn: '',
      dateOut: '',
      role: '',
      parents: [],
      activity: false,
      error: null
    };
    this._suggestionSelect = this._suggestionSelect.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onGroupSizeSelect = this.onGroupSizeSelect.bind(this);
  }

  parentSearch(snapshot){
    var options = [];
    options.push({
      username: snapshot.val().username,
      uid: snapshot.val().uid
    });
    this.setState({options: options})
  }

  componentDidMount () {
    if(this.props.firebase.auth.currentUser !== null){
      this.props.firebase.node(this.props.firebase.auth.currentUser.uid).on('value', snapshot => {
        this.parentSearch(snapshot)
      })
    }

  }

  componentWillUnmount() {
    this.props.firebase.node().off();
  }

  onGroupSizeSelect = value => this.setState({ activity: value });

  _suggestionSelect(result, lat, lng, text) {
    var resultado = result.split(', ');
    var country = resultado[resultado.length-1];
    Object.keys(continents).map( key => continents[key].find( count => {if(count === country){
      this.setState({continent: key})
    }}))
    this.setState({
      country: country,
      latitude: lat,
      longitude: lng,
      city: text,
    })
  }

  onSubmit = event => {
    this.props.firebase.node(this.props.firebase.auth.currentUser.uid).update({
      role: "hub"
    });
    const { username, email, passwordOne, continent, country, city, longitude, latitude, type, category, description, parent, role, activity } = this.state;
    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        var uid = authUser.user.uid;
        // Create a user in your Firebase realtime database
        this.props.firebase.user(authUser.user.uid).set({
            uid: authUser.user.uid,
            username,
            email,
            children: '',
            country,
            continent,
            city,
            latitude,
            longitude,
            type,
            category,
            parents: "",
            description,
            projects: "",
            dateIn: new Date().toDateString().slice(4),
            dateOut: '',
            notification: '',
            role,
            activity
          })
          .then(() => {
            this.setState({ ...this.state });
            this.props.history.push(ROUTES.ACCOUNT);
          })
          .catch(error => {
            this.setState({ error });
          });

        this.props.firebase.node(authUser.user.uid).set({
          uid: authUser.user.uid,
          username,
          email,
          children: '',
          continent,
          country,
          city,
          latitude,
          longitude,
          type,
          category,
          parents: "",
          description,
          projects: "",
          dateIn: new Date().toDateString().slice(4),
          dateOut: '',
          notification: '',
          role,
          activity
        })
          .then(() => {
            this.setState({ ...this.state });
            this.props.history.push(ROUTES.ACCOUNT);
          })
          .catch(error => {
            this.setState({ error });
          });
        this.props.firebase.findChildren(authUser.user.uid, parent).set({
          uid: parent,
          dateIn: new Date().toDateString().slice(4),
          dateOut: ""
        })
        this.props.firebase.findChildrenUsers(authUser.user.uid, parent).set({
          uid: parent,
          dateIn: new Date().toDateString().slice(4),
          dateOut: ""
        })
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
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      city,
      country,
      type,
      category,
      description,
      role,
      error,
      parent
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      country ==='' ||
      city ==='' ||
      category === '' ||
      email === '' ||
      type === '' ||
      description === '' ||
      username === '' ||
      role === '' || parent === '';

    return (
      <form onSubmit={this.onSubmit} className="">
        {error && ((error.message === 'The email address is badly formatted.') ? (<small style={{color: 'red'}}>{error.message}</small>) : null)}
        {error && ((error.message === 'The email address is already in use by another account.') ? (<small style={{color: 'red'}}>{error.message}</small>) : null)}
        <div className="input-group mb-2">
          <div className="input-group-prepend">
            <span className="input-group-text inputGroup" id="basic-addon1">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                   className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"> </path><polyline
                  points="22,6 12,13 2,6"> </polyline>
              </svg>
            </span>
          </div>
          <input value={email} onChange={this.onChange} type="text" name="email"
             className="form-control input" placeholder="Email" style={{marginLeft: '0'}}/>
        </div>
        <div className="input-group mb-2">
          <div className="input-group-prepend">
            <span className="input-group-text inputGroup" id="basic-addon1">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                 className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"> </path><circle
                cx="12" cy="7" r="4"> </circle></svg>
            </span>
          </div>
          <input value={username} onChange={this.onChange} type="text" name="username" className="form-control input"
                 placeholder="Entity name" style={{marginLeft: '0'}}/>
        </div>
        {error && ((error.message === 'Password should be at least 6 characters') ? (<small style={{color: 'red'}}>{error.message}</small>) : null)}
        <div className="input-group mb-2">
          <div className="input-group-prepend">
            <span className="input-group-text inputGroup" id="basic-addon1">
              {/*<i className="fas fa-key"></i>*/}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                   className="feather feather-key"><path
                d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"> </path></svg>
            </span>
          </div>
          <input value={passwordOne} onChange={this.onChange} type="password" name="passwordOne"
                 className="form-control input" id="passwordOne" placeholder="Password" style={{marginLeft: '0'}}/>
        </div>
        {error && ((error.message === 'Password should be at least 6 characters') ? (<small style={{color: 'red'}}>{error.message}</small>) : null)}
        <div className="input-group mb-2">
          <div className="input-group-prepend">
            <span className="input-group-text inputGroup" id="basic-addon1">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="feather feather-key"><path
                d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"> </path></svg>
            </span>
          </div>
          <input value={passwordTwo} onChange={this.onChange} type="password" name="passwordTwo"
             className="form-control input" id="passwordTwo" placeholder="Confirm password" style={{marginLeft: '0'}}/>
        </div>
        <MapboxAutocomplete publicKey={TOKEN} placeholder="Location" inputClass='form-control input search'
            onSuggestionSelect={this._suggestionSelect} resetSearch={false}/>
        <div className="select mb-2">
          <select className="select-text" name="category" onChange={this.onChange} defaultValue={"none"}>
            <option value="none" disabled>Entity category</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Architecture">Architecture</option>
            <option value="Artistic">Artistic</option>
            <option value="Biology">Biology</option>
            <option value="Chemical">Chemical</option>
            <option value="Economy">Economy</option>
            <option value="Education">Education</option>
            <option value="Engineering">Engineering</option>
            <option value="Health">Health</option>
            <option value="Humanistic">Humanistic</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Social">Social</option>
          </select>
        </div>
        <div className="select mb-2">
          <select className="select-text" name="type" onChange={this.onChange} defaultValue={"none"}>
            <option value="none" disabled>Entity type</option>
            <option value="Public body">Public body</option>
            <option value="Large Entity">Large Entity</option>
            <option value="SME">SME</option>
            <option value="University">University</option>
            <option value="Research Center">Research Center</option>
          </select>
        </div>
        <div className="select mb-2">
          <div className="select mb-2">
            <select className="select-text" name="parent" id="parent" onChange={this.onChange} defaultValue={"none"}>
              <option value="none" disabled>Parent</option>
              {this.state.options !== undefined ? Object.values(this.state.options).map((user, i) => <option key={i} value={user.uid}>{user.username}</option>) : null}
            </select>
          </div>
        </div>
        <div className="select mb-2">
          <select className="select-text" name="role" id="role" onChange={this.onChange} defaultValue={"none"}>
            <option value="none" disabled>Role </option>
            <option value="child" >Child</option>
          </select>
        </div>
        <textarea placeholder="Brief Description" onChange={this.onChange} className="form-control mb-2 input" rows="2" name="description"/>
        <MultiToggle
          options={[{
              displayName: 'Long Activity',
              value: false
            },
            { displayName: 'Short Activity',
              value: true
            },
          ]}
          selectedOption={this.state.activity}
          onSelectOption={this.onGroupSizeSelect}
        />
        <div className="form-group">
          <button disabled={isInvalid} type="submit" className="btn btn-block pure-material-button-contained mt-2">
            Sign Up
          </button>
        </div>
      </form>
    );
  }
}

const SignUpLink = () => (
  <p className="col" style={{display: 'inline'}}>Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link></p>
);


const SignUpForm = withRouter(withFirebase(SignUpFormBase));

const condition = authUser => !!authUser ;


export default compose(
 withAuthorization(condition),
  withFirebase,
)(SignUpPage);

export { SignUpForm };
