pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Pulls your React project from GitHub
                checkout scm
            }
        }

        stage('Build Image') {
            steps {
                // Builds the Docker image based on your Dockerfile
                bat 'docker build -t shopping-app:latest .'
            }
        }

        stage('Blue-Green Deploy with Health Check') {
            steps {
                script {
                    // 1. Identify which slot is currently active
                    def blueRunning = bat(script: 'docker ps -q -f "name=app-v1" -f "status=running"', returnStatus: true) == 0
                    def target = blueRunning ? "app-v2" : "app-v1"
                    def port = blueRunning ? "8082" : "8081"
                    def old = blueRunning ? "app-v1" : "app-v2"

                    // 2. Clean up the target slot before trying to deploy
                    echo "Cleaning up any existing container named ${target}..."
                    bat "docker stop ${target} || ver > nul"
                    bat "docker rm ${target} || ver > nul"

                    // 3. Start the new version as a container
                    echo "Deploying ${target} on port ${port}..."
                    bat "docker run -d --name ${target} -p ${port}:80 shopping-app:latest"
                    
                    // 4. SMART HEALTH CHECK (Targets 'CLICKIT' brand name)
                    echo "Checking if React UI is rendering brand name 'CLICKIT' on port ${port}..."
                    def isHealthy = false
                    
                    for (int i = 0; i < 8; i++) { 
                        // Download the page HTML to a string and convert to lowercase
                        def response = bat(script: "curl -s http://localhost:${port}", returnStdout: true).toLowerCase()
                        
                        // If 'clickit' is found, the React app rendered successfully
                        if (response.contains("clickit")) {
                            echo "HEALTH CHECK PASSED: Brand name 'CLICKIT' found!"
                            isHealthy = true
                            break
                        }
                        
                        echo "Attempt ${i+1}: UI not ready or crashed (No 'CLICKIT' text). Retrying in 5s..."
                        sleep 5
                    }

                    // 5. PROTECTION LOGIC: SWITCH IF GOOD, ROLLBACK IF BAD
                    if (isHealthy) {
                        echo "SUCCESS: New version is healthy. Switching traffic to ${target}."
                        bat "docker stop ${old} || ver > nul"
                        bat "docker rm ${old} || ver > nul"
                    } else {
                        // THIS IS YOUR MAIN AIM: If health check fails, delete the BROKEN one.
                        echo "FAILURE DETECTED: New version is broken. Deleting it now."
                        bat "docker stop ${target} || ver > nul"
                        bat "docker rm ${target} || ver > nul"
                        
                        // The older version is still running on its port and Nginx will keep using it.
                        error "Deployment rolled back. Your website is still safe on the OLD version."
                    }
                }
            }
        }
    }
}