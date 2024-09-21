import chat from "@/views/ai/Chat.vue";

const aiRouter = [
    {
        path: '/chat',
        meta: { title: 'AI聊天' },
        name: 'chat',
        component: chat,
    }
]
export default aiRouter
