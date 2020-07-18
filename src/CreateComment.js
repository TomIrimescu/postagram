import React, { useState } from 'react'
import { css } from 'emotion';
import Button from './Button';
import { v4 as uuid } from 'uuid';
import { API, Auth } from 'aws-amplify';
import { createComment } from './graphql/mutations';

/* Initial state to hold form input, saving state */
const initialState = {
  message: '',
  saving: false
};

export default function CreateComment({
  updateOverlayVisibility, updateComments, comments
}) {
  /* Create local state with useState hook */
  const [formState, updateFormState] = useState(initialState);

  /* onChangeText handler updates the form state when a user types int a form field */
  function onChangeText(e) {
    e.persist();
    console.log(e.target.value);
    updateFormState(currentState => ({ ...currentState, [e.target.name]: e.target.value }));
  }

  /* Save the comment  */
  async function save() {
    console.log(comments);
    try {
      const { message } = formState;
      if (!message) return;
      updateFormState(currentState => ({ ...currentState, saving: true }));
      const commentId = uuid();
      const commentInfo = { message, id: commentId };

      await API.graphql({
        query: createComment,
        variables: { input: commentInfo },
        authMode: 'AMAZON_COGNITO_USER_POOLS'
      }); // updated
      const { username } = await Auth.currentAuthenticatedUser(); // new
      updateComments([...comments, { ...commentInfo, owner: username }]);
      updateFormState(currentState => ({ ...currentState, saving: false }));
      updateOverlayVisibility(false);
    } catch (err) {
      console.log('error: ', err);
    }
  }

  return (
    <div className={containerStyle}>
      <input
        placeholder="Add a nice comment"
        name="message"
        className={inputStyle}
        onChange={onChangeText}
      />
      <Button title="Add Comment" onClick={save} />
      <Button type="cancel" title="Cancel" onClick={() => updateOverlayVisibility(false)} />
      {formState.saving && <p className={savingMessageStyle}>Saving comment...</p>}
    </div>
  )
}

const containerStyle = css`
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 150px;
  position: fixed;
  left: 0;
  border-radius: 4px;
  top: 0;
  margin-left: calc(50vw - 220px);
  margin-top: calc(50vh - 230px);
  background-color: white;
  border: 1px solid #ddd;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0.125rem 0.25rem;
  padding: 20px;
`
const inputStyle = css`
  margin-bottom: 10px;
  outline: none;
  padding: 7px;
  border: 1px solid #ddd;
  font-size: 16px;
  border-radius: 4px;
`
const savingMessageStyle = css`
  margin-bottom: 0px;
`
