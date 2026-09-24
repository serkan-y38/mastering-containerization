# Dockerfile Structure & Instructions Reference

## 1. What is a Dockerfile & How it Works?
A `Dockerfile` is a plain text document containing all the sequential commands (instructions) a user could manually execute on the command line to build an image.

* Docker reads the instructions in this file to automatically assemble images.
* When you run the `docker build` command in the terminal, it processes the `Dockerfile` in your current directory and outputs a ready-to-use Docker Image.

## 2. Core Instructions

### `FROM`
Defines the base image for the `Dockerfile`. Every instruction that follows is applied on top of this base image.
* **Syntax:** `FROM <image>[:tag]`
* **Example:** `FROM ubuntu:22.04` (Pulls the official Ubuntu 22.04 base image).

### `WORKDIR`
Sets the active working directory for any `RUN`, `CMD`, `COPY`, `ADD`, and `ENTRYPOINT` instructions that follow it.
* **Auto-Creation:** If the specified directory does not exist, Docker creates it automatically (acts like `mkdir` + `cd`).
* **Why not use `RUN cd`?** Every `RUN` command executes in a newly spawned, isolated shell. A `RUN cd /app` command will not persist to the next line. `WORKDIR` makes the directory change persistent across all subsequent layers.
* **Best Practice:** Prevents polluting the root (`/`) directory and mixing application code with critical Linux system files (`/bin`, `/etc`).
* **Syntax:** `WORKDIR </path>`
* **Example:**
WORKDIR /usr/src/app
CMD ["python3", "main.py"]

### `COPY`
Copies files or directories from the host machine's filesystem (source) into the container's filesystem (destination).
* **The Build Context Rule:** `COPY` can *only* access files within the current build context (the directory where `docker build` is run). It cannot copy files from outside the context (e.g., `../`).
* **Syntax:** `COPY <src> <dest>`
* **Example:** `COPY app/utils /app/code/utils`

### `RUN`
Executes specified commands in a new image layer and commits the results. This happens during the **Build Time**.
* **Syntax:** `RUN <command>`
* **Example:** `RUN apt-get update && apt-get install -y nginx`

### `CMD`
Defines the default command or application that will execute when a container starts (Runtime). There should only be one `CMD` instruction in a `Dockerfile`.
* **Syntax:** `CMD ["executable", "param1", "param2"]`
* **Example:** `CMD ["java", "-jar", "app.jar"]`

### `EXPOSE`
Functions as documentation, informing Docker and developers which network ports the container will listen on at runtime. *(Note: It does not actually publish the port to the host; you still need `-p` during `docker run`).*
* **Syntax:** `EXPOSE <port>`
* **Example:** `EXPOSE 80 443` (Documents that both HTTP and HTTPS ports are used).

### `ENV`
Sets environment variables that persist both during the build process and when the container is running.
* **Overriding:** The `Dockerfile` sets the default values, but these can be overridden from the terminal during execution using `docker run -e KEY=VALUE`.
* **Syntax:** `ENV <key>=<value>`
* **Example & Shell Expansion:**
  ENV action=ping
  ENV target=8.8.8.8

  Requires "sh -c" for variable expansion ($action,$target) to work

  CMD ["sh", "-c", "exec $action$target"]

### `LABEL`
Adds metadata to an image. It does not affect the technical execution of the container but is crucial for documentation (author, version, environment). This data can be viewed using `docker inspect`.
* **Syntax:** `LABEL <key>="<value>"`
* **Example:** `LABEL Owner="DevOps Team" version="1.0" description="Backend"`

---

## 3. Essential Advanced Instructions

### `ENTRYPOINT`
Similar to `CMD`, but forces the container to behave like a specific executable. While `CMD` is easily overridden by adding arguments to `docker run`, `ENTRYPOINT` is strictly enforced.
* **Example:** `ENTRYPOINT ["java", "-jar", "app.jar"]`

### `ADD`
Functions exactly like `COPY`, but with two advanced "magic" features: it can automatically extract local `.tar` archives into the container, and it can download files directly from remote URLs.
* **Best Practice:** Use `COPY` for standard file transfers. Only use `ADD` when you explicitly need auto-extraction.

