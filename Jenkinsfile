pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Build Image') {
            steps {
                bat 'docker build -t shopping-app:latest .'
            }
        }
        stage('Blue-Green Deploy with Health Check') {
            steps {
                script {
                    def blueRunning = bat(script: 'docker ps -q -f "name=app-v1"', returnStatus: true) == 0
                    def target = blueRunning ? "app-v2" : "app-v1"
                    def port = blueRunning ? "8082" : "8081"
                    def old = blueRunning ? "app-v1" : "app-v2"

                    // Start new version
                    bat "docker run -d --name ${target} -p ${port}:80 shopping-app:latest"
                    
                    // HEALTH CHECK LOGIC
                    echo "Checking health of ${target} on port ${port}..."
                    def isHealthy = false
                    for (int i = 0; i < 6; i++) { // Try for 30 seconds
                        // Use curl to check for 200 OK
                        def status = bat(script: "curl -s -o nul -w \"%%{http_code}\" http://localhost:${port}", returnStdout: true).trim()
                        if (status == "200") {
                            isHealthy = true
                            break
                        }
                        echo "Status is ${status}, retrying in 5s..."
                        sleep 5
                    }

                    if (isHealthy) {
                        echo "Health check passed! Removing ${old}..."
                        bat "docker stop ${old} || ver > nul"
                        bat "docker rm ${old} || ver > nul"
                    } else {
                        echo "HEALTH CHECK FAILED! Rolling back..."
                        bat "docker stop ${target} || ver > nul"
                        bat "docker rm ${target} || ver > nul"
                        error "Deployment failed: New container is not healthy."
                    }
                }
            }
        }
    }
}
