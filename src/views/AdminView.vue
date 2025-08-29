<template>
  <div class="container py-4">
    <h1 class="mb-4 text-center">Verificación de Eventos</h1>

    <div v-if="pendingEvents.length === 0" class="alert alert-info">
      No hay eventos pendientes de verificación.
    </div>

    <div class="row g-3">
      <div class="col-md-4" v-for="event in pendingEvents" :key="event.id">
        <div class="card shadow-sm h-100">
          <img v-if="!event.editing && event.imageUrl" :src="event.imageUrl" class="card-img-top" />
          <div class="card-body d-flex flex-column">

            <!-- Mostrar o editar campos -->
            <div v-if="!event.editing">
              <h5 class="card-title">{{ event.title }}</h5>
              <p><strong>Fecha:</strong> {{ event.date }} <strong>Hora:</strong> {{ event.time }}</p>
              <p><strong>Lugar:</strong> {{ event.location.name }} - {{ event.location.address }}</p>
              <p>{{ event.description }}</p>
              <p><strong>Categoría:</strong> {{ event.category }} | <strong>Precio:</strong> {{ event.price }} | <strong>Edad:</strong> {{ event.age }}</p>
              <p v-if="event.tags && event.tags.length"><strong>Etiquetas:</strong> {{ event.tags.join(", ") }}</p>
              <p><strong>Email:</strong> {{ event.email }}</p>
            </div>

            <div v-else>
              <input v-model="event.title" class="form-control mb-1" placeholder="Título" />
              <input type="date" v-model="event.date" class="form-control mb-1" />
              <input type="time" v-model="event.time" class="form-control mb-1" />
              <input v-model="event.location.name" class="form-control mb-1" placeholder="Lugar" />
              <input v-model="event.location.address" class="form-control mb-1" placeholder="Dirección" />
              <textarea v-model="event.description" class="form-control mb-1" placeholder="Descripción"></textarea>
              <input v-model="event.category" class="form-control mb-1" placeholder="Categoría" />
              <input v-model="event.price" class="form-control mb-1" placeholder="Precio" />
              <input v-model="event.age" class="form-control mb-1" placeholder="Edad" />
              <input v-model="event.tagsString" class="form-control mb-1" placeholder="Etiquetas, separadas por comas" />
              <input v-model="event.email" class="form-control mb-2" placeholder="Email" />
            </div>

            <!-- Botones -->
            <div class="mt-auto d-flex flex-wrap gap-1">
              <button v-if="!event.editing" class="btn btn-sm btn-success" @click="approveEvent(event)">Aprobar</button>
              <button v-if="!event.editing" class="btn btn-sm btn-danger" @click="rejectEvent(event.id)">Rechazar</button>
              <button v-if="!event.editing" class="btn btn-sm btn-primary" @click="enableEdit(event)">Editar</button>
              <button v-if="!event.editing" class="btn btn-sm btn-warning" @click="deleteEvent(event.id)">Eliminar</button>

              <button v-if="event.editing" class="btn btn-sm btn-success" @click="saveEdit(event)">Guardar</button>
              <button v-if="event.editing" class="btn btn-sm btn-secondary" @click="cancelEdit(event)">Cancelar</button>
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
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";

// Colecciones
const pendingEvents = ref([]);
const pendingCol = collection(db, "eventos_pendientes");
const eventsCol = collection(db, "eventos");

// Cargar eventos pendientes
const loadPendingEvents = async () => {
  const querySnapshot = await getDocs(pendingCol);
  pendingEvents.value = querySnapshot.docs.map(docSnap => {
    const data = { id: docSnap.id, ...docSnap.data() };
    data.editing = false;
    data.tagsString = data.tags ? data.tags.join(", ") : "";
    return data;
  });
};

// Aprobar evento
const approveEvent = async (event) => {
  await addDoc(eventsCol, { ...event });
  await deleteDoc(doc(db, "eventos_pendientes", event.id));
  await loadPendingEvents();
};

// Rechazar evento
const rejectEvent = async (id) => {
  if (confirm("¿Deseas rechazar este evento?")) {
    await deleteDoc(doc(db, "eventos_pendientes", id));
    await loadPendingEvents();
  }
};

// Eliminar evento
const deleteEvent = async (id) => {
  if (confirm("¿Deseas eliminar este evento definitivamente?")) {
    await deleteDoc(doc(db, "eventos_pendientes", id));
    await loadPendingEvents();
  }
};

// Editar inline
const enableEdit = (event) => {
  event.editing = true;
};

const cancelEdit = (event) => {
  event.editing = false;
  loadPendingEvents(); // recargar datos originales
};

const saveEdit = async (event) => {
  const eventRef = doc(db, "eventos_pendientes", event.id);
  const updatedEvent = {
    ...event,
    tags: event.tagsString.split(",").map(t => t.trim()),
  };
  delete updatedEvent.editing;
  delete updatedEvent.tagsString;
  await updateDoc(eventRef, updatedEvent);
  event.editing = false;
  await loadPendingEvents();
};

onMounted(loadPendingEvents);
</script>
