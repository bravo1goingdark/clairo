# Clairo - Scalable Video Transcoding Pipeline

This project implements a **video transcoding pipeline** using **FFmpeg, Apache Kafka, AWS ECS, AWS S3, and Docker**. The system is designed to process user-uploaded videos, transcode them into multiple resolutions, and store the processed versions in an S3 bucket.

## System Design

![System Design](assets/sysDes.png)

## Tech Stack

- **Node.js** – Backend server handling API requests.
- **FFmpeg** – Video transcoding engine.
- **Apache Kafka** – Message queue for processing uploaded videos.
- **AWS Lambda** – Event-driven processing for metadata updates.
- **AWS ECS (Elastic Container Service)** – Runs transcoding jobs in isolated containers.
- **AWS ECR (Elastic Container Registry)** – Stores Docker images for transcoding.
- **AWS S3** – Stores both raw and transcoded videos.
- **Prometheus** – Monitoring and logging for system performance.
- **MySQL** – Database to store video metadata.

---

## 📌 System Overview

### 1️⃣ User Uploads Video
Users upload a video via the **upload-video API endpoint** (multipart upload). The server receives the request and stores the unprocessed video in an **S3 bucket**.

### 2️⃣ Metadata Storage & Event Trigger
- The server inserts a new record into **MySQL**, storing the **S3 key** and initial metadata.
- The system then triggers an **AWS Lambda function** to notify Kafka.

### 3️⃣ Kafka Producer Publishes Message
The **Kafka producer** sends a message containing:
- `S3 Bucket`
- `S3 Key` 
- `File URL`
- `Upload Timestamp`

### 4️⃣ Kafka Consumer & Transcoding
- The Kafka consumer reads the uploaded video details and spins up an **isolated Docker container** to handle transcoding.
- Each **Docker container** runs an FFmpeg-based transcoding service.
- The transcoded videos are uploaded to a different **S3 bucket**.

### 5️⃣ AWS ECS Handles Scaling
- **AWS ECS** ensures that each transcoding task runs inside a container when needed.
- The containers use a **pre-built Docker image** stored in **AWS ECR**.

### 6️⃣ Storing Processed Video Metadata
- Once the video is successfully transcoded and uploaded, the system updates the **MySQL database** with:
    - `Processed URLs` (S3 paths for the different resolutions)
    - `Available Resolutions`

### 7️⃣ Prometheus Monitoring
- The system integrates **Prometheus** for monitoring **Kafka, ECS tasks, and transcoding performance**.

---

## 📦 AWS Services Used

| Service    | Purpose                              |
|------------|--------------------------------------|
| **S3**     | Stores raw and processed videos      |
| **ECS**    | Runs transcoding containers          |
| **ECR**    | Stores Docker images for transcoding |
| **Lambda** | Triggers Kafka upon video upload     |

---

