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
import { cesspoolAddress, cesspoolABI } from './contracts/cesspool.sol/cesspool.js';
import { inject, ref, onMounted, computed, watch } from 'vue'
import { useStore } from "vuex";
import slider from "vue3-slider"
import { BigNumber } from 'ethers';
import { ethers } from "ethers";
import { VueFinalModal } from "vue-final-modal";


export default {
    name: 'cess4cess',
    components: {
        slider,
        VueFinalModal
    },
    setup() {

        const store = useStore();

        const lockNumber = ref(1)
        const days = ref(1)
        const balanceAmount = ref(null)
        const stakedAmount = ref(null)
        const earningsAfterFee = ref(null)
        const ror = ref(null)
        const timeRemaining = ref(null)
        const vaultModal = ref(false)

        const getBalance = async () => {
            await $moralis.enableWeb3()
            const chainId = await $moralis.chainId;
            if ( chainId != 56 ) {
                store.state.modal["messageModal"]["message"] = "switching network...";
                store.state.modal["messageModal"]["status"] = true;
                const newId = 56;
                await $moralis.switchNetwork(newId);
                
                store.state.modal["messageModal"]["status"] = false;
                getBalance()
                return
            }


            const balancecess = {contractAddress: cesspoolAddress, functionName: "balanceOf(address)", abi: cesspoolABI,
                    params: {
                        account: store.state.address,
                    }
                };
            const transactionBalance = await $moralis.executeFunction(balancecess);

            const num1 = transactionBalance.toString()
            const cess1 = num1 / 1e18
            const rounded1 = Number(cess1.toFixed(2));
            balanceAmount.value = rounded1 - rounded1 % 1;

            const stakedcess = {contractAddress: cessVaultAddress, functionName: "getAmountLocked(address)", abi: cessVaultABI,
                    params: {
                        _user: store.state.address,
                    }
                };

            const transactionStaked = await $moralis.executeFunction(stakedcess);
            const num2 = transactionStaked.toString()
            const cess2 = num2 / 1e18
            const rounded2 = Number(cess2.toFixed(2));
            stakedAmount.value = rounded2 - rounded2 % 1;

            getData()
            return balanceAmount, stakedAmount
        }

        const lockLiq = async () => {
            await $moralis.enableWeb3()
            const chainId = await $moralis.chainId;
            if ( chainId != 56 ) {
                store.state.modal["messageModal"]["message"] = "switching network...";
                store.state.modal["messageModal"]["status"] = true;
                const newId = 56;
                await $moralis.switchNetwork(newId);
                
                store.state.modal["messageModal"]["status"] = false;
                lockLiq()
                return
            }
            const lockTime = days.value*86400 // number of seconds locked * total seconds in a day
            const decimals = 18;
            const input = lockNumber.value;
            const amount = BigNumber.from(input).mul(BigNumber.from(10).pow(decimals));
            const lockAmount = amount

            const allowancecess = {contractAddress: cesspoolAddress, functionName: "allowance(address,address)", abi: cesspoolABI,
                params: {
                    owner: store.state.address,
                    spender: cessVaultAddress.toString()
                }
            };
            store.state.modal["loadingModal"] = true
            const transactionAllowance = await $moralis.executeFunction(allowancecess);

            const allowanceAmount = transactionAllowance.toString()


            if (Number(allowanceAmount) < Number(lockAmount)) {
                const approvecess = {contractAddress: cesspoolAddress, functionName: "approve(address,uint256)", abi: cesspoolABI,
                    params: {
                        spender: cessVaultAddress.toString(),
                        amount: "1000000000000000000000000000"
                    }
                };
                
                const transactionApprove = await $moralis.executeFunction(approvecess);
                await transactionApprove.wait();
            }
            const lock = {
                contractAddress: cessVaultAddress,
                functionName: "lockLiquidity",
                abi: cessVaultABI,
                params: {
                    _amount: lockAmount,
                    _timeLock: lockTime.toString()

                }
            };
            const transactionLock = await $moralis.executeFunction(lock);
            const link =  `https://bscscan.com/tx/${transactionLock.hash}`

            await transactionLock.wait();
            store.state.modal["loadingModal"] = false
            store.state.modal["txnModal"]["hash"] = link;
            store.state.modal["txnModal"]["status"] = true;


        }
        const extractLiquidity = async () => {
            await $moralis.enableWeb3()
            const chainId = await $moralis.chainId;
            if ( chainId != 56 ) {
                store.state.modal["messageModal"]["message"] = "switching network...";
                store.state.modal["messageModal"]["status"] = true;
                const newId = 56;
                await $moralis.switchNetwork(newId);
                
                store.state.modal["messageModal"]["status"] = false;
                extractLiquidity()
                return
            }
            const unlock = {contractAddress: cessVaultAddress,functionName: "extractLiquidity",abi: cessVaultABI,};
            store.state.modal["loadingModal"] = true
            const transactionUnlock = await $moralis.executeFunction(unlock);
            const link =  `https://bscscan.com/tx/${transactionUnlock.hash}`
            await transactionUnlock.wait();
            store.state.modal["loadingModal"] = false
            store.state.modal["txnModal"]["hash"] = link;
            store.state.modal["txnModal"]["status"] = true;

        }
        const extractEarnings = async () => {
            await $moralis.enableWeb3()
            const chainId = await $moralis.chainId;
            if ( chainId != 56 ) {
                store.state.modal["messageModal"]["message"] = "switching network...";
                store.state.modal["messageModal"]["status"] = true;
                const newId = 56;
                await $moralis.switchNetwork(newId);
                
                store.state.modal["messageModal"]["status"] = false;
                extractEarnings()
                return
            }
            const earnings = {contractAddress: cessVaultAddress,functionName: "extractEarnings",abi: cessVaultABI};
            const transactionExtractEarnings = await $moralis.executeFunction(earnings);
            await transactionExtractEarnings.wait();

        }

        const getData = async() => {
            if (stakedAmount.value > 0) {

                // enable web3 and vault instance
                await $moralis.enableWeb3();
                const web3Js = new Web3($moralis.provider)
                const cessVault = new web3Js.eth.Contract( cessVaultABI, cessVaultAddress )

                // available earnings formula
                const amountLocked = await cessVault.methods.amountLocked(store.state.address).call()
                const rewardPerBlock = await $moralis.executeFunction({contractAddress: cessVaultAddress, functionName: "rewardPerBlock", abi: cessVaultABI,});
                const lastBlockFee = await $moralis.executeFunction({contractAddress: cessVaultAddress, functionName: "lastBlockFee", abi: cessVaultABI,});
                const totalLiquidityLocked = await $moralis.executeFunction({contractAddress: cessVaultAddress, functionName: "totalLiquidityLocked", abi: cessVaultABI,});
                let lockTokenFeePrice = await $moralis.executeFunction({contractAddress: cessVaultAddress, functionName: "lockTokenFeePrice", abi: cessVaultABI,});
                const currentBlock = await web3Js.eth.getBlockNumber()
                const blocksPassed = currentBlock - lastBlockFee;
                const feeIn = blocksPassed * rewardPerBlock;
                lockTokenFeePrice = parseFloat(feeIn) * 1e18 / parseFloat(totalLiquidityLocked) + parseFloat(lockTokenFeePrice);
                const lastPriceEarningsExtracted = await cessVault.methods.lastPriceEarningsExtracted(store.state.address).call()
                const lockingTime = await cessVault.methods.lockingTime(store.state.address).call()

                const myPrice = lockTokenFeePrice - lastPriceEarningsExtracted;
                const earnings = amountLocked * myPrice / 1e18;
                const devTreasuryPercentage = await cessVault.methods.calcDevTreasuryPercentage(lockingTime.toString()).call()
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
                const currentTime = await web3Js.eth.getBlock(currentBlock)
                const depositStarts = await cessVault.methods.depositStarts(store.state.address).call()
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

                await $moralis.enableWeb3();
                const rewardPerBlock = await $moralis.executeFunction({contractAddress: cessVaultAddress, functionName: "rewardPerBlock", abi: cessVaultABI,});
                const totalLiquidityLocked = await $moralis.executeFunction({contractAddress: cessVaultAddress, functionName: "totalLiquidityLocked", abi: cessVaultABI,});

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
            const user = $moralis.User.current()
            if (user) {
                getBalance()
            } else {
                store.state.modal["loginModal"] = true;
                getData()
            }
            }

        watch(()=>store.getters.user, function() {
            checkCurrentUser()
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