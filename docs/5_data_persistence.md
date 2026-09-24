# Docker Data Persistence & Volumes

## 1. The Need for Data Persistence
By design, containers are ephemeral (temporary) and stateless. When a container is deleted or rebuilt, all data stored inside its writable layer is permanently lost. Data persistence mechanisms are required for:
* **Preventing Data Loss:** Ensuring critical files, database records (e.g., MySQL, PostgreSQL), and logs survive even if the container crashes or is destroyed.
* **Data Sharing:** Enabling multiple containers to concurrently read from and write to a shared directory.
* **Architecture Decoupling:** Strictly separating the application logic (the immutable Image layer) from the user-generated state (the Data layer).

## 2. Storage Mechanisms (Volumes vs. Bind Mounts)

| Feature | Volumes | Bind Mounts |
| :--- | :--- | :--- |
| **Management** | Fully managed by Docker Daemon. | Managed by the Host OS file system. |
| **Location** | Stored in an isolated, protected Linux path: `/var/lib/docker/volumes/<name>/_data` | Any specified absolute path on the host (e.g., `/home/ubuntu/app`). |
| **Portability** | High. Works seamlessly across different OS environments. | Low. Highly dependent on the host machine's specific directory structure and permissions. |
| **Best For** | Database storage, shared container data. | Injecting source code from a developer's local machine into a container for live testing. |

## 3. Essential Volume CLI Commands
* **`docker volume create <name>`:** Creates a new, isolated named volume.
* **`docker volume ls`:** Lists all existing volumes on the host system.
* **`docker volume inspect <name>`:** Returns detailed JSON metadata. Crucial for finding the exact physical `Mountpoint` on the host machine.
* **`docker volume rm <name>`:** Deletes a specific volume. *(Note: Docker prevents deletion if the volume is currently attached to any container).*
* **`docker volume prune`:** Safely deletes all unused volumes simultaneously. Essential for freeing up disk space after heavy testing.

## 4. Mounting Volumes to Containers (`-v` vs. `--mount`)

### The Classic `-v` Syntax
The standard parameter for attaching volumes.
* **Syntax:** `-v <volume_name_or_host_path>:<container_path>[:options]`
* **Named Volume Example:** `docker run -v mysql_data:/var/lib/mysql mysql:8`
* **Bind Mount Example:** `docker run -v /home/ubuntu/db:/var/lib/mysql mysql:8`

### The Modern `--mount` Syntax
* **Syntax:** `--mount type=volume,source=<name>,target=<container_path>`
* **Example:** `docker run --mount type=volume,source=mysql_data,target=/var/lib/mysql mysql:8`

## 5. Advanced Volume Configurations
* **Read-Only Mode (`:ro`):** Appending `:ro` to the destination path ensures the container only has read access. It cannot modify or delete the data.
  *(Example: `-v mydata:/app/data:ro`)*
* **Anonymous Volumes:** If you provide a destination path without specifying a source name (e.g., `-v /app/data`), Docker generates an Anonymous Volume with a random cryptographic hash name. Useful for temporary scratch space.
* **Inheritance (`--volumes-from`):** Allows a new container to inherit the exact volume mount mappings of an already running container.
  *(Example: `docker run --volumes-from cont1 ubuntu`)*

---

## 6. Practical Workflow & Proof of Concept (Testing Persistence)

**Scenario 1: Creation & Inspection**
* Execute `docker volume create volume1`.
* Execute `docker volume inspect volume1`. The JSON output verifies that the virtual storage is mapped to a physical path on the Linux host (e.g., `/var/lib/docker/volumes/volume1/_data`).

**Scenario 2: The Ephemeral Survival Test (`--rm`)**
* Start an ephemeral Ubuntu container: `docker run -it --rm -v volume1:/data ubuntu bash`.
* Inside the container, create a file: `echo "Hello From Docker Volumes" > /data/hello.txt`.
* Exit the container. The `--rm` flag instantly destroys the container.
* **Result:** Even though the container is completely gone, checking the `/var/lib/.../_data` path on the host machine proves the `hello.txt` file is completely intact.

**Scenario 3: Cross-Container Sharing**
* Start a brand new, fresh Ubuntu container attached to the same volume: `docker run -it -v volume1:/data ubuntu bash`.
* **Result:** Running `ls /data` inside this new container reveals the `hello.txt` file left behind by the destroyed container. Two distinct machines successfully shared a persistent disk.

**Scenario 4: The Read-Only Firewall**
* Start a container with read-only restrictions: `docker run -it -v volume1:/data:ro ubuntu bash`.
* Attempt to modify the shared directory: `mkdir /data/test` or `rm /data/hello.txt`.
* **Result:** The Linux kernel instantly throws a **"Read-only file system"** error. The container can view the data but is strictly prohibited from altering it, proving the security mechanism works flawlessly.