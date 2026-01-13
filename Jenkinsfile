pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Pulls the latest code from your GitHub repository
                checkout scm
            }
        }

        stage('Build Image') {
            steps {
                // Builds the Docker image locally on Windows
                bat 'docker build -t shopping-app:latest .'
            }
        }

        stage('Blue-Green Deploy with Health Check') {
            steps {
                script {
                    // 1. Identify which version is currently running
                    // If app-v1 is running, we target app-v2 (Port 8082). Otherwise, we target app-v1 (Port 8081).
                    def blueRunning = bat(script: 'docker ps -q -f "name=app-v1" -f "status=running"', returnStatus: true) == 0
                    def target = blueRunning ? "app-v2" : "app-v1"
                    def port = blueRunning ? "8082" : "8081"
                    def old = blueRunning ? "app-v1" : "app-v2"

                    // 2. Pre-deployment Cleanup
                    // This prevents the "Conflict. The container name is already in use" error
                    echo "Cleaning up any existing container named ${target}..."
                    bat "docker stop ${target} || ver > nul"
                    bat "docker rm ${target} || ver > nul"

                    // 3. Start the New Version
                    echo "Deploying ${target} on port ${port}..."
                    bat "docker run -d --name ${target} -p ${port}:80 shopping-app:latest"
                    
                    // 4. Automated Health Check
                    echo "Checking health of ${target} on port ${port}..."
                    def isHealthy = false
                    // Try checking the status 6 times (every 5 seconds) for a total of 30 seconds
                    for (int i = 0; i < 6; i++) {
                        // Uses curl to check if the container returns a 200 OK status
                        def status = bat(script: "curl -s -o nul -w \"%%{http_code}\" http://localhost:${port}", returnStdout: true).trim()
                        if (status == "200") {
                            isHealthy = true
                            break
                        }
                        echo "Status is ${status}, retrying in 5s..."
                        sleep 5
                    }

                    // 5. Finalize Deployment or Rollback
                    if (isHealthy) {
                        echo "Health check passed! Switching traffic by removing ${old}..."
                        bat "docker stop ${old} || ver > nul"
                        bat "docker rm ${old} || ver > nul"
                        echo "SUCCESS: ${target} is now live."
                    } else {
                        // If the new container is broken, we remove it and keep the old one running
                        echo "HEALTH CHECK FAILED! Rolling back..."
                        bat "docker stop ${target} || ver > nul"
                        bat "docker rm ${target} || ver > nul"
                        error "Deployment failed: The new container was not healthy."
                    }
                }
            }
        }
    }
}
