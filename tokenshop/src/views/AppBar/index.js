import { useState, useEffect } from 'react'
import { useNetwork } from 'wagmi'

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import { ConnectButton } from '@rainbow-me/rainbowkit'

import { shorten } from '../../utils/shortAddress'

//Styles
import '../../App.css'

//inline styles
const style01 = {
  backgroundColor: '#F9DBDB',
  color: 'black',
  fontFamily: "sans-serif",
  fontSize: "14pt"
}

const style02 = {
  color: 'black',
  fontFamily: "sans-serif",
  fontSize: "14pt",
  flex: 1
}

const SHOP_ADDRESS_ARB_MAINNET = process.env.REACT_APP_TOKEN_SHOP_CONTRACT_ADDRESS_ARB_MAINNET
const SHOP_ADDRESS_ARB_TESTNET = process.env.REACT_APP_TOKEN_SHOP_CONTRACT_ADDRESS_ARB_TESTNET

const MyAppBar = () => {
  const [shopAddress, setShopAddress] = useState('')

  const { activeChain } = useNetwork()

  useEffect(() => {
    // fired on inital load of page
    if (activeChain) {
      (activeChain.network === 'arbitrum') ?
          setShopAddress(shorten(SHOP_ADDRESS_ARB_MAINNET)) :
          setShopAddress(shorten(SHOP_ADDRESS_ARB_TESTNET))
    }
  }, [activeChain, shopAddress])

  return (
    <AppBar style={style01} position='static'>
      <Toolbar>

            <Typography style={style02} variant='subtitle1' color='inherit'>
                Shop Address: {shopAddress}
            </Typography>

            <ConnectButton />
      </Toolbar>
    </AppBar>
  )
 }
 // {error && <Alert severity='error'>Error connecting wallet</Alert>}

export default MyAppBar
