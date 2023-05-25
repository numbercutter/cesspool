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
      <router-view/>
    </template>
    <template v-else>
      <nav class="nav-middle">
        <ul id="swt-nav">
          <li><button @click="metaLogin">Metamask</button></li>
        </ul>
      </nav>
    </template>
  </div>
  
</template>

<script>
import { VueFinalModal } from "vue-final-modal";
import { useStore } from 'vuex';
import { computed, onMounted } from 'vue';
import { ethers } from "ethers";
import GetBalance from './components/GetBalance.vue';
import { handleLogin, handleCurrentUser, handleAccountChange, setupNetworkChangeListener, setupAccountChangeListener } from './api/ethersConnect';

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

    store.commit('setModal', modals)

    const metaLogin = async () => {
      await handleLogin(store);
    }

    window.ethereum.on('accountsChanged', (accounts) => {
        handleAccountChange(store, accounts);
    });
    
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    provider.on("network", (newNetwork, oldNetwork) => {
        console.log(newNetwork)
        if (oldNetwork) {
            window.location.reload();
        }
    });

    onMounted(() => {
      handleCurrentUser(store);
      setupNetworkChangeListener();
      setupAccountChangeListener();  // Add this line
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
@import "./styles/main.scss";

body {
  background-image: url('./assets/img/dusky.webp');
}
</style>
