import React, { useEffect, useState } from 'react'
import { utils } from 'ethers'
import {
  useContractWrite,
  useWaitForTransaction } from 'wagmi'
import {toast } from 'react-toastify'

//components
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ArrowDropDown from '@mui/icons-material/ArrowDropDown'

import { groomWei } from '../../utils/groomBalance'
import { shorten } from '../../utils/shortAddress'

const shopABI = require('../../contracts/abi/TokenShop.json')
const tokenABI = require('../../contracts/abi/TruffleToken.json')

//inline styles
const styles = {
  backgroundColor: '#F9DBDB',
  padding: 20
}

const menuStyle = {
  menuPaper : {
    backgroundColor: '#F9DBDB'
  }
}

const Admin = ({ account, tokenAddress, shopAddress }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const [withdrawAmount, setWithdrawAmount] = useState('0')
  const [mintAmount, setMintAmount] = useState('0')
  const [tokenPair, setTokenPair] = useState('')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [newTokenAddress, setNewTokenAddress] = useState('')

  const withdraw = useContractWrite(
    {
      addressOrName: shopAddress,
      contractInterface: shopABI,
    },
    'withdraw',
    {
      args:[tokenPair, utils.parseUnits(withdrawAmount)],
    },
  )

  const waitForWithdraw = useWaitForTransaction({
    hash: withdraw.data?.hash,
    onSettled(data, error) {
      (error) ?
        notifyError(error) :
        notifySuccess(data)
    },
  })

  const mint = useContractWrite(
    {
      addressOrName: tokenAddress,
      contractInterface: tokenABI,
    },
    'mint',
    {
      args:[shopAddress, utils.parseUnits(mintAmount)],
    },
  )

  const waitForMint = useWaitForTransaction({
    hash: mint.data?.hash,
    onSettled(data, error) {
      (error) ?
        notifyError(error) :
        notifySuccess(data)
    },
  })

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenuOption = (choice) => {
    setTokenPair(choice)
  }

  const handleInputChange = (event) => {
    switch (event.target.name) {
      case 'withdrawAmount':
        setWithdrawAmount(event.target.value)
        break;
      case 'mintAmount':
        setMintAmount(event.target.value)
        break;
      case 'tokenSymbol':
        setTokenSymbol(event.target.value)
        break;
      case 'tokenAddress':
        setNewTokenAddress(event.target.value)
        break;
      default:
    }
  }

  const handleWithdrawButton = async () => {
    console.log(utils.parseUnits(withdrawAmount).toString())
    //let tx = await contracts.tokenShop.withdraw(tokenPair, withdrawAmount).send({from: account})
    await withdraw.writeAsync()
  }

  const handleMintButton = () => {
    console.log(mintAmount)
    //let tx = await contracts.tobyToken.mint(shopAddress, mintAmount).send({from: account})
  }

  const handleSetTokenButton = () => {
    console.log(tokenSymbol)
    //let tx = await contracts.tobyToken.approve(tokenSymbol, newTokenAddress).send({from: account})
  }

  const notifyError = (msg) => toast.error(msg);
  const notifySuccess = (msg) => toast.success(
    `approved! hash: ${shorten(msg.transactionHash)} block: ${msg.blockNumber}`
  );

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
            <Button
              type="Button"
              variant="contained"
              onClick={handleMenu}
              endIcon={<ArrowDropDown />}
              >
                Token Pair
              </Button>
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
            <br/>
            <p>Pair: {tokenPair}</p>
            <Button type="Button" variant="contained" onClick={handleWithdrawButton}>Withdraw</Button>
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
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            sx={{ '& .MuiMenu-paper': { backgroundColor: '#F9DBDB' } }}
          >
            <MenuItem
              onClick={() => handleMenuOption('TRFL')}>Tuffle (TRFL)
            </MenuItem>
            <MenuItem
              onClick={() => handleMenuOption('USDC')}>US Dollar Coin (USDC)
            </MenuItem>
            <MenuItem
              onClick={() => handleMenuOption('USDT')}>US Dollar Tether (USDT)
            </MenuItem>
            <MenuItem
              onClick={() => handleMenuOption('DAI')}>Dai Stable Coin (DAI)
            </MenuItem>
          </Menu>
        </Grid>
    </Paper>
  </div>
  )
}

export default Admin
