<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card p-4 shadow" style="max-width: 400px; width: 100%;">
      <h2 class="text-center mb-4">Iniciar sesión</h2>
      
      <form @submit.prevent="login">
        <div class="mb-3">
          <label for="email" class="form-label">Correo</label>
          <input v-model="email" type="email" id="email" class="form-control" placeholder="correo@ejemplo.com" required />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Contraseña</label>
          <input v-model="password" type="password" id="password" class="form-control" placeholder="******" required />
        </div>

        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          {{ loading ? "Entrando..." : "Entrar" }}
        </button>

        <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);
const router = useRouter();

const login = async () => {
  error.value = "";
  loading.value = true;
  const auth = getAuth();

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push("/"); // redirige al home
  } catch (err) {
    error.value = "Error: " + err.message;
  } finally {
    loading.value = false;
  }
};
</script>
