import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig
} from 'wagmi'
import { arbitrum, arbitrumGoerli } from '@wagmi/chains'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { ToastContainer } from 'react-toastify';

// components
import MyAppBar from './views/AppBar'
import Home from './views/Home'
import Shop from './views/Shop'

import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';

// polyfills
import { Buffer } from 'buffer'

// Styles
import './App.css'
import '@rainbow-me/rainbowkit/styles.css'
import 'react-toastify/dist/ReactToastify.css';

// const arbitrumRinkeby = {
//   id: chainId.arbitrumRinkeby,
//   name: 'Arbitrum Rinkeby',
//   network: 'arbitrum-rinkeby',
//   nativeCurrency: {
//     name: 'Arbitrum Rinkeby Ether',
//     symbol: 'ARETH',
//     decimals: 18,
//   },
//   rpcUrls: {
//     alchemy: alchemyRpcUrls.arbitrumRinkeby,
//     infura: infuraRpcUrls.arbitrumRinkeby,
//     default: 'https://rinkeby.arbitrum.io/rpc',
//   },
//   blockExplorers: {
//     arbitrum: {
//       name: 'Arbitrum Explorer',
//       url: 'https://rinkeby-explorer.arbitrum.io',
//     },
//     etherscan: etherscanBlockExplorers.arbitrumRinkeby,
//     default: etherscanBlockExplorers.arbitrumRinkeby,
//   },
//   testnet: true,
// }

const arbitrumNitroGoerliChain = {
  id: 421_613,
  name: 'Arbitrum Nitro Goerli',
  network: 'arbitrum-goerli',
  nativeCurrency: {
    name: 'GoerliETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://goerli-rollup.arbitrum.io/rpc',
  },
  blockExplorers: {
    default: 'https://goerli.arbiscan.io',
    etherscan: 'https://goerli-rollup-explorer.arbitrum.io',
  },
  testnet: true,
};

const { chains, provider } = configureChains(
  [chain.arbitrum, arbitrumNitroGoerliChain],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        return { http: chain.rpcUrls.default }
      },
    }),
  ],
)

const { connectors } = getDefaultWallets({
  appName: 'Token Shop',
  chains
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});


// polyfill Buffer for client
if (!window.Buffer) {
  window.Buffer = Buffer
}

const App = () => {
  return (
    <div className="App">
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
        <ToastContainer position='bottom-right' />
          <MyAppBar />
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="shop" element={<Shop />} />
            </Routes>
          </Router>
        </RainbowKitProvider>
      </WagmiConfig>
    </div>
  )
};

export default App;
