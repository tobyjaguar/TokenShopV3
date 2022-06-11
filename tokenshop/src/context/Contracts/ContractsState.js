import React, {useReducer} from 'react'
import contractsContext from './ContractsContext'
import contractsReducer from './ContractsReducer'
import {
  SET_CONTRACTS,
  REMOVE_CONTRACTS
} from '../types'

import SHOP_ABI from '../../contracts/abi/TokenShop.json'
import TOBY_ABI from '../../contracts/abi/ERC20TobyToken.json'
import TRUFFLE_ABI from '../../contracts/abi/TruffleToken.json'

const SHOP_ADDRESS = process.env.REACT_APP_TOKEN_SHOP_CONTRACT_ADDRESS
const TOBY_ADDRESS = process.env.REACT_APP_TOBY_TOKEN_CONTRACT_ADDRESS
const TRUFFLE_ADDRESS = process.env.REACT_APP_TRFL_TOKEN_CONTRACT_ADDRESS

const ContractsState = ({children}) => {
  const initialState = {
    contracts: {
      tokenShop: '',
      tobyToken: '',
      truffleToken: ''
    }
  };

  const [state, dispatch] = useReducer(contractsReducer, initialState);

  const setContracts = provider => {
      let tokenShop = new provider.eth.Contract(SHOP_ABI, SHOP_ADDRESS)
      let tobyToken = new provider.eth.Contract(TOBY_ABI, TOBY_ADDRESS)
      let truffleToken = new provider.eth.Contract(TRUFFLE_ABI, TRUFFLE_ADDRESS)
      let contracts = {
        tokenShop,
        tobyToken,
        truffleToken
      }
      dispatch({type: SET_CONTRACTS, payload: contracts})
      return contracts;
  };

  const removeContracts = () => {
      dispatch({type: REMOVE_CONTRACTS});
      return {};
  };

  return (
    <contractsContext.Provider
    value={{
      setContracts,
      removeContracts,
      contracts: state.contracts
    }}
    >
    {children}
    </contractsContext.Provider>
  );
};

export default ContractsState;
