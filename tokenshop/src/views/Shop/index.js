import React, { useContext, useEffect, useState} from 'react'
import {
  useAccount,
  useBalance,
  useContractRead,
  useConnect
} from 'wagmi'

import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Popover from '@mui/material/Popover'
import Divider from '@mui/material/Divider'

// import TXModal from '../../components/TXModal'
import Account from '../../components/Account'
import Approve from '../../components/Approve'
import ShopItem from '../../components/ShopItem'
import BurnToken from '../../components/BurnToken'
import TransferToken from '../../components/TransferToken'
// import Admin from '../../components/Admin'

import contractsContext from '../../context/Contracts/ContractsContext'

import { groomWei } from '../../utils/groomBalance'

const TOBY_ADDRESS = process.env.REACT_APP_TOBY_TOKEN_CONTRACT_ADDRESS
const SHOP_ADDRESS = process.env.REACT_APP_TOKEN_SHOP_CONTRACT_ADDRESS
const shopABI = require('../../contracts/abi/TokenShop.json')

//inline styles
const styles = {
  backgroundColor: '#F9DBDB',
  color: 'black',
  fontFamily: "sans-serif",
  fontSize: "14pt",
  padding: 30
}

const Shop = () => {
  const [name, setName] = useState('')
  const [owner, setOwner] = useState('')
  const [symbol, setSymbol] = useState('')
  const [stock, setStock] = useState('0')
  const [popOpen, setPop] = useState(false)
  const [showApprove, setShowApprove] = useState(false)
  const [showTrade, setShowTrade] = useState(false)
  const [showBurn, setShowBurn] = useState(false)
  const [showTransfer, setShowTransfer] = useState(false)
  const [showAccount, setShowAccount] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)

  const { data: account } = useAccount()

  const { data: ethBalance } = useBalance({
    addressOrName: account?.address,
    watch: true,
  })

  const { data: tokenBalance } = useBalance({
    addressOrName: account?.address,
    token: TOBY_ADDRESS,
    watch: true,
  })

  const { isConnected } = useConnect()

  const shopName = useContractRead(
    {
      addressOrName: SHOP_ADDRESS,
      contractInterface: shopABI
    },
    'getTokenName',
  )

  const shopSymbol = useContractRead(
    {
      addressOrName: SHOP_ADDRESS,
      contractInterface: shopABI
    },
    'getTokenSymbol',
  )

  const shopCount = useContractRead(
    {
      addressOrName: SHOP_ADDRESS,
      contractInterface: shopABI
    },
    'getShopStock',
  )

  const {
    contracts
  } = useContext(contractsContext);

  console.log('connected: ', isConnected)

  const handlePopClose = () => {
    setPop(false)
  }

  const handleApproveButton = () => {
    (isConnected) ?
      setShowApprove(!showApprove)
    :
      setPop(true)
  }

  const handleTradeButton = () => {
    (isConnected) ?
      setShowTrade(!showTrade)
    :
      setPop(true)
  }

  const handleBurnButton = () => {
    (isConnected) ?
      setShowBurn(!showBurn)
    :
      setPop(true)
  }

  const handleTransferButton = () => {
    (isConnected) ?
      setShowTransfer(!showTransfer)
    :
      setPop(true)
  }

  const handleAccountButton = () => {
    (isConnected) ?
      setShowAccount(!showAccount)
    :
      setPop(true)
  }

  const handleAdminButton = () => {
    (isConnected) ?
      setShowAdmin(!showAdmin)
    :
      setPop(true)
  }

  let shopStockGroomed = (shopCount.data) ? groomWei(shopCount.data) : '0'

  return (
    <main className="container">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper>
            <Typography style={styles}>
              Welcome to the Token Shop!
              {
                isConnected ?
                  <React.Fragment>
                    <br/>
                    <strong>Name: </strong> {shopName?.data}
                    <br/>
                    <strong>Symbol: </strong> {shopSymbol?.data}
                    <br/>
                    <strong>Stock: </strong> {shopStockGroomed}
                  </React.Fragment>
                :
                  null
              }
            </Typography>
          </Paper>
        </Grid>

        <Popover
          open={popOpen}
          onClose={handlePopClose}
          anchorReference='anchorPosition'
          anchorPosition={{top: 100, left: 100}}
          anchorOrigin={{vertical: 'top', horizontal: 'center'}}
          transformOrigin={{vertical: 'top', horizontal: 'center'}}
        >
          <Typography style={styles}>
            Please connect a MetaMask wallet!
          </Typography>
        </Popover>

        <Grid item xs={12}>
          <Button type="Button" variant="contained" onClick={handleApproveButton}> Approve </Button>
        </Grid>

        <Grid item xs={12}>
          {showApprove ? <Approve /> : null}
        </Grid>

        <Grid item xs={12}>
          <Button type="Button" variant="contained" onClick={handleTradeButton}> Trade </Button>
        </Grid>

        <Grid item xs={12}>
          {showTrade ?
            <ShopItem
              account={account}
              shopAddress={SHOP_ADDRESS}
            /> :
            null
          }
        </Grid>

        <Grid item xs={12}>
          <Button type="Button" variant="contained" onClick={handleTransferButton}> Transfer </Button>
        </Grid>

        <Grid item xs={12}>
          {showTransfer ?
            <TransferToken
              name={shopName}
              symbol={shopSymbol}
              tokenBalance={tokenBalance}
            /> :
            null
          }
        </Grid>

        <Grid item xs={12}>
          <Button type="Button" variant="contained" onClick={handleBurnButton}> Burn </Button>
        </Grid>

        <Grid item xs={12}>
          {showBurn ? <BurnToken tokenBalance={tokenBalance} /> : null}
        </Grid>

        <Grid item xs={12}>
          <Button type="Button" variant="contained" onClick={handleAccountButton}> Account </Button>
        </Grid>

        <Grid item xs={12}>
          {showAccount ?
            <Account
              account={account}
              ethBalance={ethBalance}
              tokenBalance={tokenBalance}
            /> :
            null
          }
        </Grid>

      </Grid>
    </main>
  )
}

// <TXModal />

// <Grid item xs={12}>
//   <Button type="Button" variant="contained" onClick={handleTradeButton}> Trade </Button>
// </Grid>
//
// <Grid item xs={12}>
//   {showTrade ? <ShopItem /> : null}
// </Grid>
//
// <Grid item xs={12}>
//   <Button type="Button" variant="contained" onClick={handleBurnButton}> Burn </Button>
// </Grid>
//
// <Grid item xs={12}>
//   {showBurn ? <BurnToken /> : null}
// </Grid>
//
// <Grid item xs={12}>
//   <Button type="Button" variant="contained" onClick={handleTransferButton}> Transfer </Button>
// </Grid>
//
// <Grid item xs={12}>
//   {showTransfer ? <TransferToken /> : null}
// </Grid>
//
// <Grid item xs={12}>
//   <Button type="Button" variant="contained" onClick={handleAccountButton}> Account </Button>
// </Grid>
//
// <Grid item xs={12}>
//   {showAccount ? <Account /> : null}
// </Grid>
//
// <Grid item xs={12}>
// {isConnected ?
//     (owner === data?.address) ?
//       <Button type="Button" variant="contained" onClick={handleAdminButton}> Admin </Button>
//     : null
//   : null
// }
// </Grid>
//
// <Grid item xs={12}>
//   {showAdmin ? <Admin /> : null}
// </Grid>

export default Shop;
