import React, { useContext, useEffect, useState} from 'react'
import { useAccount, useConnect } from 'wagmi'

import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Popover from '@mui/material/Popover'
import Divider from '@mui/material/Divider'

// import TXModal from '../../components/TXModal'
// import Account from '../../components/Account'
import Approve from '../../components/Approve'
// import ShopItem from '../../components/ShopItem'
// import BurnToken from '../../components/BurnToken'
// import TransferToken from '../../components/TransferToken'
// import Admin from '../../components/Admin'

import contractsContext from '../../context/Contracts/ContractsContext'

import {groomWei} from '../../utils/groomBalance'

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

  const { data } = useAccount()
  const { isConnected } = useConnect()

  const {
    contracts
  } = useContext(contractsContext);
console.log(isConnected)
  // useEffect(async () => {
  //   if(isConnected) {
  //     // setName(await contracts.tokenShop.methods.getTokenName().call({from: data?.address}))
  //     // setSymbol(await contracts.tokenShop.methods.getTokenSymbol().call({from: data?.address}))
  //     // setStock(await contracts.tokenShop.methods.getShopStock().call({from: data?.address}))
  //     // setOwner(await contracts.tokenShop.methods.owner().call({from: data?.address}))
  //   }
  // }, [isConnected])

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

  let shopStockGroomed = groomWei(stock)

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
                    <strong>Name: </strong> {name}
                    <br/>
                    <strong>Symbol: </strong> {symbol}
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
