pipeline {
    agent any

    environment {
        SERVER_IP = "31.97.188.192"
    }

    stages {
        stage('Deploy via SSH') {
            steps {
                script {
                    // Deteksi branch yang memicu build
                    def gitBranch = env.GIT_BRANCH ?: sh(script: 'git rev-parse --abbrev-ref HEAD', returnStdout: true).trim()
                    
                    // Tentukan BASE_PATH berdasarkan branch
                    def basePath = ""
                    if (gitBranch == "main" || gitBranch == "origin/main") {
                        basePath = "/www/wwwroot/kolegium-orthopaedi"
                        echo "🎯 Detected PRODUCTION branch (main)"
                    } else if (gitBranch == "staging" || gitBranch == "origin/staging") {
                        basePath = "/www/wwwroot/kolegium-orthopaedi-staging"
                        echo "🎯 Detected STAGING branch (staging)"
                    } else {
                        error("❌ Unknown branch: ${gitBranch}. Only 'main' and 'staging' are allowed.")
                    }
                    
                    echo "📍 Base Path: ${basePath}"
                    
                    sh """
                    echo "🚀 Connecting to VPS ${SERVER_IP} ..."
                    ssh -o StrictHostKeyChecking=no root@${SERVER_IP} << 'ENDSSH'
                        set -e

                        # BASE_PATH ditentukan oleh Jenkins berdasarkan branch
                        BASE_PATH="${basePath}"

                        echo "📂 Target deployment folder: \${BASE_PATH}"

                        # Validasi: Pastikan folder BASE_PATH ada
                        if [ ! -d "\${BASE_PATH}" ]; then
                            echo "❌ ERROR: Folder \${BASE_PATH} tidak ditemukan di VPS!"
                            exit 1
                        fi

                        # Validasi: Pastikan .env ada di BASE_PATH
                        if [ ! -f "\${BASE_PATH}/.env" ]; then
                            echo "❌ ERROR: File .env tidak ditemukan di \${BASE_PATH}!"
                            echo "💡 Pastikan file .env sudah dibuat dengan DEPLOY_PATH dan DEPLOY_BRANCH"
                            exit 1
                        fi

                        # Load .env dari BASE_PATH (BUKAN dari /root/.env)
                        echo "📄 Loading deployment config from \${BASE_PATH}/.env"
                        set -a
                        source "\${BASE_PATH}/.env"
                        set +a

                        # Validasi: DEPLOY_PATH harus terisi
                        if [ -z "\${DEPLOY_PATH}" ]; then
                            echo "❌ ERROR: DEPLOY_PATH tidak ditemukan di \${BASE_PATH}/.env"
                            exit 1
                        fi

                        # Validasi: DEPLOY_BRANCH harus terisi
                        if [ -z "\${DEPLOY_BRANCH}" ]; then
                            echo "❌ ERROR: DEPLOY_BRANCH tidak ditemukan di \${BASE_PATH}/.env"
                            exit 1
                        fi

                        # Validasi: DEPLOY_PATH dari .env harus sama dengan BASE_PATH
                        if [ "\${DEPLOY_PATH}" != "\${BASE_PATH}" ]; then
                            echo "❌ ERROR: DEPLOY_PATH di .env (\${DEPLOY_PATH}) tidak sama dengan BASE_PATH (\${BASE_PATH})"
                            echo "💡 Ini mencegah deploy ke folder yang salah!"
                            exit 1
                        fi

                        echo "✅ Validation passed"
                        echo "📍 Deploy Path: \${DEPLOY_PATH}"
                        echo "🌿 Deploy Branch: \${DEPLOY_BRANCH}"
                        
                        # Navigasi ke folder deployment
                        echo "📦 Navigating to \${DEPLOY_PATH} ..."
                        cd "\${DEPLOY_PATH}" || exit 1

                        # Pull latest code dari branch yang benar
                        echo "🔄 Pulling latest code from branch \${DEPLOY_BRANCH}..."
                        git fetch origin "\${DEPLOY_BRANCH}"
                        git reset --hard "origin/\${DEPLOY_BRANCH}"

                        # Install PHP dependencies
                        echo "🧩 Installing PHP dependencies..."
                        composer install --no-interaction --prefer-dist --optimize-autoloader

                        # Run Laravel optimizations
                        echo "⚙️  Running Laravel migrations and optimizations..."
                        php artisan migrate --force
                        php artisan config:cache
                        php artisan route:cache

                        # Install and build frontend
                        echo "🧱 Installing and building frontend assets..."
                        npm install
                        npm run build

                        echo "✅ Deployment completed successfully!"
ENDSSH
                    """
                }
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
