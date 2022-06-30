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
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'

import ContractDetails from '../ContractDetails'

import { groomWei } from '../../utils/groomBalance'
import { shorten } from '../../utils/shortAddress'
import { convertAmount, withDecimal } from '../../utils/purchaseAmount'

const TOKEN_NAME = process.env.REACT_APP_TRFL_TOKEN_NAME
const TOBY_ADDRESS = process.env.REACT_APP_TOBY_TOKEN_CONTRACT_ADDRESS
const SHOP_ADDRESS = process.env.REACT_APP_TOKEN_SHOP_CONTRACT_ADDRESS
const tokenABI = require('../../contracts/abi/ERC20TobyToken.json')
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

const ShopItem = ({ account, shopAddress, name, symbol }) => {
  const [dialogOpen, setDialog] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [decimals, setDecimals] = useState('18')
  const [weiAmount, setWeiAmount] = useState('0')
  const [buyAmount, setBuyAmount] = useState('0')
  const [menuState, setMenuState] = useState(false)
  const [selectedToken, setSelectedToken] = useState('')
  const [allowance, setAllowance] = useState('0')
  const [alertText, setText] = useState('')

  // need to get allowance for the selected collateral
  const provider = useProvider()
  const contract = useContract({
      addressOrName: SHOP_ADDRESS,
      contractInterface: shopABI,
      signerOrProvider: provider
  })

  // buy with selected token
  const purchaseTx = useContractWrite(
    {
      addressOrName: SHOP_ADDRESS,
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
  }, [selectedToken])

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
          <MenuList>
            <MenuItem onClick={() => handleMenu('TRFL')}>Tuffle (TRFL)</MenuItem>
            <MenuItem onClick={() => handleMenu('USDC')}>US Dollar Coin (USDC)</MenuItem>
            <MenuItem onClick={() => handleMenu('USDT')}>US Dollar Tether (USDT)</MenuItem>
            <MenuItem onClick={() => handleMenu('DAI')}>Dai Stable Coin (DAI)</MenuItem>
          </MenuList>

          <br/>
          <Button type="Button" variant="contained" onClick={handleBuyButton}>Buy</Button>
        </form>

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
