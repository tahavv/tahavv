<template>
    <div class="py-16 bg-white dark:bg-gray-900">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div v-if="project" class="max-w-4xl mx-auto">
                <!-- Back button -->
                <NuxtLink to="/#projects"
                    class="inline-flex items-center mb-8 text-blue-600 dark:text-blue-400 font-medium group">
                    <Icon name="heroicons:arrow-left"
                        class="mr-1 w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                    Back to Projects
                </NuxtLink>

                <!-- Project header -->
                <div class="rounded-xl overflow-hidden mb-8">
                    <img :src="project.image || '/images/project-placeholder.jpg'" :alt="project.title"
                        class="w-full h-auto max-h-96 object-cover" />
                </div>



                <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">{{ project.title }}</h1>

                <p class="text-lg text-gray-700 dark:text-gray-300 mb-8">{{ project.description }}</p>

                <!-- Technologies -->
                <div class="mb-8">
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Technologies</h2>
                    <div class="flex flex-wrap gap-2">
                        <span v-for="tech in project.technologies" :key="tech"
                            class="text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 py-1 px-3 rounded-full">
                            {{ tech }}
                        </span>
                    </div>
                </div>

                <!-- Features -->
                <div class="mb-8">
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Key Features</h2>
                    <ul class="space-y-2">
                        <li v-for="(feature, index) in project.features" :key="index" class="flex items-start">
                            <Icon name="heroicons:check-circle"
                                class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span class="text-gray-700 dark:text-gray-300">{{ feature }}</span>
                        </li>
                    </ul>
                </div>

                <!-- Links -->
                <div class="flex flex-wrap gap-4">
                    <a v-if="project.github" :href="project.github" target="_blank" rel="noopener noreferrer"
                        class="btn-secondary">
                        <Icon name="mdi:github" class="mr-2 w-5 h-5" />
                        View Source
                    </a>
                    <a v-if="project.liveDemo" :href="project.liveDemo" target="_blank" rel="noopener noreferrer"
                        class="btn-primary">
                        <Icon name="heroicons:globe-alt" class="mr-2 w-5 h-5" />
                        Live Demo
                    </a>
                </div>
            </div>

            <div v-else class="max-w-4xl mx-auto text-center py-16">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Project Not Found</h1>
                <p class="text-gray-600 dark:text-gray-400 mb-8">The project you're looking for doesn't exist or has
                    been removed.</p>
                <NuxtLink to="/#projects" class="btn-primary">
                    Return to Projects
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
const route = useRoute()
const projectId = route.params.id

// In a real application, you would fetch this data from an API or CMS
// For this example, we're using a static sample data array
const projects = [
    {
        id: 'fraud-management-system',
        title: 'Fraud Management System',
        description: 'A real-time fraud detection system that uses machine learning to identify suspicious transactions. The system integrates with payment gateways and banking systems to monitor transactions in real-time, applying various algorithms to detect anomalies and potential fraudulent activities.',
        image: '/images/projects.png',
        technologies: ['Angular', 'Spring Boot', 'Python', 'Docker', 'PostgreSQL', 'Kafka'],
        features: [
            'Real-time transaction monitoring',
            'AI-powered fraud detection algorithms',
            'Customizable risk scoring',
            'Audit trails and compliance reporting',
            'Automated alert system for suspicious activities',
            'User behavior analysis for detecting account takeovers'
        ],
        github: 'https://github.com/tahavv',
        liveDemo: 'https://github.com/tahavv'
    },
    {
        id: 'telecom-dashboard',
        title: 'Telecom Reporting Dashboard',
        description: 'A comprehensive analytics dashboard for telecom operators to visualize network performance and user metrics. This tool helps operators identify bottlenecks, optimize network resources, and improve overall service quality through data-driven decisions.',
        image: '/images/projects.png',
        technologies: ['Spring Boot', 'Angular', 'TypeScript', 'Highcharts', 'PostgreSQL'],
        features: [
            'Interactive data visualizations',
            'Custom report generation',
            'Real-time network monitoring',
            'User behavior analytics',
            'Performance metrics tracking',
            'Trend analysis and forecasting'
        ],
        github: 'https://github.com/tahavv',
        liveDemo: 'https://github.com/tahavv'
    },
    {
        id: 'notification-system',
        title: 'Real-time Notification System',
        description: 'A WebSocket and Kafka-based notification system for immediate alerting of critical events. This system ensures that stakeholders are promptly informed of important updates, system alerts, and business events, reducing response times and improving operational efficiency.',
        image: '/images/projects.png',
        technologies: ['Kafka', 'WebSockets', 'Spring Boot', 'Angular', 'Docker'],
        features: [
            'Real-time push notifications',
            'Event categorization and prioritization',
            'Delivery confirmation',
            'User preference management',
            'Multi-channel delivery (web, email)',
            'Notification history and analytics'
        ],
        github: 'https://github.com/tahavv',
        liveDemo: 'https://github.com/tahavv'
    }
]

// Find the project by ID
const project = computed(() => projects.find(p => p.id === projectId))

// SEO metadata
useHead(() => ({
    title: project.value ? `${project.value.title} | Taha Ayari` : 'Project Not Found | Taha Ayari',
    meta: [
        {
            name: 'description',
            content: project.value
                ? `${project.value.title} - ${project.value.description.substring(0, 150)}...`
                : 'Project not found'
        }
    ]
}))
</script>