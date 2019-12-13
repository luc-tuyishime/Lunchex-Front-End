import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Label, Icon } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { FETCH_POSTS_QUERY } from '../utils/graphql';
import MyPopup from '../utils/MyPopup';

const LikeButton = ({ user, post: { id, likeCount, likes } }) => {
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        if (user && likes.find(like => like.username === user.username)) { //if the user who is logged in has liked this Menu
            setLiked(true)
        } else {
            setLiked(false)
        }
    }, [user, likes]);

    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        variables: { postId: id },
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            });
            const new_like = result.data.likePost;
            proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: { getPosts: [new_like, ...data.getPosts] }
            });
        }
    })

    const likeButton = user ? (
        liked ? (
            <Button color="blue">
                <Icon name="thumbs up" />
            </Button>
        ) : (
                <Button color="blue" basic>
                    <Icon name="thumbs up" />
                </Button>
            )
    ) : (
            <Button as={Link} to="/login" color="blue" basic>
                <Icon name="thumbs up" />
            </Button>
        )

    return (
        <MyPopup content={liked ? 'Unlike' : 'Like'}>
            <Button as="div" labelPosition="right" onClick={likePost}>
                {likeButton}
                <Label basic color="blue" pointing="left">
                    {likeCount}
                </Label>
            </Button>
        </MyPopup>
    )
}


const LIKE_POST_MUTATION = gql`
 mutation likePost($postId: ID!){
     likePost(postId: $postId){
         id
         likes{
             id
             createdAt
             username
         }
         likeCount
     }
 }
`;

export default LikeButton;