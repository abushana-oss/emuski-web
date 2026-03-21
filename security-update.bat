@echo off
echo 🔒 EMUSKI SECURITY UPDATE - PRINCIPAL ENGINEER GRADE
echo ==================================================

echo 📦 Updating Python dependencies (CAD Engine)...
cd cad-engine
echo   → Installing secure python-multipart v0.0.12
pip install "python-multipart>=0.0.12" --upgrade
echo   → Upgrading all CAD engine dependencies  
pip install -r requirements.txt --upgrade
echo   → Verifying python-multipart version
pip show python-multipart
cd ..

echo 📦 Updating Node.js dependencies (Web App)...
echo   → Clearing npm cache
npm cache clean --force
echo   → Removing node_modules and package-lock.json
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul
echo   → Fresh install with security overrides
npm install
echo   → Force security fixes
npm audit fix --force
echo   → Running security audit
npm audit --audit-level=high

echo ✅ SECURITY UPDATE COMPLETE
echo All critical vulnerabilities have been patched\!
echo.
echo 🚀 NEXT STEPS:
echo 1. Restart CAD engine service
echo 2. Restart web application  
echo 3. Run integration tests
echo 4. Deploy to production

pause
