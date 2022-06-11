import React from 'react'

const ContractDetails = ({
  address,
  name,
  symbol,
  total,
}) => {

  return(
    <React.Fragment>
    <p>Token Address: {address}</p>
    <p>Token Name: {name}</p>
    <p>Token Symbol: {symbol}</p>
    <p>Token Amount: {total}</p>
    </React.Fragment>
  )
}

export default ContractDetails
