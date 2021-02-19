import React, { useEffect, useState } from 'react';
import { Button, TextField } from '@material-ui/core';

import { getWeb3, getVotingContract } from '../utils';
import { showNotification } from '../utils/Notifications';
import './_dashboard.scss';

const Dashboard = () => {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState([]);
  const [votingContract, setVotingContract] = useState(undefined);
  const [ballotForm, setBallotForm] = useState({ ballotName: '', choices: [], duration: 0, voters: [] });

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      setWeb3(web3);
      const votingContract = await getVotingContract(web3);
      setVotingContract(votingContract);
      const [accounts] = await web3.eth.getAccounts();
      setAccounts(accounts);
    };
    init();
  }, []);

  const handleChange = (e) => {
      setBallotForm({ ...ballotForm, [e.target.name]: e.target.value });
  }

  const createBallot = async (e) => {
    e.preventDefault();
    console.log('ballotForm=====', ballotForm);
    try {
      await votingContract.voting.methods.createBallot(ballotForm.ballotName, [...ballotForm.choices.split(",")], ballotForm.duration).send({ from: accounts });
      showNotification('Ballot Created Successfully.', 'success', 5000);
    } catch (e) {
      showNotification(e.message, 'error', 5000);
    }
  }

  const addVoters = async (e) => {
    e.preventDefault();
    console.log('ballotForm=====', ballotForm);
    try {
      await votingContract.voting.methods.addVoters([...ballotForm.voters.split(",")]).send({ from: accounts });
      showNotification('Voters added Successfully.', 'success', 5000);
    } catch (e) {
      showNotification(e.message, 'error', 5000);
    }
  }

  return (
    <div className="dashboard">
      <h1>Voting</h1>
      <div className="create-ballot">
        <h2 className="sub-title">Create Ballot</h2>
        <form onSubmit={createBallot}>
          <TextField
            label="Name"
            variant="outlined"
            name="ballotName"
            onChange={handleChange}
            required
          />
          <TextField
            label="Choices (ex: increased,decreased)"
            variant="outlined"
            name="choices"
            onChange={handleChange}
            required
          />
          <TextField
            label="Duration(s)"
            variant="outlined"
            name="duration"
            onChange={handleChange}
            required
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
      <div className="add-voters">
        <h2 className="sub-title">Add Voters</h2>
        <form onSubmit={addVoters}>
          <TextField
            label="Add Voters"
            variant="outlined"
            name="voters"
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
      <div className="votes">
        <h2 className="sub-title">Votes</h2>
      </div>
    </div>
  );
};

export default Dashboard;
