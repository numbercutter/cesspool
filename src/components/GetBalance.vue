<template>
  <div>
    {{ cessBalance }}
  </div>
</template>

<script>
//import { ethers } from "ethers";
import { ref, onMounted, watch } from 'vue'
import { useStore } from "vuex";

export default {
    name: "GetBalance",
    setup() {
        const store = useStore()
        const address = ref(store.state.address)

        const getBalance = async () => {
            const user = store.state.user
            console.log(user)
        }
        watch(()=>store.getters.user, function() {
            getBalance()
        });
        onMounted(() => {
            getBalance()
        })

        return {
            address
        }
    }
}
</script>

<style>

</style>