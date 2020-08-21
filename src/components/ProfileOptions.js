import React, { useState, useEffect, useRef } from 'react';

import { db, storage, auth } from '../firebase';
import firebase from 'firebase';

import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { Avatar } from '@material-ui/core';

import '../assets/ProfileOptions.css';

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
    }
}));

function ProfileOptions({ username }) {
    
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const anchorRef = useRef(null);

    const [caption, setCaption] = useState('');
    
    const [image, setImage] = useState('');
    // const [url, setrl] = useState('');
    const [progress, setProgress] = useState('');

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
        event.preventDefault();
        setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
        anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${ image.name }`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(progress);
            },
            (error) => {
                alert(error.message);
            },
            () => {
                storage
                    .ref('images')
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        })
                        setProgress(0);
                        setCaption('');
                        setImage(null);
                        setOpenModal(false);
                    })
            }
        );
    }

    return (
        <>
            <Modal
                open={ openModal }
                onClose={ () => setOpenModal(false) }
            >
                <div style={modalStyle} className={classes.paper}>
                    <center>
                        <img
                            className="app__headerImage"
                            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
                            alt=""/>
                    </center>

                    <div className="form-group">
                        <input
                            placeholder="Enter a caption..."
                            type="text"
                            className="form-control mt-3"
                            onChange={ e => setCaption(e.target.value) }
                            value={ caption }
                        />

                        <input
                            type="file"
                            className="form-control mb-3 mt-3"
                            onChange={ handleChange }
                        />
                        <progress 
                            value={ progress }
                            max="100"
                            />
                            
                    </div>
                    <Button 
                        onClick={ handleUpload }
                        variant="contained"
                        color="primary"
                        >Upload Image
                    </Button>
                </div>
            </Modal>
            <Avatar
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                className="app__options"
                alt={ username }
                src="/static/images/avatar/1.jpg"
                />
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                >
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                        >
                            <Paper>
                                <ClickAwayListener 
                                    onClickAway={handleClose}
                                >
                                <MenuList 
                                    autoFocusItem={open} 
                                    id="menu-list-grow" 
                                    onKeyDown={handleListKeyDown}
                                >
                                    <MenuItem 
                                        onClick={ handleClose }
                                    >
                                        Profile
                                    </MenuItem>

                                    <MenuItem 
                                        onClick={ () => setOpenModal(true) }
                                    >
                                        Upload Image
                                    </MenuItem>

                                    <MenuItem 
                                        onClick={ () => auth.signOut() }
                                    >
                                        Log Out
                                    </MenuItem>
                                </MenuList>

                                </ClickAwayListener>
                                
                            </Paper>
                        </Grow>
                    )}
            </Popper>
        </>
    );
}

export default ProfileOptions;