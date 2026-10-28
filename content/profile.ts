export const profile = {
    name: 'Taha Ayari',
    role: 'Software Engineer, Full-Stack and Cloud',
    headline: 'Taha Ayari. I build software and the platform under it.',
    summary: 'Software engineer with 3+ years designing and shipping full-stack and cloud-native systems: microservices, CI/CD pipelines, Kubernetes and observability, in travel tech and telecom. Red Hat Certified (RHCSA).',
    location: 'Tunis, Tunisia',
    email: 'taha.ayari@iteam-univ.tn',
    linkedin: 'https://www.linkedin.com/in/taha-ayari-700b823b9',
    github: 'https://github.com/tahavv',
    cv: '/taha_ayari_cv_en.pdf',
    image: '/images/taha-terminal.jpeg'
}

export interface Project {
    slug: string
    name: string
    where: string
    years: string
    summary: string
    stack: string[]
    lead?: boolean
    context?: string
    work?: string[]
    outcome?: string[]
    repo?: string
    demo?: string
    image?: string
}

// Professional work gets its own case page; public repositories link out.
export const projects: Project[] = [
    {
        slug: 'gitops-observability-platform',
        name: 'GitOps delivery of a business observability and incident investigation platform',
        where: 'Everbloo-Adenis',
        years: '2025 to now',
        lead: true,
        summary: 'Provisioned, configured and delivered through Git: metrics, logs and traces in one place for investigating incidents.',
        stack: ['Kubernetes', 'Terraform', 'Ansible', 'Argo CD', 'Prometheus', 'Quickwit', 'Grafana', 'Jaeger', 'GCP'],
        context: 'A booking platform with many providers needs one place to see how the business is doing and to trace an incident back to its cause.',
        work: [
            'Infrastructure written in Terraform and configured with Ansible',
            'Every service and dashboard delivered to Kubernetes by Argo CD from Git',
            'Metrics in Prometheus, logs in Quickwit, traces in Jaeger',
            'Grafana dashboards that tie business events to the services behind them'
        ]
    },
    {
        slug: 'multi-provider-booking-platform',
        name: 'Multi-provider booking platform',
        where: 'Everbloo-Adenis',
        years: '2025 to now',
        summary: 'Flight, rail and hotel booking across providers, through NDC, GDS and bedbank integrations.',
        stack: ['TypeScript', 'Next.js', 'Vue.js', 'Nuxt.js', 'Express.js', 'SQL', 'PostgreSQL', 'NDC', 'GDS', 'Jenkins', 'Argo CD'],
        context: 'A global booking platform serving clients across international markets, with each provider speaking its own protocol.',
        work: [
            'Features across flight, rail and hotel booking',
            'NDC and GDS integrations for air, bedbank integrations for hotels',
            'Microservice delivery pipelines to GCP',
            'Jenkins and Argo CD in place of ad hoc deployments'
        ],
        outcome: ['Fewer differences between environments', 'A repeatable promotion workflow']
    },
    {
        slug: 'telecom-fraud-detection',
        name: 'Telecom fraud detection platform',
        where: 'Elite Business',
        years: '2023 to now',
        summary: 'Real-time monitoring, detection, blocking and blacklisting of fraudulent telecom traffic.',
        stack: ['Angular', 'Spring Boot', 'Python', 'Redis', 'Prometheus', 'Grafana', 'Jenkins', 'Docker', 'Kubernetes'],
        context: 'Fraud on a telecom network was caught by hand, late, by an operations team reviewing records.',
        work: [
            'Architected the system: Angular front end, Spring Boot services, Dockerized Python detection services',
            'Redis for fast lookups on blocked and blacklisted numbers',
            'Prometheus and Grafana for platform health',
            'Jenkins CI/CD to Docker and Kubernetes'
        ],
        outcome: ['Faster fraud detection', 'Less manual review for the operations team']
    },
    {
        slug: 'casetools-incident-platform',
        name: 'CaseTools, incident management',
        where: 'Elite Business',
        years: '2023 to now',
        summary: 'Structured incident workflows with Grafana and Prometheus dashboards and Kafka and WebSocket alerting.',
        stack: ['Angular', 'Spring Boot', 'Kafka', 'WebSockets', 'Grafana', 'Prometheus', 'PostgreSQL'],
        context: 'Incidents were tracked by hand, with no shared view of what was open or who had it.',
        work: [
            'Built the incident workflow, from report to resolution',
            'Grafana and Prometheus dashboards for every incident',
            'Kafka and WebSocket alerting to the engineers on duty'
        ],
        outcome: ['Adopted by 10 to 20 engineers', 'Replaced a fully manual process']
    },
    {
        slug: 'telecom-cdr-etl-dashboard',
        name: 'ETL and dashboards for telecom CDR',
        where: 'Elite Business',
        years: '2022 to now',
        summary: 'A pipeline that loads high-volume call detail records into PostgreSQL, and the dashboards built on it.',
        stack: ['Spark Streaming', 'Apache Hadoop', 'PostgreSQL', 'Angular', 'Spring Boot', 'React', 'Grafana', 'Jenkins'],
        context: 'Operational analytics for a telecom operator depend on call detail records arriving complete and on time.',
        work: [
            'Designed the ETL pipeline from CDR files to PostgreSQL',
            'Worked on the platform redesign with Spark Streaming and Apache Hadoop',
            'Built React and Angular dashboard components',
            'Jenkins pipelines for every service'
        ],
        outcome: ['The backbone of the operational analytics dashboards', 'More reliable pipelines and a faster front end']
    },
    {
        slug: 'aws-s3-manager',
        name: 'AWS S3 Manager',
        where: 'Public repository',
        years: '2025',
        summary: 'File management on Amazon S3, with SQS and SNS event handling.',
        stack: ['TypeScript', 'AWS S3', 'SQS', 'SNS', 'Docker', 'Kubernetes', 'Playwright'],
        repo: 'https://github.com/tahavv/aws-s3-manager',
        demo: 'https://aws-s3-manager.vercel.app',
        image: 'https://raw.githubusercontent.com/tahavv/aws-s3-manager/main/screenshots/dashboard.png'
    },
    {
        slug: 'iteam-terraform',
        name: 'Terraform labs',
        where: 'Public repository',
        years: '2025',
        summary: 'Infrastructure as code exercises from the cloud engineering degree at ITeam University.',
        stack: ['Terraform', 'HCL'],
        repo: 'https://github.com/tahavv/iteam-terraform'
    },
    {
        slug: 'clinic-management',
        name: 'Clinic management',
        where: 'Public repository',
        years: '2025',
        summary: 'Appointments, patients, payments and medical records for a clinic, on Spring Boot.',
        stack: ['Java', 'Spring Boot', 'Docker Compose', 'Swagger'],
        repo: 'https://github.com/tahavv/gestionCabinet'
    },
    {
        slug: 'event-manager',
        name: 'Event manager',
        where: 'Public repository',
        years: '2025',
        summary: 'Events, rooms, users and authentication behind a Spring Boot API.',
        stack: ['Java', 'Spring Boot', 'Docker Compose', 'Swagger'],
        repo: 'https://github.com/tahavv/event_manager'
    }
]

