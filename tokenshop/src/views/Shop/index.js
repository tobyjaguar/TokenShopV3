import React, { useEffect, useState } from 'react'
import {
  useAccount,
  useBalance,
  useContractRead,
  useConnect,
  useNetwork
} from 'wagmi'

import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Popover from '@mui/material/Popover'

// import TXModal from '../../components/TXModal'
import Account from '../../components/Account'
import Approve from '../../components/Approve'
import ShopItem from '../../components/ShopItem'
import BurnToken from '../../components/BurnToken'
import TransferToken from '../../components/TransferToken'
import Admin from '../../components/Admin'

import { groomWei } from '../../utils/groomBalance'

const TOBY_ADDRESS_MAINNET = process.env.REACT_APP_TOBY_TOKEN_CONTRACT_ADDRESS_ARB_MAINNET
const TOBY_ADDRESS_TESTNET = process.env.REACT_APP_TOBY_TOKEN_CONTRACT_ADDRESS_ARB_TESTNET
const SHOP_ADDRESS_MAINNET = process.env.REACT_APP_TOKEN_SHOP_CONTRACT_ADDRESS_ARB_MAINNET
const SHOP_ADDRESS_TESTNET = process.env.REACT_APP_TOKEN_SHOP_CONTRACT_ADDRESS_ARB_TESTNET

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
  const [owner, setOwner] = useState('')
  const [popOpen, setPop] = useState(false)
  const [showApprove, setShowApprove] = useState(false)
  const [showTrade, setShowTrade] = useState(false)
  const [showBurn, setShowBurn] = useState(false)
  const [showTransfer, setShowTransfer] = useState(false)
  const [showAccount, setShowAccount] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [shopAddress, setShopAddress] = useState('')
  const [tokenAddress, setTokenAddress] = useState('')

  const { data: account } = useAccount()

  const { data: ethBalance } = useBalance({
    addressOrName: account?.address,
    watch: true,
  })

  const { isConnected } = useConnect()
  const { activeChain } = useNetwork()

  useEffect(() => {
    if (activeChain) {
      if (activeChain.network === 'arbitrum') {
        setShopAddress(SHOP_ADDRESS_MAINNET)
        setTokenAddress(TOBY_ADDRESS_MAINNET)
      }
      else {
        setShopAddress(SHOP_ADDRESS_TESTNET)
        setTokenAddress(TOBY_ADDRESS_TESTNET)
      }
    }
  }, [activeChain])

  const { data: tokenBalance } = useBalance({
    addressOrName: account?.address,
    token: tokenAddress,
    watch: true,
  })

  // get token owner
  const shopOwner = useContractRead(
    {
      addressOrName: shopAddress,
      contractInterface: shopABI
    },
    'getOwner',
    {
      onSuccess(data) {
        setOwner(data)
      },
    },
  )

  const shopName = useContractRead(
    {
      addressOrName: shopAddress,
      contractInterface: shopABI
    },
    'getTokenName',
  )

  const shopSymbol = useContractRead(
    {
      addressOrName: shopAddress,
      contractInterface: shopABI
    },
    'getTokenSymbol',
  )

  const shopCount = useContractRead(
    {
      addressOrName: shopAddress,
      contractInterface: shopABI
    },
    'getShopStock',
  )

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
          {showApprove ?
            <Approve
              network={activeChain.network}
              shopAddress={shopAddress}
            /> :
            null
          }
        </Grid>

        <Grid item xs={12}>
          <Button type="Button" variant="contained" onClick={handleTradeButton}> Trade </Button>
        </Grid>

        <Grid item xs={12}>
          {showTrade ?
            <ShopItem
              account={account}
              name={shopName}
              network={activeChain.network}
              shopAddress={shopAddress}
              symbol={shopSymbol}
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
          {showBurn ?
            <BurnToken
              tokenAddress={tokenAddress}
              tokenBalance={tokenBalance}
            /> :
            null
          }
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

        <Grid item xs={12}>
        {isConnected ?
            (owner === account?.address) ?
              <Button type="Button" variant="contained" onClick={handleAdminButton}> Admin </Button>
            : null
          : null
        }
        </Grid>

        <Grid item xs={12}>
          {showAdmin ?
            <Admin
              account={account}
              network={activeChain.network}
              tokenAddress={tokenAddress}
              shopAddress={shopAddress}
            /> :
            null
          }
        </Grid>

      </Grid>
    </main>
  )
}

export default Shop;
