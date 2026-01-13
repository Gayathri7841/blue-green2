pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Build Image') {
            steps {
                // Use 'bat' for Windows instead of 'sh'
                bat 'docker build -t shopping-app:latest .'
            }
        }
        stage('Blue-Green Deploy') {
            steps {
                script {
                    // This logic checks which port is free and deploys there
                    def blueRunning = bat(script: 'docker ps -q -f "name=app-v1"', returnStatus: true) == 0
                    def target = blueRunning ? "app-v2" : "app-v1"
                    def port = blueRunning ? "8082" : "8081"
                    def old = blueRunning ? "app-v1" : "app-v2"

                    bat "docker run -d --name ${target} -p ${port}:80 shopping-app:latest"
                    echo "Deployed to ${target} on port ${port}"
                    
                    // In a real scenario, you'd test health here before stopping 'old'
                    bat "docker stop ${old} || ver > nul"
                    bat "docker rm ${old} || ver > nul"
                }
            }
        }
    }
}
