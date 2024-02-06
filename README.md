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
