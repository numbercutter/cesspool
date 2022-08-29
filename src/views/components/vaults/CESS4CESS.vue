<template>
    <div id="vault_container">
        <template v-if="isBalanced">
            <div id="grid-view">
                <h2>CESS Vault</h2>
                <br>
                <span><p>Aprox. APR: <span class="fill"> {{ ror }}  </span> %</p></span>
                <span><p>Available Earnings: <span class="fill"> {{ earningsAfterFee }}  </span> $cess</p></span>
                <button @click="vaultModal = true">Expand</button>
            </div>
        </template>
        <template v-else>
            <div id="grid-view">
                <h2>cess Vault</h2>
                <br>
                <span><p>Aprox. APR/yr: <span class="fill"> {{ ror }}  </span> %</p></span>
                <button @click="vaultModal = true">Expand</button>
            </div>
        </template>
        <VueFinalModal v-model="vaultModal" classes="modal-container" content-class="modal-content-transfer">
            <template v-if="isBalanced">
                <div id="staking_container">
                    <!--time left -->
                    <div class="header">
                        <h1>cesspool VAULT</h1>
                        <span><p>Aprox. APR/yr: <span class="fill"> {{ ror }}  </span> %</p></span>
                    </div>
                    <div class="lock">
                        <slider v-model="lockNumber" color="#00ff62" track-color="#FEFEFE" :height='15' :max="balanceAmount" :min="0"/>
                        <span><p>Locking Amount: <span class="fill"> {{ lockNumber }}  </span> $cess</p></span>
                        <slider v-model="days" color="#ff9100" track-color="#FEFEFE" :height='15' :max="365" :min="1"/>
                        <span><p>Locking Time (BETWEEN 1 AND 365 DAYS): <span class="fill"> {{ days }}  </span> DAY(S)</p></span>
                        <br>
                        <button @click="lockLiq">Stake</button>
                    </div>
                    <template v-if="isStaked">
                        <div class="unlock">
                            <span><p>Currently Staked: <span class="fill"> {{ stakedAmount }}  </span> $cess</p></span>
                            <span><p>Available Earnings: <span class="fill"> {{ earningsAfterFee }}  </span> $cess</p></span>
                            <span><p>Lock Time Remaining: <span class="fill"> {{ timeRemaining }}  </span> Days</p></span>

                            <br>
                            <template v-if="isUnlocked">
                                <button @click="extractLiquidity">Unstake</button>
                            </template>
                            <button @click="extractEarnings">Collect Earnings</button>
                        </div>
                    </template>
                    <br>
                    <a @click="vaultModal = false">Close</a>
                </div>
            </template>
            <template v-else>
                <div class="header">
                    <h1>cess4cess VAULT</h1>
                    <span><p>Aprox. APR/yr: <span class="fill"> {{ ror }}  </span> %</p></span>
                    <p>You must own $cess token to utilize this vault...</p>
                    <button @click="extractLiquidity">BUY HERE</button>
                    <button @click="vaultModal = false">Close</button>
                </div>
            </template>
        
      </VueFinalModal>
    </div>
</template>

<script>
import { cessVaultAddress, cessVaultABI } from './contracts/cess4cess.sol/cess4cess.js';
import { ref, onMounted, computed, watch } from 'vue'
import { useStore } from "vuex";
import slider from "vue3-slider"
import { BigNumber } from 'ethers';
//import { ethers } from "ethers";
import { VueFinalModal } from "vue-final-modal";


