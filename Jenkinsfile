pipeline {
    agent any

    environment {
        REGISTRY_HOST_CREDENTIALS_ID = "docker-registry-host"
        REGISTRY_USERNAME_CREDENTIALS_ID = "docker-registry-username"
        REGISTRY_PASSWORD_CREDENTIALS_ID = "docker-registry-credentials"

        GIT_CREDENTIALS_ID = "github-pat-gitops"

        IMAGE_NAME = "pare-moments"
        APP_NAME = "pare-moments"
        GITOPS_REPO_URL = "https://github.com/Ganiramadhan/gitops.git"
        GITOPS_MANIFEST_PATH = "apps/pare-moments/deploy.yaml"
        GITOPS_BRANCH = "main"
        GITOPS_DIR = "gitops-repo"

        DOCKER_BUILDKIT = "1"
    }

    options {
        disableConcurrentBuilds()
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '15', artifactNumToKeepStr: '5'))
        timeout(time: 30, unit: 'MINUTES')
        skipStagesAfterUnstable()
    }

    triggers {
        pollSCM('H/2 * * * *')
    }

    stages {
        stage('Checkout') {
            when {
                branch 'main'
            }
            steps {
                checkout scm
            }
        }

        stage('Initialize') {
            when {
                branch 'main'
            }
            steps {
                script {
                    env.GIT_COMMIT_SHORT = sh(
                        returnStdout: true,
                        script: 'git rev-parse --short HEAD 2>/dev/null || echo unknown'
                    ).trim()
                    env.IMAGE_TAG = "${env.BUILD_NUMBER}-${env.GIT_COMMIT_SHORT}"
                    env.LOCAL_IMAGE = "${env.IMAGE_NAME}:${env.IMAGE_TAG}"
                    env.LOCAL_LATEST = "${env.IMAGE_NAME}:latest"
                    env.SKIP_PIPELINE = sh(
                        returnStdout: true,
                        script: 'git log -1 --pretty=%B | grep -qF "[skip ci]" && echo true || echo false'
                    ).trim()
                    if (env.SKIP_PIPELINE == 'true') {
                        echo "Last commit contains [skip ci] (GitOps manifest bump); skipping remaining stages."
                    }

                    echo """
Build Configuration
-------------------
Branch      : ${env.BRANCH_NAME}
Commit      : ${env.GIT_COMMIT_SHORT}
Image       : ${env.IMAGE_NAME}:${env.IMAGE_TAG}
Latest      : ${env.IMAGE_NAME}:latest
Registry    : configured by Jenkins credentials
Remote      : configured by Jenkins credentials
GitOps repo : ${GITOPS_REPO_URL} (${GITOPS_MANIFEST_PATH})
"""
                }
            }
        }

        stage('Validate Configuration') {
            when {
                allOf {
                    branch 'main'
                    expression { env.SKIP_PIPELINE != 'true' }
                }
            }
            steps {
                withCredentials([
                    string(credentialsId: "${REGISTRY_HOST_CREDENTIALS_ID}", variable: 'REGISTRY'),
                    string(credentialsId: "${REGISTRY_USERNAME_CREDENTIALS_ID}", variable: 'DOCKER_USER'),
                    string(credentialsId: "${REGISTRY_PASSWORD_CREDENTIALS_ID}", variable: 'DOCKER_PASS')
                ]) {
                    sh '''
                        set -euo pipefail
                        set +x

                        for name in REGISTRY DOCKER_USER DOCKER_PASS; do
                            eval "value=\\${$name:-}"
                            if [ -z "$value" ]; then
                                echo "ERROR: required Jenkins credential value $name is empty." >&2
                                exit 1
                            fi
                        done

                        case "$REGISTRY" in
                            http://*|https://*)
                                echo "ERROR: docker-registry-host must not include http:// or https://." >&2
                                exit 1
                                ;;
                        esac

                        # Static site: no application secrets are needed at build or deploy time.
                    '''
                }
            }
        }

        stage('Build Image') {
            when {
                allOf {
                    branch 'main'
                    expression { env.SKIP_PIPELINE != 'true' }
                }
            }
            steps {
                sh '''
                    set -euo pipefail

                    docker build \
                        --file Dockerfile \
                        --tag "$LOCAL_IMAGE" \
                        --tag "$LOCAL_LATEST" \
                        --label "org.opencontainers.image.revision=$GIT_COMMIT_SHORT" \
                        --label "org.opencontainers.image.source=$JOB_NAME" \
                        --build-arg "VITE_SITE_URL=https://moments.ganipedia.com" \
                        --progress=plain \
                        .
                '''
            }
        }

        stage('Push Image') {
            when {
                allOf {
                    branch 'main'
                    expression { env.SKIP_PIPELINE != 'true' }
                }
            }
            steps {
                withCredentials([
                    string(credentialsId: "${REGISTRY_HOST_CREDENTIALS_ID}", variable: 'REGISTRY'),
                    string(credentialsId: "${REGISTRY_USERNAME_CREDENTIALS_ID}", variable: 'DOCKER_USER'),
                    string(credentialsId: "${REGISTRY_PASSWORD_CREDENTIALS_ID}", variable: 'DOCKER_PASS')
                ]) {
                    sh '''
                        set -euo pipefail
                        set +x

                        IMAGE_FULL="$REGISTRY/$IMAGE_NAME:$IMAGE_TAG"
                        IMAGE_LATEST="$REGISTRY/$IMAGE_NAME:latest"

                        docker tag "$LOCAL_IMAGE" "$IMAGE_FULL"
                        docker tag "$LOCAL_LATEST" "$IMAGE_LATEST"
                        printf '%s\\n' "$DOCKER_PASS" | docker login "$REGISTRY" -u "$DOCKER_USER" --password-stdin
                        docker push "$IMAGE_FULL"
                        docker push "$IMAGE_LATEST"
                        docker logout "$REGISTRY"
                    '''
                }
            }
        }

        stage('Update Manifest (GitOps)') {
            when {
                allOf {
                    branch 'main'
                    expression { env.SKIP_PIPELINE != 'true' }
                }
            }
            steps {
                withCredentials([
                    string(credentialsId: "${REGISTRY_HOST_CREDENTIALS_ID}", variable: 'REGISTRY'),
                    usernamePassword(credentialsId: "${GIT_CREDENTIALS_ID}", usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')
                ]) {
                    sh '''
                        set -euo pipefail
                        set +x

                        IMAGE_FULL="$REGISTRY/$IMAGE_NAME:$IMAGE_TAG"

                        ASKPASS_FILE="$(mktemp)"
                        GITOPS_ABS="$PWD/$GITOPS_DIR"
                        cleanup() { rm -f "$ASKPASS_FILE"; rm -rf "$GITOPS_ABS"; }
                        trap cleanup EXIT
                        cat > "$ASKPASS_FILE" << 'ENDASKPASS'
#!/bin/sh
case "$1" in
    Username*) printf '%s\\n' "$GIT_USER" ;;
    *) printf '%s\\n' "$GIT_TOKEN" ;;
esac
ENDASKPASS
                        chmod 700 "$ASKPASS_FILE"
                        export GIT_ASKPASS="$ASKPASS_FILE" GIT_TERMINAL_PROMPT=0

                        # Clone the separate GitOps repo; this application repo is never pushed to.
                        rm -rf "$GITOPS_DIR"
                        git clone --depth 1 --branch "$GITOPS_BRANCH" "$GITOPS_REPO_URL" "$GITOPS_DIR"
                        cd "$GITOPS_DIR"

                        git config user.name "jenkins-ci"
                        git config user.email "jenkins-ci@ganipedia.com"

                        if [ ! -f "$GITOPS_MANIFEST_PATH" ]; then
                            echo "ERROR: $GITOPS_MANIFEST_PATH not found in GitOps repo." >&2
                            exit 1
                        fi

                        sed -i.bak -E "s#^([[:space:]]*image:[[:space:]]*).*/?$IMAGE_NAME:.*#\\1$IMAGE_FULL#" "$GITOPS_MANIFEST_PATH"
                        rm -f "$GITOPS_MANIFEST_PATH.bak"

                        if ! grep -q "image: $IMAGE_FULL\$" "$GITOPS_MANIFEST_PATH"; then
                            echo "ERROR: could not set image tag in $GITOPS_MANIFEST_PATH." >&2
                            exit 1
                        fi

                        if git diff --quiet -- "$GITOPS_MANIFEST_PATH"; then
                            echo "Manifest already points to $IMAGE_FULL; nothing to commit."
                            exit 0
                        fi

                        git add "$GITOPS_MANIFEST_PATH"
                        git commit -m "chore: deploy $IMAGE_NAME:$IMAGE_TAG [skip ci]"

                        # Retry: another push to the GitOps repo may land between clone and push.
                        pushed=0
                        for i in 1 2 3 4 5; do
                            if git push origin "HEAD:$GITOPS_BRANCH"; then
                                pushed=1
                                break
                            fi
                            echo "Push rejected (attempt $i/5); rebasing onto latest $GITOPS_BRANCH and retrying."
                            sleep $((i * 2))
                            git pull --rebase origin "$GITOPS_BRANCH"
                        done
                        if [ "$pushed" -ne 1 ]; then
                            echo "ERROR: could not push manifest update after 5 attempts." >&2
                            exit 1
                        fi
                    '''
                }
            }
        }
    }

    post {
        always {
            sh '''
                docker image prune -f >/dev/null 2>&1 || true
            '''
        }
        success {
            echo "Image pushed and manifest updated: ${IMAGE_NAME}:${IMAGE_TAG}. Argo CD will sync the rollout."
        }
        failure {
            echo "Pipeline failed. Check Jenkins logs for details."
        }
    }
}
