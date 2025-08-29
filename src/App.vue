<script setup>
import NavBar from './components/NavBar.vue';
import { db } from './firebase.js';
import { collection, getDocs } from 'firebase/firestore';

const test = async () => {
  const querySnapshot = await getDocs(collection(db, "eventos"));
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
};

test();
</script>

<template>
  <div class="container">
  <NavBar />
  </div>
  <div>
    <router-view />
  </div>
</template>


<style scoped>

</style>
