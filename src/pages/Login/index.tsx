import React from 'react';
import { handleLogin } from '../../apis/authApi';
import { Button, Header, Wrapper } from './style';

const Login = () => {
  return (
    <Wrapper>
      <Header>Eternal Return League</Header>
      <Button onClick={handleLogin}>Login with Google</Button>
    </Wrapper>
  );
};

export default Login;
