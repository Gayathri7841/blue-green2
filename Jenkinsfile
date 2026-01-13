pipeline {
    agent any
    stages {
        stage('Cleanup Workspace') {
            steps { cleanWs() }
        }
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Build Image') {
            steps {
                sh 'docker build -t shopping-app:latest .'
            }
        }
        stage('Blue-Green Deploy') {
            steps {
                script {
                    // Check if Version 1 (Blue) is running
                    def isBlueRunning = sh(script: "docker ps -q -f name=app-v1", returnStatus: true) == 0
                    
                    def targetName = isBlueRunning ? "app-v2" : "app-v1"
                    def targetPort = isBlueRunning ? "8082" : "8081"
                    def oldName    = isBlueRunning ? "app-v1" : "app-v2"

                    // 1. Start the NEW container
                    sh "docker run -d --name ${targetName} -p ${targetPort}:80 shopping-app:latest"
                    
                    // 2. Health Check
                    echo "Waiting for health check on port ${targetPort}..."
                    sleep 15
                    def health = sh(script: "curl -s http://localhost:${targetPort}/health", returnStdout: true).trim()
                    
                    if (health == "OK") {
                        echo "New version is healthy! Removing old version..."
                        sh "docker stop ${oldName} || true"
                        sh "docker rm ${oldName} || true"
                    } else {
                        sh "docker stop ${targetName} && docker rm ${targetName}"
                        error "Health check failed on ${targetName}. Deployment aborted."
                    }
                }
            }
        }
    }
}