export default {
    name: 'cess4cess',
    components: {
        slider,
        VueFinalModal
    },
    setup() {

        const { Contract } = require('ethers');
        
        const store = useStore();
        const provider = store.state.provider
        const signer = provider.getSigner();
        const cesspoolSC = new Contract(store.state.cesspoolContract.address, store.state.cesspoolContract.abi, signer);
        const cess4cessSC = new Contract(cessVaultAddress, cessVaultABI, signer);
        
        const lockNumber = ref(1)
        const days = ref(1)
        const balanceAmount = ref(store.state.cess)
        console.log(balanceAmount)
        const stakedAmount = ref(null)
        const earningsAfterFee = ref(null)
        const ror = ref(null)
        const timeRemaining = ref(null)
        const vaultModal = ref(false)


        const getStaked = async () => {
            
            const transactionStaked = await cess4cessSC.getAmountLocked(store.state.address)
            const num2 = transactionStaked.toString()
            const cess2 = num2 / 1e18
            const rounded2 = Number(cess2.toFixed(2));
            stakedAmount.value = rounded2 - rounded2 % 1;
            balanceAmount.value = store.state.cess
            getData()
            return  stakedAmount, balanceAmount
        }

        const lockLiq = async () => {

            const lockTime = days.value*86400 // number of seconds locked * total seconds in a day
            const decimals = 18;
            const input = lockNumber.value;
            const amount = BigNumber.from(input).mul(BigNumber.from(10).pow(decimals));
            const lockAmount = amount

            const transactionAllowance = await cesspoolSC.allowance(store.state.address, cessVaultAddress.toString())

            const allowanceAmount = transactionAllowance.toString()


            if (Number(allowanceAmount) < Number(lockAmount)) {

                const transactionApprove = await cesspoolSC.approve(cessVaultAddress.toString(), "1000000000000000000000000000")
                console.log(transactionApprove)
            }

            const transactionLock = await cess4cessSC.lockLiquidity(lockAmount, lockTime.toString())
            const link =  `https://bscscan.com/tx/${transactionLock.hash}`

            store.state.modal["loadingModal"] = false
            store.state.modal["txnModal"]["hash"] = link;
            store.state.modal["txnModal"]["status"] = true;


        }
        const extractLiquidity = async () => {

            const transactionUnlock = await cess4cessSC.extractLiquidity()

            store.state.modal["loadingModal"] = true
            const link =  `https://bscscan.com/tx/${transactionUnlock.hash}`
            store.state.modal["loadingModal"] = false
            store.state.modal["txnModal"]["hash"] = link;
            store.state.modal["txnModal"]["status"] = true;

        }
        const extractEarnings = async () => {
            const earnings = await cess4cessSC.extractEarnings()
            console.log(earnings)
        }

        const getData = async() => {
            if (stakedAmount.value > 0) {

                // enable web3 and vault instance

                const amountLocked = await cess4cessSC.getAmountLocked(store.state.address)
                const rewardPerBlock = await cess4cessSC.rewardPerBlock()
                const lastBlockFee = await cess4cessSC.lastBlockFee()
                const totalLiquidityLocked = await cess4cessSC.totalLiquidityLocked()
                let lockTokenFeePrice = await cess4cessSC.lockTokenFeePrice()
                const currentBlock = await provider.getBlockNumber()

                const blocksPassed = currentBlock - lastBlockFee;
                const feeIn = blocksPassed * rewardPerBlock;
                lockTokenFeePrice = parseFloat(feeIn) * 1e18 / parseFloat(totalLiquidityLocked) + parseFloat(lockTokenFeePrice);
                const lastPriceEarningsExtracted = await cess4cessSC.lastPriceEarningsExtracted(store.state.address)
                const lockingTime = await cess4cessSC.lockingTime(store.state.address)

                const myPrice = lockTokenFeePrice - lastPriceEarningsExtracted;
                const earnings = amountLocked * myPrice / 1e18;
                const devTreasuryPercentage = await cess4cessSC.calcDevTreasuryPercentage(lockingTime.toString())
                const devTreasuryEarnings = earnings * devTreasuryPercentage / 1e20
                const remaining = earnings - devTreasuryEarnings
                earningsAfterFee.value = (remaining / 1e18).toFixed(2)

                // ROR formula
                const reward = rewardPerBlock / 1e18
                const tokensPerDay = reward * 28780 // <- blocks per day
                const i = 2/totalLiquidityLocked 
                const v = tokensPerDay*i
                const rorDay = v/2;
                const rorYear = rorDay*365 * 1e20
                ror.value = rorYear.toFixed(2)

                // time remaining formula
                const currentTime = await provider.getBlock(currentBlock)
                const depositStarts = await cess4cessSC.depositStarts(store.state.address)
                const timePassed = currentTime["timestamp"] - parseInt(depositStarts)
                const diffDays = timePassed / 60 / 60 / 24;
                const timeLockedDays = lockingTime / 86400
                const daysLeft = timeLockedDays - diffDays
                if (timeLockedDays < diffDays) {
                    timeRemaining.value = "stake is unlocked"
                } else {
                    timeRemaining.value = daysLeft.toFixed(3)
                }
                

                return earningsAfterFee, ror, timeRemaining
            } else {

                const rewardPerBlock = await cess4cessSC.rewardPerBlock()
                const totalLiquidityLocked = await cess4cessSC.totalLiquidityLocked()

                const reward = rewardPerBlock / 1e18
                const tokensPerDay = reward * 28780 // <- blocks per day
                const i = 2/totalLiquidityLocked 
                const v = tokensPerDay*i
                const rorDay = v/2;
                const rorYear = rorDay*365 * 1e20
                ror.value = rorYear.toFixed(2)

                return ror
            }
        }
        const checkCurrentUser = () => {
            console.log(provider)
            if (provider) {
                getStaked()
            } else {
                store.state.modal["loginModal"] = true;
                getData()
            }
            }

        watch(()=>store.getters.cess, function() {
            getStaked()
        });

        onMounted(() => {
            checkCurrentUser()
        })

        return { 
            lockLiq,
            extractLiquidity,
            extractEarnings,
            lockNumber,
            earningsAfterFee,
            ror,
            timeRemaining,
            days,
            balanceAmount,
            stakedAmount,
            vaultModal,
            isBalanced: computed(() => balanceAmount.value > 0),
            isStaked: computed(() => stakedAmount.value > 0),
            isUnlocked: computed(() => timeRemaining.value == "stake is unlocked")
        }
    }
}
</script>

