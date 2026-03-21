# Security Update Deployment Commands

## 1. Update Python Dependencies (CAD Engine)
cd cad-engine
pip install python-multipart==0.0.9 --upgrade
pip install -r requirements.txt --upgrade

## 2. Update Node.js Dependencies (Web App)
npm clean-install
npm audit fix --force

## 3. Verification Commands
npm audit --audit-level=high
pip show python-multipart

## 4. Security Check
npm run security:check
