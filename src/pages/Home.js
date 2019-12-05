import React, { useContext, useEffect, useState } from "react";
import { Grid, Container, Loader, Dimmer, Transition } from "semantic-ui-react";
import { useQuery } from "@apollo/react-hooks";

import MenuCard from "../components/MenuCard";
import { FETCH_POSTS_QUERY } from '../utils/graphql';
import "../style/HomeStyle.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const { loading, data } = useQuery(FETCH_POSTS_QUERY); // post can be null or undefined cause data itself is not polulated, so we need to check if it's truphy

  useEffect(() => {
    if (data) {
      setPosts(data.getPosts);
    }

  }, [data]);
  console.log('here are the posts', data);
  return (
    <Container>
      <Grid columns={3}>
        <Grid.Row className="page-title">
          <h1>Recent Menus</h1>
        </Grid.Row>
        <Grid.Row>

          {loading ? (
            <Dimmer className="loading-padding" active inverted>
              <Loader size="large">Loading</Loader>
            </Dimmer>
          ) : (
              <Transition.Group>
                {posts &&
                  posts.map(post => (
                    <Grid.Column key={post.id} className="grid-menu">
                      <MenuCard post={post} />
                    </Grid.Column>
                  ))}
              </Transition.Group>
            )}
        </Grid.Row>
      </Grid>
    </Container>
  );
};



export default Home;
