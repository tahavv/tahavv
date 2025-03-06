<template>
    <section :id="id" class="section bg-white dark:bg-gray-900 relative overflow-hidden">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">

                <!-- Profile Image -->
                <div class="w-full lg:w-1/3 flex justify-center animate-fade-in">
                    <div class="relative w-64 h-64 rounded-full overflow-hidden border-4 border-blue-600 shadow-lg">
                        <img src="/assets/images/profile.jpg" alt="Taha Ayari" class="w-full h-full object-cover" />
                    </div>
                </div>

                <!-- Content -->
                <div class="w-full lg:w-2/3 animate-slide-in">
                    <h1 class="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                        Taha Ayari
                    </h1>
                    <h2 class="text-2xl sm:text-3xl font-medium mb-6 text-blue-600 dark:text-blue-400">
                        Full Stack Developer
                    </h2>
                    <p class="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                        Results-driven Full Stack Developer with advanced expertise in Java, Angular, and Python.
                        Skilled in microservices, cloud computing, and event-driven architectures, delivering real-time,
                        scalable solutions. Adept at optimizing performance, streamlining processes, and collaborating
                        in agile teams to fuel innovation and impact.
                    </p>

                    <!-- Social Links -->
                    <div class="flex gap-4 mb-8 animate-fade-in">
                        <a href="https://github.com/tahavv" target="_blank" rel="noopener noreferrer"
                            class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300">
                            <Icon name="mdi:github" class="w-6 h-6 text-gray-700 dark:text-gray-300" />
                        </a>
                        <a href="https://www.linkedin.com/in/taha-ayari-090a0b199/" target="_blank"
                            rel="noopener noreferrer"
                            class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300">
                            <Icon name="mdi:linkedin" class="w-6 h-6 text-blue-600" />
                        </a>
                    </div>

                    <!-- Buttons -->
                    <div class="flex flex-wrap gap-4 animate-slide-in">
                        <NuxtLink to="#contact" class="btn-primary">
                            Contact Me
                        </NuxtLink>
                        <a href="/taha_ayari_cv_en.pdf" target="_blank" class="btn-secondary">
                            Download CV
                            <Icon name="heroicons:arrow-down-tray" class="ml-2 w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Waves Background -->
        <div class="waves absolute bottom-0 left-0 w-full pointer-events-none"></div>
    </section>
</template>

<script setup>
defineProps({
    id: {
        type: String,
        default: 'about'
    }
})
</script>
