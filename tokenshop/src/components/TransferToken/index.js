import React, { useState } from 'react'
import { BigNumber, utils } from 'ethers'
import {
  useContractWrite,
  useWaitForTransaction
} from 'wagmi'
import { toast } from 'react-toastify'

//components
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'

import { shorten } from '../../utils/shortAddress'

const TOBY_ADDRESS = process.env.REACT_APP_TOBY_TOKEN_CONTRACT_ADDRESS

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

const TransferToken = ({ name, symbol, tokenBalance }) => {
  const [dialogOpen, setDialog] = useState(false)
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('0')
  const [alertText, setAlert] = useState('')

  // instantiate contract
  const contract = useContractWrite(
    {
      addressOrName: TOBY_ADDRESS,
      contractInterface: tokenABI,
    },
    'transfer',
    {
      args:[recipient, amount],
    },
  )

  const waitForTransferTx = useWaitForTransaction({
    hash: contract.data?.hash,
    onSettled(data, error) {
      (error) ?
        notifyError(error) :
        notifySuccess(data)
    },
  })

  const handleRecipientInputChange = (event) => {
    setRecipient(event.target.value)
  }

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

  const handleTransferButton = async () => {
    var amountBN = BigNumber.from(amount)
    var balanceBN = tokenBalance.value
    if(utils.isAddress(recipient) && amountBN.lte(balanceBN)) {
      await contract.writeAsync()
    } else if (!utils.isAddress(recipient)) {
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
    setAmount(tokenBalance.value.toString())
  }

  const notifyError = (msg) => toast.error(msg);
  const notifySuccess = (msg) => toast.success(
    `approved! hash: ${shorten(msg.transactionHash)} block: ${msg.blockNumber}`
  );

  let transferGroomed = utils.formatEther(amount)

  return (
    <div>
      <Paper style={styles} elevation={5}>
        <p><strong>Name: </strong> {name.data}</p>
        <p><strong>Symbol: </strong> {symbol.data}</p>
        <p>Balance: {tokenBalance.formatted}</p>
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
