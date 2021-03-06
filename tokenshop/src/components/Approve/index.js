import React, { useState } from 'react'
import {
  useContractWrite,
  useWaitForTransaction
} from 'wagmi'
import { toast } from 'react-toastify'

//components
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Dialog from '@mui/material/Dialog'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ArrowDropDown from '@mui/icons-material/ArrowDropDown'

import { shorten } from '../../utils/shortAddress'

const APPROVAL_AMOUNT = process.env.REACT_APP_APPROVAL_AMOUNT
const USDC_ADDRESS = process.env.REACT_APP_USDC_TOKEN_CONTRACT_ADDRESS
const USDT_ADDRESS = process.env.REACT_APP_USDT_TOKEN_CONTRACT_ADDRESS
const DAI_ADDRESS = process.env.REACT_APP_DAI_TOKEN_CONTRACT_ADDRESS
const TRFL_ADDRESS_MAINNET = process.env.REACT_APP_TRFL_TOKEN_CONTRACT_ADDRESS_ARB_MAINNET
const TRFL_ADDRESS_TESTNET = process.env.REACT_APP_TRFL_TOKEN_CONTRACT_ADDRESS_ARB_TESTNET

const tokenABI = require('../../contracts/abi/TruffleToken.json')

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

const Approve = ({ network, shopAddress }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [dialogOpen, setDialog] = useState(false)
  const [selectedToken, setSelectedToken] = useState('')
  const [alertText, setText] = useState('')

  const open = Boolean(anchorEl)
  const trflAddress = (network === 'arbitrum') ?
    TRFL_ADDRESS_MAINNET :
    TRFL_ADDRESS_TESTNET

  // TRFL
  const trflApprove = useContractWrite(
    {
      addressOrName: trflAddress,
      contractInterface: tokenABI,
    },
    'approve',
    {
      args:[shopAddress, APPROVAL_AMOUNT],
    },
  )

  const waitForTrflApprove = useWaitForTransaction({
    hash: trflApprove.data?.hash,
    onSettled(data, error) {
      (error) ?
        notifyError(error) :
        notifySuccess(data)
    },
  })

  // USDC
  const usdcApprove = useContractWrite(
    {
      addressOrName: USDC_ADDRESS,
      contractInterface: tokenABI,
    },
    'approve',
    {
      args:[shopAddress, APPROVAL_AMOUNT],
    },
  )

  const waitForUsdcApprove = useWaitForTransaction({
    hash: usdcApprove.data?.hash,
    onSettled(data, error) {
      (error) ?
        notifyError(error) :
        notifySuccess(data)
    },
  })

  // USDT
  const usdtApprove = useContractWrite(
    {
      addressOrName: USDT_ADDRESS,
      contractInterface: tokenABI,
    },
    'approve',
    {
      args:[shopAddress, APPROVAL_AMOUNT],
    },
  )

  const waitForUsdtApprove = useWaitForTransaction({
    hash: usdtApprove.data?.hash,
    onSettled(data, error) {
      (error) ?
        notifyError(error) :
        notifySuccess(data)
    },
  })

  // DAI stable coin
  const daiApprove = useContractWrite(
    {
      addressOrName: DAI_ADDRESS,
      contractInterface: tokenABI,
    },
    'approve',
    {
      args:[shopAddress, APPROVAL_AMOUNT],
    },
  )

  const waitForDaiApprove = useWaitForTransaction({
    hash: daiApprove.data?.hash,
    onSettled(data, error) {
      (error) ?
        notifyError(error) :
        notifySuccess(data)
    },
  })

  const handleDialogOpen = () => {
    setDialog(true)
  }

  const handleDialogClose = () => {
    setDialog(false)
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenuOption = (choice) => {
    setSelectedToken(choice)
  }

  const handleApproveButton = async () => {
    if (selectedToken === '') {
      setText("Oops! Select a token to approve transfer.")
      handleDialogOpen()
    }
    else {
      switch(selectedToken) {
        case 'TRFL':
          await trflApprove.writeAsync()
          break
        case 'USDC':
          await usdcApprove.writeAsync()
          break
        case 'USDT':
          await usdtApprove.writeAsync()
          break
        case 'DAI':
          await daiApprove.writeAsync()
          break
        default:
          setText("Oops! something went wrong while trying to approve transfer.")
          handleDialogOpen()
      }
    }
  }

  const notifyError = (msg) => toast.error(msg);
  const notifySuccess = (msg) => toast.success(
    `approved! hash: ${shorten(msg.transactionHash)} block: ${msg.blockNumber}`
  );

  const mainnetTokens = [
    <MenuItem key={1} onClick={() => handleMenuOption('USDC')}>US Dollar Coin (USDC)</MenuItem>,
    <MenuItem key={2} onClick={() => handleMenuOption('USDT')}>US Dollar Tether (USDT)</MenuItem>,
    <MenuItem key={3} onClick={() => handleMenuOption('DAI')}>Dai Stable Coin (DAI)</MenuItem>,
    <MenuItem key={4} onClick={() => handleMenuOption('TRFL')}>Truffle Token (TRFL)</MenuItem>
  ]

  return (
    <div>
      <Paper style={styles} elevation={5}>
        <h3><p>Approve a Trade: </p></h3>
        <Button
          type="Button"
          variant="contained"
          onClick={handleMenu}
          endIcon={<ArrowDropDown />}
        >
          Token
        </Button>
        <br/><br/>
        <Button type="Button" variant="contained" onClick={handleApproveButton}>Approve</Button>
        <br/>
        <p>Approving: {selectedToken}</p>
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        sx={{ '& .MuiMenu-paper': { backgroundColor: '#F9DBDB' } }}
      >
        {(network === 'arbitrum') ?
          mainnetTokens.map((item, i) => item) :
          <MenuItem onClick={() => handleMenuOption('TRFL')}>Truffle Testnet (TRFL)</MenuItem>
        }

      </Menu>

      <Dialog PaperProps={dialogStyles} open={dialogOpen} >
        <p>{alertText}</p>
        <p><Button variant="contained" onClick={handleDialogClose} >Close</Button></p>
      </Dialog>
    </div>
  )

}

export default Approve
