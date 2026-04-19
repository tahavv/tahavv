export const profile = {
  name: 'Taha Ayari',
  title: 'Software Engineer | Cloud & Platform',
  location: 'Tunisia',
  email: 'taha.ayari@iteam-univ.tn',
  linkedin: 'https://www.linkedin.com/in/taha-ayari-090a0b199/',
  github: 'https://github.com/tahavv'
}

export const experience = [
  {
    role: 'Software Engineer (Freelance)',
    company: 'Everbloo-Adenis',
    period: 'Feb 2025 – Present',
    summary: [
      'Contribute to a global reservation platform spanning flights, rail, and hotels with NDC/GDS integrations.',
      'Support microservices deployment workflows on Google Cloud Platform to improve release consistency across services.',
      'Collaborate on CI/CD implementation using Jenkins and Argo CD to streamline delivery and environment promotion.'
    ],
    technologies: ['Express.js', 'Nuxt.js', 'Argo CD', 'GCP', 'Docker', 'Kubernetes', 'PostgreSQL']
  },
  {
    role: 'Software Engineer',
    company: 'Elite Business',
    period: 'Jul 2023 – Present',
    summary: [
      'Maintain and optimize telecom reporting dashboards used for CDR analysis and operational visibility.',
      'Developed and deployed CaseTools, an incident management and reporting platform integrated with Grafana and Prometheus.',
      'Developed and deployed a fraud management platform covering monitoring, detection, blocking, and blacklisting workflows.',
      'Implemented CI/CD pipelines with Jenkins, Docker, and Kubernetes for both local and cloud deployment scenarios.'
    ],
    technologies: ['Angular', 'Spring Boot', 'Jenkins', 'Docker', 'Kubernetes', 'Grafana', 'Prometheus', 'Spark Streaming']
  },
  {
    role: 'Full Stack Developer Intern',
    company: 'Elite Business',
    period: 'Jan 2023 – Jun 2023',
    summary: [
      'Developed and maintained scalable dashboard applications for telecom CDR reporting and visualization.',
      'Implemented delivery workflows with Jenkins and Docker to improve build and deployment reliability.',
      'Collaborated with engineering teammates to harden backend services and improve front-end maintainability.'
    ],
    technologies: ['Angular', 'Spring Boot', 'Jenkins', 'Docker']
  },
  {
    role: 'Full Stack Developer Intern',
    company: 'Elite Business',
    period: 'Jun 2022 – Sep 2022',
    summary: [
      'Contributed to redesigning a telecom CDR ETL platform with a focus on performance and maintainability.',
      'Implemented and optimized front-end features aligned with backend data processing requirements.',
      'Worked across data and platform tooling in a stack including Spark Streaming and Apache Hadoop.'
    ],
    technologies: ['Angular', 'Spring Boot', 'Git', 'Docker', 'PostgreSQL', 'Spark Streaming', 'Apache Hadoop']
  }
]

export const featuredProjects = [
  {
    id: 'fraud-management-platform',
    title: 'Fraud Management Platform',
    tagline: 'Monitoring, detection, and enforcement workflows for telecom operations.',
    description:
      'Built and deployed a platform that centralizes suspicious activity monitoring, fraud case review, and blocking/blacklisting workflows for operations teams.',
    challenge:
      'Operations teams needed a single workflow to investigate suspicious patterns and act quickly without fragmented tools.',
    approach:
      'Implemented modular services and dashboard workflows using Angular and Spring Boot, then containerized deployments with Docker and Kubernetes.',
    outcome:
      'Delivered a dependable platform that improved visibility, standardized case handling, and supported faster operational response.',
    technologies: ['Angular', 'Spring Boot', 'Docker', 'Kubernetes', 'PostgreSQL', 'Jenkins'],
    image: '/images/projects.png',
    github: 'https://github.com/tahavv'
  },
  {
    id: 'casetools-observability-platform',
    title: 'CaseTools Incident Platform',
    tagline: 'Incident reporting and observability workflows with Grafana and Prometheus.',
    description:
      'Designed and shipped CaseTools to support incident management, service reporting, and technical observability dashboards.',
    challenge:
      'Teams lacked a unified way to correlate incident context with service metrics during escalations.',
    approach:
      'Combined Spring Boot services with observability integrations and dashboard views for faster incident triage and reporting.',
    outcome:
      'Improved incident collaboration and made service health trends easier to track across teams.',
    technologies: ['Angular', 'Spring Boot', 'Grafana', 'Prometheus', 'Docker', 'Jenkins'],
    image: '/images/project.png',
    github: 'https://github.com/tahavv'
  },
  {
    id: 'global-reservation-platform',
    title: 'Global Reservation Platform',
    tagline: 'Distributed booking workflows with NDC/GDS integrations and cloud delivery.',
    description:
      'Contributed to a global reservation system supporting flight, rail, and hotel booking experiences across provider ecosystems.',
    challenge:
      'Provider integrations and distributed services required reliable deployment workflows and stable service orchestration.',
    approach:
      'Built service features with Express.js/Nuxt.js and collaborated on Kubernetes deployments to GCP with Jenkins and Argo CD.',
    outcome:
      'Strengthened release confidence and supported scalable delivery for cross-provider booking workflows.',
    technologies: ['Express.js', 'Nuxt.js', 'GCP', 'Kubernetes', 'Docker', 'Argo CD', 'PostgreSQL'],
    image: '/images/projects.png',
    github: 'https://github.com/tahavv'
  }
]

export const certifications = [
  'Red Hat Certified System Administrator (RHCSA)',
  'Cisco NDG Linux Essentials'
]
