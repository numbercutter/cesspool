<template>
  <div id="app">
    <VueFinalModal
        v-model="modal.loginModal"
        classes="modal-container-login"
        content-class="modal-content-login"
      >
        <div class="modal__content">
          <p>You must be logged in via MetaMask or WalletConnect to utilize the CESSPOOL Vaults</p>
        </div>
    </VueFinalModal>
    <VueFinalModal
      v-model="modal.messageModal.status"
      classes="modal-container"
      content-class="modal-content-transfer"
    >
      <div class="modal__content">
        <p>{{modal.messageModal.message}}</p>
      </div>
    </VueFinalModal>
    <template v-if="isAuthenticated">
      <nav class="nav-middle">
        <ul id="swt-nav">
          <li>Connected</li>
          <li>{{ address.slice(0, 4) }}...{{ address.slice(address.length - 4) }}  </li>
          <li><GetBalance/></li>
        </ul>
      </nav>
    </template>
    <template v-else>
      <nav class="nav-middle">
        <ul id="swt-nav">
          <li><button @click="metaLogin">Metamask</button></li>
        </ul>
      </nav>
    </template>
  </div>
  <router-view/>
</template>

<script>
import { VueFinalModal } from "vue-final-modal";
import { useStore } from 'vuex';
import { computed, onMounted } from 'vue';
import { ethers } from "ethers";
import GetBalance from './components/GetBalance.vue';



export default {
  name: 'App',
  components: {
    VueFinalModal,
    GetBalance,
},
  setup() {
    const store = useStore()

    const modals = {
      loadingModal: false,
      errorModal: false,
      txnModal: {status: false, hash: ''},
      messageModal: {status: false, message: ''},
      loginModal: false
    }

    const setModal = (modal) => store.commit('setModal', modal)
    const setUser = (payload) => store.commit('setUser', payload)
    const setAccountAddress = (address) => store.commit('setAccountAddress', address)
    setModal(modals)

    const metaLogin = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
        
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner()
        const accounts = await provider.listAccounts();
        setUser(signer)
        setAccountAddress(accounts[0])
        
      } catch (error) {
        store.state.modal["loginModal"] = true
      }
    }

    const handleCurrentUser = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
      const chain = await provider.getNetwork(1)
      if (chain.name != "bnb") {
          store.state.modal["messageModal"]["message"] = "switching network...";
          store.state.modal["messageModal"]["status"] = true;
          window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [{
                  chainId: "0x38",
                  rpcUrls: ['https://bsc-dataseed1.binance.org/'],
                  chainName: "Smart Chain",
                  nativeCurrency: {
                      name: "BNB",
                      symbol: "BNB",
                      decimals: 18
                  },
                  blockExplorerUrls: ["https://bscscan.com"]
              }]
          });
        }
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        const signer = provider.getSigner()
        setUser(signer)
        setAccountAddress(accounts[0])
      } else {
        store.state.modal["loginModal"] = true
      }
    }
    window.ethereum.on('accountsChanged', (accounts) => {
        handleCurrentUser()
        if (!accounts.length) {
          console.log("accountlenght")
          setUser(0)
          setAccountAddress(0)
        }
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    provider.on("network", (newNetwork, oldNetwork) => {
        console.log(newNetwork)
        if (oldNetwork) {
            window.location.reload();
        }
    });

    onMounted(() => {
      handleCurrentUser()
    })
    return {
      metaLogin,
      isAuthenticated: computed(() => Object.keys(store.state.user).length > 0),
      user: computed(() => store.state.user),
      modal: computed(() => store.state.modal),
      address: computed(() => store.state.address)
    }
  }
}


</script>
<style lang="scss">
@import "./assets/style/main.scss";
</style>