<style lang="scss" scoped>

#vault_container {
    padding: 30px;
    margin: 20px;
    border: 100px;
    text-align: center;
    

    #staking_container {
        border-radius: 10px;
        padding:5%;
        background-color: black;
        @media (min-width: 400px) {
            padding:10%;
        }
        @media (min-width: 750px) {
            padding:10%;
        }
        h1 {
            font-family: headerFont;
            font-size: .9em;
            text-shadow: grey;
            color: rgb(255, 241, 173);
            padding: 10%;
            @media (min-width: 400px) {
                font-size: 1.5em;
                padding: 5%;
            }
            @media (min-width: 750px) {
            font-size: 3em;
            padding: 2%;
            }
        }
        p {
            font-family: pFont;
            font-size: .7em;
            padding: 10px;
            color: rgb(255, 255, 255);
            @media (min-width: 400px) {
                font-size: 1em;
            }
            @media (min-width: 750px) {
            font-size: 1.5em;
            }
        }
        button {
            padding: 10px;
            border: 10px;
            font-size: .7em;
            @media (min-width: 400px) {
                font-size: .9em;
                padding: 10px;
            }
            @media (min-width: 750px) {
                font-size: 1.1em;
                padding: 25px;
            }
        }
    }
    input {
        padding: 10px;
    }
    h2 {
        color: white
    }
    h1 {
        font-family: headerFont;
        font-size: 1em;
        text-shadow: grey;
        color: rgb(255, 241, 173);
        padding: 10%;
        @media (min-width: 400px) {
            font-size: 1.5em;
            padding: 5%;
        }
        @media (min-width: 750px) {
        font-size: 3em;
        padding: 2%;
        }
    }
    p {
        font-family: pFont;
        font-size: 1em;
        padding: 10px;
        color: rgb(255, 255, 255);
        @media (min-width: 400px) {
            font-size: 1em;
        }
        @media (min-width: 750px) {
        font-size: 1.5em;
        }
    }
    button {
        padding: 20px;
        border: 10px;
        font-size: 1em;

    }
    a {
        text-decoration: underline;
        color: rgb(255, 241, 173);
    }
    .fill {
        color: rgb(96, 255, 96)
    }
    #grid-view {

        border-radius: 10px;
        padding: 10%;

        background: radial-gradient(
            circle,
            rgb(0, 0, 0) 0%,
            rgb(0, 0, 0) 42%,
            rgb(0, 0, 0) 100%
        );
        border: 1px solid #000000;
        box-shadow:  -1px 1px #6b6b6b,
            -2px 2px rgb(96, 255, 96),
            -3px 3px rgb(96, 255, 96),
            -4px 4px rgb(96, 255, 96),
            -5px 5px rgb(96, 255, 96);
        }
}

::v-deep .modal-content-transfer {
  display: flex;
  flex-direction: column;
  margin: 0 1rem;
  padding: 1rem;
  background-color: black;
  -webkit-box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
  -moz-box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
  p {
    padding: 10px;

  }
}



</style>