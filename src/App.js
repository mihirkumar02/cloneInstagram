import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './components/Post';
import { db, auth } from './firebase';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './components/ImageUpload';


function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  // useEffect -> runs a piece of code based on a specific condition

  useEffect(() => {
    // The code runs here

    // onSnapshot -> fires the code every single time a change happens in the database.
    // So, if someone adds a new post, the feed updates automatically, without needing to refresh!
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id, 
        post: doc.data()
      })));
    })
  }, []); 

  // [] is the condition based on which the content refreshes.
  // If it is given blank i.e., [], it will refresh the content once upon loading.  


  useEffect(() => {
    const unsubscribe =  auth.onAuthStateChanged((authUser) => {
      if(authUser){
        // user has logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        // user has logged out
        setUser(null);
      }
    })

    return () => {
      // perform some cleanup actions before firing useEffect again
      // otherwise there will be a spam of the same code which will run again and again.
      unsubscribe();
    }
  }, [user, username]);

  // user and username are the 2 variables which are changing and hence the useEffect depends on these 2 variables.
 
  const signUp = (event) => {
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message))

    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))

    setOpenSignIn(false);
  }

  return (
    <div className="App">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              className="appHeaderImage"
              alt="Instagram"
            />
            <form className="signUpForm">
              <Input 
                placeholder = "Username.."
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <Input 
                placeholder = "Email.."
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input 
                placeholder = "Password.."
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button onClick={signUp}>Sign Up</Button>
            </form>
          </center>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              className="appHeaderImage"
              alt="Instagram"
            />
            <form className="signUpForm">
              <Input 
                placeholder = "Email.."
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input 
                placeholder = "Password.."
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button onClick={signIn}>Sign In</Button>
            </form>
          </center>
        </div>
      </Modal>

      <div className="appHeader">
          <img
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            className="appHeaderImage"
            alt="Instagram"
          />

          {user ? (
            <Button onClick={() => auth.signOut()}>Logout</Button>
          ) : (
            <div className="loginContainer">
              <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
            </div>
          )}
      </div>
        

        <div className="postsHolder"> 
          <div className="postsLeft">
            {
              posts.map(({id, post}) => (
                <Post key={id} postId={id} signedInUser={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
              ))
            }
          </div>

        </div>



    {user?.displayName ? (
        <ImageUpload username={user.displayName}/>
      ) : (
        <h3>Sorry you need to be logged in to upload.</h3>
      )}
    </div>
  );
}

export default App;
