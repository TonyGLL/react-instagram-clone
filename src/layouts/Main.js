import React, { useState, useEffect } from 'react';

import { db } from '../firebase';

import '../assets/Main.css';

import Posts from '../components/Posts';

import InstagramEmbed from 'react-instagram-embed';

function Main(props) {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        db.collection('posts')
            .orderBy('timestamp', 'desc')
            .onSnapshot(snapshot => {
                setPosts(snapshot.docs.map(doc => (
                    {
                        id: doc.id,
                        post: doc.data() 
                    }
                )));
            });
    }, []);

    return (
        <>
            <div className="post__main__section">
                <div className="app__postsLeft">
                    {
                        posts.map(({ id, post }) => (
                            <Posts
                                key={ id }
                                postId={ id }
                                imageUrl={ post.imageUrl }
                                username={ post.username }
                                caption={ post.caption }
                                timestamp={ post.timestamp }
                            />
                        ))
                    }
                </div>

                <div className="app__postsRight">
                    <InstagramEmbed
                        url='https://instagr.am/p/BtbY4t_gQ78/'
                        maxWidth={320}
                        hideCaption={false}
                        containerTagName='div'
                        protocol=''
                        injectScript
                        onLoading={() => {}}
                        onSuccess={() => {}}
                        onAfterRender={() => {}}
                        onFailure={() => {}}
                    />
                </div>
            </div>
        </>
    );
}

export default Main;