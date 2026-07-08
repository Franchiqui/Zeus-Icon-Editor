// Este script descargará el archivo ZIP personalizado de PocketBase
const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ZIP_URL = 'https://zeus-basedatos.fly.dev/api/files/pbc_936789771/ia4iek7i0b5qq4r/pocket_base_km8lp1ccdx_0al05ft6c0.zip';
const ZIP_NAME = 'pocketbase_custom.zip';

console.log('📥 Descargando archivo ZIP personalizado de PocketBase...');
console.log('🔗 URL:', ZIP_URL);

async function downloadAndExtract() {
  try {
    // Ensure we're in the correct directory (pocket-base)
    const pocketBaseDir = process.cwd();
    console.log('📂 Working directory:', pocketBaseDir);

    // Check if PocketBase files already exist
    const pocketBaseExecutable = path.join(pocketBaseDir, process.platform === 'win32' ? 'pocketbase.exe' : 'pocketbase');
    if (fs.existsSync(pocketBaseExecutable)) {
      console.log('✅ PocketBase already exists, skipping download');
      return;
    }

    // Create the file stream for download
    const file = fs.createWriteStream(path.join(pocketBaseDir, ZIP_NAME));
    
    // Download the file
    await new Promise((resolve, reject) => {
      const request = https.get(ZIP_URL, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error('Error al descargar el archivo: ' + response.statusCode));
          return;
        }
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          resolve(true);
        });
      });
      
      request.on('error', (err) => {
        reject(new Error('Error en la descarga: ' + err.message));
      });
    });
    
    console.log('✅ Descarga completada');
    console.log('📦 Extrayendo archivos...');
    
    // Extraer el archivo ZIP
    console.log('📦 Iniciando extracción...');
    if (process.platform === 'win32') {
      console.log('🖥️  Sistema Windows detectado');
      try {
        // Fixed PowerShell command with proper quote escaping
        execSync('powershell -Command "Expand-Archive -Path \'' + ZIP_NAME + '\' -DestinationPath \'.\' -Force"', { stdio: 'inherit' });
        console.log('✅ Extracción en Windows completada');
      } catch (winError) {
        console.error('❌ Error en extracción Windows:', winError.message);
        throw new Error('Falló la extracción en Windows');
      }
    } else {
      console.log('🐧 Sistema Unix/Linux/Mac detectado');
      try {
        execSync('unzip -o "' + ZIP_NAME + '" -d "."', { stdio: 'inherit' });
        console.log('✅ Extracción en Unix completada');
      } catch (unixError) {
        console.error('❌ Error en extracción Unix:', unixError.message);
        throw new Error('Falló la extracción en Unix');
      }
    }
    
    // Handle nested directory structure from ZIP extraction
    const extractedPocketBaseDir = path.join(pocketBaseDir, 'pocket-base');
    if (fs.existsSync(extractedPocketBaseDir)) {
      console.log('🔄 Moving files from nested pocket-base directory...');
      
      // Copy all files from nested directory to current directory
      const files = fs.readdirSync(extractedPocketBaseDir);
      files.forEach(file => {
        const sourcePath = path.join(extractedPocketBaseDir, file);
        const destPath = path.join(pocketBaseDir, file);
        
        // Remove destination if it exists
        if (fs.existsSync(destPath)) {
          if (fs.lstatSync(destPath).isDirectory()) {
            fs.rmSync(destPath, { recursive: true, force: true });
          } else {
            fs.unlinkSync(destPath);
          }
        }
        
        // Move file/directory
        fs.renameSync(sourcePath, destPath);
        console.log('  📄 Moved:', file);
      });
      
      // Remove the now empty nested directory
      fs.rmdirSync(extractedPocketBaseDir);
      console.log('🗑️  Removed temporary nested directory');
    }
    
    // Eliminar el archivo ZIP después de extraer
    try {
      const zipPath = path.join(pocketBaseDir, ZIP_NAME);
      if (fs.existsSync(zipPath)) {
        fs.unlinkSync(zipPath);
        console.log('🗑️  Archivo ZIP eliminado después de la extracción');
      } else {
        console.log('⚠️  Archivo ZIP no encontrado para eliminar');
      }
    } catch (deleteError) {
      console.warn('⚠️  No se pudo eliminar el archivo ZIP:', deleteError.message);
    }
    
    console.log('✅ Extracción completada');
    console.log('🚀 Archivos de PocketBase listos para usar');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Ejecutar la descarga y extracción
downloadAndExtract();