export const caseStudies = projects.filter((project) => project.context)

export const experience = [
    {
        start: '2025-02',
        period: 'Feb 2025 to now',
        role: 'Software Engineer (Freelance)',
        company: 'Everbloo-Adenis',
        place: 'Remote',
        summary: 'I build features for a global multi-provider booking platform (flight, rail, hotel) with NDC and GDS integrations, own its microservice deployment pipelines to GCP, and replaced ad hoc deployments with a Jenkins and Argo CD promotion workflow.',
        stack: ['TypeScript', 'Express.js', 'Nuxt.js', 'Next.js', 'Vue.js', 'PostgreSQL', 'NDC and GDS', 'Docker', 'Kubernetes', 'Jenkins', 'Argo CD', 'Terraform', 'Ansible', 'Prometheus', 'Quickwit', 'Grafana', 'GCP']
    },
    {
        start: '2023-07',
        period: 'Jul 2023 to now',
        role: 'Software Engineer',
        company: 'Elite Business',
        place: 'Tunis',
        summary: 'I architected a real-time fraud management system, built CaseTools, the incident platform 10 to 20 engineers work in, automated releases from monthly manual deployments to weekly ones, and designed the CDR ETL pipeline behind the analytics dashboards.',
        stack: ['Angular', 'Spring Boot', 'Python', 'PostgreSQL', 'Kafka', 'Redis', 'Docker', 'Kubernetes', 'Jenkins', 'Grafana', 'Prometheus', 'Spark Streaming']
    },
    {
        start: '2023-01',
        period: 'Jan 2023 to Jun 2023',
        role: 'Full-Stack Developer Intern',
        company: 'Elite Business',
        place: 'Tunis',
        summary: 'I built React components for a telecom reporting dashboard and standardised the team’s Git workflow, which cut integration conflicts.',
        stack: ['React', 'Spring Boot', 'Git', 'Docker', 'MySQL']
    },
    {
        start: '2022-06',
        period: 'Jun 2022 to Sep 2022',
        role: 'Web Developer Intern',
        company: 'Elite Business',
        place: 'Tunis',
        summary: 'I worked on the redesign of a telecom CDR ETL platform with Spark Streaming and Apache Hadoop, for more reliable pipelines and a more responsive front end.',
        stack: ['Angular', 'Spring Boot', 'Spark Streaming', 'Apache Hadoop', 'PostgreSQL', 'Docker']
    }
]

