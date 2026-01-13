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

        stage('Blue-Green Deploy with Bulletproof Health Check') {
            steps {
                script {
                    // 1. Identify active slot
                    def blueRunning = bat(script: 'docker ps -q -f "name=app-v1" -f "status=running"', returnStatus: true) == 0
                    def target = blueRunning ? "app-v2" : "app-v1"
                    def port = blueRunning ? "8082" : "8081"
                    def old = blueRunning ? "app-v1" : "app-v2"

                    // 2. Cleanup target
                    bat "docker stop ${target} || ver > nul"
                    bat "docker rm ${target} || ver > nul"

                    // 3. Start new version
                    bat "docker run -d --name ${target} -p ${port}:80 shopping-app:latest"
                    
                    // 4. WAIT AND CHECK FOR ACTUAL CONTENT
                    echo "Waiting for React to render 'Today's Special Deals' on port ${port}..."
                    def isHealthy = false
                    
                    for (int i = 0; i < 6; i++) { 
                        // We wait 10 seconds before each check to ensure React has finished loading
                        sleep 10
                        
                        // We search for the specific heading text from your screenshot
                        def response = bat(script: "curl -s http://localhost:${port}", returnStdout: true)
                        
                        if (response.contains("Today's Special Deals")) {
                            echo "HEALTH CHECK PASSED: Content rendered successfully!"
                            isHealthy = true
                            break
                        }
                        
                        echo "Attempt ${i+1}: Content not found yet. Retrying..."
                    }

                    // 5. THE MAIN AIM: Protect the Old Version
                    if (isHealthy) {
                        echo "SUCCESS: Switching traffic."
                        bat "docker stop ${old} || ver > nul"
                        bat "docker rm ${old} || ver > nul"
                    } else {
                        // If it fails, we DELETE the new broken container
                        echo "FAILURE: New version is a blank page. Deleting it to keep OLD version alive."
                        bat "docker stop ${target} || ver > nul"
                        bat "docker rm ${target} || ver > nul"
                        error "Deployment failed: The new code resulted in a blank page. Old version is still running."
                    }
                }
            }
        }
    }
}