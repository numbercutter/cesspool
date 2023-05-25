import { createStore } from 'vuex'
import { cesspoolAddress, cesspoolABI } from '../contracts/cesspool.sol/cesspool';

const store = createStore({
  state () {
    return {
      user: {},
      address: null,
      provider: null,
      nfts: [],
      txn: [],
      modal: [],
      swtnfts: {},
      cess: null,
      cesspoolContract: {address: cesspoolAddress, abi: cesspoolABI}
    }
  },
  getters: {
    address(state) {
      return state.address
    },
    cess(state) {
      return state.cess
    }
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    setAccountAddress (state, address) {
      state.address = address
    },
    setProvider (state, provider) {
      state.provider = provider
    },
    setUserNfts (state, nfts) {
      state.nfts = nfts
    },
    setTxnHistory (state, txn) {
      state.txn = txn
    },
    setModal (state, modal) {
      state.modal = modal
    },
    setSwtNfts (state, swtnfts) {
      state.swtnfts = swtnfts
    },
    setCess (state, cess) {
      state.cess = cess
    },
  }
})

export default store