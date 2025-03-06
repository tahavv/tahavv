<!-- /components/ExperienceSection.vue -->
<template>
    <section :id="id" class="section bg-gray-50 dark:bg-gray-800">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="section-title text-gray-900 dark:text-white">Work Experience</h2>

            <div class="relative mt-12">
                <!-- Vertical line -->
                <div class="absolute left-0 md:left-1/2 top-0 h-full w-1 bg-blue-600 transform md:translate-x-0.5">
                </div>

                <!-- Timeline items -->
                <div class="space-y-12">
                    <ExperienceTimelineItem position="Full Stack Developer" company="Elite business"
                        duration="June 2023 - Present" isLeft :responsibilities="[
                            'Architected a real-time Fraud Management System using Angular, Spring Boot, and Dockerized Python microservices, reducing fraudulent transactions by 35% and accelerating detection by 40%.',
                            'Designed a robust ETL pipeline integrating data flows into PostgreSQL, guaranteeing data integrity and boosting throughput by 30%.',
                            'Developed a telecom Reporting Dashboard in collaboration with cross-functional teams, increasing user engagement by 25% through tailored insights and reducing manual reporting efforts.',
                            'Engineered a Kafka- and WebSockets-driven notification system, cutting incident response time by 45% and enhancing critical-event visibility.'
                        ]" :achievements="[
                            'Established CI/CD best practices, shortening deployment cycles by 20% and minimizing downtime.',
                            'Introduced automated testing tools to improve code coverage by 15%.'
                        ]" :technologies="['Angular', 'Spring Boot', 'Python', 'PostgreSQL', 'Kafka', 'Docker', 'WebSockets']" />

                    <ExperienceTimelineItem position="Web Developer Intern" company="Elite business"
                        duration="January 2023 - June 2023" :responsibilities="[
                            'Developed and optimized front-end functionalities with React, increasing page-load speeds by 30% and boosting user satisfaction.',
                            'Collaborated in code reviews and Agile sprints, reducing rework by 15% through improved developer best practices.'
                        ]" :achievements="[
                            'Integrated Git workflows to lower version-control conflicts by 40% and accelerate sprint delivery.',
                            'Delivered sprints ahead of schedule by consistently completing backlog items under estimated effort.'
                        ]" :technologies="['React', 'Spring Boot', 'Git', 'Docker', 'MySQL']" />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
defineProps({
    id: {
        type: String,
        default: 'experience'
    }
})
</script>