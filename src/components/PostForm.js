import React from 'react'
import { Button, Image, Form, Modal, Message, Grid } from 'semantic-ui-react';
import { useAlert } from 'react-alert'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { useForm } from '../utils/hooks';
import { FETCH_POSTS_QUERY } from '../utils/graphql';
import MENULOGO from '../images/turkey.png';

import "../style/HomeStyle.css";

const PostForm = (props) => {
    const alert = useAlert();
    const { values, onChange, onSubmit } = useForm(createPostCallBack, {
        title: '',
        body: ''
    });

    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            });
            const new_post = result.data.createPost;
            proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: { getPosts: [new_post, ...data.getPosts] }
            });
            values.title = '';
            values.body = '';
        }
    });

    function createPostCallBack() {
        return (values.title === '' || values.body === '') ?
            (alert.show(<Message color='red'>Please fill all the forms...</Message>)) :
            (createPost() && alert.show(<Message color='green'>Menu added successfully....</Message>)
                && props.history.push("/"))

    }

    return (
        <div className="form-padding">
            <Grid centered columns={3}>
                <Grid.Column>
                    <Image className="image-size" src={MENULOGO} circular />
                    <Form onSubmit={onSubmit}>
                        <Form.Field>
                            <Form.Input
                                placeholder="title...."
                                name="title"
                                onChange={onChange}
                                value={values.title}
                                error={error ? true : false}
                            />
                            <Form.TextArea
                                placeholder='Description...'
                                name="body"
                                onChange={onChange}
                                value={values.body}
                                error={error ? true : false}
                            />

                        </Form.Field>
                        <Modal.Actions>
                            <Button type="submit" color='green'>Add</Button>
                        </Modal.Actions>
                    </Form>
                </Grid.Column>
            </Grid>
        </div>
    )
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($title: String! $body: String!){
      createPost(title: $title body: $body){
          id
          title
          body
          createdAt
          username
          likes {
              id
              username
              createdAt
          }
          likeCount
          comments{
              id
              body
              username
              createdAt
          }
          commentCount
      }
  }
`;

export default PostForm;
