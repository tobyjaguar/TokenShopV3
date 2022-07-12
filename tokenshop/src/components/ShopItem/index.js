import React, { useEffect, useState } from 'react'
import { BigNumber, utils } from 'ethers'
import {
  useContract,
  useContractWrite,
  useProvider,
  useWaitForTransaction } from 'wagmi'
import { toast } from 'react-toastify'

//components
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ArrowDropDown from '@mui/icons-material/ArrowDropDown'

import ContractDetails from '../ContractDetails'

import { shorten } from '../../utils/shortAddress'
import { convertAmount, withDecimal } from '../../utils/purchaseAmount'

const shopABI = require('../../contracts/abi/TokenShop.json')

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

const ShopItem = ({ account, name, network, shopAddress, symbol }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const [dialogOpen, setDialog] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [weiAmount, setWeiAmount] = useState('0')
  const [buyAmount, setBuyAmount] = useState('0')
  const [selectedToken, setSelectedToken] = useState('')
  const [allowance, setAllowance] = useState('0')
  const [alertText, setText] = useState('')

  // need to get allowance for the selected collateral
  const provider = useProvider()
  const contract = useContract({
      addressOrName: shopAddress,
      contractInterface: shopABI,
      signerOrProvider: provider
  })

  // buy with selected token
  const purchaseTx = useContractWrite(
    {
      addressOrName: shopAddress,
      contractInterface: shopABI,
    },
    'buyToken',
    {
      args:[selectedToken, weiAmount],
    },
  )

  const waitForPurchaseTx = useWaitForTransaction({
    hash: purchaseTx.data?.hash,
    onSettled(data, error) {
      (error) ?
        notifyError(error) :
        notifySuccess(data)
    },
  })

  useEffect (() => {
    async function getAllowance() {
      let allowanceBN = await contract.getStableAllowance(
          selectedToken,
          {from: account.address}
        )
      setAllowance(allowanceBN.toString())
    }
    if (selectedToken !== '') getAllowance()
  }, [account.address, contract, selectedToken])

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

  const handleInputChange = (event) => {
    if (event.target.value.match(/^[0-9.]{1,5}$/)){
      if (0 <= event.target.value && event.target.value <= 100) {
        var amount = Math.abs(parseFloat(event.target.value).toFixed(2))
        setBuyAmount(amount)
        setWeiAmount(convertAmount(amount))
      } else {
          setBuyAmount(0)
          setWeiAmount('0')
        }
    } else {
        setBuyAmount(0)
        setWeiAmount('0')
      }
  }

  const handleBuyButton = async () => {
    let zero = BigNumber.from(0)
    let allowanceBN = BigNumber.from(allowance)
    let amountBN = BigNumber.from(weiAmount)
    if (selectedToken === '') {
      setText("Oops! Select a payment token.")
      handleDialogOpen()
    }
    else if (allowanceBN.lt(amountBN)) {
      setText("Oops! Check approval amount.")
      handleDialogOpen()
    }
    else if (amountBN.gt(zero)) {
      await purchaseTx.writeAsync()
    } else {
      setText("Oops! Check purchase amount.")
      handleDialogOpen()
    }
  }

  const handleShowStateButton = () => {
    setInfoOpen(!infoOpen)
  }

  const notifyError = (msg) => toast.error(msg);
  const notifySuccess = (msg) => toast.success(
    `purchased! hash: ${shorten(msg.transactionHash)} block: ${msg.blockNumber}`
  );

  const mainnetTokens = [
    <MenuItem key={1} onClick={() => handleMenuOption('USDC')}>US Dollar Coin (USDC)</MenuItem>,
    <MenuItem key={2} onClick={() => handleMenuOption('USDT')}>US Dollar Tether (USDT)</MenuItem>,
    <MenuItem key={3} onClick={() => handleMenuOption('DAI')}>Dai Stable Coin (DAI)</MenuItem>
  ]

  return (
    <div>
    <Paper style={styles} elevation={5}>
      <h3><p>Buy Tokens: </p></h3>
      <p>Number of Tokens:</p>
      <form className="pure-form">
        <TextField
          name="purchaseAmount"
          type="number"
          placeholder="tokens"
          value={buyAmount}
          onChange={handleInputChange}
          variant='outlined'
          style={{margin: '5% auto'}}
        />
        <p>Payment:</p>
        <Button
          type="Button"
          variant="contained"
          onClick={handleMenu}
          endIcon={<ArrowDropDown />}
        >
          Token
        </Button>
        <br/><br/>
        <Button type="Button" variant="contained" onClick={handleBuyButton}>Buy</Button>
      </form>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        sx={{ '& .MuiMenu-paper': { backgroundColor: '#F9DBDB' } }}
      >
        {(network === 'arbitrum') ?
          mainnetTokens.map(item => item) :
          <MenuItem onClick={() => handleMenuOption('TRFL')}>Truffle Testnet (TRFL)</MenuItem>
        }
      </Menu>

      <p>Total: {buyAmount} {selectedToken} </p>
      <p>Able to spend: {utils.formatEther(allowance)} {selectedToken} </p>
      <p>Purchase Amount: {buyAmount} TOBY </p>
      <br/>
      <Button type="Button" variant="contained" onClick={handleShowStateButton}>More Info</Button>
      {infoOpen ?
        <ContractDetails
          address={shopAddress}
          name={name.data}
          symbol={symbol.data}
          total={withDecimal(weiAmount)}
        />
        : null
      }
    </Paper>

    <Dialog PaperProps={dialogStyles} open={dialogOpen} >
      <p>{alertText}</p>
      <p><Button variant="contained" onClick={handleDialogClose} >Close</Button></p>
    </Dialog>
    </div>
  )

}

export default ShopItem
