pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Pulls latest code from your GitHub repository
                checkout scm
            }
        }

        stage('Build Image') {
            steps {
                // Builds the Docker image from your Dockerfile
                bat 'docker build -t shopping-app:latest .'
            }
        }

        stage('Blue-Green Deploy with Fixed Health Check') {
            steps {
                script {
                    // 1. Identify which slot is currently active
                    def blueRunning = bat(script: 'docker ps -q -f "name=app-v1" -f "status=running"', returnStatus: true) == 0
                    def target = blueRunning ? "app-v2" : "app-v1"
                    def port = blueRunning ? "8082" : "8081"
                    def old = blueRunning ? "app-v1" : "app-v2"

                    // 2. Clean up the target slot
                    echo "Cleaning up ${target}..."
                    bat "docker stop ${target} || ver > nul"
                    bat "docker rm ${target} || ver > nul"

                    // 3. Start the new version
                    echo "Deploying ${target} on port ${port}..."
                    bat "docker run -d --name ${target} -p ${port}:80 shopping-app:latest"
                    
                    // 4. IMPROVED STATUS CODE CHECK
                    echo "Checking for 200 OK status on port ${port}..."
                    def isHealthy = false
                    
                    for (int i = 0; i < 6; i++) { 
                        sleep 10
                        // Captures the HTTP status code from the new container
                        def statusCode = bat(script: "curl -s -o nul -w %%{http_code} http://localhost:${port}", returnStdout: true).trim()
                        
                        // Using .contains to handle extra Windows path text in the output
                        if (statusCode.contains("200")) {
                            echo "HEALTH CHECK PASSED: Received 200 OK!"
                            isHealthy = true
                            break
                        }
                        
                        echo "Attempt ${i+1}: Received ${statusCode}. Retrying..."
                    }

                    // 5. THE MAIN AIM: Protect the live site
                    if (isHealthy) {
                        echo "SUCCESS: Switching traffic to ${target}."
                        bat "docker stop ${old} || ver > nul"
                        bat "docker rm ${old} || ver > nul"
                    } else {
                        // If it fails, we delete the NEW broken version only
                        echo "FAILURE: New version is unhealthy. Rolling back to keep OLD version alive."
                        bat "docker stop ${target} || ver > nul"
                        bat "docker rm ${target} || ver > nul"
                        error "Deployment failed. Your old version is still running safely."
                    }
                }
            }
        }
    }
}
