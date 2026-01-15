pipeline {
    agent any

    environment {
        SERVER_IP = "31.97.188.192"
        GIT_REPO = "https://github.com/pullstackdevv/kolegium-orthopaedi.git"    }

    stages {
        stage('Deploy via SSH') {
            steps {
                sh '''
                echo "🚀 Connecting to VPS ${SERVER_IP} ..."
                ssh -o StrictHostKeyChecking=no root@${SERVER_IP} "
                    set -e
                    echo '📦 Navigating to ${env.DEPLOY_PATH} ...'
                    cd ${env.DEPLOY_PATH} || exit 1

                    echo '🔄 Pulling latest code...'
                    git fetch origin ${env.BRANCH} && git reset --hard origin/${env.BRANCH}

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
            echo "✅ Deployment berhasil ke ${env.DEPLOY_PATH} di VPS ${env.SERVER_IP}!"
        }
        failure {
            echo "❌ Deployment gagal. Periksa log Jenkins dan VPS."
        }
    }
}
