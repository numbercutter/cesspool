<template>
  <header :class="{ 'scrolled-nav': scrolledNav }" class="p-shadow-4">
   <nav >
     <ul v-show="!mobile" class="navigation ">
        <li><router-link :to="{ name: 'Home' }" class="link">Home</router-link></li>
        <!--
        <li><router-link :to="{ name: 'Vaults' }" class="link">Vaults</router-link></li>
        <li><router-link :to="{ name: 'WildNFTs' }" class="link">WildNFTs</router-link></li>
        <li><router-link :to="{ name: 'LitePaper' }" class="link">Litepaper</router-link></li>
        -->
     </ul>
     <div class="icon">
       <i @click="toggleMobileNav" v-show="mobile" class="far fa-bars m-nav" :class="{ 'icon-active': mobileNav }"></i>
     </div>
     <transition name="mobile-nav">
       <ul v-show="mobileNav" class="dropdown-nav">
          <li @click="toggleMobileNav"><router-link :to="{ name: 'Home' }" class="link">Home</router-link></li>
          <!--
          <li @click="toggleMobileNav"><router-link :to="{ name: 'Vaults' }" class="link">Vaults</router-link></li>
          <li @click="toggleMobileNav"><router-link :to="{ name: 'WildNFTs' }" class="link">WildNFTs</router-link></li>
          <li @click="toggleMobileNav"><router-link :to="{ name: 'LitePaper' }" class="link">Litepaper</router-link></li>
          -->
       </ul>
     </transition>
   </nav>
  </header>
</template>

<script>
export default {
  name: "Navigation",
  data() {
    return {
      scrolledNav: null,
      mobile: null,
      mobileNav: null,
      windowWidth: null,
    };
  },
  created() {
    window.addEventListener("resize", this.checkScreen);
    this.checkScreen();
  },
  mounted() {
    window.addEventListener("scroll", this.updateScroll);
  },
  methods: {
    toggleMobileNav() {
      this.mobileNav = !this.mobileNav
    },

    updateScroll() {
      const scrollPosition = window.scrollY;
      if( scrollPosition > 50 ) {
        this.scrolledNav = true;
        return;
      }
      this.scrolledNav = false;
    },
    checkScreen() {
      this.windowWidth = window.innerWidth;
      if (this.windowWidth <= 750) {
        this.mobile = true;
        return;
      }
      this.mobile = false;
      this.mobileNav = false;
      return;
    },

    goToSite(producturl){
      window.open(producturl,'_blank');
    }
  }
}

</script>

<style lang="scss" scoped>

header {
  background-color: rgb(116, 116, 116);
  width: 100%;
  position: fixed;
  top: 0;
  transition: .3s ease all;
  padding: 10px;
  nav {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px 0;
    transition: .2s ease all;
    width: 100%;
    margin: 0 !important;
    
    @media (min-width: 750px) {
        padding: 8px;
      }


    .ul,
    .link {
      font-weight: 500;
      color: rgb(255, 255, 255);
      list-style: none;
      text-decoration: none;
      text-shadow: 2px 2px 4px #0000005d;
    }
    ul {
          padding-inline-start: 0 !important;
    }

    li {
      text-transform: uppercase;
      padding: 8px;
      list-style-type: none;
      color: white;
    }

    .link {
      font-size: 30px;
      transition: .4s ease all;
      padding: 7px;
      border: 2px solid transparent;

      &:hover {
        border-color: rgb(0, 253, 110);
        color: rgb(255, 255, 255);
      }
    }
    
    .branding {
      display: flex;
      align-items: center;

      img {
        width: 60px;
        transition: .5s ease all;
      }
    }

    .navigation {
      display: flex;
      align-items: center;
      text-align: center;
      color: white;
    }
    .m-nav {
      padding: 20px;
    }
    .icon {
      display: flex;
      align-items: center;
      position: absolute;
      top: 0;
      right: 24px;
      height: 100%;
      transition: .2s;
      
      i {
        cursor: pointer;
        font-size: 24px;
        transition: .4s ease all;
      }
    }

    .icon-active {
      transform: rotate(270deg);
      
    }

    .dropdown-nav {
      display: flex;
      flex-direction: column;
      position: fixed;
      max-width: 150px;
      height: 100%;
      padding: 0 !important;
      background-color: #000000;
      top:0;
      left:0;
      margin-left: 0;

      li {
        margin-right: 0;
        .link {
          color: #ffffff;
        }
        
      }
      .link {
      font-size: 20px;
      text-shadow: .5px .5px 2px #87898d57;
      
      

      &:hover {
        color: #ffffff;
        border-color: rgb(0, 253, 110);
      }
    }
    }

    .mobile-nav-enter-active,
    .mobile-nav-leave-active {
      transition: 1s ease all;
    }

    .mobile-nav-enter-from, 
    .mobile-nav-leave-to {
      transform: translateX(-250px);
    }

    .mobile-nav-enter-to {
      transform: translateX(0);
    }
  }
}

.scrolled-nav {
  //background-color: rgb(0, 238, 255);
  background-image: linear-gradient(rgb(255, 0, 234), rgb(155, 122, 187));
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 10px;

  nav {
    padding: 12px 0;
    @media (min-width: 750px) {
        padding: 2px;
      }
    

    .branding {
      img {
        filter: invert(100%);
        width: 50px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 2px 4px -1px rgba(0, 0, 0, 0.06);

      }
    }
    .link {
      font-weight: 500;
      color: rgb(0, 0, 0);
      list-style: none;
      text-decoration: none;
      text-shadow: 1px 1px 2px #0000007e;
      font-size: 20px;
      &:hover {
        border-color: #000000;
        color: #00ff40;
      }
    }
    
    .icon {
      color: black;

    }
  }
}



</style>
