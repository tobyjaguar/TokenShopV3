import React, { useContext, useEffect, useState } from 'react'

//components
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'

import transactionsContext from '../../context/Transactions/TransactionsContext';

import { shorten } from '../../utils/shortAddress'

//inline styles
const styles = {
  style: {
    backgroundColor: '#FFF5F5',
    padding: 20,
    width: '30%'
  }
}

const TXModal = () => {
  const [isOpen, setOpen] = useState(false);
  const [txHash, setTxHash] = useState('');

  const {
    setTransactions,
    txsContext
  } = useContext(transactionsContext);

  useEffect(async () => {
    // if a new transaction is added to the context
    let id = txsContext.length - 1;
    if (txsContext[id] !== undefined) {
        setOpen(true);
        setTxHash(txsContext[id]);
    }
  }, [txsContext]);

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <div>
      <Dialog PaperProps={styles} open={isOpen} >
        <DialogTitle id="tx-dialog"><b>Transaction sent</b></DialogTitle>
          <DialogContent>Click on the link to view in an explorer</DialogContent>
        <List>
          <ListItem>
            <p>TxHash: &nbsp;</p>
            <a href={`https://testnet.arbiscan.io/tx/${txHash}`} target="_blank">
              <ListItemText secondary={shorten(txHash)} />
            </a>
          </ListItem>
          <ListItem>
            <Button variant="contained" onClick={() => handleClose()} >Close</Button>
          </ListItem>
        </List>
      </Dialog>
    </div>
  );
};

export default TXModal;
