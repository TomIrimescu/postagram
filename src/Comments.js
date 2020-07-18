import React from 'react'
import { css } from 'emotion';

export default function Comments({
  comments = []
}) {
  return (
    <div className={commentMessageWrapper}>
      <h2 className={commentHeaderStyle}>Comments:</h2>
      {
        comments.map(comment => (
          <div key={comment.id}>
            <p className={commentMessageStyle}>
              {comment.message}
            </p>
          </div>
        ))
      }
    </div>
  )
}

const commentHeaderStyle = css`
  margin-top: 5px;
  margin-bottom: 10px;
`
const commentMessageWrapper = css`
  margin-bottom: 40px;
`
const commentMessageStyle = css`
  margin: 0px 0px 10px 0px;
  color: blue;
  font-weight: 600;
`
