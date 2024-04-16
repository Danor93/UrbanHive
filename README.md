UrbanHive Project Maintenance Guide

Ensuring a consistent development environment is crucial for both building and maintaining the application effectively.

System Requirements:
CPU: A multi-core processor (Intel i5/i7/i9 or AMD equivalent) is recommended for efficient compilation and emulation, especially when using Android Studio and Xcode.
RAM: At least 8GB of RAM, though 16GB or more is preferred for better performance with multiple emulators and development tools running.
Storage: A solid-state drive (SSD) with at least 50GB of free space to handle the various installations and project files comfortably.

6.1 Client Project Setup

Development Environment Requirements:

1. Node.js: The runtime environment for executing JavaScript code outside of a browser. Download and install from https://nodejs.org.
2. Visual Studio Code: Integrated Development Environment (IDE) for editing and managing the project files. Available at https://code.visualstudio.com/
3. Expo CLI: A command-line tool that enables you to work with Expo apps. Install globally using npm:
   npm install -g expo-cli

4. Android Studio: Provides an Android emulator for simulating Android devices. Download at https://developer.android.com/studio
5. Xcode: Necessary for iOS development, providing tools and the iOS simulator. Available on the Mac App Store : Xcode on Mac Store

Running the Client:
1.Before running the client application, it is essential to install all necessary dependencies:
npm install

or, if you prefer using Yarn:

yarn install

This step ensures that all the required packages are locally available to build and run the project.

2. To execute a development build for testing on emulators or real devices, use:
   eas build --platform android --profile development
   or to build a development build for ios:
   eas build --platform ios --profile development
   then you will get a url for install it on the device

- you need an expo account for this https://expo.dev/

3. To start the client application after install the development build, use the following command in the terminal:
   npx expo start
   This command initializes the Expo development server and provides a QR code to open the project on a physical device and options to run it on Android or iOS simulators.
   -The client is configured to communicate with the server running on localhost:5000.
   If there are network issues while the server is running, the base URL can be adjusted in the config/config.js file based on the ip address that shows when running the server (in pycharm or terminal).

Server Project Setup

Development Environment Requirements:

1. Python: Install Python from https://python.org to run the server-side code.
2. PyCharm: A Python IDE by JetBrains, optimal for managing Python-based applications. Download at https://www.jetbrains.com/pycharm/
3. MongoDB Atlas: A cloud database service to host and manage your MongoDB database. Register and configure at https://www.mongodb.com/cloud/atlas

Server Dependencies:

- Before running the server, ensure all dependencies are installed. Setup a virtual environment and install packages from `requirements.txt`:  
  python -m venv venv
  source venv/bin/activate # On Unix/macOS
  venv\Scripts\activate # On Windows
  pip install -r requirements.txt

Running the Server:

- Launch the Flask application using:
  flask run
  This command starts the server on the local machine, accessible via `localhost` on the configured port 5000.
  or open the project in pycharm and set up an interpreter and run it from there.

Contact Information:
Email : urbanHive@gmail.com
GitHub : https://github.com/Danor93

Contribution to Maintenance:
Any contributions you make are greatly appreciated. If you have a suggestion that would make the application better, please follow these steps:
1.Fork the repository.
2.Create your feature branch (e.g., ‘git checkout -b feature/your-feature-name‘).
3.Commit your changes (‘git commit -am ’Add some feature’‘).
4.Push to the branch (‘git push origin feature/your-feature-name‘).
5.Open a pull request.

Alternatively, you can simply open an issue with the tag "enhancement". Your contributions will be reviewed and merged to improve the application.
