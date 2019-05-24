import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const config = {
  apiKey: "AIzaSyCfuZPrerZxoHgu2DrKtVvX38w_GrFPqqk",
  authDomain: "open-innovation-pn.firebaseapp.com",
  databaseURL: "https://open-innovation-pn.firebaseio.com",
  projectId: "open-innovation-pn",
  storageBucket: "open-innovation-pn.appspot.com",
  messagingSenderId: "599877382405"
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.database();
    this.st = app.storage();
    this.emailAuthProvider = app.auth.EmailAuthProvider;
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  doGet = (email, password) => this.emailAuthProvider.credential(email, password);

  // *** Merge Auth and DB User API *** //

  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.node(authUser.uid)
          .once('value')
          .then(snapshot => {
            const dbUser = snapshot.val();
            //default empty roles
            if (!dbUser.roles) {
              dbUser.roles = [];
            }
            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              ...dbUser,
            };

            next(authUser);
          });
      } else {
        fallback();
      }
    });

  // *** User API ***

  user = uid => this.db.ref(`users/${uid}`);

  users = () => this.db.ref('users');

  nodes = () => this.db.ref('nodes');

  node = uid => this.db.ref(`nodes/${uid}`);

  storage = (p1, p2, title, filename) => this.st.ref(`reports/${p1+p2+title}/${filename}`);

  findProject = (id, uid) => this.db.ref(`nodes/${id}/projects/${uid}`);

  findChildren = (id, parentID) => this.db.ref(`nodes/${id}/parents/${parentID}`)

  findChildrenUsers = (id, parentID) => this.db.ref(`users/${id}/parents/${parentID}`)

}

export default Firebase;
