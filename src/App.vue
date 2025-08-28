<script setup>

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
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <router-link class="navbar-brand" to="/">Agenda Coruña Ciudad</router-link>
        <div>
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/addEvent">Añade tu evento</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/admin">Administrador</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <router-view />
  </div>
</template>


<style scoped>

</style>
