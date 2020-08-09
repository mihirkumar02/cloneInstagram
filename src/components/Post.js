import React, { useState, useEffect } from 'react';
import '../App.css';
import Avatar from "@material-ui/core/Avatar";
import { db } from '../firebase';
import firebase from 'firebase';
 
function Post({ postId, signedInUser, username, caption, imageUrl }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState(''); // single comment which is being entered by user
    
    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp','asc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
                });
            }
        return () => {
            unsubscribe();
        };
    },[postId]);

    const postComment = (e) => {
        e.preventDefault();
        
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: signedInUser.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }

    return (
        <div className="post">
            <div className="postHeading">
                <Avatar 
                    className="postAvatar"
                    alt={username}
                    src="/static/images/avatar/1.jpg"
                />
                <h3>{username}</h3>
            </div>

            <img className="postImage" src={imageUrl} alt=""/>
        
            <h4 className="postCaption"><b>{username} </b>{caption}</h4>

            <div className="postComments">  
                {comments.map((singleComment) => (
                    <p>
                        <strong>{singleComment.username}</strong> {singleComment.text}
                    </p>
                ))}
            </div>

            {signedInUser && (     
                <form className="commentForm">
                    <input 
                        className="commentInput"
                        type="text"
                        placeholder="Add a comment.."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                        className="commentButton"
                        disabled={!comment}
                        type="submit"
                        onClick={postComment}
                    >
                        Post
                    </button>
                </form>
            )}

        </div>
    )
}

export default Post;
