<template>
  <div class="col-md-4">
    <div class="card shadow-sm h-100">
      <img v-if="event.imageUrl" :src="event.imageUrl" class="card-img-top" />
      <div class="card-body d-flex flex-column">
        
        <!-- Categoría -->
        <p class="card-title mb-1 badge bg-info text-dark fs-6">
            {{ event.category }}
        </p>
        <!-- Título evento -->
        <h5 class="card-title">{{ event.title }}</h5>
         <!-- Fecha-->
        <p class="d-flex justify-content-between mb-1">
          <span><strong>Fecha:</strong> {{ new Date(event.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }) }}</span>
        <span><strong>Hora:</strong> {{ event.time }}</span>
         </p>
        <!-- Lugar -->
        <p class="card-text mb-1">
          <strong>Lugar:</strong> {{ event.location.name }}
        </p>

        <!-- <p class="card-texd mb-1"><small>Dirección: {{ event.location.address }}</small></p> -->
        <!-- <p class="card-text mb-2">Descripción: {{ event.description }}</p> -->
                                                                           
        <!-- Precio -->
       <p class="card-text mb-1">
          <strong>Precio:</strong> {{ event.price }}
        </p>
        <!-- Recomendado -->
        <p class="card-text mb-1"><strong>Edad:</strong> {{ event.age }}</p>

        <div class="mt-auto d-flex justify-content-between">
          <a :href="event.link" target="_blank" class="btn btn-sm btn-primary">RRSS</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  event: {
    type: Object,
    required: true
  }
});
</script>
