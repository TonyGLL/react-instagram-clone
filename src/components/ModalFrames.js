import React, { useState, useEffect } from 'react';

import { auth } from '../firebase';

import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';

import '../assets/ModalFrame.css';
import ProfileOptions from '../components/ProfileOptions';

function getModalStyle() {
    const top = 50;
    const left = 50;
  
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
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3)
    },
}));

function ModalFrame(props) {

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    const [openSignUp, setOpenSignUp] = useState(false);
    const [openSignIn, setOpenSignIn] = useState(false);
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const [user, setUser] = useState(null);

    // EVENTO TO SAVE THE USER IN THE DATABASE
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                console.log(authUser);
                setUser(authUser);

                if (authUser.displayName) {
                    
                }else {
                    return authUser.updateProfile({
                        displayName: username
                    });
                }
            }else {
                setUser(null);
            }
        });

        return () => {
            unsubscribe();
        }
    }, [user, username]);

    // SIGN UP EVENT
    const signUp = (e) => {
        e.preventDefault();
        auth.createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
            return authUser.user.updateProfile({
                displayName: username
            });
        })
        .catch((error) => alert(error.message));

        setOpenSignUp(false);
    }

    // SIGN IN EVENT
    const signIn = (e) => {
        e.preventDefault();
        auth.signInWithEmailAndPassword(email, password)
        .catch((error) => alert(error.message));

        setOpenSignIn(false);
    }

    return (
        <>
            {
                user ? (
                    <div>
                        {
                            user?.displayName ? (
                                <ProfileOptions 
                                    username={ user.displayName }
                                />
                            ) : (
                                <h3>Sorry you need to log in to upload.</h3>
                            )
                        }   
                    </div>
                ): (
                    <div className="app__loginContainer">
                        <Button
                            onClick={ () => setOpenSignIn(true) }
                            variant="outlined"
                            color="primary"
                            >Sign In
                        </Button>
                        <Button
                            onClick={ () => setOpenSignUp(true) }
                            variant="outlined"
                            color="secondary"
                            className="ml-2"
                            >Sign Up
                        </Button>
                    </div>
                )
            }

            {/* SIGN UP MODAL */}
            <Modal
                open={ openSignUp }
                onClose={ () => setOpenSignUp(false) }
            >
                <div style={modalStyle} className={classes.paper}>
                    <center>
                        <img
                            className="app__headerImage"
                            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
                            alt=""/>
                    </center>
                    <form className="app__signup">
                        
                        <Input
                            className="mb-3"
                            placeholder="Username"
                            type="text"
                            value={ username }
                            onChange={ e => setUsername(e.target.value) }
                        />

                        <Input
                            className="mb-3"
                            placeholder="Email"
                            type="email"
                            value={ email }
                            onChange={ e => setEmail(e.target.value) }
                        />
    
                        <Input
                            className="mb-3"
                            placeholder="Password"
                            type="password"
                            value={ password }
                            onChange={ e => setPassword(e.target.value) }
                        />
                            
                        <Button 
                            type="submit"
                            onClick={ signUp }
                            variant="contained"
                            color="primary"
                            >Sign Up
                        </Button>
                    </form>
                </div>
            </Modal>

            {/* SIGN IN MODAL */}
            <Modal
                open={ openSignIn }
                onClose={ () => setOpenSignIn(false) }
            >
                <div style={modalStyle} className={classes.paper}>
                    <center>
                        <img
                            className="app__headerImage"
                            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
                            alt=""/>
                    </center>
                    <form className="app__signup">

    
                        <Input
                            className="mb-3"
                            placeholder="Email"
                            type="email"
                            value={ email }
                            onChange={ e => setEmail(e.target.value) }
                        />
    
                        <Input
                            className="mb-3"
                            placeholder="Password"
                            type="password"
                            value={ password }
                            onChange={ e => setPassword(e.target.value) }
                        />
                            
                        <Button 
                            type="submit"
                            onClick={ signIn }
                            variant="contained"
                            color="primary"
                            >Sign In
                        </Button>
                    </form>
                </div>
            </Modal>
        </>
    );
}

export default ModalFrame;