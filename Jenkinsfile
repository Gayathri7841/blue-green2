pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Image') {
            steps {
                bat 'docker build -t shopping-app:latest .'
            }
        }

        stage('Blue-Green Deploy with Health Check') {
            steps {
                script {
                    // 1. Identify Target
                    def blueRunning = bat(script: 'docker ps -q -f "name=app-v1" -f "status=running"', returnStatus: true) == 0
                    def target = blueRunning ? "app-v2" : "app-v1"
                    def port = blueRunning ? "8082" : "8081"
                    def old = blueRunning ? "app-v1" : "app-v2"

                    // 2. Cleanup Target Container
                    echo "Cleaning up any existing container named ${target}..."
                    bat "docker stop ${target} || ver > nul"
                    bat "docker rm ${target} || ver > nul"

                    // 3. Start New Container
                    echo "Deploying ${target} on port ${port}..."
                    bat "docker run -d --name ${target} -p ${port}:80 shopping-app:latest"
                    
                    // 4. Improved Health Check Loop
                    echo "Checking health of ${target} on port ${port}..."
                    def isHealthy = false
                    
                    for (int i = 0; i < 5; i++) {
                        // Capture only the HTTP status code
                        def response = bat(script: "curl -s -o nul -w %%{http_code} http://localhost:${port}", returnStdout: true).trim()
                        
                        // Extract status code (it might be at the end of the string in Windows)
                        if (response.contains("200")) {
                            isHealthy = true
                            break
                        }
                        echo "Attempt ${i+1}: App not ready yet (Status: ${response}). Retrying in 5s..."
                        sleep 5
                    }

                    // 5. Traffic Switch or Rollback
                    if (isHealthy) {
                        echo "HEALTH CHECK PASSED! ${target} is ready."
                        bat "docker stop ${old} || ver > nul"
                        bat "docker rm ${old} || ver > nul"
                    } else {
                        echo "HEALTH CHECK FAILED after 5 attempts. Rolling back..."
                        bat "docker stop ${target} || ver > nul"
                        bat "docker rm ${target} || ver > nul"
                        error "Deployment failed: New version was not healthy."
                    }
                }
            }
        }
    }
}