### `USER`
Sets the username or UID to use when running the image.
* **Best Practice:** By default, containers run as `root`. For security reasons, you should create a non-root user and switch to it using the `USER` instruction before executing the application.
* **Example:** `USER spring_user`

### `ARG`
Defines variables that users can pass at **Build Time** only (using `docker build --build-arg`). Unlike `ENV`, `ARG` variables are not accessible once the container is running.

### `VOLUME`
Creates a designated mount point and marks it as holding externally mounted volumes from native host or other containers. Used to persist database files or logs.
* **Example:** `VOLUME ["/var/lib/mysql"]`

### `HEALTHCHECK`
Tells Docker how to test the container to check that it is still working.
* **Example:** `HEALTHCHECK CMD curl --fail http://localhost:8080/health || exit 1`

---

## 4. Layer Architecture & Optimization

### Image Layers
* Docker images are built from a series of layers.
* Each instruction in a `Dockerfile` (like `FROM`, `RUN`, `COPY`) maps to a specific read-only layer in the final image.
* **Inspection:** You can view the layered history and sizes of an image using the `docker history <image_name>` command.

### Dockerfile Optimization (Reducing Layer Count)
* **The Bad Practice (Multi-Layer):** Writing commands sequentially with separate `RUN` instructions (e.g., `RUN apt-get update` followed by `RUN apt-get install -y vim`) adds unnecessary layers and severely bloats the final image size.
* **The Golden Rule (Single Layer):** Chain multiple commands together under a single `RUN` instruction using the logical AND operator `&&` and the line continuation character `\`. This consolidates the entire operation into a single, optimized layer.

### Optimized execution:
  RUN apt-get update && \
  apt-get install -y vim curl && \
  apt-get clean

## 5. Building the Image
Once your `Dockerfile` is ready, you use the `docker build` command to create the actual image.

* **Standard Syntax:** `docker build [OPTIONS] PATH | URL | -`
* **The Build Context (`PATH`):** Defines the directory used as the source for the image build (usually `.`, meaning the current directory). Any file you want to `COPY` into the image must exist within this specific context directory.

### Key Build Flags
* `-t` (Tag): Assigns a name and optionally a version tag to the image (e.g., `-t myapp:1.0`).
* `-f` (File): Overrides the default behavior of looking for a file named explicitly `Dockerfile`. Used to specify a custom text file path.

### Build Examples
* **Standard Build:**
  `docker build -t image1 .`
  *(Reads the default `Dockerfile` in the current directory `.` and builds an image named `image1`)*
* **Custom File/Context Build:**
  `docker build -f files/test.txt -t image3 /imagefiles`
  *(Reads instructions from `files/test.txt` and uses `/imagefiles` as the isolated build context)*

## 6. Lifecycle & Advanced Layer Caching

### Build Time vs. Runtime
* **Build Time (`docker build`):** Docker reads the `Dockerfile` line by line. Each instruction (`FROM`, `RUN`, `COPY`) is converted into a **read-only layer** with a unique cryptographic hash.
* **Runtime (`docker run`):** When the container starts, Docker adds a single **Writable Container Layer** on top of the locked read-only image layers. Any file modifications (like `apt install`, creating logs, or deleting files) happen *only* in this top writable layer, keeping the base image completely isolated and pristine.

### Smart Caching Rules
If Docker detects a change in a specific layer, it automatically invalidates the cache for that layer and **all subsequent layers**.
* **The Golden Optimization Rule:** To ensure fast builds, place instructions that rarely change (like installing OS dependencies) at the top of the file. Place instructions that change frequently (like your application source code) at the very bottom.

## 7. Registry Naming Conventions & Pushing
To push an image to a remote repository (like Docker Hub or a private corporate server), Docker requires a strict naming template:
`[registry/][username_or_org/]repository[:tag]`

* **Registry (Optional):** The domain of the registry (e.g., `registry.mycorp.com`). If omitted, it defaults to Docker Hub.
* **Username / Org:** Your Docker Hub username (mandatory for custom images).
* **Repository & Tag:** The application's name and its version.

### Essential Registry Commands
* **Tagging for Docker Hub:**
  `docker tag image1 myusername/myapp:latest`
* **Pushing to Docker Hub:**
  `docker push myusername/myapp:latest`
