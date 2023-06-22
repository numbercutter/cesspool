<template>
    <header :class="{ 'scrolled-nav': scrolledNav }">
      <nav>
        <div class="icon">
          <i @click="toggleMobileNav" v-show="mobile" class="fas fa-bars" :class="{ 'icon-active': mobileNav }"></i>
        </div>
        <ul v-show="!mobile" class="navigation">
          <li><router-link to="/">Home</router-link></li>
          <li v-if="isAuthenticated"><router-link to="/staking">Staking</router-link></li>
        </ul>
        
        <transition name="mobile-nav">
          <ul v-show="mobileNav" class="dropdown-nav">
            <li @click="toggleMobileNav"><router-link to="/">Home</router-link></li>
            <li v-if="isAuthenticated" @click="toggleMobileNav"><router-link to="/staking">Staking</router-link></li>
          </ul>
        </transition>
      </nav>
    </header>
</template>
  
<script>
  export default {
    props: {
      isAuthenticated: Boolean,
    },
    data() {
      return {
        scrolledNav: false,
        mobile: false,
        mobileNav: false,
      };
    },
    created() {
      window.addEventListener("resize", this.checkScreen);
      this.checkScreen();
    },
    mounted() {
      window.addEventListener("scroll", this.updateScroll);
    },
    beforeUnmount() {
      window.removeEventListener("resize", this.checkScreen);
      window.removeEventListener("scroll", this.updateScroll);
    },
    methods: {
      toggleMobileNav() {
        this.mobileNav = !this.mobileNav;
      },
      updateScroll() {
        this.scrolledNav = window.scrollY > 50;
      },
      checkScreen() {
        const windowWidth = window.innerWidth;
        this.mobile = windowWidth <= 750;
        if (!this.mobile) {
          this.mobileNav = false;
        }
      },
    },
  };
</script>

<style scoped>
  header {
    width: 100%;
    position: fixed;
    top: 34px;
    transition: 0.3s ease all;
    padding: 10px;
    background-color: rgb(116, 116, 116);
  }

  @media screen and (max-width: 750px) {
    header {
      top: auto;
      bottom: 0;
    }
  }
  
  nav {
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      justify-content: flex-end;
      padding: 15px 0;
      width: 100%;
  }


  
  .navigation,
  .dropdown-nav {
    list-style: none;
    padding: 0;
  }
  
  .navigation li,
  .dropdown-nav li {
    padding: 8px;
  }

  
  .icon {
    cursor: pointer;
    transition: 0.4s ease all;
  }
  
  .icon-active {
    transform: rotate(90deg);
  }
  
  .dropdown-nav {
    flex-direction: column;
    position: fixed;
    max-width: 150px;
    height: 100%;
    bottom: 0;
    left: 0;
    background-color: #000000;
  }

  
  .scrolled-nav {
    background-color: rgb(0, 238, 255);
  }
  
  @media screen and (max-width: 750px) {
    .navigation {
      display: none;
    }
  }
  </style>
  