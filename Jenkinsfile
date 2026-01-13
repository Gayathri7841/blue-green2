pipeline {
    agent any
    stages {
        stage('Checkout') { steps { checkout scm } }
        stage('Build Image') { steps { bat 'docker build -t shopping-app:latest .' } }
        stage('Blue-Green Deploy') {
            steps {
                script {
                    def blueRunning = bat(script: 'docker ps -q -f "name=app-v1" -f "status=running"', returnStatus: true) == 0
                    def target = blueRunning ? "app-v2" : "app-v1"
                    def port = blueRunning ? "8082" : "8081"
                    def old = blueRunning ? "app-v1" : "app-v2"

                    bat "docker stop ${target} || ver > nul"
                    bat "docker rm ${target} || ver > nul"
                    bat "docker run -d --name ${target} -p ${port}:80 shopping-app:latest"
                    
                    echo "SMART CHECK: Looking for actual UI content on port ${port}..."
                    def isHealthy = false
                    
                    for (int i = 0; i < 6; i++) { 
                        sleep 10
                        // Downloads the full page content to see what is actually inside
                        def response = bat(script: "curl -s http://localhost:${port}", returnStdout: true)
                        
                        // If 'Today's Special Deals' is missing, the page is considered BROKEN
                        if (response.contains("Today's Special Deals")) {
                            echo "HEALTH CHECK PASSED: UI content found!"
                            isHealthy = true
                            break
                        }
                        echo "Attempt ${i+1}: Content not found (Page might be blank). Retrying..."
                    }

                    if (isHealthy) {
                        echo "New version is good. Deleting old version ${old}."
                        bat "docker stop ${old} || ver > nul"
                        bat "docker rm ${old} || ver > nul"
                    } else {
                        // THIS IS YOUR GOAL: Keeping the working site online
                        echo "PROTECTION TRIGGERED: New version is blank. Keeping OLD version alive."
                        bat "docker stop ${target} || ver > nul"
                        bat "docker rm ${target} || ver > nul"
                        error "Deployment failed: Your old version is still running safely at http://localhost"
                    }
                }
            }
        }
    }
}
