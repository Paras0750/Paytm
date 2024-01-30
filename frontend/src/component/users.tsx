import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  user: User;
}
interface User {
  firstName: string;
  lastName: string;
  _id: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/user/bulk")
      .then((response) => {
        setUsers(response.data.user);
        setFilteredUsers(response.data.user);
      })
      .catch((err) => {
        alert(err);
      });
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = users.filter((user: User) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return fullName.includes(searchTerm);
    });
    setFilteredUsers(filtered);
  };

  return (
    <div className="px-4 my-3 ">
      <div className="text-2xl bold">Users</div>
      <div className="my-5">
        <label htmlFor="searchUsers" className="text-md">
          Search Users:
        </label>
        <input
          className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none"
          type="text"
          onChange={handleChange}
          id="searchUsers"
        />
      </div>
      <div className="">
        {filteredUsers &&
          filteredUsers.map((user: User, i) => <User key={i} user={user} />)}
      </div>
    </div>
  );
};

export default Users;

const User = (props: Props) => {
  const { firstName, lastName, _id } = props.user;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(
      `/sendMoney?id=${_id}&firstName=${firstName}&lastName=${lastName}`
    );
  };
  return (
    <div className="flex justify-between my-4 shadow-lg bg-gray-50 hover:bg-gray-200 rounded-2xl p-3">
      <div className="flex items-center gap-2">
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
          <div className="flex flex-col justify-center h-full text-xl">
            {firstName?.[0]}
          </div>
        </div>
        <div className="text-bolder text-[1.1rem] flex-wrap">{`${firstName} ${lastName}`}</div>
      </div>
      <button
        className="px-4 py-2 bg-blue-200 rounded-2xl"
        onClick={handleClick}
      >
        Send Money
      </button>
    </div>
  );
};
