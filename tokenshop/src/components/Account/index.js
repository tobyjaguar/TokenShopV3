import React, { useContext, useEffect, useState } from 'react'

//components
import Paper from '@material-ui/core/Paper'

import walletContext from '../../context/WalletProvider/WalletProviderContext'

import {groomWei} from '../../utils/groomBalance'

//inline styles
const styles = {
    backgroundColor: '#F9DBDB',
    padding: 20
}

const Account = ()  => {
  const [ethBalance, setEthBalance] = useState('0')

  const {
    connected,
    providerContext,
    account,
    tokenBalance
  } = useContext(walletContext);

  useEffect(async () => {
    setEthBalance(await providerContext.eth.getBalance(account))
  }, [])

  return (
    <div>
      <Paper style={styles} elevation={5} >
      <h2>Active Account</h2>
      <p><strong>Ether Balance: </strong> {groomWei(ethBalance)} ETH</p>
      <p><strong>Token Balance: </strong> {tokenBalance} TOBY</p>
      <br/>
    </Paper>
    </div>
  )


}

export default Account
