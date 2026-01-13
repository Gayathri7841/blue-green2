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

                    // CLEANUP: This prevents the 'Conflict' error you just saw
                    echo "Removing existing ${target} if it exists..."
                    bat "docker rm -f ${target} || ver > nul"

                    // START NEW VERSION
                    echo "Deploying ${target} on port ${port}..."
                    bat "docker run -d --name ${target} -p ${port}:80 shopping-app:latest"
                    
                    // DEEP SCAN: Jenkins peeks inside the container to see if the UI rendered
                    echo "DEEP SCAN: Checking if UI content exists inside the container..."
                    sleep 10
                    
                    // We look for 'Special' inside the container's production files
                    def check = bat(script: "docker exec ${target} grep -r \"Special\" /usr/share/nginx/html/assets/", returnStatus: true)

                    if (check == 0) {
                        echo "HEALTH CHECK PASSED: New version is healthy. Switching traffic."
                        bat "docker rm -f ${old} || ver > nul"
                    } else {
                        // THIS IS YOUR MAIN AIM
                        echo "PROTECTION TRIGGERED: New version is blank/broken. Keeping OLD version alive."
                        bat "docker rm -f ${target} || ver > nul"
                        error "Deployment Blocked: To prevent a blank page, your working site was kept online."
                    }
                }
            }
        }
    }
}
