import React, { useEffect, useState } from 'react';
import { Button, TextField } from '@material-ui/core';

import { getWeb3, getEtherWalletContract } from '../utils';
import { showNotification } from '../utils/Notifications';

const Dashboard = () => {
  // const [web3, setWeb3] = useState(undefined);
  // const [accounts, setAccounts] = useState([]);
  const [etherWalletContract, setEtherWalletContract] = useState(undefined);
  const [contractDetails, setContractsDetails] = useState({ contractBalance: 0, contractOwnerAddress: '', contractAddress: '' });
  const [userDetails, setUserDetails] = useState({ accountAddress: '', accountBalance: '' });
  const [form, setForm] = useState({ depositAmount: 0, transferToAddress: '', transferAmount: '' });

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      const [accountAddress] = await web3.eth.getAccounts();
      const etherWallet = await getEtherWalletContract(web3);
      setEtherWalletContract(etherWallet);
      const contractOwnerAddress = await etherWallet.etherWallet.methods.owner().call();
      setContractsDetails({ ...contractDetails, contractOwnerAddress });
      const accountBalance = await web3.eth.getBalance(accountAddress);
      setUserDetails({ ...userDetails, accountAddress, accountBalance });
    };
    init();
  });

  useEffect(() => {
    if (etherWalletContract) {
      onRefreshClick();
    }
  }, [etherWalletContract]);

  const onRefreshClick = async () => {
    const contractBalance = await etherWalletContract && etherWalletContract.etherWallet && etherWalletContract.etherWallet.methods.balanceOf().call();
    contractBalance.then(balance => {
      setContractsDetails({ ...contractDetails, contractBalance: balance });
    });
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const onDepositClick = async (e) => {
    e.preventDefault();
    try {
      await etherWalletContract.etherWallet.methods.deposit().send({ from: userDetails.accountAddress, value: form.depositAmount });
      showNotification('Deposit Successfully', 'success', 5000);
    } catch (e) {
      showNotification('Something went wrong!', 'error', 5000);
    }
  }

  const onTransferClick = async (e) => {
    e.preventDefault();
    try {
      await etherWalletContract.etherWallet.methods.send(form.transferToAddress, form.transferAmount).send({ from: userDetails.accountAddress });
      showNotification('Transferred Successfully!', 'success', 5000);
    } catch (e) {
      showNotification('Something went wrong!', 'error', 5000);
    }
  }

  return (
    <div className="dashboard">
      <h1>Ether Wallet</h1>
      <div className="contract-details">
        <h2 className="contract-details-title">Contract Details</h2>
        <div className="contract-details-content">
          <div>Contract Address: {etherWalletContract && etherWalletContract.etherWallet && etherWalletContract.etherWallet._address}</div>
          <div>Contract Balance: {contractDetails.contractBalance} wei <button onClick={() => onRefreshClick()}>Refresh</button></div>
          <div>Owner: {contractDetails.contractOwnerAddress}</div>
        </div>
      </div>
      <div className="user-details">
        <h2 className="user-details-title">User Details</h2>
        <div className="user-details-content">
          <div>Metamask Address: {userDetails.accountAddress}</div>
          <div>Account Balance: {userDetails.accountBalance} wei</div>
        </div>
      </div>
      <div className="deposit">
        <h2>Deposit</h2>
        <form onSubmit={onDepositClick}>
          <TextField
            id="outlined-basic"
            label="Enter deposit amount"
            variant="outlined"
            name="depositAmount"
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
      <div className="trasfer">
        <h2>Transfer</h2>
        <form onSubmit={onTransferClick}>
          <TextField
            id="outlined-basic"
            label="Enter transfer address"
            variant="outlined"
            name="transferToAddress"
            onChange={handleChange}
          />
          <TextField
            id="outlined-basic"
            label="Enter transfer amount"
            variant="outlined"
            name="transferAmount"
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
  );
}

export default Dashboard;
