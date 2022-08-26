<template>
  <div>
    {{ balance }}
  </div>
</template>

<script>
import { ethers } from "ethers";
//import { cessVaultAddress, cessVaultABI } from './contracts/cess4cess.sol/cess4cess.js';
import { cesspoolAddress, cesspoolABI } from './contracts/cesspool.sol/cesspool.js';
import { ref, onMounted, watch } from 'vue'
import { useStore } from "vuex";

export default {
    name: "GetBalance",
    setup() {
        const store = useStore()
        const balance = ref(0)

        const getBalance = async () => {
            const { Contract } = require('ethers');
            const address = store.state.address
            const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
            const contract = new Contract(cesspoolAddress, cesspoolABI, provider);
            const amount = await contract.balanceOf(address);
            const result = amount / 1e18
            const rounded1 = Number(result.toFixed(0));
            const num = rounded1 - rounded1 % 1;
            const internationalNumberFormat = new Intl.NumberFormat('en-US')
            balance.value =internationalNumberFormat.format(num)
            return balance.value;
        }
        watch(()=>store.getters.address, function() {
            getBalance()
        });
        onMounted(() => {
            getBalance()
        })

        return {
            balance
        }
    }
}
</script>

<style>

</style>