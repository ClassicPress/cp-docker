# CP Docker
CP Docker is a local development environment focuses on ClassicPress.

## Table of Content
1. [Overview](https://github.com/benlumia007/cp-docker#overview)
2. [Requirements](https://github.com/benlumia007/cp-docker#requirements)
3. [Getting Started](https://github.com/benlumia007/cp-docker#getting-started)
4. [How to Begin](https://github.com/benlumia007/cp-docker#how-to-begin)
5. [Resources](https://github.com/benlumia007/cp-docker#resources)
6. [Important Information](https://github.com/benlumia007/cp-docker#important-information)

## Overview
Sturdy Docker is an easy and automate local development environment for ClassicPress, WordPress and PHP applications that works on Linux, macOS, and Windows 10 with Windows Subsystem Linux 2.

## Requirements
* [Docker Desktop for Windows](https://docs.docker.com/desktop/windows/install), [Docker Desktop for Mac](https://docs.docker.com/desktop/mac/install), or [Docker for Linux](https://docs.docker.com/engine/install)
* [WSL2](https://docs.microsoft.com/en-us/windows/wsl/), if you are on Windows 10 or Windows 11 (Ubuntu 20.04 LTS from Microsoft Store)

## Getting Started
Before you begin, I would like to point out one of the file that gets used often, and that file is <code>custom.yml</code> and when you docker up for the first time, it will then duplicate <code>default.yml</code> to <code>custom.yml</code> inside of the global folder and it will use that to generate any sites you want. By default, the only sites that gets create is the ClassicPress and WordPress.
<pre>
sites:
  classicpress:
    provision: true
    repo: https://github.com/benlumia007/cp-docker-sites.git
    host:
      - classicpress.test
    custom:
      php: 7.4
      type: ClassicPress
      plugins:
        - query-monitor
      constants:
        - DISALLOW_FILE_EDIT
        - WP_DEBUG
        - WP_DEBUG_DISPLAY
</pre>

### Supressing prompts for elevating privileges
To allow docker and wsl2 to automatically update the hosts file without asking for a sudo password, add one of the following snippets to a new sudoers file.

### Allow passwordless (Linux environments)
The most easiest way to achieve powerless sudo is to add your user to the sudoers with no password and it works with Linux and macOS, by using sudo visudo.

<pre>username ALL=(ALL:ALL) NOPASSWD:ALL</pre>

### Windows: UAC Prompt
You can use cacls or icacls to grant your user account permanent write permission to the system's hosts file. You have to open an elevated command prompt; hold ❖ Win and press X, then choose "Command Prompt (Admin)"

<pre>
cacls %SYSTEMROOT%\system32\drivers\etc\hosts /E /G username:w
</pre>

## How to Begin
To begin, use git to clone the repository to anywhere
<pre>
git clone git@github.com:benlumia007/cp-docker.git .dev
</pre>
I would like to keep this simple so I'm going to clone the repository to a folder called WordPress and navigate to the folder
<pre>
cd .dev
</pre>

At this point, since all the volumes has been set already in the `docker-compose.yml` file, you don't need to do anything from here so to get started, please use the following command
<pre>
sudo npm install
sudo npm link
</pre>
You should now have some few options by typing `sturdydocker -v` or `sturdydocker --version` and you will see the following options
<pre>
Usage: sturdydocker [command]

Commands:

init        Create intial custom file
provision   Creae new site or sites
restart     Restart server container
shell       Bash shell for server container
start       Start server container
stop        Stop server container
up          Start server container
down        Destroy server container
pull        Pull image for server container
logs        Fetch log for server container

Run 'sturdydocker [command] help' for more information on a command.
</pre>
The first thing you want to do is `sturdydocker pull` to pull the main image or you can just do a `sturdydocker up` to automatically pull down the image needed.

### Provision
Let's begin provisioning by using the command `sturdydocker provision`. This will provision the following
<pre>
- dashboard
- sites
- resources
  - phpmyadmin
  - tls-ca 
</pre>

## Resources
In the <code>custom.yml</code> file, there is a section where you will see 
<pre>
resources:
  - phpmyadmin
  - tls-ca
</pre>
This is where any resources will go so that it will generated any resources that comes with. At this time, only phpMyAdmin and TLS-CA is included since the project itself will be using https rather than http for connection. As for the certificates, it will generate a root ca and the rest for sites. You should only need to install the ca.crt and it should be SSL ready. 

## So What's Included
When you look at the docker-compose.yml file in the .global folder, you will see only one image that takes care of all of your needs when doing development. Rather than setting up multiple services. I have managed to setup one image for all. This includes the following.
<pre>
1. Apache (2.4.41)
2. MariaDB 10.5
3. PHP 7.4 and 8.1
4. MailCatcher
5. phpMyadmin
</pre>

### Apache2
I decided to use Apache2 as default just because is a lot easier to maintain and easier to configure. At this moment. Sturdy Docker is using Apache 2.4.41. Please note that https is enabled by default so this means that when you create a new site for any project. HTTP will get redirected to HTTPS automatically so make sure to setup your certificates after doing a provision which is located in the certificates folder. Please use ca.crt (root certificate) and install.

### MariaDB
I have decided to move from MySQL to MariaDB just because.

### PHP 8.1
At this momemet, php 8.1 is set by default for all sites that gets created. As for ClassicPress and WordPress is defaulted to PHP 7.4 since they are not fully compatiible.

<pre>
custom:
  type: WordPress
  php: 7.4
</pre>

### MailHog
Sturdy Docker supports MailHog which can be use under http://localhost:8025 or http://dashboard.test:8025

## Important Information
Here are some important information that you will need to know such as credientials

### ClassicPress
When working with ClassicPress, the username and password is
<pre>
username: admin
password: password
</pre>

To add a new ClassicPress, copy and paste this to custom.yml, and make sure the spacing is correct due to yaml rules
<pre>
  example:
    provision: true
    repo: https://github.com/benlumia007/cp-docker-sites.git
    host:
      - example.test
    custom:
      php: 7.4
      type: ClassicPress
      plugins:
        - query-monitor
      constants:
        - DISALLOW_FILE_EDIT
        - WP_DEBUG
        - WP_DEBUG_DISPLAY
</pre>

### WordPress
When working with WordPress, the username and password is
<pre>
username: admin
password: password
</pre>

To add a new WordPress, copy and paste this to custom.yml, and make sure the spacing is correct due to yaml rules
<pre>
  example:
    provision: true
    repo: https://github.com/benlumia007/cp-docker-sites.git
    host:
      - example.test
    custom:
      php: 7.4
      type: WordPress
      plugins:
        - query-monitor
      constants:
        - DISALLOW_FILE_EDIT
        - WP_DEBUG
        - WP_DEBUG_DISPLAY
</pre>

### MySQL
<pre>
username: root
password: root

username: classicpress
password: classicpress

username: wordpress
password: wordpress
</pre>