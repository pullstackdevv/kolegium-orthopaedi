sh '''
echo "🚀 Connecting to VPS ${SERVER_IP} ..."
ssh -o StrictHostKeyChecking=no root@${SERVER_IP} << 'ENDSSH'
    set -e

    # === PILIH FOLDER TARGET DI SINI ===
    # Misalnya mau production:
    BASE_PATH="/www/wwwroot/kolegium-orthopaedi"
    # Kalau mau staging, ganti ke:
    # BASE_PATH="/www/wwwroot/kolegium-orthopaedi-staging"

    if [ ! -f "${BASE_PATH}/.env" ]; then
        echo "❌ .env not found in ${BASE_PATH}"
        exit 1
    fi

    echo "📄 Loading env from ${BASE_PATH}/.env"

    set -a
    source "${BASE_PATH}/.env"
    set +a

    if [ -z "${DEPLOY_PATH}" ]; then
        echo "❌ DEPLOY_PATH is not set in .env"
        exit 1
    fi

    if [ -z "${DEPLOY_BRANCH}" ]; then
        echo "❌ DEPLOY_BRANCH is not set in .env"
        exit 1
    fi

    echo "📦 Navigating to ${DEPLOY_PATH} ..."
    cd "${DEPLOY_PATH}"

    echo "🔄 Pulling latest code from branch ${DEPLOY_BRANCH} ..."
    git fetch origin "${DEPLOY_BRANCH}"
    git reset --hard "origin/${DEPLOY_BRANCH}"

    echo "🧩 Installing dependencies..."
    composer install --no-interaction --prefer-dist --optimize-autoloader

    echo "⚙️ Optimizing Laravel..."
    php artisan migrate --force
    php artisan config:cache
    php artisan route:cache

    echo "🧱 Building frontend..."
    npm install
    npm run build
ENDSSH
'''
