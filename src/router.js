import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)


function importComponent(path) {
    return () => import(`./components/${path}.vue`)
}

Vue.use(VueRouter);

const router = new VueRouter({
    mode: "history",
    routes: [
        {
            path: "/",
            name: "admin",
            component: importComponent('DashboardLayout'),
            children: [
                {
                    path: "/",
                    name: "Root",
                    component: importComponent('Dashboard'),
                },
                {
                    path: "/gd",
                    name: "Guided",
                    component: importComponent('TodoList/List'),
                },
        ]
    },
 ]
});
export default router;