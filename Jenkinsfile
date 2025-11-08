pipeline {
    agent any

    environment {
        DEPLOY_PATH = "/www/kolegium-orthopaedi"
        SERVER_IP = "31.97.188.192"
        GIT_REPO = "https://github.com/pullstackdevv/kolegium-orthopaedi.git"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: "${GIT_REPO}"
            }
        }

        stage('Build Backend') {
            steps {
                sh '''
                cd backend
                composer install --no-interaction --prefer-dist
                php artisan migrate --force
                php artisan config:cache
                php artisan route:cache
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                sh '''
                cd frontend
                npm install
                npm run build
                '''
            }
        }

        stage('Deploy to VPS') {
            steps {
                sh '''
                rsync -avz --delete ./ root@${SERVER_IP}:${DEPLOY_PATH}
                ssh root@${SERVER_IP} "cd ${DEPLOY_PATH}/backend && php artisan migrate --force && systemctl restart php8.2-fpm nginx"
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployment berhasil ke ${DEPLOY_PATH}!"
        }
        failure {
            echo "❌ Deployment gagal, periksa log Jenkins."
        }
    }
}
