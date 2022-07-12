import { Link } from 'react-router-dom'

import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

const logo = require('../../assets/Shop.jpg')

//inline styles
const styles = {
  backgroundColor: '#F9DBDB',
  color: 'black',
  fontFamily: "sans-serif",
  fontSize: "14pt",
  padding: 30
}

const Home = () => {

  return (
    <main className="container">
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <div className="pure-u-1-1 header">
            <Link to='/shop'>
              <img src={logo} alt="toby-token-shop" width={'90%'} />
            </Link>
          </div>
        </Grid>

        <Grid item>
        <Paper>
          <Typography style={styles}>
          This is a token shop where you can swap TOBY tokens for Stable tokens.
          Each TOBY token costs $1, and is swapped for equivalent Stable tokens.
          The goal is to buy TOBY tokens here and then sell them back to Toby in person.
          TOBY is an ERC20 token. Please have MetaMask enabled to play.
          </Typography>
        </Paper>
        </Grid>

        <br/><br/>
        <Grid item>
          <a href="https://www.freepik.com/free-photos-vectors/flower"><font color="#F9DBDB">Flower vector created by Rawpixel.com - Freepik.com</font></a>
        </Grid>
      </Grid>
    </main>
  )
}

export default Home;
