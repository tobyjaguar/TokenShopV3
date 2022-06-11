import {
  SET_CONTRACTS,
  REMOVE_CONTRACTS
} from '../types';

const ContractsReducer = (state, action) => {
  let { contracts } = state
  switch (action.type) {
    case SET_CONTRACTS:
      contracts = action.payload
      return {
        ...state,
        contracts: contracts
      };
    case REMOVE_CONTRACTS:
      contracts = {
        tokenShop: '',
        tobyToken: '',
        truffleToken: ''
      }
      return {
        ...state,
        contracts: contracts
      };
    default:
      return state;
  };
};

export default ContractsReducer;
