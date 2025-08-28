<template>
  <div class="container py-4">
    <h1 class="mb-4 text-center">Enviar un evento</h1>

    <div class="card p-4 shadow-sm">
      <form @submit.prevent="submitEvent">
        <div class="mb-3">
          <label>Nombre del evento</label>
          <input v-model="form.title" class="form-control" required />
        </div>

        <div class="mb-3">
          <label>Correo de contacto</label>
          <input v-model="form.email" type="email" class="form-control" />
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label>Fecha</label>
            <input v-model="form.date" type="date" class="form-control" required />
          </div>
          <div class="col-md-6 mb-3">
            <label>Hora</label>
            <input v-model="form.time" type="time" class="form-control" required />
          </div>
        </div>

        <div class="mb-3">
          <label>Lugar</label>
          <input v-model="form.location.name" class="form-control" placeholder="Nombre del lugar" />
        </div>
        <div class="mb-3">
          <input v-model="form.location.address" class="form-control" placeholder="Dirección" />
        </div>

        <div class="mb-3">
          <label>Categoría</label>
          <select v-model="form.category" class="form-select">
            <option>Concierto</option>
            <option>Teatro</option>
            <option>Exposición</option>
            <option>Taller</option>
            <option>Otras</option>
          </select>
        </div>

        <div class="mb-3">
          <label>Imagen del evento</label>
          <input type="file" @change="handleFileChange" class="form-control" />
        </div>

        <div class="mb-3">
          <label>Enlace</label>
          <input v-model="form.link" class="form-control" placeholder="https://... facebook instagram..." />
        </div>

        <div class="mb-3">
          <label>Descripción</label>
          <textarea v-model="form.description" class="form-control" rows="3"></textarea>
        </div>

        <div class="mb-3">
          <label>Precio</label>
          <input v-model="form.price" class="form-control" placeholder="Ej: 15€, gratis..." />
        </div>

        <div class="mb-3">
      <label>Edad recomendada</label>
          <select v-model="form.age" class="form-select">
            <option value="">Selecciona edad</option>
            <option value="Todas las edades">Todos</option>
            <option value="+18">+18</option>
            <option value="+16">+16</option>
            <option value="+12">+12</option>
            <option value="+6">+6</option>
            <option value="+3">+3</option>
          </select>
        </div>

        <div class="mb-3">
          <label>Etiquetas (separadas por coma)</label>
          <input v-model="tagsInput" class="form-control" placeholder="jazz, música en vivo" />
        </div>

        <button type="submit" class="btn btn-success w-100">Enviar evento</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const form = ref({
  title: "",
  email: "",
  date: "",
  time: "",
  location: { name: "", address: "" },
  category: "Concierto",
  imageUrl: "",
  link: "",
  description: "",
  price: "",
  age: "",
  tags: [],
});

const tagsInput = ref("");
const selectedFile = ref(null);

const pendingCol = collection(db, "eventos_pendientes");
const storage = getStorage();

const handleFileChange = (e) => {
  selectedFile.value = e.target.files[0];
};

const submitEvent = async () => {
  // Subir imagen si hay archivo seleccionado
  if (selectedFile.value) {
    const fileRef = storageRef(storage, `eventos/${Date.now()}_${selectedFile.value.name}`);
    await uploadBytes(fileRef, selectedFile.value);
    form.value.imageUrl = await getDownloadURL(fileRef);
  }

  // Guardar etiquetas
  form.value.tags = tagsInput.value.split(",").map(t => t.trim()).filter(t => t);

  // Enviar evento a Firestore
  await addDoc(pendingCol, { ...form.value, createdAt: new Date() });

  alert("Evento enviado. Será revisado por el administrador.");
  
  // Reset formulario
  form.value = {
    title: "",
    email: "",
    date: "",
    time: "",
    location: { name: "", address: "" },
    category: "Concierto",
    imageUrl: "",
    link: "",
    description: "",
    price: "",
    age: "Todos las edades",
    tags: [],
  };
  tagsInput.value = "";
  selectedFile.value = null;
};
</script>
