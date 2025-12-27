import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import CreatePoll from '@/views/CreatePoll.vue'
import PollDetails from '@/views/PollDetails.vue'
import VotingPage from '@/views/VotingPage.vue'
import NotFound from '@/views/NotFound.vue'
import EditPoll from '@/views/EditPoll.vue'
import VoterAnalytics from '@/views/VoterAnalytics.vue'
import UserRegistry from '@/views/UserRegistry.vue'
import Settings from '@/views/Settings.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/create",
      name: "create",
      component: CreatePoll,
    },
    {
      path: '/edit/:id',
      name: 'edit',
      component: EditPoll,
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: VoterAnalytics,
    },
    {
      path: "/poll/:id",
      name: "poll",
      component: PollDetails,
    },
    {
      path: "/vote/:id",
      name: "vote",
      component: VotingPage,
    },
    {
      path: "/manage",
      name: "register",
      component: UserRegistry,
    },
    {
      path: "/settings",
      name: "settings",
      component: Settings,
    },
    {
      path: "/:catchAll(.*)",
      name: "NotFound",
      component: NotFound,
    },
  ],
});

export default router
