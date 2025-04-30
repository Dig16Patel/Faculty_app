import { exec } from 'child_process';
import { platform } from 'os';

const isWindows = platform() === 'win32';

const checkMongoDB = () => {
  console.log('Checking MongoDB installation...');
  
  const command = isWindows 
    ? 'mongod --version'
    : 'mongod --version';

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('MongoDB is not installed or not in PATH');
      console.log('\nTo install MongoDB:');
      console.log('1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community');
      console.log('2. Run the installer');
      console.log('3. Choose "Complete" installation');
      console.log('4. Install MongoDB Compass (optional but recommended)');
      console.log('\nAfter installation:');
      console.log('1. Open Services (services.msc)');
      console.log('2. Find "MongoDB" service');
      console.log('3. Right-click and select "Start"');
      return;
    }

    console.log('MongoDB is installed!');
    console.log(stdout);
    
    // Check if MongoDB service is running
    const serviceCommand = isWindows
      ? 'net start MongoDB'
      : 'systemctl status mongodb';

    exec(serviceCommand, (error, stdout, stderr) => {
      if (error) {
        console.log('\nMongoDB service is not running. Starting it...');
        const startCommand = isWindows
          ? 'net start MongoDB'
          : 'sudo systemctl start mongodb';
        
        exec(startCommand, (error, stdout, stderr) => {
          if (error) {
            console.error('Failed to start MongoDB service:', error);
            console.log('\nPlease start MongoDB service manually:');
            console.log('1. Open Services (services.msc)');
            console.log('2. Find "MongoDB" service');
            console.log('3. Right-click and select "Start"');
            return;
          }
          console.log('MongoDB service started successfully!');
        });
      } else {
        console.log('\nMongoDB service is running!');
      }
    });
  });
};

checkMongoDB(); 