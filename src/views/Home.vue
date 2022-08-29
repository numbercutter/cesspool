<template>
  <body>
    <div id="home">
      <div class="outer">
        <section class="top">
          <div>
            <h1>CESSPOOL</h1>
          </div>
        </section>
        <section class="middle">
          <Vaults/>
        </section>
      </div>
    </div>
  </body>
</template>

<script>
import Vaults from './components/Vaults.vue'
export default {
  name: 'Home',
  components: {
    Vaults
  }
}
</script>

<style lang="scss" scoped>

#home {
  display: inline;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: honeydew;
  line-height: 1.5;
  li {
    list-style: none;
    text-decoration: none;
    
    font-family: pFont;
    padding: 0px 2%;
    font-size: 1.2em;
    @media (min-width: 400px) {
        font-size: 1.2em;
        padding: 0px 5%;
      }
    @media (min-width: 750px) {
      font-size: 1.7em;
      padding: 0px 10%;
    }
    ul {
          padding-inline-start: 0 !important;
    }
  }
  .bold {
      font-weight: bold;
    }
  /* Inset */

  hr.style-two {
  border: 0;
  height: 10px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
  /* Border Shadow in <hr> tag */

  h2 {
    font-family: headerFontTwo;
    font-size: 1.5em;
    text-shadow: grey;
    padding: 20px;
    text-decoration: underline;
    @media (min-width: 400px) {
        font-size: 3em;
      }
    @media (min-width: 750px) {
      font-size: 4em;
    }
  }
  h3 {
    font-family: pFont;
    font-size: 1.5em;
    text-shadow: grey;
      
    padding: 20px;
    @media (min-width: 400px) {
        font-size: 1.5em;
      }
    @media (min-width: 750px) {
      font-size: 3em;
    }
  }
}


.outer {
  padding: 50px 0px 0px;
  background-image: url('./assets/img/dusky.webp');
  background-size: cover; 
  background-attachment: fixed;
  color: black;
  //animation: 300s para infinite linear;

}
@keyframes para {
  100% {
    background-position: 
      -5000px 20%,
      -800px 95%,
      500px 50%,
      1000px 100%,
      400px 0;
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
.middle {
  background-image: linear-gradient(rgb(0, 253, 110), rgba(255, 255, 255, 0.788));
  width: 100%;
  h1 {
    font-family: headerFont;
    font-size: 1.5em;
    text-shadow: grey;
    @media (min-width: 400px) {
        font-size: 2em;
      }
    @media (min-width: 750px) {
      font-size: 3em;
    }
  }
  p {
    font-family: pFont;
    padding: 0px 5%;
    font-size: 1.2em;
    @media (min-width: 400px) {
        font-size: 1.2em;
        padding: 0px 5%;
      }
    @media (min-width: 750px) {
      font-size: 1.7em;
      padding: 0px 10%;
    }
    
  }
  
}
.bottom {
  background-image: linear-gradient(rgba(255, 255, 255, 0.788), rgba(255, 241, 173, 0.829));
  width: 100%;
  h1 {
    font-family: headerFont;
    font-size: 1.5em;
    text-shadow: grey;
    @media (min-width: 400px) {
        font-size: 2em;
      }
    @media (min-width: 750px) {
      font-size: 3em;
    }
  }
  p {
    font-family: pFont;
    padding: 0px 5%;
    font-size: 1.2em;
    @media (min-width: 400px) {
        font-size: 1.2em;
        padding: 0px 5%;
      }
    @media (min-width: 750px) {
      font-size: 1.7em;
      padding: 0px 10%;
    }
  }
  a {
    color: black;
  }
  a:hover {
      color: rgb(0, 253, 110);
    }
  ul {
          padding-inline-start: 0 !important;
    }
}


</style>
