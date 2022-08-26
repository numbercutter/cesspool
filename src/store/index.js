import { createStore } from 'vuex'

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
    }
  },
  getters: {
    address(state) {
      return state.address
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