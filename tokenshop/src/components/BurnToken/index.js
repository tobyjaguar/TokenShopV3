import React, { useContext, useEffect, useState } from 'react'
import web3 from 'web3'

//components
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'

import walletContext from '../../context/WalletProvider/WalletProviderContext'
import contractsContext from '../../context/Contracts/ContractsContext'

import {groomWei} from '../../utils/groomBalance'

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

const BN = web3.utils.BN

const BurnToken = () => {
  const [dialogOpen, setDialog] = useState(false)
  const [dialogBurnOpen, setDialogBurn] = useState(false)
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [alertText, setAlert] = useState('')

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
  }, [])

  const setTXParamValue = (_value) => {
    if (web3.utils.isBN(_value)) {
      setAmount(_value.toString())
    } else {
      setAmount('')
    }
  }

  const handleInputChange = (event) => {
    if (event.target.value.match(/^[0-9]{1,40}$/)) {
      var amount = new BN(event.target.value)
      if (amount.gte(0)) {
        setAmount(amount.toString())
        setTXParamValue(amount)
      } else {
        setAmount('')
        setTXParamValue(0)
      }
    } else {
        setAmount('')
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

  const handleBurnButton = () => {
    var amountBN = new BN(amount)
    var balanceBN = new BN(tokenBalance)
    if(amountBN.lte(balanceBN)) {
      handleDialogBurnClose()
      contracts.tobyToken.methods.burn(amount).send({from: account})
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
    setAmount(tokenBalance)
  }

  let transferGroomed = groomWei(amount)

  return (
    <div>
      <Paper style={styles} elevation={5}>
        <p>Balance: {tokenBalance}</p>
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
