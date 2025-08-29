<template>
  <div class="container py-4">
    <h1 class="mb-4 text-center">Verificación de Eventos</h1>

    <div v-if="pendingEvents.length === 0" class="alert alert-info">
      No hay eventos pendientes de verificación.
    </div>

    <div class="row g-3">
      <div class="col-md-4" v-for="event in pendingEvents" :key="event.id">
        <div class="card shadow-sm h-100">
          <img v-if="event.imageUrl" :src="event.imageUrl" class="card-img-top" />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ event.title }}</h5>
            <p class="card-text mb-1">
              <strong>Fecha:</strong> {{ event.date }} <strong>Hora:</strong> {{ event.time }}
            </p>
            <p class="card-text mb-1">
              <strong>Lugar:</strong> {{ event.location.name }}<br/>
              <small>{{ event.location.address }}</small>
            </p>
            <p class="card-text mb-2">{{ event.description }}</p>
            <p class="card-text">
              <strong>Categoría:</strong> {{ event.category }} | 
              <strong>Precio:</strong> {{ event.price }} | 
              <strong>Edad:</strong> {{ event.age }}
            </p>
            <p v-if="event.tags && event.tags.length" class="mb-2">
              <strong>Etiquetas:</strong> {{ event.tags.join(", ") }}
            </p>
            <p class="mb-2"><strong>Correo de contacto:</strong> {{ event.email }}</p>

            <div class="mt-auto d-flex justify-content-between">
              <button class="btn btn-sm btn-success" @click="approveEvent(event)">Aprobar</button>
              <button class="btn btn-sm btn-danger" @click="rejectEvent(event.id)">Rechazar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { db } from "@/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

const pendingEvents = ref([]);
const pendingCol = collection(db, "eventos_pendientes");
const eventsCol = collection(db, "eventos");

const loadPendingEvents = async () => {
  const querySnapshot = await getDocs(pendingCol);
  pendingEvents.value = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
};

// Aprobar evento: pasarlo a la colección principal y eliminar de pendientes
const approveEvent = async (event) => {
  await addDoc(eventsCol, { ...event });
  await deleteDoc(doc(db, "eventos_pendientes", event.id));
  await loadPendingEvents();
};

// Rechazar evento: eliminar de pendientes
const rejectEvent = async (id) => {
  if (confirm("¿Deseas rechazar este evento?")) {
    await deleteDoc(doc(db, "eventos_pendientes", id));
    await loadPendingEvents();
  }
};

onMounted(loadPendingEvents);
</script>
