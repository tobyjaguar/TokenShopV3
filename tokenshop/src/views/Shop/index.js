import React, { useContext, useEffect, useState} from 'react'

import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Popover from '@material-ui/core/Popover'
import Divider from '@material-ui/core/Divider'

import TXModal from '../../components/TXModal'
import Account from '../../components/Account'
import Approve from '../../components/Approve'
import ShopItem from '../../components/ShopItem'
import BurnToken from '../../components/BurnToken'
import TransferToken from '../../components/TransferToken'
import Admin from '../../components/Admin'

import walletContext from '../../context/WalletProvider/WalletProviderContext'
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

  const {
    connected,
    account,
    tokenBalance
  } = useContext(walletContext)

  const {
    contracts
  } = useContext(contractsContext);

  useEffect(async () => {
    if(connected) {
      setName(await contracts.tokenShop.methods.getTokenName().call({from: account}))
      setSymbol(await contracts.tokenShop.methods.getTokenSymbol().call({from: account}))
      setStock(await contracts.tokenShop.methods.getShopStock().call({from: account}))
      setOwner(await contracts.tokenShop.methods.owner().call({from: account}))
    }
  }, [connected])

  const handlePopClose = () => {
    setPop(false)
  }

  const handleApproveButton = () => {
    (connected) ?
      setShowApprove(!showApprove)
    :
      setPop(true)
  }

  const handleTradeButton = () => {
    (connected) ?
      setShowTrade(!showTrade)
    :
      setPop(true)
  }

  const handleBurnButton = () => {
    (connected) ?
      setShowBurn(!showBurn)
    :
      setPop(true)
  }

  const handleTransferButton = () => {
    (connected) ?
      setShowTransfer(!showTransfer)
    :
      setPop(true)
  }

  const handleAccountButton = () => {
    (connected) ?
      setShowAccount(!showAccount)
    :
      setPop(true)
  }

  const handleAdminButton = () => {
    (connected) ?
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
                connected ?
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
          <TXModal />

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
          {showTrade ? <ShopItem /> : null}
        </Grid>

        <Grid item xs={12}>
          <Button type="Button" variant="contained" onClick={handleBurnButton}> Burn </Button>
        </Grid>

        <Grid item xs={12}>
          {showBurn ? <BurnToken /> : null}
        </Grid>

        <Grid item xs={12}>
          <Button type="Button" variant="contained" onClick={handleTransferButton}> Transfer </Button>
        </Grid>

        <Grid item xs={12}>
          {showTransfer ? <TransferToken /> : null}
        </Grid>

        <Grid item xs={12}>
          <Button type="Button" variant="contained" onClick={handleAccountButton}> Account </Button>
        </Grid>

        <Grid item xs={12}>
          {showAccount ? <Account /> : null}
        </Grid>

        <Grid item xs={12}>
        {connected ?
            (owner === account) ?
              <Button type="Button" variant="contained" onClick={handleAdminButton}> Admin </Button>
            : null
          : null
        }
        </Grid>

        <Grid item xs={12}>
          {showAdmin ? <Admin /> : null}
        </Grid>

      </Grid>
    </main>
  )
}

export default Shop;
