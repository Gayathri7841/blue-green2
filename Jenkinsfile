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
                    
                    echo "Waiting for container to stabilize..."
                    sleep 15
                    
                    // SMART CHECK: Does the page contain the word 'div' or 'script'? 
                    // Every React app HAS these. If it's a 502 error, it won't have them.
                    def response = bat(script: "curl -s http://localhost:${port}", returnStdout: true).toLowerCase()
                    
                    if (response.contains("div") || response.contains("script")) {
                        echo "HEALTH CHECK PASSED: App is serving HTML content!"
                        echo "SUCCESS: Switching traffic to ${target}."
                        bat "docker stop ${old} || ver > nul"
                        bat "docker rm ${old} || ver > nul"
                    } else {
                        echo "FAILURE: New version returned no valid HTML. Rolling back."
                        bat "docker stop ${target} || ver > nul"
                        bat "docker rm ${target} || ver > nul"
                        error "Deployment failed: Old version preserved."
                    }
                }
            }
        }
    }
}
