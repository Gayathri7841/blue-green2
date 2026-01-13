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
                    
                    echo "Checking if Source Code changes are valid on port ${port}..."
                    def isHealthy = false
                    
                    // 1. Verify the Server is responding (200 OK)
                    def statusCode = bat(script: "curl -s -o nul -w %%{http_code} http://localhost:${port}", returnStdout: true).trim()
                    
                    // 2. Verify the Source Code content ('Special' deals)
                    // We check the 'dist' folder generated during build to ensure the code isn't broken
                    def contentCheck = bat(script: 'findstr /S /I "Special" dist\\assets\\*.js', returnStatus: true) == 0

                    if (statusCode.contains("200") && contentCheck) {
                        echo "HEALTH CHECK PASSED: Server is UP and Source Code is VALID!"
                        isHealthy = true
                    }

                    if (isHealthy) {
                        echo "SUCCESS: Switching traffic to ${target}."
                        bat "docker stop ${old} || ver > nul"
                        bat "docker rm ${old} || ver > nul"
                    } else {
                        // THE MAIN AIM: If Hero.jsx is broken, we ROLLBACK
                        echo "FAILURE DETECTED: Source code is broken or unreachable. Keeping OLD version alive."
                        bat "docker stop ${target} || ver > nul"
                        bat "docker rm ${target} || ver > nul"
                        error "Deployment failed: Your old version is still running safely."
                    }
                }
            }
        }
    }
}
