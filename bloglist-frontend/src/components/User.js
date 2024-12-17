const User = ({ user }) => {
  return (
    <tbody>
      <tr>
        <td>{user.name}</td>
        <td>{user.blogs.length}</td>
      </tr>
    </tbody>
  )
}

export default User
