## Run Instructiones (on windows)

### DB run:
- Go to ./Provisioning/
- Unzip DatabaseExampe_RavenDB-5.3.100-windows-x64.zip, and go inside the unzipped folder.
- Right click on "run.ps1" and then click "run with powershell".
- The ravenDb server console (in powershell) and studio will be opened constantly.
![alt text](/README/RavenConsole.png?raw=true)
<br/>Dont close the console (powershell window).

### Composing microservice run (python):
- Go to ./Provisioning/PythonEnvSetup/
- Install python-3.7.0-amd64.exe (with 'PATH' option).
- Install the dependencies in requirements.txt file (by the cmd/powershell command pip ```install -r requirements.txt ```).
- Go to ./ComposeService/
- Run controller.py (by the cmd/powershell command ```python controller.py```).
![alt text](/README/ComposingServiceConsole.png?raw=true)
<br/>Dont close the console (cmd/powershell window).


### Web server run (nodejs):
- Download and install nodejs: https://nodejs.org/en/download/
- Go to ./WebServer/
- Run the server by the cmd/powershell command ```npm start```.
![alt text](/README/WebServerConsole.png?raw=true)
<br/>Dont close the console (cmd/powershell window).<br/><br/>


In the end you'll have 3 cmd/poweshell windows - 1 for each component in the project.
<br/>When you finish you can use the system by launch the site http://localhost:8080/ in your web browser.
![alt text](/README/WebLogin.png?raw=true)
![alt text](/README/WebIndex.png?raw=true)
