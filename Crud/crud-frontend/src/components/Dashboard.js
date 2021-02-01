import React, { useEffect, useState } from 'react';
import { Button, TextField } from '@material-ui/core';

import { getWeb3, getCrudContract } from '../utils';
import { showNotification } from '../utils/Notifications';
import './dashboard.css';

const Dashboard = () => {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState([]);
  const [crudContract, setCrudContract] = useState(undefined);
  const [form, setForm] = useState({ userName: '', readUser: '', userId: '', editUser: '', deleteUser: '' });
  const [userDetail, setUserDetail] = useState('');

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      setWeb3(web3);
      const crudContract = await getCrudContract(web3);
      setCrudContract(crudContract);
      const [accounts] = await web3.eth.getAccounts();
      setAccounts(accounts);
    };
    init();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const createUser = async (e) => {
    e.preventDefault();
    try {
      await crudContract.crud.methods.create(form.userName).send({ from: accounts });
      showNotification('User added successfully', 'success', 5000);
    } catch (e) {
      showNotification('Something went wrong!', 'error', 5000);
    }
  }

  const readUser = async (e) => {
    e.preventDefault();
    try {
      const userDetail = await crudContract.crud.methods.read(form.readUser).call();
      setUserDetail(userDetail);
    } catch (e) {
      showNotification('Something went wrong!', 'error', 5000);
    }
  }

  const editUser = async (e) => {
    e.preventDefault();
    try {
      await crudContract.crud.methods.update(form.userId, form.editUser).send({ from: accounts });
      showNotification('User Updated successfully', 'success', 5000);
    } catch (e) {
      showNotification('Something went wrong!', 'error', 5000);
    }
  }

  const deleteUser = async (e) => {
    e.preventDefault();
    try {
      await crudContract.crud.methods.destroy(form.deleteUser).send({ from: accounts });
      showNotification('User Deleted successfully', 'success', 5000);
    } catch (e) {
      showNotification('Something went wrong!', 'error', 5000);
    }
  }

  return (
    <div className="dashboard">
      <h1 className="title">Crud</h1>
      <div className="dashboard-content">
        <div className="create-user">
          <h2 className="sub-title">Create User</h2>
          <form onSubmit={createUser} className="form">
            <TextField
              id="outlined-basic"
              label="Enter user name"
              variant="outlined"
              name="userName"
              onChange={handleChange}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
            >
              Submit
            </Button>
          </form>
        </div>
        <div className="read-user">
          <h2 className="sub-title">Read User</h2>
          <form onSubmit={readUser} className="form">
            <TextField
              id="outlined-basic"
              label="Enter user index"
              variant="outlined"
              name="readUser"
              onChange={handleChange}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
            >
              Submit
            </Button>
          </form>
          <div>User Id: {userDetail[0]}, User Name: {userDetail[1]}</div>
        </div>
        <div className="edit-user">
          <h2 className="sub-title">Edit User</h2>
          <form className="form" onSubmit={editUser}>
            <TextField
              id="outlined-basic"
              label="Enter user id"
              variant="outlined"
              name="userId"
              className="form-field"
              onChange={handleChange}
            />
            <TextField
              id="outlined-basic"
              label="Enter user name"
              variant="outlined"
              name="editUser"
              onChange={handleChange}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
            >
              Submit
            </Button>
          </form>
        </div>
        <div className="delete-user">
          <h2 className="sub-title">Delete User</h2>
          <form className="form" onSubmit={deleteUser}>
            <TextField
              id="outlined-basic"
              label="Enter user index"
              variant="outlined"
              name="deleteUser"
              onChange={handleChange}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
