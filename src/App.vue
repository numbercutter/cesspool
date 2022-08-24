<template>
  <div id="nav">
    <router-link to="/"></router-link>
    <Navigation/>
    <GetSafariworldBalance/>
    <VueFinalModal
        v-model="modal.loginModal"
        classes="modal-container-login"
        content-class="modal-content-login"
      >
        <div class="modal__content">
          <p>You must be logged in via MetaMask or WalletConnect to utilize the Safari World Vaults</p>
        </div>
    </VueFinalModal>
  </div>
  <router-view/>
</template>

<script>
import Navigation from './components/Navigation.vue';
import GetSafariworldBalance from './components/GetSafariworldBalance.vue';
import { VueFinalModal } from "vue-final-modal";
import { useStore } from 'vuex';
import { computed } from 'vue';
export default {
  name: 'App',
  components: {
    Navigation,
    GetSafariworldBalance,
    VueFinalModal
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
    //const setUserNfts = (nfts) => store.commit("setUserNfts", nfts);

    

    setModal(modals)

    return {
      modal: computed(() => store.state.modal),
    }
  }
}


</script>
<style lang="scss">
@import "./assets/style/main.scss";
</style>
