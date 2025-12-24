import { createRouter, createWebHistory } from 'vue-router'

// 引入布局组件
// 请确保你的文件路径正确，如果文件名是 CommonLayout.vue 请自行修改
import CommonLayout from '@/layout/MainLayout.vue'

const routes = [
    {
        path: '/',
        component: CommonLayout,
        children: [
            {
                path: '',
                name: 'Home',
                component: () => import('@/views/Home.vue')
            },
            // --- 新增：分类列表页 ---
            {
                // :type 是动态参数，例如 /category/new, /category/ebook
                path: 'category/:type',
                name: 'Category',
                component: () => import('@/views/Category.vue')
            },
            {
                path: 'product/:id',
                name: 'ProductDetail',
                component: () => import('@/views/ProductDetail.vue')
            },
            {
                path: 'cart',
                name: 'Cart',
                component: () => import('@/views/Cart.vue')
            },
            {
                path: 'checkout',
                name: 'Checkout',
                component: () => import('@/views/Checkout.vue')
            },
            // --- 用户相关 ---
            {
                path: 'user/profile',
                name: 'UserProfile',
                component: () => import('@/views/user/UserProfile.vue')
            },
            {
                path: 'user/orders',
                name: 'OrderList',
                component: () => import('@/views/user/OrderList.vue')
            }
        ]
    },

    // --- 认证页面 ---
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/Register.vue')
    },

    // --- 管理员后台 ---
    {
        path: '/admin',
        component: () => import('@/layout/AdminLayout.vue'),
        meta: { requiresAuth: true, role: 'admin' },
        children: [
            {
                path: 'books',
                name: 'BookManage',
                component: () => import('@/views/admin/BookManage.vue')
            }
        ]
    },

    // --- 404 ---
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    }
})

export default router