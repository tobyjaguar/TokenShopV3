import React, { useContext, useEffect, useState } from 'react'

//components
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'

import walletContext from '../../context/WalletProvider/WalletProviderContext'
import contractsContext from '../../context/Contracts/ContractsContext'

import {groomWei} from '../../utils/groomBalance'

//inline styles
const styles = {
  backgroundColor: '#F9DBDB',
  padding: 20
}

const Admin = () => {
  const [withdrawAmount, setWithdrawAmount] = useState(0)
  const [depositAmount, setDepositAmount] = useState(0)
  const [mintAmount, setMintAmount] = useState(0)
  const [burnAmount, setBurnAmount] = useState(0)
  const [approveAmount, setApproveAmount] = useState(0)
  const [shopAddress, setShopAddress] = useState('')
  const [tokenAddress, setTokenAddress] = useState('')
  const [tokenPair, setTokenPair] = useState('')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [newTokenAddress, setNewTokenAddress] = useState('')

  const {
    connected,
    providerContext,
    account,
    tokenBalance
  } = useContext(walletContext);

  const {
    contracts
  } = useContext(contractsContext);

  useEffect(async () => {
    // initial load
    setTokenAddress(contracts.tokenShop._address)
    setShopAddress(contracts.tobyToken._address)
  }, [connected])

  const handleInputChange = (event) => {
    switch (event.target.name) {
      case 'withdrawAmount':
        setWithdrawAmount(event.target.value)
        break;
      case 'depositAmount':
        setDepositAmount(event.target.value)
        break;
      case 'mintAmount':
        setMintAmount(event.target.value)
        break;
      case 'burnAmount':
        setBurnAmount(event.target.value)
        break;
      case 'approveAmount':
        setApproveAmount(event.target.value)
        break;
      case 'tokenSymbol':
        setTokenSymbol(event.target.value)
        break;
      case 'tokenAddress':
        setTokenNewAddress(event.target.value)
        break;
      default:
    }
  }

  const handleWithdrawButton = async () => {
    console.log(withdrawAmount)
    //let tx = await contracts.tokenShop.withdraw(tokenPair, withdrawAmount).send({from: account})

  }

  const handleDepositButton = () => {
    console.log(depositAmount)
    //let tx = await contracts.tokenShop.deposit(depositAmount).send({from: account})
  }

  const handleMintButton = () => {
    console.log(mintAmount)
    //let tx = await contracts.tobyToken.mint(shopAddress, mintAmount).send({from: account})
  }

  const handleBurnButton = () => {
    console.log(burnAmount)
    //let tx = await contracts.tobyToken.burn(burnAmount).send({from: account})
  }

  const handleApproveButton = () => {
    console.log(approveAmount)
    //let tx = await contracts.tobyToken.approve(approveAmount).send({from: account})
  }

  const handleSetTokenButton = () => {
    console.log(tokenSymbol)
    //let tx = await contracts.tobyToken.approve(tokenSymbol, newTokenAddress).send({from: account})
  }

    return (
      <div>
        <Paper style={styles}>
          <h2>Admin</h2>
          <p>Shop Address: <strong>{shopAddress}</strong> </p>
          <p>Token Address: <strong>{tokenAddress}</strong> </p>

          <h3><p>Store Stats</p></h3>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <strong>Withdraw: </strong>
              <br/>
              <TextField
                name="withdrawAmount"
                type="number"
                placeholder="amount"
                value={withdrawAmount}
                onChange={handleInputChange}
                variant='outlined'
                style={{margin: '5px auto'}}
              />
              <br/><br/>
              <Button type="Button" variant="contained" onClick={handleWithdrawButton}>Withdraw</Button>
            </Grid>

            <Grid item xs={12}>
              <strong>Deposit: </strong>
              <br/>
              <TextField
                name="depositAmount"
                type="number"
                placeholder="amount"
                value={depositAmount}
                onChange={handleInputChange}
                variant='outlined'
                style={{margin: '5px auto'}}
              />
              <br/>
              (Add funds to the shop)
              <br/><br/>
              <Button type="Button" variant="contained" onClick={handleDepositButton}>Deposit</Button>
            </Grid>

            <Grid item xs={12}>
              <strong>Allocate Tokens to the Shop:</strong>
              <br/>
              <TextField
                name="mintAmount"
                type="number"
                placeholder="amount"
                value={mintAmount}
                onChange={handleInputChange}
                variant='outlined'
                style={{margin: '5px auto'}}
              />
              <br/>
              (Mint Tokens to the store)
              <br/><br/>
              <Button type="Button" variant="contained" onClick={handleMintButton}>Mint</Button>
            </Grid>

            <Grid item xs={12}>
              <strong>Burn Tokens from your Account</strong>
              <br/>
              <TextField
                name="burnAmount"
                type="number"
                placeholder="amount"
                value={burnAmount}
                onChange={handleInputChange}
                variant='outlined'
                style={{margin: '5px auto'}}
              />
              <br/>
              (Burn your tokens)
              <br/><br/>
              <Button type="Button" variant="contained" onClick={handleBurnButton}>Burn</Button>
            </Grid>

            <Grid item xs={12}>
              <strong>Approve Owner to Burn Shop Stock</strong>
              <br/>
              <TextField
                name="approveAmount"
                type="number"
                placeholder="amount"
                value={approveAmount}
                onChange={handleInputChange}
                variant='outlined'
                style={{margin: '5px auto'}}
              />
              <br/>
              (Approve Owner)
              <br/><br/>
              <Button type="Button" variant="contained" onClick={handleApproveButton}>Approve</Button>
            </Grid>

            <Grid item xs={12}>
              <strong>Add new Stable Token to Shop</strong>
              <br/>
              <TextField
                name="tokenSymbol"
                type="string"
                placeholder="symbol"
                value={tokenSymbol}
                onChange={handleInputChange}
                variant='outlined'
                style={{margin: '5px auto'}}
              />
              <br/>
              <TextField
                name="tokenAddress"
                type="string"
                placeholder="address"
                value={newTokenAddress}
                onChange={handleInputChange}
                variant='outlined'
                style={{margin: '5px auto'}}
              />
              <br/>
              (TOKEN SYMBOL)
              <br/><br/>
              <Button type="Button" variant="contained" onClick={handleSetTokenButton}>Add</Button>
            </Grid>
          </Grid>
      </Paper>
    </div>
  )
}

export default Admin
