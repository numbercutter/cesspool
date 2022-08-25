<template>
  <div>
    {{ address }}
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
            address.value = store.state.address
            console.log(address)
            return address
        }
        watch(()=>store.getters.address, function() {
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