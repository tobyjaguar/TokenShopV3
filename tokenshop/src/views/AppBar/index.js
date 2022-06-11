import React, { useContext, useEffect, useState  } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import hex2dec from 'hex2dec'

import contractsContext from '../../context/Contracts/ContractsContext'

import { groomWei } from '../../utils/groomBalance'
import {shorten} from '../../utils/shortAddress'

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
  const [web3, setWeb3] = useState(null)
  const [areWeConnected, setLocalConnection] = useState(false)
  const [shopAddress, setShopAddress] = useState('')
  const [tokenContract, setTokenContract] = useState(null)
  //const [tokenBalance, setBalance] = useState('0')
  const connected = false;

  const {
    setContracts,
    contracts
  } = useContext(contractsContext)

  useEffect(() => {
    // fired on inital load of page
    setShopAddress(shorten(SHOP_ADDRESS))
  }, [])

  const connect = async () => {
      // try {
      //     let provider = await web3Modal.connect()
      //     let localWeb3 = new Web3(provider)
      //
      //     //register provider events
      //     registerProvider(localWeb3)
      //     let chainId = await localWeb3.eth.getChainId()
      //
      //     if (chainId.toString() === hex2dec.hexToDec(NETWORK_ID)) {
      //       // continue with connection setup
      //       setWeb3(localWeb3)
      //       await setWalletProvider(localWeb3) // set provider to context
      //       let accounts = await localWeb3.eth.getAccounts()
      //       setAccount(accounts[0]) // set account to context
      //       let localContract = new localWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS)
      //       setTokenContract(localContract)
      //       setContracts(localWeb3) // set contracts to context
      //       let balance = await localContract.methods.balanceOf(accounts[0]).call({from: accounts[0]})
      //       setTokenBalance(balance) // set token balance to context
      //       setConnected(true) // set connected to context
      //     }
      // }
      // catch (ex) {
      //   console.log(ex)
      // }
  }

  const registerProvider = provider => {
    // target supported chain ids
    provider.currentProvider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: NETWORK_ID,
          chainName: NETWORK_NAME,
          nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
          },
          rpcUrls: [RPC_URL],
          blockExplorerUrls: [EXPLORER_URL],
        },
      ],
    });

    // register MetaMask events
    provider.currentProvider.on('accountsChanged', (accounts: string[]) => {
      console.log('account changed', accounts[0])
      // connect()
    });

    provider.currentProvider.on('chainChanged', (chainId: number) => {
      console.log('chain changed', chainId)
      // connect()
      //window.location.reload();
    });

    provider.currentProvider.on('disconnect', (error: {code: number; message: string}) => {
      console.log('the client has disconnected')
      console.log(error)
    });
  }

  return (
    <AppBar style={style01} position='static'>
      <Toolbar>
        <Typography style={style01} variant='subtitle1' color='inherit'>
            Shop Address: {shopAddress}
        </Typography>
        {connected ?
            <Typography style={style02} >
              Balance: {groomWei(0)} TOBY
            </Typography>
          : <Typography style={style02} >
              <Button
                variant='contained'
                onClick={async () => connect()}
              >
                Connect
              </Button>
            </Typography>
        }
      </Toolbar>
    </AppBar>
  )
 }

export default MyAppBar
