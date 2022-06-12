import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {
  WagmiConfig,
  chain,
  createClient,
  defaultChains,
  configureChains
} from 'wagmi'

// context
import ContractsState from './context/Contracts/ContractsState'

// components
import MyAppBar from './views/AppBar'
import Home from './views/Home'
// import Shop from './views/Shop'

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

import { publicProvider } from 'wagmi/providers/public'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

// polyfills
import { Buffer } from 'buffer'

// Styles
import './App.css'

console.log(chain)
const { chains, provider } = configureChains(
  [chain.arbitrum, chain.arbitrumRinkeby],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        return { http: chain.rpcUrls.default }
      },
    }),
  ],
)

// polyfill Buffer for client
if (!window.Buffer) {
  window.Buffer = Buffer
}

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  provider,
})

const App = () => {
  return (
    <div className="App">
      <WagmiConfig client={client}>
        <ContractsState>
          <MyAppBar />
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </Router>
        </ContractsState>
      </WagmiConfig>
    </div>
  )
};

// <ContractsState>
//   <MyAppBar />
//   <Router>
//     <Routes>
//       <Route path="/shop" component={Shop} />
//       <Route exact path="/" component={Home} />
//     </Routes>
//   </Router>
// </ContractsState>

export default App;
