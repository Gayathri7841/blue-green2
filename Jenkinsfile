pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Pulls the latest code from GitHub
                checkout scm
            }
        }

        stage('Build Image') {
            steps {
                // Builds the Docker image from your Dockerfile
                bat 'docker build -t shopping-app:latest .'
            }
        }

        stage('Blue-Green Deploy with Health Check') {
            steps {
                script {
                    // 1. Identify which port is currently active
                    def blueRunning = bat(script: 'docker ps -q -f "name=app-v1" -f "status=running"', returnStatus: true) == 0
                    def target = blueRunning ? "app-v2" : "app-v1"
                    def port = blueRunning ? "8082" : "8081"
                    def old = blueRunning ? "app-v1" : "app-v2"

                    // 2. Clean up the target slot before deploying
                    echo "Cleaning up any existing container named ${target}..."
                    bat "docker stop ${target} || ver > nul"
                    bat "docker rm ${target} || ver > nul"

                    // 3. Start the new version
                    echo "Deploying ${target} on port ${port}..."
                    bat "docker run -d --name ${target} -p ${port}:80 shopping-app:latest"
                    
                    // 4. SMART HEALTH CHECK
                    // We wait for the app to load and check if "Special" text exists in the HTML.
                    echo "Checking if React UI is rendering 'Special' text on port ${port}..."
                    def isHealthy = false
                    
                    for (int i = 0; i < 8; i++) { 
                        // Download the page content into a variable
                        def response = bat(script: "curl -s http://localhost:${port}", returnStdout: true).toLowerCase()
                        
                        // Check if our key word exists in the rendered HTML
                        if (response.contains("special")) {
                            echo "HEALTH CHECK PASSED: The word 'Special' was found in the UI!"
                            isHealthy = true
                            break
                        }
                        
                        echo "Attempt ${i+1}: UI not ready or crashed (No 'Special' text found). Retrying in 5s..."
                        sleep 5
                    }

                    // 5. THE MAIN AIM: Switch if good, KEEP OLD IF BAD
                    if (isHealthy) {
                        echo "SUCCESS: Switching traffic to ${target}. Removing the old version ${old}."
                        bat "docker stop ${old} || ver > nul"
                        bat "docker rm ${old} || ver > nul"
                    } else {
                        // THIS IS YOUR GOAL: If the new code is bad, we delete IT, not the old one.
                        echo "CRITICAL FAILURE: New version is broken. Deleting it to keep the OLD version running."
                        bat "docker stop ${target} || ver > nul"
                        bat "docker rm ${target} || ver > nul"
                        error "Deployment failed: The new code is broken. Your website is still running on the OLD version."
                    }
                }
            }
        }
    }
}