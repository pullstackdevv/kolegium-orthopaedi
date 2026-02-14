pipeline {
    agent any

    environment {
        SERVER_IP = "31.97.188.192"
        GIT_REPO = "https://github.com/pullstackdevv/kolegium-orthopaedi.git"
    }

    stages {
        stage('Deploy via SSH') {
            steps {
                sh '''
                echo "🚀 Connecting to VPS ${SERVER_IP} ..."
                ssh -o StrictHostKeyChecking=no root@${SERVER_IP} << 'ENDSSH'
                    set -e

                    DEFAULT_DEPLOY_PATH="/www/wwwroot/kolegium-orthopaedi-staging"
                    DEFAULT_DEPLOY_BRANCH="staging"

                    # Try to load from /root/.env first (global config)
                    if [ -f "/root/.env" ]; then
                        echo "📄 Loading deployment config from /root/.env"
                        set -a
                        source /root/.env
                        set +a
                    fi

                    # Set defaults if not loaded from /root/.env
                    DEPLOY_PATH="${DEPLOY_PATH:-$DEFAULT_DEPLOY_PATH}"
                    DEPLOY_BRANCH="${DEPLOY_BRANCH:-$DEFAULT_DEPLOY_BRANCH}"

                    echo "📍 Deploy Path: ${DEPLOY_PATH}"
                    echo "🌿 Deploy Branch: ${DEPLOY_BRANCH}"
                    
                    echo "📦 Navigating to ${DEPLOY_PATH} ..."
                    cd ${DEPLOY_PATH} || exit 1

                    echo "🔄 Pulling latest code..."
                    git fetch origin ${DEPLOY_BRANCH} && git reset --hard origin/${DEPLOY_BRANCH}

                    echo "🧩 Installing dependencies..."
                    composer install --no-interaction --prefer-dist --optimize-autoloader

                    echo "⚙️  Optimizing Laravel..."
                    php artisan migrate --force
                    php artisan config:cache
                    php artisan route:cache

                    echo "🧱 Building frontend..."
                    npm install
                    npm run build
ENDSSH
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployment berhasil di VPS ${SERVER_IP}!"
        }
        failure {
            echo "❌ Deployment gagal. Periksa log Jenkins dan VPS."
        }
    }
}
