pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Pulls latest code from GitHub
                checkout scm
            }
        }

        stage('Build Image') {
            steps {
                // Packages your React app into a Docker image
                bat 'docker build -t shopping-app:latest .'
            }
        }

        stage('Blue-Green Deploy with 502 Detection') {
            steps {
                script {
                    // 1. Identify active and target containers
                    def blueRunning = bat(script: 'docker ps -q -f "name=app-v1" -f "status=running"', returnStatus: true) == 0
                    def target = blueRunning ? "app-v2" : "app-v1"
                    def port = blueRunning ? "8082" : "8081"
                    def old = blueRunning ? "app-v1" : "app-v2"

                    // 2. Cleanup target slot
                    echo "Cleaning up ${target}..."
                    bat "docker stop ${target} || ver > nul"
                    bat "docker rm ${target} || ver > nul"

                    // 3. Start new version
                    echo "Deploying ${target} on port ${port}..."
                    bat "docker run -d --name ${target} -p ${port}:80 shopping-app:latest"
                    
                    // 4. STATUS CODE HEALTH CHECK
                    // This specifically looks for "200" and will fail on "502"
                    echo "Checking for 200 OK status on port ${port}..."
                    def isHealthy = false
                    
                    for (int i = 0; i < 6; i++) { 
                        sleep 10
                        // Get the HTTP status code (e.g., 200, 404, 502)
                        def statusCode = bat(script: "curl -s -o nul -w %%{http_code} http://localhost:${port}", returnStdout: true).trim()
                        
                        if (statusCode == "200") {
                            echo "HEALTH CHECK PASSED: Received 200 OK!"
                            isHealthy = true
                            break
                        }
                        
                        echo "Attempt ${i+1}: Received ${statusCode}. (If 502, app is still booting or broken). Retrying..."
                    }

                    // 5. THE MAIN AIM: Switch if 200, Rollback if 502
                    if (isHealthy) {
                        echo "SUCCESS: New version is healthy. Switching traffic."
                        bat "docker stop ${old} || ver > nul"
                        bat "docker rm ${old} || ver > nul"
                    } else {
                        // This keeps your OLD version running
                        echo "FAILURE: New version returned an error (like 502). Rolling back to keep site alive."
                        bat "docker stop ${target} || ver > nul"
                        bat "docker rm ${target} || ver > nul"
                        error "Deployment failed. Your old version is still running at http://localhost"
                    }
                }
            }
        }
    }
}
