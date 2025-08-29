<template>
<nav class="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">
        <img src="../assets/infinita.jpeg" alt="Bootstrap">
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item pb-2">
            <router-link class="navbar-brand custom" to="/">Agenda Cultural Coruña Ciudad</router-link>
        </li>
        <li class="nav-item">
            <router-link class="btn btn-light ms-3 fs-5" to="/addEvent">
                Añade tu evento
            </router-link>
        </li>
      </ul> 
      <ul class="navbar-nav ms-auto">
      <li class="nav-item">
        <router-link class="nav-link" to="/admin">Administrador</router-link>
      </li>
    </ul>
    </div>
  </div>
</nav>
</template>

<style>
.navbar-brand.custom {
  position: relative;
  top: 8px; /* ajusta en px lo que necesites */
}
</style>