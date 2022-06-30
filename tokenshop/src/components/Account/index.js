import React, { useContext, useEffect, useState } from 'react'

import { useAccount, useBalance } from 'wagmi'

//components
import Paper from '@mui/material/Paper'

import { groomWei } from '../../utils/groomBalance'

//inline styles
const styles = {
    backgroundColor: '#F9DBDB',
    padding: 20
}

const TOBY_ADDRESS = process.env.REACT_APP_TOBY_TOKEN_CONTRACT_ADDRESS

const Account = ({ account, ethBalance, tokenBalance })  => {

  return (
    <div>
      <Paper style={styles} elevation={5} >
      <h2>Active Account</h2>
      <p>
        <strong>Ether Balance: </strong>
        {ethBalance.formatted} <em>{ethBalance.symbol}</em>
      </p>
      <p>
        <strong>Token Balance: </strong>
        {tokenBalance.formatted} <em>TOBY</em>
      </p>
      <br/>
    </Paper>
    </div>
  )


}

export default Account
