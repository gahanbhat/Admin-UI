import React from "react";
import { useState, useEffect } from "react";
import useTable from "./hook/useTable";
import "./App.css";

const App = () => {
  const [fetchData, setFetchData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      const data = await response.json();
      setFetchData(data);
    };
    fetchData();
  }, []);
  return (
    <div className="flex flex-col p-3 m-3">
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="border rounded-lg divide-y divide-grey-200 focus-grey-200  ">
            <div className="overflow-hidden">
              {fetchData.length > 0 ? (
                <MyTable userData={fetchData} />
              ) : (
                <div>Loading...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyTable = ({ userData }) => {
  const [page, setPage] = useState(1);
  const [inputData, setInputData] = useState("");
  const [newUserData, setnewUserData] = useState(userData);
  const { slice, range } = useTable(newUserData, page, inputData);
  const [selectedItems, setSelectedItems] = useState([]);
  const [editID, setEditID] = useState(-1);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("");

  function checkboxHandler(e) {
    let isSelected = e.target.checked;
    let value = parseInt(e.target.value);
    if (isSelected) {
      setSelectedItems([...selectedItems, value]);
    } else {
      setSelectedItems((prevData) => {
        return prevData.filter((id) => {
          return id !== value;
        });
      });
    }
  }

  function checkAllHandler() {
    if (slice.length === selectedItems.length) {
      setSelectedItems([]);
    } else {
      const postIds = slice.map((user) => {
        return parseInt(user.id);
      });

      setSelectedItems(postIds);
    }
  }

  function delhandler(id) {
    const newUserDatax = newUserData.filter((user) => {
      if (user.id !== id) return user;
    });
    setnewUserData(newUserDatax);
  }

  function multiDeleteHandler() {
    const newUserDatax = newUserData.filter((user) => {
      if (!selectedItems.includes(parseInt(user.id))) {
        return user;
      }
    });
    setnewUserData(newUserDatax);
    setSelectedItems([]);
  }

  const handleupdate = (id) => {
    const newUserDatax = newUserData.map((user) => {
      if (user.id === id) {
        let newUser = {};
        newUser.id = id;
        if (editName === "" || editName === undefined) {
          newUser.name = user.name;
        } else {
          newUser.name = editName;
        }

        if (editEmail === "" || editEmail === undefined) {
          newUser.email = user.email;
        } else {
          newUser.email = editEmail;
        }

        if (editRole === "" || editRole === undefined) {
          newUser.role = user.role;
        } else {
          newUser.role = editRole;
        }
        return newUser;
      }
      return user;
    });
    setnewUserData(newUserDatax);
    setEditID(-1);
  };

  return (
    <>
      <div className="py-3 px-4  rounded-t border-b">
        <div className="flex w-full justify-between">
          <div className="relative max-w-xs">
            <label className="sr-only">Search</label>
            <input
              type="text"
              name="hs-table-with-pagination-search"
              id="hs-table-with-pagination-search"
              className="p-3 pl-10 block w-full border-black rounded-md text-sm  focus:border-blue-500 focus:ring-blue-500 outline-none"
              placeholder="Search for items"
              onChange={(e) => setInputData(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-4">
              <svg
                className="h-3.5 w-3.5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </div>
          </div>
          <button
            className="bg-red-500 rounded-xl p-2 text-white "
            onClick={multiDeleteHandler}
          >
            Delete Selected
          </button>
        </div>
      </div>
      <table className=" min-w-full divide-y divide-gray-200 ">
        <thead className="bg-gray-50 ">
          <tr>
            <th scope="col" className="py-3 px-4 pr-0">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  onChange={checkAllHandler}
                  className="border-gray-200 rounded text-blue-600 focus:ring-blue-500 "
                />
                <label className="sr-only">Checkbox</label>
              </div>
            </th>
            <th
              scope="col"
              className=" px-6 py-3 text-left text-xs font-bold text-black  uppercase"
            >
              ID
            </th>
            <th
              scope="col"
              className="  px-6 py-3 text-left text-xs  font-bold text-black  uppercase"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs  font-bold text-black  uppercase"
            >
              Email
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs  font-bold text-black  uppercase"
            >
              Role
            </th>
            <th
              scope="col"
              className="px-6 py-3  text-xs  font-bold text-black  uppercase"
            >
              Action
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200  ">
          {slice.map((user, i) => {
            return user.id === editID ? (
              <tr key={i}>
                <td className="py-3 pl-4">
                  <div className="  h-5">
                    <label>
                      <input
                        id="hs-table-pagination-checkbox-1"
                        type="checkbox"
                        className="border-gray-200 rounded text-blue-600 focus:ring-blue-500 "
                      />
                    </label>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800  rounded">
                  {user.id}
                </td>
                <td>
                  <input
                    className=" px-6 py-4 whitespace-nowrap text-sm text-gray-800 0  rounded"
                    placeholder={user.name}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-800   rounded"
                    placeholder={user.email}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-800   rounded"
                    placeholder={user.role}
                    onChange={(e) => setEditRole(e.target.value)}
                  />
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-center flex-end gap-2">
                  <button
                    className="text-blue-500 hover:text-blue-700 px-4 py-2 border rounded"
                    type="button"
                    onClick={() => handleupdate(user.id)}
                  >
                    Update
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700 px-4 py-2 border rounded"
                    type="button"
                    onClick={() => setEditID(-1)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={i}>
                <td className="py-3 pl-4">
                  <div className="  h-5">
                    <label>
                      <input
                        id="hs-table-pagination-checkbox-1"
                        type="checkbox"
                        className="border-gray-200 rounded text-blue-600 focus:ring-blue-500 "
                        checked={selectedItems.includes(parseInt(user.id))}
                        value={user.id}
                        onChange={checkboxHandler}
                      />
                    </label>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 ">
                  {user.id}
                </td>
                <td className=" px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">
                  {user.role}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-center flex-end">
                  <button
                    className="text-blue-500 hover:text-blue-700 p-4"
                    type="button"
                    onClick={() => setEditID(user.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    type="button"
                    onClick={() => delhandler(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <TableFooter range={range} slice={slice} setPage={setPage} page={page} />
    </>
  );
};

const TableFooter = ({ range, setPage, page, slice }) => {
  useEffect(() => {
    if (slice.length < 1 && page !== 1) {
      setPage(page - 1);
    }
  }, [slice, page, setPage]);
  return (
    <div className="block w-auto  border-t rounded-b-md  text-center text-black   p-2 ">
      {range.map((el, index) => (
        <button
          key={index}
          className={`  p-2   border border-white mx-3 hover:bg-neutral-500 rounded ${
            page === el ? "bg-blue-500" : ""
          }`}
          onClick={() => setPage(el)}
        >
          {el}
        </button>
      ))}
    </div>
  );
};

export default App;
