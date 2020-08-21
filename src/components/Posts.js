import React, { useState, useEffect, Fragment } from 'react';
import '../assets/Posts.css';
import { db } from '../firebase';
import firebase from 'firebase';

function Posts({ imageUrl, username, caption, postId, timestamp }) {

    const [commets, setComments] = useState([]);
    const [comment, setComment] = useState('');

    const [user, setUser] = useState('');

    useEffect(() => {

        firebase.auth().onAuthStateChanged((user) => {
            setUser(user.displayName);
        })

        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection('posts')
                .doc(postId)
                .collection('comments')
                .orderBy('timestamp', 'desc')
                .onSnapshot(snapshot => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
                });
        }

        return () => {
            unsubscribe();
        };
    }, [postId]);

    const postComment = (e) => {
        e.preventDefault();

        db
            .collection('posts')
            .doc(postId)
            .collection('comments')
            .add({
                text: comment,
                username: user,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        setComment('');
    }

    return (
        <Fragment>
            <div className="post">
                {/* HEADER -> AVATAR + USERNAME */}
                <div className="post__header">
                    <img
                        className="post__avatar"
                        alt=""
                        src="https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/user.png"
                        width="35"
                    />
                    <div className="post__info">
                        <h4>{ username }</h4>
                    </div>
                </div>
    
                {/* IMAGE */}
                <img
                    className="post__image"
                    src={ imageUrl }
                    alt=""/>
    
                {/* USERNAME + CAPTION */}
                <h4 className="post__text"><strong>{ username }:</strong> <span>{ caption }</span></h4>

                {/* COMMENTS SECTION */}
                <div className="post_comments">
                    {
                        commets.map(comment => (
                            <p>
                                <strong>{ comment.username }</strong> <span>{ comment.text }</span>
                            </p>
                        ))
                    }
                </div>
                {/* POST COMMENTS */}
                <form className="post__commentBox">
                    <input
                        className="post__input" 
                        type="text"
                        placeholder="Add a comment..."
                        value={ comment }
                        onChange={ e => setComment(e.target.value) }
                    />
                    <button
                        disabled={ !comment }
                        className="post__button"
                        type="submit"
                        onClick={ postComment }
                        onKeyPress={ postComment }
                    >
                        Post
                    </button>
                </form>
            </div>
        </Fragment>
    );
}

export default Posts;