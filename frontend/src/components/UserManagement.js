import React, { useState } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <div>
      <h1>User Management</h1>
      <button onClick={fetchUsers}>Load Users</button>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name} ({user.age} years old)</li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;
