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

                   // ... (start of your script remains the same)

bat "docker run -d --name ${target} -p ${port}:80 shopping-app:latest"

echo "DEEP SCAN: Checking if UI components rendered in assets..."
def isHealthy = false

// We look inside the container's web folder for the word 'Special'
// If you comment out the code, this word will not be indexed correctly in the assets
def check = bat(script: "docker exec ${target} grep -r \"Special\" /usr/share/nginx/html/assets/", returnStatus: true)

if (check == 0) {
    echo "HEALTH CHECK PASSED: Component text found."
    isHealthy = true
}

if (isHealthy) {
    echo "SUCCESS: Switching traffic."
    bat "docker stop ${old} || ver > nul"
    bat "docker rm ${old} || ver > nul"
} else {
    echo "ROLLBACK: New version is a BLANK PAGE. Keeping old version."
    bat "docker stop ${target} || ver > nul"
    bat "docker rm ${target} || ver > nul"
    error "Deployment blocked to prevent blank page!"
}
                }
            }
        }
    }
}
