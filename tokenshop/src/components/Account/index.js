//components
import Paper from '@mui/material/Paper'

//inline styles
const styles = {
    backgroundColor: '#F9DBDB',
    padding: 20
}

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
