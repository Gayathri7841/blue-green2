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

                    echo "Removing existing ${target}..."
                    bat "docker rm -f ${target} || ver > nul"

                    echo "Deploying ${target} on port ${port}..."
                    // FIX 1: Added --network so Nginx can find this container internally
                    bat "docker run -d --name ${target} --network blue-green-net -p ${port}:80 shopping-app:latest"
                    
                    sleep 10 

                    // 1. Check if Server is alive (Returns 200 OK)
                    def isAlive = bat(script: "curl -Is http://localhost:${port}", returnStdout: true).contains("200 OK")
                    
                    // 2. DEEP SCAN
                    def isContentValid = bat(script: "docker exec ${target} grep -r \"Special\" /usr/share/nginx/html/assets/", returnStatus: true) == 0

                    if (isAlive && isContentValid) {
                        echo "HEALTH CHECK PASSED: Switching Traffic to ${target}..."
                        
                        // FIX 2: These two lines tell nginx-proxy to switch from the old version to the new one
                        bat "docker exec nginx-proxy sh -c \"echo 'server { listen 80; location / { proxy_pass http://${target}:80; } }' > /etc/nginx/conf.d/default.conf\""
                        bat "docker exec nginx-proxy nginx -s reload"
                        
                        // FIX 3: Delete the old container ONLY after the new one is live on localhost
                        bat "docker rm -f ${old} || ver > nul"
                    } else {
                        echo "PROTECTION TRIGGERED: New version is broken. Keeping OLD version alive."
                        bat "docker rm -f ${target} || ver > nul"
                        error "Deployment Blocked: Old version is still running safely at http://localhost"
                    }
                }
            }
        }
    }
}
