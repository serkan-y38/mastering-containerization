# Docker Compose

## 1. What is Docker Compose?

Docker Compose is an official tool designed to define, run, and manage multi-container Docker applications.
Instead of executing long, error-prone `docker run` commands for each individual container, Compose allows you to manage
an entire architecture (e.g., Frontend, Backend, Database) simultaneously on a single host machine.

Compose manages the entire environment through a single, declarative YML file (`docker-compose.yml`).

* All architectural components (services, networks, volumes) and their dependencies are defined hierarchically.
* It can dynamically `build` custom images from local `Dockerfile`s or `pull` ready-made images directly from remote
  registries like Docker Hub.

## 2. File Structure & Hierarchy

### Root Level

YML relies on indentation. At the outermost level (no indentation), we declare the main building blocks:

* **`services:`** The primary block where all individual containers (e.g., `web`, `api`, `db`) are defined.
* **`volumes:`** The root block used to declare named persistent storage areas that can be shared or attached to
  services.
* **`networks:`** The root block to define custom isolated networks for the architecture.

### Service Definitions & Local DNS

Directly under the `services:` block, you define the names of your containers (e.g., `frontend:`, `database:`).

* **Crucial Detail:** These are not just random labels. Docker Compose uses these exact names to automatically configure
  an **Embedded DNS**. A backend service can connect to a database service simply by pinging the hostname `database`,
  completely eliminating the need for hardcoded IP addresses.

### Service Configurations

Under each service, you define exactly how that specific container should behave:

* **`image:`** Tells Compose to pull a pre-built image from a registry (e.g., `image: mysql:8`).
* **`build:`** Tells Compose to build the image locally.
    * Standard: `build: .` (Looks for a `Dockerfile` in the current directory).
    * Advanced:

```yaml
      build:
        context: ./app
        dockerfile: Dockerfile.dev
```

    (Specifies a precise path and filename.)

* **`container_name:`** Overrides Compose's default naming convention (`projectname_servicename_1`) with a fixed, custom
  name.
* **`ports:`** Maps host ports to container ports (Syntax: `"HostPort:ContainerPort"`). Analogous to the `-p` flag.
* **`volumes:`** Mounts persistent data. Can be a Named Volume or a Host Bind Mount (Syntax:
  `- volumeName:/containerPath`).
* **`environment:`** Injects necessary environment variables (like DB passwords or API keys) into the container.
  Analogous to the `-e` flag.
* **`depends_on:`** Dictates the startup sequence. Setting `depends_on: - database` under a backend service ensures
  Compose starts the database *before* attempting to start the backend.

---

## 3. Essential Docker Compose CLI Commands

### Build & Start Operations

* **`docker compose build`**: Reads the YML file and builds the images for all services that have a `build:` directive.
  It does *not* start the containers.
* **`docker compose up`**: The core command. It builds images (if they don't exist), pulls missing images, and starts
  all containers in the correct dependency order. *(Note: This locks your terminal to stream logs).*
* **`docker compose up -d` (Enterprise Standard):** The `-d` (detached) flag starts the entire architecture silently in
  the background, returning control of the terminal to you.
* **`docker compose -f <filename.yml> up -d`**: Used to target a specific Compose file if it is not named the default
  `docker-compose.yml` (e.g., for testing or staging environments).
* **`docker compose run <service_name>`**: Boots up *only* one specific service from the YML file rather than the entire
  architecture.

### Stopping the System

* **`docker compose down`**: Stops and completely removes all containers and networks created by `up`. **Crucially, it
  leaves your persistent Volumes intact**, keeping your database data safe.
* **`docker compose down --volumes` (Destructive):** Stops containers and *destroys* all defined named volumes. This
  completely wipes the system back to factory settings (data loss).
* **`docker compose down --remove-orphans`**: Cleans up lingering background containers that were removed from the YML
  file but are still running as zombies.
* **`docker compose down --volumes --remove-orphans`**: The ultimate option to completely eradicate the entire
  environment and all its data with zero traces left.

### Monitoring & Management

* **`docker compose ps`**: Lists the current status (Up or Exited) and exposed ports of all services related to the
  current YML file.
* **`docker compose logs -f`**: Streams the live background logs of the entire system. You can also append a service
  name (e.g., `docker compose logs -f api`) to isolate logs for a single container. Great for debugging.
* **`docker compose stop` / `docker compose start`**: Pauses and resumes the containers without actually deleting them (
  unlike `down`).