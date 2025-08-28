<template>
  <div class="container py-4">
    <h1 class="mb-4 text-center">Agenda Cultural</h1>

    <!-- Filtar por nombre y categoría -->
    <div class="d-flex gap-2 mb-4">
      <input v-model="searchQuery" type="text" class="form-control" placeholder="Buscar evento por nombre..." />
    <select v-model="selectedCategory" class="form-select">
        <option value="">Todas las categorías</option>
        <option>Teatro</option>
        <option>Concierto</option>
        <option>Exposición</option>
        <option>Taller</option>
      </select>
    </div>

    <!-- Calendario para filtrar por fecha -->
    <div class="p-4 mb-4">
      <h2 class="text-lg font-bold mb-2">Filtrar por fecha</h2>
      <vue-cal
        style="height: 350px"
        default-view="month"
        hide-view-selector
        :time="false"
        :events="calendarEvents"
        @cell-click="selectDate"
      />
      <p class="mt-4">
        Fecha seleccionada: <b>{{ formattedSelectedDate }}</b>
      </p>
    </div>

    <!-- Lista de eventos -->
    <div class="row g-3">
      <CardEvent
        v-for="event in filteredEvents"
        :key="event.id"
        :event="event"
        @edit="editEvent"
        @delete="deleteEvent"
      />
    </div>
  </div>
</template>

<script setup>
import CardEvent from "../components/CardEvent.vue";
import { ref, onMounted, computed } from "vue";
import { db } from "@/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";

// Variables reactivas
const selectedDate = ref("");
const selectedCategory = ref("");
const searchQuery = ref("");
const events = ref([]);
const editingEvent = ref(null);

const eventsCol = collection(db, "eventos");
const storage = getStorage();

// Formulario interno
const form = ref({
  title: "",
  date: "",
  time: "",
  location: { name: "", address: "" },
  category: "Teatro",
  imageUrl: "",
  link: "",
  description: "",
  price: "",
  age: "",
  tags: [],
});
const tagsInput = ref("");
const selectedFile = ref(null);

// Convertir eventos a formato para VueCal mostrando título
const calendarEvents = computed(() =>
  events.value.map(event => ({
    start: event.date,
    end: event.date,
    title: event.title,
    class: "calendar-event"
  }))
);

// Seleccionar fecha desde VueCal
const selectDate = (day) => {
  selectedDate.value = new Date(day.date).toISOString().split("T")[0];
};

// Fecha bonita para mostrar
const formattedSelectedDate = computed(() => {
  if (!selectedDate.value) return "";
  return new Date(selectedDate.value).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
});

// Filtrar eventos por nombre, categoría y fecha
const filteredEvents = computed(() => {
  return sortedEvents.value.filter(event => {
    const matchesName = event.title.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesCategory = selectedCategory.value ? event.category === selectedCategory.value : true;
    const matchesDate = selectedDate.value ? event.date === selectedDate.value : true;
    return matchesName && matchesCategory && matchesDate;
  });
});

// Ordenar eventos por fecha y hora
const sortedEvents = computed(() => {
  return [...events.value].sort(
    (a, b) => new Date(`${a.date}T${a.time || "00:00"}`) - new Date(`${b.date}T${b.time || "00:00"}`)
  );
});

// Cargar eventos futuros desde Firestore
const loadEvents = async () => {
  const querySnapshot = await getDocs(eventsCol);
  const now = new Date();
  const futureEvents = [];

  for (const docSnap of querySnapshot.docs) {
    const data = docSnap.data();
    const eventDateTime = new Date(`${data.date}T${data.time || "00:00"}`);
    if (eventDateTime >= now) {
      futureEvents.push({ id: docSnap.id, ...data });
    } else {
      await deleteDoc(doc(db, "eventos", docSnap.id));
    }
  }
  events.value = futureEvents;
};

// Funciones para manejar el formulario de eventos
const handleFileChange = (e) => {
  selectedFile.value = e.target.files[0];
};

const saveEvent = async () => {
  if (selectedFile.value) {
    const fileRef = storageRef(storage, `eventos/${Date.now()}_${selectedFile.value.name}`);
    await uploadBytes(fileRef, selectedFile.value);
    form.value.imageUrl = await getDownloadURL(fileRef);
  }
  form.value.tags = tagsInput.value.split(",").map(t => t.trim()).filter(t => t);

  if (editingEvent.value) {
    await updateDoc(doc(db, "eventos", editingEvent.value.id), { ...form.value });
  } else {
    await addDoc(eventsCol, { ...form.value });
  }

  resetForm();
  loadEvents();
};

const editEvent = (event) => {
  editingEvent.value = event;
  form.value = { ...event };
  tagsInput.value = event.tags ? event.tags.join(", ") : "";
};

const deleteEvent = async (id) => {
  await deleteDoc(doc(db, "eventos", id));
  loadEvents();
};

const resetForm = () => {
  form.value = {
    title: "", date: "", time: "", location: { name: "", address: "" },
    category: "Teatro", imageUrl: "", link: "", description: "", price: "", age: "", tags: []
  };
  editingEvent.value = null;
  tagsInput.value = "";
  selectedFile.value = null;
};

// Cargar eventos al montar
onMounted(loadEvents);
</script>

<style>
.vuecal {
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

/* Estilo para los títulos de los eventos en el calendario */
.calendar-event {
  font-size: 0.75rem;
  color: #1a1a1a;
  background-color: #e3f2fd; /* azul muy claro */
  border-radius: 4px;
  padding: 2px 4px;
  margin: 2px 0;
}
</style>
