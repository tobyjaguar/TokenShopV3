import React, { useContext, useEffect, useState  } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Fade from '@mui/material/Fade'
import Alert from '@mui/material/Alert'

import hex2dec from 'hex2dec'

import contractsContext from '../../context/Contracts/ContractsContext'

import { groomWei } from '../../utils/groomBalance'
import { shorten } from '../../utils/shortAddress'

import { useAccount, useConnect, useDisconnect } from 'wagmi'

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
  marginLeft: 'auto'
}

const APP_ENV = process.env.REACT_APP_ENV
const NETWORK_NAME = process.env.REACT_APP_NETWORK_NAME
const NETWORK_ID = process.env.REACT_APP_NETWORK_ID
const RPC_URL = process.env.REACT_APP_RPC_URL
const EXPLORER_URL = process.env.REACT_APP_EXPLORER_URL

const TOKEN_ABI = require('../../contracts/abi/ERC20TobyToken.json')
const SHOP_ABI = require('../../contracts/abi/TokenShop.json')

const TOKEN_ADDRESS = process.env.REACT_APP_TOBY_TOKEN_CONTRACT_ADDRESS
const SHOP_ADDRESS = process.env.REACT_APP_TOKEN_SHOP_CONTRACT_ADDRESS

const MyAppBar = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [areWeConnected, setLocalConnection] = useState(false)
  const [shopAddress, setShopAddress] = useState('')
  const [tokenContract, setTokenContract] = useState(null)

  const open = Boolean(anchorEl)

  const { account, data } = useAccount()

  const {
    connect,
    connectors,
    error,
    isConnected,
    isConnecting,
    pendingConnector
  } = useConnect()

  const { disconnect } = useDisconnect()

  const {
    setContracts,
    contracts
  } = useContext(contractsContext)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
      setAnchorEl(null)
  }

  useEffect(() => {
    // fired on inital load of page
    setShopAddress(shorten(SHOP_ADDRESS))
  }, [])

console.log(isConnected)
console.log(data?.address)
console.log('open: ', open)

  return (
    <AppBar style={style01} position='static'>
      <Toolbar>
        <Typography style={style01} variant='subtitle1' color='inherit'>
            Shop Address: {shopAddress}
        </Typography>

        {(isConnected) ?
          <Typography style={style02} >
            <Button
              variant='contained'
              onClick={disconnect}
            >
              Disconnect
            </Button>
          </Typography>
          :
          <Typography style={style02} >
          <Button
            variant='contained'
            onClick={handleClick}
          >
            Connect
          </Button>
          </Typography>
        }

        <Menu
          id='menu'
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'fade-button',
          }}
          TransitionComponent={Fade}
        >
        {connectors.map(connector => (
          <MenuItem
            key={connector.id}
            variant='contained'
            disabled={!connector.ready}
            onClick={() => connect(connector)}
          >
            {connector.name}
            {!connector.ready && ' (unsupported)'}
            {isConnecting && connector.id === pendingConnector?.id && ' (connecting)'}
          </MenuItem>
        ))}
        </Menu>
      </Toolbar>
      {error && <Alert severity='error'>Error connecting wallet</Alert>}
    </AppBar>
  )
 }


 // {connected ?
 //     <Typography style={style02} >
 //       Balance: {groomWei(0)} TOBY
 //     </Typography>
 //   : <Typography style={style02} >
 //       <Button
 //         variant='contained'
 //         onClick={async () => connect()}
 //       >
 //         Connect
 //       </Button>
 //     </Typography>
 // }

export default MyAppBar
