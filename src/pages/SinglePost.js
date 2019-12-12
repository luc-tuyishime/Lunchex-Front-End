import React, { useContext, useState, useRef } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import moment from 'moment';
import { Grid, Button, Card, Icon, Label, Image, Dimmer, Loader, Form, Header } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import "../style/HomeStyle.css";

const SinglePost = (props) => {
    const postId = props.match.params.postId;
    const { user } = useContext(AuthContext);
    const commentInputRef = useRef(null);

    const [comment, setComment] = useState('');

    const { data } = useQuery(FETCH_POST_QUERY, {
        variables: { postId }
    });

    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
        update() {
            setComment('');
            commentInputRef.current.blur();
        },
        variables: {
            postId,
            body: comment
        }
    })

    function deletePostCallback() {
        props.history.push("/");
    }


    let postMarkup;  // check wether we have the data in the query 
    if (!data) {
        postMarkup = <Dimmer className="loading-padding" active inverted>
            <Loader size="large">Loading</Loader>
        </Dimmer>
    } else {
        const { id, title, body, createdAt, username, comments, likes, likeCount, commentCount } =
            data.getPost;
        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image src="https://react.semantic-ui.com/images/avatar/large/steve.jpg"
                            size="small"
                            float="right"
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{title}</Card.Description>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr />
                            <Card.Content extra>
                                <LikeButton user={user} post={{ id, likes, likeCount }} />
                                <Button as="div" labelPosition="right" onClick={() => console.log('Comment on post')} >
                                    <Button basic color="blue">
                                        <Icon name="comments" />
                                    </Button>
                                    <Label basic color="blue" pointing="left">
                                        {commentCount}
                                    </Label>
                                </Button>
                                <Button as="div" labelPosition="right" onClick={() => console.log('Share this menu')} >
                                    <Button basic color="blue">
                                        <Icon name="share" /> Share
                                    </Button>
                                </Button>
                                {user && user.username === username && (
                                    <DeleteButton postId={id} callback={deletePostCallback} />
                                )}
                            </Card.Content>
                        </Card>
                        {user ? (
                            <Card fluid>
                                <Card.Content>
                                    <p>Post a Comment</p>
                                    <Form>
                                        <div className="ui action input fluid">
                                            <input
                                                type="text"
                                                placeholder="Comment..."
                                                name="comment"
                                                value={comment}
                                                onChange={e => setComment(e.target.value)}
                                                ref={commentInputRef}
                                            />
                                            <button
                                                type="submit"
                                                className="ui button blue"
                                                disabled={comment.trim() === ''}
                                                onClick={submitComment}

                                            >Post</button>
                                        </div>
                                    </Form>
                                </Card.Content>
                            </Card>
                        ) :
                            (<Header as='h4' color="red">Please log in to add a comment..</Header>)
                        }
                        {comments.map(comment => (
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    {user && user.username === comment.username && (
                                        <DeleteButton postId={id} commentId={comment.id} />
                                    )}
                                    <Card.Content className="username-comment">{comment.username}</Card.Content>
                                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                    <Card.Description>{comment.body}</Card.Description>
                                </Card.Content>
                            </Card>
                        ))}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
    return postMarkup;
}

// Likes: determone whether we have liked or not.


// CREATE COMMENT QUERY
const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: ID!, $body: String!){
      createComment(postId: $postId, body: $body){
          id
          comments{
              id
              body
              createdAt
              username
          }
          commentCount
      }
  }
`;

// FETCH SINGLE POST
const FETCH_POST_QUERY = gql`
   query($postId: ID!){
       getPost(postId: $postId){
           id
           title
           body
           createdAt
           username
           likeCount
           likes{
               username
           }
           commentCount
           comments{
               id
               username
               createdAt
               body
           }
       }
   }
`;

export default SinglePost;