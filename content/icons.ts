import {
    siKubernetes, siTerraform, siDocker, siArgo, siGrafana, siPrometheus, siJenkins, siAnsible, siGooglecloud,
    siSpringboot, siAngular, siVuedotjs, siTypescript, siPostgresql, siApachekafka, siRedis, siNextdotjs, siPython,
    siNuxt, siReact, siJavascript, siExpress, siApachespark, siApachehadoop, siLinux, siRedhat, siGit, siMysql, siNodedotjs
} from 'simple-icons'

// Tool names as the content writes them, mapped to their logos (24 x 24 paths).
const map: Record<string, { path: string }> = {
    Kubernetes: siKubernetes, Terraform: siTerraform, Docker: siDocker, 'Argo CD': siArgo, Grafana: siGrafana,
    Prometheus: siPrometheus, Jenkins: siJenkins, Ansible: siAnsible, GCP: siGooglecloud, 'Spring Boot': siSpringboot,
    Angular: siAngular, 'Vue.js': siVuedotjs, TypeScript: siTypescript, PostgreSQL: siPostgresql, Kafka: siApachekafka,
    Redis: siRedis, 'Next.js': siNextdotjs, Python: siPython, 'Nuxt.js': siNuxt, React: siReact, JavaScript: siJavascript,
    'Express.js': siExpress, 'Spark Streaming': siApachespark, 'Apache Hadoop': siApachehadoop, Linux: siLinux,
    RHCSA: siRedhat, Git: siGit, MySQL: siMysql, 'Node.js': siNodedotjs
}

export function iconPath(name: string) {
    return map[name]?.path ?? ''
}

export function withIcons(names: string[], limit = 6) {
    return names.filter((name) => map[name]).slice(0, limit)
}
