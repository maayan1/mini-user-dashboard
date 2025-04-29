import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'


function UserDashborad() {

    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null)
    const [userPosts, setUserPosts] = useState([]);
    const [userTodos, setUserTodos] = useState([]);
    const [loadingUserData, setLoadingUserData] = useState(false)
  
    useEffect(() => {

        const fetchUsers = async () => {
            try{
                const resp = await axios.get("https://jsonplaceholder.typicode.com/users")
                setUsers(resp.data)
            } catch (error){
                console.error("Error fetching users: ", error)
            }
        }
        fetchUsers()
    }, []);

    const handleUserClick = async (userId) => {
        setSelectedUserId(userId)
        setLoadingUserData(true)

        try{
            const [postsResp, todoResp] = await Promise.all([
                axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`),
                axios.get(`https://jsonplaceholder.typicode.com/todos?userId=${userId}`)
            ])
            setUserPosts(postsResp.data.slice(0,5))
            setUserTodos(todoResp.data.slice(0,5))
        } catch (error){
            console.error('Error fetching user data: ', error)
        } finally {
            setLoadingUserData(false)
        }
    }
  
    return (
      <div>
        <h1>User Dashboard</h1>


        <h2>Users:</h2>
        <ul>
          {users.map(user => (
            <li key={user.id}>
               <button onClick={()=> handleUserClick(user.id)}disabled={loadingUserData}> 
                {user.name} ({user.email})
               </button>
            </li>
          ))}
        </ul>
  
        {loadingUserData && <p>Loading posts and todos...</p>}

        {selectedUserId && !loadingUserData && (
        <div style={{ marginTop: '30px' }}>
            <h2>Posts for User {selectedUserId}:</h2>
            <ul>
            {userPosts.map(post => (
                <li key={post.id}>{post.title}</li>
            ))}
            </ul>

            <h2>Todos for User {selectedUserId}:</h2>
            <ul>
            {userTodos.map(todo => (
                <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  </div>
)}
</div>
    );
  }

export default UserDashborad
