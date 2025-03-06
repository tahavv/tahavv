<!-- /components/ProjectsSection.vue -->
<template>
    <section :id="id" class="section bg-white dark:bg-gray-900">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="section-title text-gray-900 dark:text-white">Projects</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
            </div>
        </div>
    </section>
</template>

<script setup>
defineProps({
    id: {
        type: String,
        default: 'projects'
    }
})

// Sample projects data - in a real app, this could come from a CMS or API
const projects = [
    {
        id: 'fraud-management-system',
        title: 'Fraud Management System',
        description: 'A real-time fraud detection system that uses machine learning to identify suspicious transactions.',
        image: '/images/projects.png',
        technologies: ['Angular', 'Spring Boot', 'Python', 'Docker', 'PostgreSQL', 'Kafka'],
        features: [
            'Real-time transaction monitoring',
            'AI-powered fraud detection algorithms',
            'Customizable risk scoring',
            'Audit trails and compliance reporting'
        ],
        github: 'https://github.com/tahavv',
        liveDemo: 'https://github.com/tahavv'
    },
    {
        id: 'telecom-dashboard',
        title: 'Telecom Reporting Dashboard',
        description: 'A comprehensive analytics dashboard for telecom operators to visualize network performance and user metrics.',
        image: '/images/projects.png',
        technologies: ['Angular', 'TypeScript', 'D3.js', 'Spring Boot', 'PostgreSQL'],
        features: [
            'Interactive data visualizations',
            'Custom report generation',
            'Real-time network monitoring',
            'User behavior analytics'
        ],
        github: 'https://github.com/tahavv',
        liveDemo: 'https://github.com/tahavv'
    },
    {
        id: 'notification-system',
        title: 'Real-time Notification System',
        description: 'A WebSocket and Kafka-based notification system for immediate alerting of critical events.',
        image: '/images/projects.png',
        technologies: ['Kafka', 'WebSockets', 'Spring Boot', 'Angular', 'Docker'],
        features: [
            'Real-time push notifications',
            'Event categorization and prioritization',
            'Delivery confirmation',
            'User preference management'
        ],
        github: 'https://github.com/tahavv',
        liveDemo: 'https://github.com/tahavv'
    }
]
</script>