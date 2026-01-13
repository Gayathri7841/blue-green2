pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Pulls the latest code from your GitHub repository
                checkout scm
            }
        }

        stage('Build Image') {
            steps {
                // Builds the Docker image locally on Windows
                bat 'docker build -t shopping-app:latest .'
            }
        }

        stage('Blue-Green Deploy with Smart Health Check') {
            steps {
                script {
                    // 1. Identify Target
                    def blueRunning = bat(script: 'docker ps -q -f "name=app-v1" -f "status=running"', returnStatus: true) == 0
                    def target = blueRunning ? "app-v2" : "app-v1"
                    def port = blueRunning ? "8082" : "8081"
                    def old = blueRunning ? "app-v1" : "app-v2"

                    // 2. Cleanup Target Container
                    echo "Cleaning up any existing container named ${target}..."
                    bat "docker stop ${target} || ver > nul"
                    bat "docker rm ${target} || ver > nul"

                    // 3. Start New Container
                    echo "Deploying ${target} on port ${port}..."
                    bat "docker run -d --name ${target} -p ${port}:80 shopping-app:latest"
                    
                    // 4. Smart Health Check Loop
                    echo "Checking if React UI is rendering 'Special' text on port ${port}..."
                    def isHealthy = false
                    
                    for (int i = 0; i < 6; i++) { 
                        // This command downloads the page and searches for the word "Special"
                        // findstr /I "Special" returns 0 if found, 1 if not
                        def status = bat(script: "curl -s http://localhost:${port} | findstr /I \"Special\"", returnStatus: true)
                        
                        if (status == 0) {
                            echo "Health Check Passed: UI text 'Special' found!"
                            isHealthy = true
                            break
                        }
                        
                        echo "Attempt ${i+1}: UI not ready or crashed. Retrying in 5s..."
                        sleep 5
                    }

                    // 5. Finalize or Rollback
                    if (isHealthy) {
                        echo "SUCCESS: Switching traffic to ${target} and removing ${old}."
                        bat "docker stop ${old} || ver > nul"
                        bat "docker rm ${old} || ver > nul"
                    } else {
                        echo "HEALTH CHECK FAILED: React UI did not render correctly. Rolling back..."
                        bat "docker stop ${target} || ver > nul"
                        bat "docker rm ${target} || ver > nul"
                        error "Deployment failed: New version is unhealthy."
                    }
                }
            }
        }
    }
}