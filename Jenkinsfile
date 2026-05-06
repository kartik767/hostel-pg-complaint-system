pipeline {
    agent any

    stages {

        stage('Build Backend Image') {
            steps {
                sh 'docker build -t hostel-backend ./backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh 'docker build -t hostel-frontend ./hostel-complaints'
            }
        }

        stage('Check Docker Images') {
            steps {
                sh 'docker images'
            }
        }
    }
}