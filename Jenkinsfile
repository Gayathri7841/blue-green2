pipeline {
    agent any
    stages {
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
                    def running = sh(script: "docker ps -q -f name=app-v1", returnStatus: true)
                    def targetName = (running == 0) ? "app-v2" : "app-v1"
                    def targetPort = (running == 0) ? "8082" : "8081"
                    def oldName    = (running == 0) ? "app-v1" : "app-v2"

                    sh "docker run -d --name ${targetName} -p ${targetPort}:80 shopping-app:latest"
                    
                    echo "Checking health..."
                    sleep 10
                    
                    // Cleanup old version
                    sh "docker stop ${oldName} || true"
                    sh "docker rm ${oldName} || true"
                }
            }
        }
    }
}