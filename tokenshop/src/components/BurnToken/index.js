import React, { useState } from 'react'
import { BigNumber, utils } from 'ethers'
import {
  useContractWrite,
  useWaitForTransaction
} from 'wagmi'
import { toast } from 'react-toastify'

//components
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'

import { shorten } from '../../utils/shortAddress'

const tokenABI = require('../../contracts/abi/ERC20TobyToken.json')

//inline styles
const styles = {
    backgroundColor: '#F9DBDB',
    padding: 20
}

const dialogStyles = {
  style: {
    backgroundColor: '#F9DBDB',
    padding: 20
  }
}

const BurnToken = ({ tokenAddress, tokenBalance }) => {
  const [dialogOpen, setDialog] = useState(false)
  const [dialogBurnOpen, setDialogBurn] = useState(false)
  const [amount, setAmount] = useState('0')
  const [alertText, setAlert] = useState('')

  // TOBY token contract
  const contract = useContractWrite(
    {
      addressOrName: tokenAddress,
      contractInterface: tokenABI,
    },
    'burn',
    {
      args:[amount],
    },
  )

  const waitForBurnTx = useWaitForTransaction({
    hash: contract.data?.hash,
    onSettled(data, error) {
      (error) ?
        notifyError(error) :
        notifySuccess(data)
    },
  })

  const setTXParamValue = (_value) => {
    if (BigNumber.isBigNumber(_value)) {
      setAmount(_value.toString())
    } else {
      setAmount('0')
    }
  }

  const handleInputChange = (event) => {
    if (event.target.value.match(/^[0-9]{1,40}$/)) {
      var amount = BigNumber.from(event.target.value)
      if (amount.gte(0)) {
        setAmount(amount.toString())
        setTXParamValue(amount)
      } else {
        setAmount('0')
        setTXParamValue(0)
      }
    } else {
        setAmount('0')
        setTXParamValue(0)
      }
  }

  const handleDialogOpen = () => {
    setDialog(true)
  }

  const handleDialogBurnOpen = () => {
    setDialogBurn(true)
  }

  const handleDialogClose = () => {
    setDialog(false)
  }

  const handleDialogBurnClose = () => {
    setDialogBurn(false)
  }

  const handleBurnButton = async () => {
    var amountBN = BigNumber.from(amount)
    var balanceBN = tokenBalance.value
    if(amountBN.lte(balanceBN)) {
      handleDialogBurnClose()
      await contract.writeAsync()
    } else if (amountBN.gt(balanceBN)) {
      handleDialogBurnClose()
      setAlert('Oops! You are trying to burn more than you have.')
      handleDialogOpen()
    } else {
      handleDialogBurnClose()
      setAlert('Oops! Something went wrong. Try checking your transaction details.')
      handleDialogOpen()
    }
  }

  const handleSetMaxButton = () => {
    setAmount(tokenBalance.value.toString())
  }

  const notifyError = (msg) => toast.error(msg);
  const notifySuccess = (msg) => toast.success(
    `approved! hash: ${shorten(msg.transactionHash)} block: ${msg.blockNumber}`
  );

  // let transferGroomed = groomWei(amount)
  let transferGroomed = utils.formatEther(amount)

  return (
    <div>
      <Paper style={styles} elevation={5}>
        <p>Balance: {tokenBalance.formatted}</p>
        <p><Button type="Button" variant="contained" onClick={handleSetMaxButton}>Use Balance</Button></p>

        <form className="pure-form">
          <TextField
            name="burnAmount"
            type="text"
            placeholder="token bits to burn:"
            value={amount}
            onChange={handleInputChange}
            variant='outlined'
            style={{margin: '5% auto'}}
          />
          <br/>
          <Button type="Button" variant="contained" onClick={handleDialogBurnOpen}>Burn</Button>
        </form>
        <p>Tokens to burn: {transferGroomed} </p>
    </Paper>

    <Dialog PaperProps={dialogStyles} open={dialogBurnOpen} >
      <DialogTitle>Destroying Tokens</DialogTitle>
        <p>WARNING!!! This will destroy your tokens</p>
      <DialogActions>
        <Button variant="contained" onClick={handleDialogBurnClose} >Cancel</Button>
        <Button variant="contained" onClick={handleBurnButton} >Burn 'em!</Button>
      </DialogActions>
    </Dialog>

    <Dialog PaperProps={dialogStyles} open={dialogOpen} >
      <p>{alertText}</p>
      <p><Button variant="contained" onClick={handleDialogClose} >Close</Button></p>
    </Dialog>
    </div>
  )
}

export default BurnToken
