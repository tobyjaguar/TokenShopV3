import { BigNumber, utils } from 'ethers';

export function convertAmount(amount, decimals) {
  let int = Math.floor(amount);
  let dec = Math.round((amount - int) * 100);
  let intBN = BigNumber.from(int);
  let decBN = BigNumber.from(dec);
  let intDec = utils.parseUnits(decBN.toString(), (decimals - 2));
  let intEth = utils.parseUnits(intBN.toString(), decimals);
  return intEth.add(intDec).toString();
}

export function withDecimal(amount) {
  let amountBN = BigNumber.from(amount)
  let oneEth = BigNumber.from(utils.parseUnits('1', 'ether'));
  let whole
  let decimal
  if (amountBN.lt(oneEth)) {
    whole = '0'
    let tenBN = BigNumber.from('10')
    if (amountBN.lt(oneEth.div(tenBN))) {
      decimal = '0' + amount
    }
    else {
      decimal = amount
    }
  }
  else {
    whole = amount.slice(0,-18)
    decimal = amount.slice(-18)
  }

  return whole + '.' + decimal
}
