import React, { useContext } from "react";
import { Card, Icon, Label, Image, Button } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";

import LikeButton from './LikeButton';
import { AuthContext } from '../context/auth';
import DeleteButton from './DeleteButton';
import MyPopup from '../utils/MyPopup';

const MenuCard = ({
  post: { title, body, createdAt, id, username, likeCount, commentCount, likes }
}) => {
  // getting the props and destructure because we are passing the props down

  const { user } = useContext(AuthContext);

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/steve.jpg"
        />
        <Card.Header style={{ color: '#2196f3' }} as={Link} to={`/posts/${id}`}>{username}</Card.Header>
        <Card.Meta >
          {moment(createdAt).fromNow()}
        </Card.Meta>
        <Card.Description>{title}</Card.Description>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likeCount, likes }} />
        <MyPopup content="Comment on post..">
          <Button labelPosition="right" as={Link} to={`/posts/${id}`}>
            <Button color="purple" basic>
              <Icon name="comments" />
            </Button>
            <Label basic color="purple" pointing="left">
              {commentCount}
            </Label>
          </Button>
        </MyPopup>
        {user && user.username === username && <DeleteButton postId={id} />}
      </Card.Content>
    </Card>
  );
};

export default MenuCard;
