import React, { useState, useContext } from "react";
import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import "../style/RegisterStyle.css";

import { AuthContext } from '../context/auth';
import { useForm } from '../utils/hooks';


const Login = (props) => {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(loginUserCallback, { // the callback function 
    username: "",
    password: "",
  })

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    // will trigger the update function if the mutation is successfully triggered
    update(_, { data: { login: userData } }) {
      console.log("here is the result", userData);
      context.login(userData);
      props.history.push("/");
    },
    onError(err) {
      console.log("here are the errors", err.graphQLErrors);
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values
  });

  function loginUserCallback() {
    loginUser();
  };

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Login</h1>
        <Form.Input
          label="username"
          placeholder="Username...."
          name="username"
          type="text"
          value={values.username}
          error={errors.username ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="password"
          placeholder="Password...."
          name="password"
          type="password"
          value={values.password}
          error={errors.password ? true : false}
          onChange={onChange}
        />
        <Button type="submit" primary>
          Login
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map(value => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const LOGIN_USER = gql`
  mutation login(
    $username: String!
    $password: String!
  ) {
    login(
        username: $username
        password: $password
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Login;
