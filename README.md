<p align="center">
  <img src="https://github.com/LaOuede/42-project-badges/blob/main/badges/ft_transcendencee.png" />
</p>

<h1 align=center>ft_transcendence</h1>

<h3 align=center>

</h3>

<div align=center>

The <b>ft_transcendance</b> is a collaborative project at 42 School, involving the development of a website. Users are able to create accounts through the 42 API, engage in real-time multiplayer Pong games, and communicate through both public and private chat rooms.

</div>

<div align="center">

Go to [42 Québec](https://42quebec.com/) to discover the course ! 👈
</div>

---

<h3 align="center">Collaborators 👨🏼‍🚀</h3>

<div align="center">

This project has been realized as a team effort with [acouture](https://github.com/demenciel), [emlamoth](https://github.com/TwindZ), [fbouchar](https://github.com/Prezcoder) and [kmehour](https://github.com/Mehourka) 🚀

</div>

---

<h3 align="left">Setup 🛠️</h3>

<div align="left">

To launch the project, simply :
  - Use the command `make` which is configured in the `Makefile` to start the Docker containers.
  - Access the Django application at `http://localhost`.

## Project Structure 📂

The project is structured as follows:

- `nginx/`: Contains the configuration files for the Nginx server which acts as a reverse proxy to our Django application.
- `transcendance/`: The main Django project directory.
  - `static/`: This directory holds all the static files for the project like CSS, JavaScript, and image files.
  - `templates/`: Contains the HTML template files. These are the front-end files that will be rendered and sent to the client's browser.
  - `tools/`: Includes various utility scripts and tools for the project.
  - `__init__.py`: An empty file that tells Python that this directory should be considered a Python package.
  - `asgi.py`: Entry-point for ASGI-compatible web servers to serve your project.
  - `settings.py`: Contains all the configuration for your Django project.
  - `urls.py`: The URL declarations for this Django project; a “table of contents” of your Django-powered site.
  - `views.py`: Contains the functions and classes that handle what data is displayed in each HTML template.
  - `wsgi.py`: An entry-point for WSGI-compatible web servers to serve your project.
- `.env`: A file to keep all environment variables for the project. This includes secret keys and database configuration.
- `docker-compose.yml`: A YAML file defining services, networks, and volumes for a Docker application.
- `Dockerfile`: A text document that contains all the commands a user could call on the command line to assemble an image for Docker.
- `Makefile`: A simple way to manage the build process, in our case, a collection of shortcuts to manage Docker containers.
- `manage.py`: A command-line utility that lets you interact with this Django project in various ways.
- `README.md`: A markdown file containing information about the project setup, usage, and contribution guidelines.

---

<h3 align="left">Implemented Modules 📝</h3>

- Use a backend framework (Django)
- Use a database in the backend (PostgreSQL)
- Standard user management, authentication, users in tournaments
- Implement remote authentication
- Multiple players
- Game customization options
- Implement two-factor authentication (2FA) and JWT (JSON Web Tokens)
- Use of advanced 3D techniques (Three.js)
- Support for multiple languages (en, fr, es)

---

<h3 align="left">What we've learned 📚</h3>

Through this project, I've gained proficiency in:
- <b>Full Stack Web Development</b>:
  - Developing frontend using JavaScript, HTML and CSS and the backend using Django.
- <b>Real-time Communication</b>:
  - Implementing websockets for real-time data exchange and live interactions between clients.
- <b>User Authentication and Security</b>:
  - Integrating user authentication systems.
  - Implementing two-factor authentication (2FA).
  - Secure handling of JSON Web Tokens (JWT) for maintaining user sessions.
- <b>Database Management</b>:
  - Designing and managing databases using PostgreSQL.
  - Ensuring data integrity and security.
- <b>3D Graphics and Animation</b>:
  - Using Three.js for rendering 3D graphics in the browser.
  - Understanding basic principles of 3D modeling and animation.
- <b>Project Management and Collaboration</b>:
  - Utilizing version control systems like Git effectively in a team environment.
  - Employing agile development practices.
  - Managing project tasks and timelines using Git Project.

<div align="center">

---

Go to [42 Québec](https://42quebec.com/) to discover the course ! 👈
</div>

---

<div align="center">

This was the last project of the 42 common core!
</div>

