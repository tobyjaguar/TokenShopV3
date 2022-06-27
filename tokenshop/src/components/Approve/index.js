import React, { useContext, useEffect, useState } from 'react'
import { useAccount, useContract, useContractWrite, useSigner } from 'wagmi'

//components
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import Popper from '@mui/material/Popper'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'

// import TXModal from '../TXModal'

import myTx from '../../assets/tx.json'

import { groomWei } from '../../utils/groomBalance'

import contractsContext from '../../context/Contracts/ContractsContext'

const TRFL_NAME = process.env.REACT_APP_TRFL_TOKEN_NAME
const TRFL_ADDRESS = process.env.REACT_APP_TRFL_TOKEN_CONTRACT_ADDRESS
const USDC_ADDRESS = process.env.REACT_APP_USDC_TOKEN_CONTRACT_ADDRESS
const USDT_ADDRESS = process.env.REACT_APP_USDT_TOKEN_CONTRACT_ADDRESS
const DAI_ADDRESS = process.env.REACT_APP_DAI_TOKEN_CONTRACT_ADDRESS
const SHOP_ADDRESS = process.env.REACT_APP_TOKEN_SHOP_CONTRACT_ADDRESS
const APPROVAL_AMOUNT = process.env.REACT_APP_APPROVAL_AMOUNT

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

const Approve = () => {
  // const [account, setAccount] = useState(false)
  const [dialogOpen, setDialog] = useState(false)
  const [menuState, setMenuState] = useState(false)
  const [alertText, setText] = useState('')
  const [selectedToken, setSelectedToken] = useState('')

  const { data: account } = useAccount()

  const { data: signer } = useSigner()

  // instantiate contract approve functions
  // const truffleContract = useContract({
  //   addressOrName: TRFL_ADDRESS,
  //   contractInterface: tokenABI,
  //   signerOrProvider: signer,
  // })

  const { write: trflApprove } = useContractWrite(
    {
      addressOrName: TRFL_ADDRESS,
      contractInterface: tokenABI,
    },
    'approve',
    {
      args:[SHOP_ADDRESS, APPROVAL_AMOUNT],
    },
  )

  const {
    contracts
  } = useContext(contractsContext);

  // useEffect(() => {
  //   setAccount(data?.address)
  // }, [account])

  const handleDialogOpen = () => {
    setDialog(true)
  }

  const handleDialogClose = () => {
    setDialog(false)
  }
  const openMenu = () => {
    setMenuState(true)
  }

  const handleMenu = (choice) => {
    setSelectedToken(choice)
    setMenuState(false)
  }

  const handleApproveButton = () => {
    if (selectedToken === '') {
      setText("Oops! Select a token to approve transfer.")
      handleDialogOpen()
    }
    else {
      switch(selectedToken) {
        case 'TRFL':
          trflApprove()
          break
        default:
          setText("Oops! something went wrong while trying to approve transfer.")
          handleDialogOpen()
      }
    }
  }

  return (
    <div>
      <Paper style={styles} elevation={5}>
        <h3><p>Approve a Trade: </p></h3>
        <MenuList>
          <MenuItem onClick={() => handleMenu('TRFL')}>Tuffle (TRFL)</MenuItem>
          <MenuItem onClick={() => handleMenu('USDC')}>US Dollar Coin (USDC)</MenuItem>
          <MenuItem onClick={() => handleMenu('USDT')}>US Dollar Tether (USDT)</MenuItem>
          <MenuItem onClick={() => handleMenu('DAI')}>Dai Stable Coin (DAI)</MenuItem>
        </MenuList>

        <Button type="Button" variant="contained" onClick={handleApproveButton}>Approve</Button>
        <br/>
        <p>Approving: {selectedToken}</p>
      </Paper>
      <Dialog PaperProps={dialogStyles} open={dialogOpen} >
        <p>{alertText}</p>
        <p><Button variant="contained" onClick={handleDialogClose} >Close</Button></p>
      </Dialog>
    </div>
  )

}

export default Approve
