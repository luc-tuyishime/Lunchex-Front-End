import React, { useContext } from "react";
import { Card, Icon, Label, Image, Button } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";

import LikeButton from './LikeButton';
import { AuthContext } from '../context/auth';

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
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow()}
        </Card.Meta>
        <Card.Description>{title}</Card.Description>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likeCount, likes }} />
        <Button labelPosition="right" as={Link} to={`/posts/${id}`}>
          <Button color="purple" basic>
            <Icon name="comments" />
          </Button>
          <Label basic color="purple" pointing="left">
            {commentCount}
          </Label>
        </Button>
        {user && user.username === username && (
          <Button
            as="div"
            color="red"
            floated="right"
            onClick={() => console.log('Deleted Post')}>
            <Icon name="trash" style={{ margin: 0 }} />
          </Button>
        )}
      </Card.Content>
    </Card>
  );
};

export default MenuCard;
