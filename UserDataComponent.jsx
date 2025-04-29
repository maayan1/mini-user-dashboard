import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserDataComponent({ userId }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError('');

      try {
        const [userResponse, todosResponse, postsResponse] = await Promise.all([
          axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`),
          axios.get(`https://jsonplaceholder.typicode.com/todos?userId=${userId}`),
          axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
        ]);

        const { name, email } = userResponse.data;
        const todos = todosResponse.data.slice(0, 5).map(todo => todo.title);
        const posts = postsResponse.data.slice(0, 1).map(post => post.title);

        setUserData({ name, email, todos, posts });
      } catch (err) {
        console.error(err);
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);  

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!userData) return null;

  return (
    <div>
      <h2>{userData.name} ({userData.email})</h2>

      <h3>Todos:</h3>
      <ol>
        {userData.todos.map((todo, index) => (
          <li key={index}>{todo}</li>
        ))}
      </ol>

      <h3>First Post:</h3>
      <div style={{ border: '1px solid gray', padding: '10px', borderRadius: '5px' }}>
        {userData.posts[0]}
      </div>
    </div>
  );
}

export default UserDataComponent;
