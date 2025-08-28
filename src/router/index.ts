import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import AddEvent from "@/views/AddEvent.vue";
import LoginView from "@/views/LoginView.vue";
import AdminView from "@/views/AdminView.vue";

const routes = [
  { path: "/", name: "home", component: HomeView },
  { path: "/addEvent", name: "addEvent", component: AddEvent },
  { path: "/login", name: "login", component: LoginView },
  { path: "/admin", name: "admin", component: AdminView, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// protección de rutas privadas
import { getAuth, onAuthStateChanged } from "firebase/auth";
const auth = getAuth();

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    onAuthStateChanged(auth, (user) => {
      if (user) next();
      else next("/login");
    });
  } else {
    next();
  }
});

export default router;
