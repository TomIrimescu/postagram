import React, { useState, useEffect } from 'react'
import { css } from 'emotion';
import { useParams } from 'react-router-dom';
import { API, Storage, Auth } from 'aws-amplify';
import { getPost, listComments } from './graphql/queries';
import Button from './Button';
import Comments from './Comments';
import CreateComment from './CreateComment';

export default function Post() {
  /* create a couple of pieces of initial state */
  const [showOverlay, updateOverlayVisibility] = useState(false);
  const [comments, updateComments] = useState([]);
  const [myComments, updateMyComments] = useState([]);

  const [loading, updateLoading] = useState(true);
  const [post, updatePost] = useState(null);
  const { id } = useParams()
  useEffect(() => {
    fetchPost()
  }, [])
  async function fetchPost() {
    try {
      const postData = await API.graphql({
        query: getPost, variables: { id }
      });
      const currentPost = postData.data.getPost
      const image = await Storage.get(currentPost.image);

      currentPost.image = image;
      updatePost(currentPost);
      updateLoading(false);
    } catch (err) {
      console.log('error: ', err)
    }
  }

  /* fetch comments when component loads */
  useEffect(() => {
    fetchComments()
  }, [])

  async function fetchComments() {
    /* query the API, ask for 100 items */
    let commentData = await API.graphql({ query: listComments, variables: { limit: 100 } });
    let commentsArray = commentData.data.listComments.items;
    /* update the comments array in the local state */
    setCommentState(commentsArray);
  }

  async function setCommentState(commentsArray) {
    const user = await Auth.currentAuthenticatedUser();
    const myCommentData = commentsArray.filter(p => p.owner === user.username);
    updateMyComments(myCommentData);
    updateComments(commentsArray);
  }

  if (loading) return <h3>Loading...</h3>
  console.log('post: ', post)
  return (
    <>
      <h1 className={titleStyle}>{post.name}</h1>
      <h3 className={locationStyle}>{post.location}</h3>
      <p>{post.description}</p>
      <img alt="post" src={post.image} className={imageStyle} /><br></br>
      <Button title="New Comment" onClick={() => updateOverlayVisibility(true)} />
      {showOverlay && (
        <CreateComment
          updateOverlayVisibility={updateOverlayVisibility}
          updateComments={setCommentState}
          comments={comments}
        />
      )}
      <Comments comments={myComments} />
    </>
  )
}

const titleStyle = css`
  margin-bottom: 7px;
`
const locationStyle = css`
  color: #0070f3;
  margin: 0;
`
const imageStyle = css`
  max-width: 500px;
  margin-bottom: 25px;
  @media (max-width: 500px) {
    width: 100%;
  }
`
