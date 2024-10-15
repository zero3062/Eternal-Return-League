import { handleLogin } from '../apis/authApi';

const Login = () => {
  return (
    <div>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;
