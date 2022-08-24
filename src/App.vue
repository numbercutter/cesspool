<template>
  <div id="app">
    <VueFinalModal
      v-model="modal.messageModal.status"
      classes="modal-container"
      content-class="modal-content-transfer"
    >
      <div class="modal__content">
        <p>{{modal.messageModal.message}}</p>
        
      </div>
    </VueFinalModal>
    <router-link to="/"></router-link>
    <Navigation/>

  </div>
  <router-view/>
</template>

<script>
import Navigation from './components/Navigation.vue';
import { VueFinalModal } from "vue-final-modal";
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
  name: 'App',
  components: {
    Navigation,
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
