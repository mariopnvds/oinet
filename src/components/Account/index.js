import React from 'react';
import {withFirebase} from '../Firebase';
import { compose } from 'recompose';
import { AuthUserContext, withAuthorization } from '../Session';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import MapboxAutocomplete from 'react-mapbox-autocomplete';
import DeleteAcc from '../DeleteAcc';
const TOKEN = 'pk.eyJ1IjoibWFyaW9wbiIsImEiOiJjanJ0NTBmN28waHZkNDluOGlna29keGxwIn0.Wp6-w3f9R3tf_F5vaBjN4w'

class AccountPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      email: '',
      editMode: false,
      category: '',
      type: '',
      country: '',
      city: '',
      role: '',
      description: ''
    }
    this.editModeOn = this.editModeOn.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this._suggestionSelect = this._suggestionSelect.bind(this)
  }
  componentDidMount() {
    var u = this.props.firebase.auth.currentUser;
    this.props.firebase.node(u.uid).on('value', snapshot => {
      this.setState({
        username: snapshot.val().username,
        email : snapshot.val().email,
        category : snapshot.val().category,
        type : snapshot.val().type,
        city : snapshot.val().city,
        country : snapshot.val().country,
        role: snapshot.val().role,
        description : snapshot.val().description,
      });
    });
  }

  _suggestionSelect(result, lat, lng, text) {
    var resultado = result.split(', ');
    var country = resultado[resultado.length-1]
    this.setState({
      country: country,
      lat: lat,
      lng: lng,
      city: text
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { country, city, type, category, role, description } = this.state;
    var u = this.props.firebase.auth.currentUser;
    this.props.firebase.node(u.uid)
      .update({
        country,
        city,
        type,
        category,
        role,
        description
      });
    this.props.firebase.user(u.uid)
      .update({
        country,
        city,
        type,
        category,
        role,
        description
      });
    this.setState({editMode: false})

  };

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  editModeOn(){
    this.setState({editMode: true})
  };

  render(){
    const {category, type, description, city, country, role} = this.state;
    const isInvalid = category==='' || type==='' || city==='' || country === '' || description==='' || role==='';
    return (
          <div className="container">
            <div className="row">
              <div className="container">
                <div className="card" style={{margin: 'auto', width: '100%', marginTop: '2%'}}>
                  {this.state.editMode === false ?
                    <div>
                      <div className="card-header">
                        Profile
                      </div>
                      <div className="card-body">
                        <div className="container row">
                          <div className="col">
                            <h5><b>Entity name:</b> <a>{this.state.username}</a></h5>
                            <h5><b>Email:</b> <a>{this.state.email}</a></h5>
                            <h5><b>Description:</b> <a>{this.state.description}</a></h5>
                          </div>
                          <div className="col">
                            <h5><b>Country:</b> <a>{this.state.country}</a></h5>
                            <h5><b>City:</b> <a>{this.state.city}</a></h5>
                            <h5><b>Type:</b> <a>{this.state.type}</a></h5>
                            <h5><b>Role:</b> <a>{this.state.role}</a></h5>
                            <h5><b>Category:</b> <a>{this.state.category}</a></h5>
                          </div>
                        </div>
                        <button className="btn btn-block pure-material-button-contained mb-2" onClick={this.editModeOn}> Edit </button>
                      </div>
                    </div>
                    :
                    <div>
                      <div className="card-header">
                        Edit profile
                      </div>
                      <div className="card-body">
                        <form onSubmit={this.handleSubmit}>
                          <MapboxAutocomplete publicKey={TOKEN} placeholder="Enter location" inputClass='form-control input search'
                              onSuggestionSelect={this._suggestionSelect} resetSearch={false}/>
                          <div className="select mb-2">
                            <select className="select-text" name="category" onChange={this.handleInputChange} defaultValue={"none"}>
                              <option value="none" disabled>Entity category</option>
                              <option value="Agriculture">Agriculture</option>
                              <option value="Architecture">Architecture</option>
                              <option value="Artistics">Artistics</option>
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
                            <select className="select-text" name="type" onChange={this.handleInputChange} defaultValue={"none"}>
                              <option value="none" disabled>Entity type</option>
                              <option value="Public body">Public body</option>
                              <option value="Large Entity">Large Entity</option>
                              <option value="SME">SME</option>
                              <option value="University">University</option>
                              <option value="Research Center">Research Center</option>
                            </select>
                          </div>
                          <textarea placeholder="Brief Description" onChange={this.handleInputChange} className="form-control input mb-2" rows="2" name="description"/>
                          <div className="form-group">
                            <button type="submit" disabled={isInvalid} id="enter" className="mt-4 btn btn-block pure-material-button-contained" onClick={this.handleSubmit} style={{marginRight: '5px'}}>
                              Done
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  }
                </div>
              </div>
              <PasswordForgetForm />
              <PasswordChangeForm />
              <DeleteAcc/>
            </div>
          </div>
    )
  }
}

const condition = authUser => !!authUser;

export default compose(withAuthorization(condition), withFirebase)(AccountPage);
