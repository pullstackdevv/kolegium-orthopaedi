pipeline {
    agent any

    environment {
        SERVER_IP = "31.97.188.192"
        GIT_REPO = "https://github.com/pullstackdevv/kolegium-orthopaedi.git"
        REMOTE_ENV_FILE = "/www/wwwroot/kolegium-orthopaedi-staging/.env"
    }

    stages {
        stage('Deploy via SSH') {
            steps {
                sh '''
                echo "🚀 Connecting to VPS ${SERVER_IP} ..."
                ssh -o StrictHostKeyChecking=no root@${SERVER_IP} <<'ENDSSH'
                    set -e

                    REMOTE_ENV_FILE="/www/wwwroot/kolegium-orthopaedi-staging/.env"
                    if [ ! -f "$REMOTE_ENV_FILE" ]; then
                        echo "❌ Remote .env file not found at $REMOTE_ENV_FILE"
                        exit 1
                    fi

                    # Load deployment configuration from remote .env
                    set -a
                    . "$REMOTE_ENV_FILE"
                    set +a

                    if [ -z "$DEPLOY_PATH" ] || [ -z "$DEPLOY_BRANCH" ]; then
                        echo "❌ DEPLOY_PATH or DEPLOY_BRANCH is not set in $REMOTE_ENV_FILE"
                        exit 1
                    fi

                    echo "📦 Navigating to ${DEPLOY_PATH} ..."
                    cd "${DEPLOY_PATH}" || exit 1

                    echo "🔄 Pulling latest code..."
                    git fetch origin "${DEPLOY_BRANCH}" && git reset --hard "origin/${DEPLOY_BRANCH}"

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
            echo "✅ Deployment berhasil!"
        }
        failure {
            echo "❌ Deployment gagal. Periksa log Jenkins dan VPS."
        }
    }
}
