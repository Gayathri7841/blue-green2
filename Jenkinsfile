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

        stage('Blue-Green Deploy') {
            steps {
                script {
                    // 1. Identify which slot is currently active
                    def blueRunning = bat(script: 'docker ps -q -f "name=app-v1" -f "status=running"', returnStatus: true) == 0
                    def target = blueRunning ? "app-v2" : "app-v1"
                    def port = blueRunning ? "8082" : "8081"
                    def old = blueRunning ? "app-v1" : "app-v2"

                    // 2. Clean up the target slot before deployment to avoid conflicts
                    echo "Removing existing ${target} if it exists..."
                    bat "docker rm -f ${target} || ver > nul"

                    // 3. Start the new version on the standby port
                    echo "Deploying ${target} on port ${port}..."
                    bat "docker run -d --name ${target} -p ${port}:80 shopping-app:latest"
                    
                    // 4. SMART CONTENT CHECK
                    // This verifies the app is actually rendering content, not just a blank page.
                    echo "SMART CONTENT CHECK: Verifying the app is rendering on port ${port}..."
                    def isHealthy = false

                    for (int i = 0; i < 5; i++) {
                        sleep 10
                        // Captures the ACTUAL HTML output from the container
                        def response = bat(script: "curl -s http://localhost:${port}", returnStdout: true)
                        
                        // If React crashes due to the import error, 'Today's Special Deals' won't be in the HTML.
                        if (response.contains("Today's Special Deals") || response.contains("Shop Fresh Now")) {
                            echo "HEALTH CHECK PASSED: Content is visible on the page!"
                            isHealthy = true
                            break
                        }
                        echo "Attempt ${i+1}: Page content not found (Likely Blank Page). Retrying..."
                    }

                    // 5. THE MAIN AIM: Switch traffic only if healthy, otherwise Rollback
                    if (isHealthy) {
                        echo "SUCCESS: Switching traffic to ${target}."
                        // Remove the old working version only because the new one is confirmed good
                        bat "docker rm -f ${old} || ver > nul"
                    } else {
                        // If it fails, we delete the NEW broken version and keep the OLD version running
                        echo "PROTECTION TRIGGERED: New version is a BLANK PAGE. Rolling back to keep OLD site alive."
                        bat "docker rm -f ${target} || ver > nul"
                        error "Deployment Blocked: Your working site was kept online to prevent a blank page."
                    }
                }
            }
        }
    }
}
