pipeline {
    agent any

    environment {
        DEPLOY_PATH = "/www/wwwroot/kolegium-orthopaedi"
        SERVER_IP = "31.97.188.192"
        GIT_REPO = "https://github.com/pullstackdevv/kolegium-orthopaedi.git"
        BRANCH = "main"
    }

    stages {
        stage('Deploy via SSH') {
            steps {
                sh '''
                echo "🚀 Connecting to VPS ${SERVER_IP} ..."
                ssh -o StrictHostKeyChecking=no root@${SERVER_IP} "
                    set -e
                    echo '📦 Navigating to ${DEPLOY_PATH} ...'
                    cd ${DEPLOY_PATH} || exit 1

                    echo '🔄 Pulling latest code...'
                    git fetch origin ${BRANCH} && git reset --hard origin/${BRANCH}

                    echo '🧩 Installing dependencies...'
                    composer install --no-interaction --prefer-dist --optimize-autoloader

                    echo '⚙️  Optimizing Laravel...'
                    php artisan migrate --force
                    php artisan config:cache
                    php artisan route:cache

                    echo '🧱 Building frontend...'
                    npm install
                    npm run build
                "
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployment berhasil ke ${DEPLOY_PATH} di VPS ${SERVER_IP}!"
        }
        failure {
            echo "❌ Deployment gagal. Periksa log Jenkins dan VPS."
        }
    }
}
