import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {
  WagmiConfig,
  chain,
  createClient,
  defaultChains,
  configureChains
} from 'wagmi'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'

// context
import ContractsState from './context/Contracts/ContractsState'

// components
import MyAppBar from './views/AppBar'
import Home from './views/Home'
import Shop from './views/Shop'

import { publicProvider } from 'wagmi/providers/public'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

// polyfills
import { Buffer } from 'buffer'

// Styles
import './App.css'
import '@rainbow-me/rainbowkit/styles.css'

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

const { connectors } = getDefaultWallets({
  appName: 'Token Shop',
  chains
})

// polyfill Buffer for client
if (!window.Buffer) {
  window.Buffer = Buffer
}

const client = createClient({
  autoConnect: true,
  connectors,
  provider,
})

const App = () => {
  return (
    <div className="App">
      <WagmiConfig client={client}>
        <RainbowKitProvider chains={chains}>
        <ContractsState>
          <MyAppBar />
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="shop" element={<Shop />} />
            </Routes>
          </Router>
        </ContractsState>
        </RainbowKitProvider>
      </WagmiConfig>
    </div>
  )
};

export default App;
