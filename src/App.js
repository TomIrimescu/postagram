import React, { useState, useEffect } from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';

// import API from Amplify library
import { API, Auth } from 'aws-amplify'

// import query definition
import { listPosts } from './graphql/queries'

async function checkUser() {
  const user = await Auth.currentAuthenticatedUser();
  console.log('user:', user);
  console.log('user attributes: ', user.attributes);
}

function App() {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    fetchPosts();
    checkUser(); // new function call
  }, []);
  async function fetchPosts() {
    try {
      const postData = await API.graphql({ query: listPosts });
      setPosts(postData.data.listPosts.items)
    } catch (err) {
      console.log({ err })
    }
  }
  return (
    <div>
      <h1>Hello Amplify</h1>
      {
        posts.map(post => (
          <div key={post.id}>
            <h3>{post.name}</h3>
            <p>{post.location}</p>
            <p>{post.description}</p>
          </div>
        ))        
      }
      <AmplifySignOut />
    </div>
  )
}

export default withAuthenticator(App);
