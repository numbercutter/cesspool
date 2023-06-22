<template>
  <div id="home">
    <section class="top">
          <div>
            <h1>CESSPOOL</h1>
          </div>
        </section>
    <p>
      This is a decentralized application for interacting with smart contracts on the Binance Smart Chain (BSC). 
      Please log in to continue.
    </p>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style lang="scss" scoped>
#home {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-family: Arial, sans-serif;

  h1 {
    color: #4a4a4a;
  }

  p {
    color: #9b9b9b;
    font-size: 18px;
    text-align: center;
    max-width: 800px;
    margin: 20px auto;
  }
}

.top {
  //background-image: linear-gradient(rgba(255, 255, 255, 0.705), rgb(0, 0, 0));

  width: 100%;
  padding: 20px 0px 40px;
  color: rgb(186, 253, 0);
  
  
  h1 {
    font-family: headerFont;
    font-size: 4em;
    text-shadow: 2px 2px #575757;
    @media (min-width: 400px) {
        font-size: 6em;
      }
    @media (min-width: 750px) {
      font-size: 10em;
    }
  }
  p {
    font-family: pFont;
    padding: 0px 2%;
    font-size: 1.2em;
    @media (min-width: 400px) {
        font-size: 1.2em;
        padding: 0px 5%;
      }
    @media (min-width: 750px) {
      font-size: 2em;
      padding: 0px 10%;
    }
  }
  img {
    width: 100px;
    @media (min-width: 400px) {
      width: 400px;
    }
    @media (min-width: 750px) {
      width: 750px;
    }
  }
}
</style>
