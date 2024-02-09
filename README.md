<p align="center">
  <img src="https://github.com/LaOuede/42-project-badges/blob/main/badges/ft_transcendencee.png" />
</p>

<h1 align=center>ft_transcendence</h1>

<h3 align=center>
  
  _Work in progress..._

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

This project is realized as a team effort with [demenciel](https://github.com/demenciel), [TwindZ](https://github.com/TwindZ) and [Prezcoder](https://github.com/Prezcoder) 🚀

</div>

---

<h2 align="left">Setup 🛠️</h2>

<div align="left">

To launch the project, simply run the `make up` command at the root of the project.

Access Django at: http://localhost:8000/

<b>PGADMIN:</b>

For a graphical interface to the database, we use pgAdmin.

1. After launching the dockers and everything is up and running, access pgAdmin on port 5050: http://localhost:5050

2. On the page, enter the credentials found in the `.env` file.

3. Once logged in, go to the "Add Server" tab.

4. In the "General" tab:
    - Name: `transcendance_db` (the name of the db)

5. In the "Connection" tab:
    - Hostname/address: `postgres` (the name of the container)
    - Username: database credentials from the `.env` file
    - Password: database credentials from the `.env` file

Then, submit to connect.

</div>

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

<h2 align="left">Basic Operations 📝</h2>

Here's a brief on the basic operations you can perform:

- **Starting the Project**:
  - Use the command `make up` which is configured in the `Makefile` to start the Docker containers.
  - Access the Django application at `http://localhost:8000`.

- **Interacting with the Database**:
  - The project uses PostgreSQL, and pgAdmin is configured for database interaction.
  - You can access pgAdmin at `http://localhost:5050` and log in using the credentials provided in the `.env` file.

- **Working with Static Files**:
  - Place all your CSS, JavaScript, and image assets in the `static/` directory.
  - Use Django's `{% static '' %}` template tag to include them in your HTML files.

- **Rendering Templates**:
  - Store your HTML templates in the `templates/` directory.
  - Use Django's `render` function in `views.py` to display these templates in the browser.

- **Making Changes**:
  - After updating the Docker configuration or the `Dockerfile`, rebuild the containers with `make build`.
  - Use `git` for version control. Commit changes with descriptive messages and push to the repository for collaboration.

Remember to keep your `.env` file secure and do not commit it to the version control system. It contains sensitive data that should not be shared publicly.

Feel free to update and expand this README as the project evolves.
