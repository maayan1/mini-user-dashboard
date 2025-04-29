import React, { useState, useEffect } from 'react';
import './UserDashboardP.css';

function UserDashboardP() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userTodos, setUserTodos] = useState([]);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };
    fetchUsers();
  }, []);

  const handleUserClick = async (userId) => {
    setSelectedUserId(userId);
    setLoadingUserData(true);
    const user = users.find(u => u.id === userId);
    setSelectedUser(user);

    try {
      const [postsResp, todoResp] = await Promise.all([
        fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`).then(res => res.json()),
        fetch(`https://jsonplaceholder.typicode.com/todos?userId=${userId}`).then(res => res.json())
      ]);
      setUserPosts(postsResp.slice(0, 5));
      setUserTodos(todoResp.slice(0, 5));
    } catch (error) {
      console.error('Error fetching user data: ', error);
    } finally {
      setLoadingUserData(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <p>Click a user below to explore their profile, posts, and todos</p>
      </header>

      <div className="dashboard-content">
        <aside className="user-list">
          <h2> Users</h2>
          {users.map(user => (
            <div
              key={user.id}
              onClick={() => handleUserClick(user.id)}
              className={`user-item ${selectedUserId === user.id ? 'selected' : ''}`}
            >
              <p><strong>{user.name}</strong></p>
              <small>{user.email}</small>
            </div>
          ))}
        </aside>

        <main className="user-details">
          {loadingUserData && <div className="loader">🔄 Loading...</div>}

          {selectedUser && !loadingUserData && (
            <>
              <section className="profile-card">
                <h3> User Profile</h3>
                <ul>
                  <li><strong>Name:</strong> {selectedUser.name}</li>
                  <li><strong>Email:</strong> {selectedUser.email}</li>
                  <li><strong>Phone:</strong> {selectedUser.phone}</li>
                  <li><strong>Website:</strong> {selectedUser.website}</li>
                </ul>
              </section>

              <section className="post-card">
                <h3> Recent Posts</h3>
                {userPosts.map(post => (
                  <div key={post.id} className="post-item">
                    <h4>{post.title}</h4>
                    <p>{post.body.substring(0, 100)}...</p>
                  </div>
                ))}
              </section>

              <section className="todo-card">
                <h3> Todo List</h3>
                {userTodos.map(todo => (
                  <div key={todo.id} className={`todo-item ${todo.completed ? 'done' : ''}`}>
                    {todo.title}
                  </div>
                ))}
              </section>
            </>
          )}

          {!selectedUserId && !loadingUserData && (
            <div className="placeholder"> Select a user to see details.</div>
          )}
        </main>
      </div>
    </div>
  );
}

export default UserDashboardP;
