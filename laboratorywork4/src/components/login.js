import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(0);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (name === '' || surname === '') {
      setError('Fill the fields');
      return;
    }

    try {
      const response = await axios.post(
        'https://late-glitter-4431.fly.dev/api/v54/users',
        { data: { name, surname } },
        {
          headers: {
            'X-Access-Token': process.env.REACT_APP_ACCESS_TOKEN,
          },
        }
      );
      const { id } = response.data;
      setUserId(id);
      localStorage.setItem('user-info', id);
      navigate('/main');
    } catch (error) {
      console.error(error);
      setError('User already exists!');
    }
  };

  return (
    <div className="main">
      <div className="login-div">
        <form className="login-form" onSubmit={handleSubmit}>
          <h1>Log in</h1>
          <input
            type="text"
            name="name"
            className="name"
            placeholder="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <input
            type="text"
            name="surname"
            className="surname"
            placeholder="Surname"
            value={surname}
            onChange={(event) => setSurname(event.target.value)}
          />
          <input
            type="password"
            name="password"
            className="password"
            placeholder="Password"
          />
          <input type="submit" className="login-button" value="Log in" />
        </form>
      </div>
    </div>
  );
}

export default Login;
