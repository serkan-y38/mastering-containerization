# Mastering Containerization

This repository contains my technical notes and hands-on lab exercises focusing on Docker and containerization. It
serves as a portfolio project documenting my learning journey from core virtualization concepts to multi-container
orchestration using Docker Compose.

The goal of this repository is to demonstrate practical, everyday usage of containers with a focus on system
administration and basic DevOps fundamentals.

## 📖 Technical Documentation

The `docs` directory contains detailed, structured notes covering the complete Docker ecosystem. Each file is designed
to explain the "why" behind the technology, followed by practical usage and architectural practices.

* **[1. Docker Fundamentals](docs/1_fundamentals.md)**  
  Explores the foundational differences between OS virtualization and containerization, the Docker client-server
  architecture, and the lifecycle of images and containers.


* **[2. Essential Commands](docs/2_essential_commands.md)**  
  A categorized CLI cheat sheet for container lifecycle management, image building, registry operations, and system
  troubleshooting.


* **[3. Dockerfile Structure](docs/3_file_structure.md)**  
  Deep dive into writing efficient `Dockerfile`s. Covers core instructions, layer architecture, build cache
  optimization, and multi-stage builds.


* **[4. Network Architecture](docs/4_network.md)**  
  Explains Docker's software-defined networking, including bridge networks, host isolation, NAT routing, port mapping,
  and embedded DNS resolution.


* **[5. Data Persistence](docs/5_data_persistence.md)**  
  Details how to decouple stateful data from ephemeral containers using Docker Volumes and Bind Mounts, ensuring safe
  database management.


* **[6. Docker Compose](docs/6_compose.md)**  
  A guide to multi-container orchestration. Covers YAML file hierarchy, dependency management, environment variables,
  and local DNS setups.

## 🚀 Applied Projects

Beyond theoretical concepts, this repository documents two full-scale deployment lab environments, simulating real-world
production scenarios.

### [Project 1: End-to-End Frontend Deployment](docs/project1.md)

Demonstrates a traditional "Build-Ship-Run" pipeline.

* Containerization of a React/Vite application using a Multi-Stage Dockerfile (Node.js & Nginx).
* Pushing the compiled image to a private Docker Hub registry.
* Securely connecting to a remote Ubuntu server via SSH, pulling the image, and deploying it as a highly available
  background service.

### [Project 2: Source-to-Server Backend Orchestration](docs/project2.md)

Demonstrates a Git-driven multi-container deployment using Docker Compose.

* Cloning a Java Spring Boot and MySQL architecture directly onto a production server.
* Utilizing Docker Compose to build the application artifact natively, inject secure `.env` credentials, and manage
  isolated database networks with persistent storage volumes.