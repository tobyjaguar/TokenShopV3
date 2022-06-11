import React, { useContext, useEffect, useState } from 'react'
import web3 from 'web3'

//components
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Dialog from '@material-ui/core/Dialog'
import TextField from '@material-ui/core/TextField'

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

const TransferToken = () => {
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [dialogOpen, setDialog] = useState(false)
  const [valid, setValid] = useState(false)
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
    setName(await contracts.tokenShop.methods.getTokenName().call({from: account}))
    setSymbol(await contracts.tokenShop.methods.getTokenSymbol().call({from: account}))
  }, [])

  const handleRecipientInputChange = (event) => {
    setRecipient(event.target.value)
  }

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

  const handleDialogClose = () => {
    setDialog(false)
  }

  const handleTransferButton = () => {
    var amountBN = new BN(amount)
    var balanceBN = new BN(tokenBalance)
    if(web3.utils.isAddress(recipient) && amountBN.lte(balanceBN)) {
      contracts.tobyToken.methods.transfer(recipient, amount).send({from: account})
    } else if (!web3.utils.isAddress(recipient)) {
      setAlert(`Oops! The receipient address isn't a correct ethereum address.`)
      handleDialogOpen()
    } else if (amountBN.gt(balanceBN)) {
      setAlert('Oops! You are trying to transfer more than you have.')
      handleDialogOpen()
    } else {
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
        <p><strong>Name: </strong> {name}</p>
        <p><strong>Symbol: </strong> {symbol}</p>
        <p>Balance: {tokenBalance}</p>
        <p><Button type="Button" variant="contained" onClick={handleSetMaxButton}>Use Balance</Button></p>

        <form className='pure-form'>
          <TextField
            name="recipientAddress"
            type="text"
            placeholder="Send to:"
            value={recipient}
            onChange={handleRecipientInputChange}
            variant='outlined'
            style={{margin: '5% auto'}}
          />
          <br/>
          <TextField
            name="transferAmount"
            type="text"
            placeholder="token bits to send:"
            value={amount}
            onChange={handleInputChange}
            variant='outlined'
            style={{margin: '5% auto'}}
          />
          <br/>
          <Button type="Button" variant="contained" onClick={handleTransferButton}>Transfer</Button>
        </form>
        <p>Tokens to transfer: {transferGroomed} </p>
    </Paper>

    <Dialog PaperProps={dialogStyles} open={dialogOpen} >
      <p>{alertText}</p>
      <p><Button variant="contained" onClick={handleDialogClose} >Close</Button></p>
    </Dialog>
    </div>
  )
}

export default TransferToken
