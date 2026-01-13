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
                    
                    echo "Checking for 'Special' text on port ${port}..."
                    def isHealthy = false
                    
                    for (int i = 0; i < 6; i++) { 
                        sleep 10
                        // Downloads the HTML content and makes it lowercase
                        def response = bat(script: "curl -s http://localhost:${port}", returnStdout: true).toLowerCase()
                        
                        // IF the word 'special' is found, the UI is NOT blank
                        if (response.contains("special")) {
                            echo "HEALTH CHECK PASSED: App is rendering correctly!"
                            isHealthy = true
                            break
                        }
                        echo "Attempt ${i+1}: Page is blank or crashed. Retrying..."
                    }

                    if (isHealthy) {
                        echo "New version is good. Deleting old version ${old}."
                        bat "docker stop ${old} || ver > nul"
                        bat "docker rm ${old} || ver > nul"
                    } else {
                        // THIS IS YOUR GOAL: Keep the old site alive
                        echo "FAILURE DETECTED: New version is blank. Keeping OLD version alive."
                        bat "docker stop ${target} || ver > nul"
                        bat "docker rm ${target} || ver > nul"
                        error "Deployment failed: Your old site is still safe."
                    }
                }
            }
        }
    }
}
