import React from 'react';
import { NavLink } from 'react-router-dom';
import SideNav, { NavItem, NavIcon } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { AuthUserContext } from '../Session';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../Firebase';

class Nav extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      screen: ""
    }
  }

  componentDidMount() {
    /*if(this.props.firebase.auth.currentUser !== null){
      this.props.firebase.node(this.props.firebase.auth.currentUser.uid).on("value", snapshot => {
        if(snapshot.val().notification !== "" && (snapshot.val().role === "hub" || snapshot.val().role === "root")){
          document.getElementById("notification").style.display = ''

        }
      })
    }*/
  }

  render() {
    return (
      <div>
        <AuthUserContext.Consumer>
          {authUser =>
            authUser ? (
              <SideNav style={{backgroundColor: '#0078FF', position: 'fixed'}}>
                <SideNav.Nav defaultSelected="home" selected="">
                  <div style={{textAlign: 'center', marginTop: '12px', marginBottom: '13px'}}>
                    <svg className="" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1"
                         width="50px" height="50px" viewBox="-0.5 -0.5 91 110"><defs/>
                      <g><path d="M 17 26 L 41 50" fill="none" stroke="#000000" strokeMiterlimit="10" pointerEvents="none"/>
                        <ellipse cx="45" cy="54" rx="40" ry="40" fill="#0078FF" stroke="#000000" pointerEvents="none"/>
                        <ellipse cx="85" cy="54" rx="5" ry="5" fill="#000000" stroke="#000000" pointerEvents="none"/> {/*66cc00*/}
                        <ellipse cx="5" cy="54" rx="5" ry="5" fill="#000000" stroke="#000000" pointerEvents="none"/> {/*66cc00*/}
                        <path d="M 19 28 L 73 82" fill="none" stroke="#000000" strokeMiterlimit="10" pointerEvents="none"/>
                        <ellipse cx="15" cy="24" rx="5" ry="5" fill="#ffffff" stroke="#000000" pointerEvents="none"/>{/*ffff00*/}
                        <ellipse cx="75" cy="24" rx="5" ry="5" fill="#ffffff" stroke="#000000" pointerEvents="none"/> {/*ffff00*/}
                        <path d="M 75 79 L 75 29" fill="none" stroke="#000000" strokeMiterlimit="10" pointerEvents="none"/>
                        <ellipse cx="75" cy="84" rx="5" ry="5" fill="#ffffff" stroke="#000000" pointerEvents="none"/>{/*ffff00*/}
                        <path d="M 15 79 L 15 29" fill="none" stroke="#000000" strokeMiterlimit="10" pointerEvents="none"/>
                        <ellipse cx="15" cy="84" rx="5" ry="5" fill="#ffffff" stroke="#000000" pointerEvents="none"/>{/*ffff00*/}
                        <path d="M 45 99 Q 45 99 45 59" fill="none" stroke="#000000" strokeMiterlimit="10" pointerEvents="none"/>
                        <ellipse cx="45" cy="104" rx="5" ry="5" fill="#ffffff" stroke="#000000" pointerEvents="none"/> {/*3399ff*/}
                        <ellipse cx="45" cy="5" rx="5" ry="5" fill="#ffffff" stroke="#000000" pointerEvents="none"/> {/*3399ff*/}
                        <path d="M 45 49 Q 45 49 45 10" fill="none" stroke="#000000" strokeMiterlimit="10" pointerEvents="none"/>
                        <ellipse cx="45" cy="54" rx="5" ry="5" fill="gray" stroke="#000000" pointerEvents="none"/> {/*3399ff*/}
                      </g>
                    </svg>
                    <br/>
                    <p className="logo" href="#" style={{textDecoration: 'none', fontSize: '1em', color: 'white'}}>OINet</p>
                  </div>
                  {console.log(authUser, "Cambiar a nodes no en users")}

                  {authUser.notification !== "" && (authUser.role === "hub" || authUser.role === "root") ?
                    <NavItem eventKey="notification" >
                      <NavIcon style={{ paddingTop: '5px' }}>
                        <NavLink to={{pathname:ROUTES.NOTIFICATION, aboutProps:{deleted: authUser.notification}}}>
                          <i className="fas fa-exclamation-triangle" style={{ fontSize: '2em', color: "#fffa20"}}/>
                        </NavLink>
                      </NavIcon>
                    </NavItem>
                  : null}
                  <NavItem eventKey="home">
                    <NavIcon style={{ paddingTop: '5px' }}>
                      <NavLink to={ROUTES.ACCOUNT}>
                        <i className="fas fa-fw fa-user-circle" style={{ fontSize: '2.3em' }} />
                      </NavLink>
                    </NavIcon>
                  </NavItem>
                  <NavItem eventKey="list">
                    <NavIcon style={{ paddingTop: '5px' }}>
                      <NavLink to={ROUTES.LIST}>
                        <i className="fas fa-fw fa-list" style={{ fontSize: '2.3em' }}/>
                      </NavLink>
                    </NavIcon>
                  </NavItem>
                  <NavItem eventKey="network">
                    <NavIcon style={{ paddingTop: '5px' }}>
                      <NavLink to={ROUTES.NETWORK}>
                        <i className="fas fa-project-diagram" style={{ fontSize: '2.3em'}}></i>
                      </NavLink>
                    </NavIcon>
                  </NavItem>
                  <NavItem eventKey="world">
                    <NavIcon style={{ paddingTop: '5px' }}>
                      <NavLink to={ROUTES.MAP}><i className="fas fa-fw fa-globe-europe" style={{ fontSize: '2.3em' }}/></NavLink>
                    </NavIcon>
                  </NavItem>
                  <NavItem eventKey="charts">
                    <NavIcon style={{ paddingTop: '5px' }}>
                      <NavLink to={ROUTES.CHARTS}>
                        <i className="fas fa-fw fa-chart-pie" style={{ fontSize: '2.3em' }}/>
                      </NavLink>
                    </NavIcon>
                  </NavItem>
                  <NavItem eventKey="register">
                    <NavIcon style={{ paddingTop: '5px' }}>
                      <NavLink to={ROUTES.SIGN_UP}><i className="fas fa-fw fa-user-plus" style={{ fontSize: '2em' }}/>
                      </NavLink>
                    </NavIcon>
                  </NavItem>
                  {/*authUser.role === 'root' ?
                    <NavItem eventKey="admin">
                      <NavIcon style={{ paddingTop: '5px' }}>
                        <NavLink to={ROUTES.ADMIN}>
                          <i className="fas fa-fw fa-user" style={{ fontSize: '2em' }} />
                        </NavLink>
                      </NavIcon>
                    </NavItem> : null
                  */}
                  <NavItem eventKey="land">
                    <NavIcon style={{ paddingTop: '5px' }}>
                      <NavLink to={ROUTES.PROJECTSLIST}>
                        <i className="fas fa-fw fa-book" style={{ fontSize: '2.3em' }}/>
                      </NavLink>
                    </NavIcon>
                  </NavItem>
                  <hr />
                  <NavItem eventKey="logout">
                    <NavIcon style={{ paddingTop: '5px' }}>
                      <SignOutButton/>
                    </NavIcon>
                  </NavItem>
                </SideNav.Nav>
              </SideNav>
            ) : (
              <SideNav style={{backgroundColor: '#0078FF'}}>
                <SideNav.Nav defaultSelected="main">
                  <div style={{textAlign: 'center', marginTop: '12px', marginBottom: '13px'}}>
                    <svg className="" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1"
                         width="50px" height="50px" viewBox="-0.5 -0.5 91 110"><defs/>
                      <g><path d="M 17 26 L 41 50" fill="none" stroke="#000000" strokeMiterlimit="10" pointerEvents="none"/>
                        <ellipse cx="45" cy="54" rx="40" ry="40" fill="#0078FF" stroke="#000000" pointerEvents="none"/>
                        <ellipse cx="85" cy="54" rx="5" ry="5" fill="#000000" stroke="#000000" pointerEvents="none"/> {/*66cc00*/}
                        <ellipse cx="5" cy="54" rx="5" ry="5" fill="#000000" stroke="#000000" pointerEvents="none"/> {/*66cc00*/}
                        <path d="M 19 28 L 73 82" fill="none" stroke="#000000" strokeMiterlimit="10" pointerEvents="none"/>
                        <ellipse cx="15" cy="24" rx="5" ry="5" fill="#ffffff" stroke="#000000" pointerEvents="none"/>{/*ffff00*/}
                        <ellipse cx="75" cy="24" rx="5" ry="5" fill="#ffffff" stroke="#000000" pointerEvents="none"/> {/*ffff00*/}
                        <path d="M 75 79 L 75 29" fill="none" stroke="#000000" strokeMiterlimit="10" pointerEvents="none"/>
                        <ellipse cx="75" cy="84" rx="5" ry="5" fill="#ffffff" stroke="#000000" pointerEvents="none"/>{/*ffff00*/}
                        <path d="M 15 79 L 15 29" fill="none" stroke="#000000" strokeMiterlimit="10" pointerEvents="none"/>
                        <ellipse cx="15" cy="84" rx="5" ry="5" fill="#ffffff" stroke="#000000" pointerEvents="none"/>{/*ffff00*/}
                        <path d="M 45 99 Q 45 99 45 59" fill="none" stroke="#000000" strokeMiterlimit="10" pointerEvents="none"/>
                        <ellipse cx="45" cy="104" rx="5" ry="5" fill="#ffffff" stroke="#000000" pointerEvents="none"/> {/*3399ff*/}
                        <ellipse cx="45" cy="5" rx="5" ry="5" fill="#ffffff" stroke="#000000" pointerEvents="none"/> {/*3399ff*/}
                        <path d="M 45 49 Q 45 49 45 10" fill="none" stroke="#000000" strokeMiterlimit="10" pointerEvents="none"/>
                        <ellipse cx="45" cy="54" rx="5" ry="5" fill="gray" stroke="#000000" pointerEvents="none"/> {/*3399ff*/}
                      </g>
                    </svg>
                    <br/>
                    <p className="logo" style={{textDecoration: 'none', fontSize: '1em', color: 'white'}}>OINet</p>
                  </div>
                  <NavItem eventKey="main">
                    <NavIcon>
                      <NavLink to={ROUTES.SIGN_IN}><i className="fas fa-fw fa-user" style={{ fontSize: '2em' }}/></NavLink>
                    </NavIcon>
                  </NavItem>
                  {/*<NavItem eventKey="register">
                    <NavIcon style={{ paddingTop: '5px' }}>
                      <NavLink to={ROUTES.SIGN_UP}><i className="fas fa-fw fa-user-plus" style={{ fontSize: '2em' }}/>
                      </NavLink>
                    </NavIcon>
                  </NavItem>*/}
                </SideNav.Nav>
              </SideNav>
            )
          }
        </AuthUserContext.Consumer>
      </div>
    );
  }
}

export default  withFirebase(Nav);

