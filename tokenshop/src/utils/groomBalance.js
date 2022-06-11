import { utils } from 'ethers';

export function groomWei(weiValue) {
  var factor = Math.pow(10, 4)
  var balance = utils.formatEther(weiValue.toString())
  balance = Math.round(balance * factor) / factor
  return balance
}