export const skills = [
    { title: 'Containers and GitOps', items: ['Docker', 'Kubernetes', 'Argo CD', 'GitOps'] },
    { title: 'Cloud', items: ['AWS', 'GCP', 'S3', 'SQS', 'SNS'] },
    { title: 'Infrastructure', items: ['Terraform', 'Ansible', 'Linux', 'RHCSA'] },
    { title: 'CI/CD', items: ['Jenkins', 'Argo CD', 'Git'] },
    { title: 'Observability', items: ['Prometheus', 'Grafana', 'Quickwit', 'Jaeger'] },
    { title: 'Backend', items: ['Java', 'Spring Boot', 'Node.js', 'Express.js', 'Python', 'Kafka', 'Redis', 'WebSockets', 'NDC and GDS', 'Bedbank APIs'] },
    { title: 'Frontend', items: ['JavaScript', 'TypeScript', 'Angular', 'React', 'Next.js', 'Vue.js', 'Nuxt.js'] },
    { title: 'Data', items: ['SQL', 'PostgreSQL', 'MySQL', 'Spark Streaming', 'Apache Hadoop'] },
    { title: 'Practices', items: ['CI/CD', 'REST APIs', 'Microservices', 'Agile and Scrum', 'Jira'] }
]

// Figures from the CV, each with what it counts.
export const scores = [
    { figure: '3+', unit: 'years', label: 'shipping full-stack and cloud systems' },
    { figure: '10-20', unit: 'engineers', label: 'on CaseTools, the incident platform I built' },
    { figure: '5', unit: 'platforms', label: 'in production at Everbloo and Elite Business' },
    { figure: '2', unit: 'certs', label: 'Red Hat RHCSA and Cisco NDG Linux Essentials' }
]
export const education = [
    { degree: 'Engineer’s degree, Cloud Computing and Virtualization', school: 'ITeam University, Tunis', years: '2023 to 2026' },
    { degree: 'Bachelor’s degree in Computer Science', school: 'Faculty of Sciences of Tunis', years: '2020 to 2023' }
]

export const certifications = [
    { name: 'Red Hat Certified System Administrator (RHCSA)', href: 'https://www.credly.com/badges/4993ff00-5e5d-4d1a-a766-6a987a2b97aa/public_url' },
    { name: 'Cisco NDG Linux Essentials', href: 'https://www.credly.com/badges/73e284dc-dbb8-4438-8729-726cc166328f/public_url' }
]

// The three things I do, as the about chapter's cards.
export const pillars = [
    { title: 'Cloud and DevOps', line: 'Kubernetes clusters provisioned with Terraform and Ansible, delivered by Argo CD and Jenkins, on AWS and GCP.', tags: ['Kubernetes', 'Terraform', 'Argo CD', 'GCP'], icon: 'Kubernetes' },
    { title: 'Full-stack engineering', line: 'Angular, Next.js, Vue and Nuxt front ends over Spring Boot, Express and Python services.', tags: ['Angular', 'Spring Boot', 'Next.js', 'TypeScript'], icon: 'Angular' },
    { title: 'Observability', line: 'Metrics, logs and traces in Prometheus, Quickwit, Jaeger and Grafana, tied to what the business sees.', tags: ['Prometheus', 'Grafana', 'Quickwit', 'Jaeger'], icon: 'Grafana' }
]

// The skills chapter, as layers of one stack, top to bottom.
export const layers = [
    { name: 'Platform', items: ['Kubernetes', 'Docker', 'Terraform', 'Ansible', 'Argo CD', 'Jenkins', 'Linux', 'RHCSA'], icons: ['Kubernetes', 'Terraform', 'Argo CD'] },
    { name: 'Cloud', items: ['AWS', 'GCP', 'S3', 'SQS', 'SNS'], icons: ['GCP'] },
    { name: 'Observability', items: ['Prometheus', 'Grafana', 'Quickwit', 'Jaeger'], icons: ['Prometheus', 'Grafana'] },
    { name: 'Application', items: ['TypeScript', 'Angular', 'React', 'Next.js', 'Vue.js', 'Nuxt.js', 'Java', 'Spring Boot', 'Node.js', 'Express.js', 'Python', 'REST APIs', 'Microservices', 'NDC and GDS', 'Bedbank APIs'], icons: ['Angular', 'Spring Boot', 'Next.js'] },
    { name: 'Data', items: ['SQL', 'PostgreSQL', 'MySQL', 'Kafka', 'Redis', 'Spark Streaming', 'Apache Hadoop'], icons: ['PostgreSQL', 'Kafka', 'Redis'] }
]
