import gql from 'graphql-tag';

export const FETCH_POSTS_QUERY = gql`
{
  getPosts {
    id
    title
    body
    createdAt
    username
    commentCount
    comments {
      username
      body
      createdAt
    }
    likes {
      username
      createdAt
    }
    likeCount
  }
}
`;