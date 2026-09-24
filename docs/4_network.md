# Docker Networking Architecture & Management

## 1. The Concept of Docker Networking
Docker network architecture is the software-defined equivalent of physical networking hardware. Creating a network in Docker is highly analogous to configuring a virtual switch (vSwitch) in VMware ESXi or defining a new VLAN on a physical switch.

## 2. Core Network Drivers
Docker provides several network drivers, each tailored to different security, isolation, and communication requirements:

* **`bridge` (Default):** The standard driver used to enable communication between containers running on the same standalone Docker host.
* **`host`:** Removes network isolation entirely. The container shares the host machine's networking namespace, directly using the physical server's IP address and network interface (`eth0`).
* **`none`:** Disables all networking for the container (except the loopback interface). It completely isolates the container from the host and all other containers.
* **`overlay`:** Connects multiple Docker daemons together, allowing swarm services or Kubernetes clusters to communicate securely across different physical servers (L2 tunneling).
* **`macvlan` / `ipvlan`:** Assigns a physical MAC or IP address directly to a container from the host's subnet. The container appears on the physical network as a completely independent physical device (often used for legacy applications).

## 3. The Default Bridge (`docker0`) & Virtual Interfaces
When Docker Engine is installed, it automatically creates a virtual bridge network on the Linux kernel named `docker0`.

* **IP Allocation:** By default, it is configured with the `172.17.0.0/16` subnet and `172.17.0.1` as the default gateway.
* **Attachment:** Any new container created without explicitly specifying a network is automatically attached to this `docker0` bridge.
* **Virtual Cables (`veth`):** Inside the container, a virtual interface (`eth0`) is created. This interface is connected to the `docker0` bridge via a virtual ethernet (`veth`) cable on the host, mimicking a physical patch cord plugged into a switch port.

## 4. Network Isolation & NAT
* **Intra-Network (Same Broadcast Domain):** Containers attached to the same bridge network (e.g., `172.17.0.2` and `172.17.0.3`) can communicate with each other directly without any extra configuration.
* **Inter-Network (Isolation):** Containers on different bridge networks are completely isolated. Just like assigning switch ports to different VLANs, a container on `docker0` cannot reach a container on `Bridge-1` unless explicitly connected.
* **Multi-Homed Containers:** A single container can be connected to multiple networks simultaneously.
* **Outbound Traffic & NAT:** When a container accesses the external internet, the Docker host automatically applies Network Address Translation (NAT) via `iptables`. The container's internal IP (`172.17.0.2`) is masqueraded behind the host's physical IP (`192.168.x.x`).

## 5. Port Mapping & Embedded DNS

### Inbound Traffic (Port Mapping)
By default, Docker's `iptables` rules drop all inbound traffic from the outside world for security. To expose a web service running inside a container, you must map a physical host port to the container's internal port during startup.
* *Example:* `docker run -p 8080:80 myapp` (Routes external traffic hitting the host on port 8080 directly to port 80 inside the container).

### User-Defined Bridges vs. Default Bridge
* **The Default `docker0` Flaw:** Containers on the default bridge can only communicate using IP addresses. Since container IPs are dynamic and change upon restart, this creates brittle architectures.
* **User-Defined Networks (Embedded DNS):** When you create a custom bridge network, Docker activates its **Embedded DNS server**. This allows containers to resolve each other using their container names instead of IPs.

---

## 6. Docker Network CLI Commands

### Viewing & Inspecting Networks
* **`ip a` (Linux Native):** Displays all network interfaces on the host system. Used by System Admins to physically verify the `docker0` bridge and the `veth` interfaces created by Docker on the Linux kernel.
* **`docker network ls`:** Lists all networks (bridge, host, none, and user-defined) within the Docker engine, displaying their IDs and drivers.
* **`docker network inspect <network_name>`:** Returns deep JSON metadata about a specific network. Extremely useful for troubleshooting to see the exact subnet, gateway, and a list of all currently attached containers with their assigned IPs.
* **`docker port <container_name>`:** Lists the active public-to-private port mappings for a specific running container.

### Creating Networks
* **`docker network create <name>`:** Creates a new user-defined custom bridge network. Docker automatically calculates and assigns an available IP subnet.
* **`docker network create --subnet x.x.0.0/16 --gateway x.x.0.1 <name>`:** Creates a custom network with a strictly defined Subnet and Gateway to prevent IP collisions with enterprise physical networks.

### Attaching & Detaching Containers
* **`docker run --network <network_name> ...`:** Starts a new container and explicitly attaches it to the specified network rather than the default `docker0`.
* **`docker run --network <network_name> --ip x.x.0.5 ...`:** Advanced usage. Starts a container and assigns it a **Static IP** (only works on user-defined networks where a subnet was explicitly declared).
* **`docker network connect <network_name> <container_name>`:** Attaches a live, already-running container to an additional network.
* **`docker network disconnect <network_name> <container_name>`:** Unplugs a running container from a specific network *(Note: Only works for bridge networks; cannot disconnect from `host` or `none`)*.

### Cleanup & Deletion
* **`docker network rm <network_name>`:** Deletes a specific network.
Just like you cannot delete a vSwitch in vCenter if active VMs are attached to it, Docker will block the deletion of any network that still has active containers connected to it.
* **`docker network prune`:** Safely deletes all unused/unattached networks in the system simultaneously. Essential for cleaning up wasted IP blocks after heavy testing.