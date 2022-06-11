import { BigNumber, utils } from 'ethers';

export function convertAmount(amount) {
  var int = Math.floor(amount);
  var dec = Math.round((amount - int) * 100);
  var intBN = BigNumber.from(int);
  var decBN = BigNumber.from(dec);
  var weiDec = BigNumber.from(utils.formatUnits('1', 'ether'));
  var hundredBN = BigNumber.from('100')
  decBN = decBN.mul(weiDec).div(hundredBN);
  var intEth = utils.formatUnits(intBN, 'ether');
  var decEth = utils.formatEther(decBN, 'ether');
  return intEth.add(decBN).toString();
}

export function withDecimal(amount) {
  var amountBN = BigNumber.from(amount)
  var oneEth = BigNumber.from(utils.formatEther('1', 'ether'));
  var whole
  var decimal
  if (amountBN.lt(oneEth)) {
    whole = '0'
    var tenBN = BigNumber.from('10')
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
