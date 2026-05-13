# 🐳 Local Vision OCR – Docker Deployment

> **Docker • GPU • Ollama** – Deploy Local Vision OCR with Docker Compose for production-ready vision model inference.

<p align="center">
  <a href="#-quick-start"><strong> Quick Start</strong></a> •
  <a href="#-installation"><strong> Installation</strong></a> •
  <a href="#-configuration"><strong> Configuration</strong></a> •
  <a href="#-api-endpoints"><strong> API</strong></a> •
  <a href="#-troubleshooting"><strong> Troubleshooting</strong></a>
</p>

<div align="center">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/Docker%20Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Compose">
  <img src="https://img.shields.io/badge/NVIDIA%20GPU-76B900?style=for-the-badge&logo=nvidia&logoColor=white" alt="NVIDIA GPU">
  <img src="https://img.shields.io/badge/Ollama-000000?style=for-the-badge&logo=ollama&logoColor=white" alt="Ollama">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
</div>

---

##  Features

-  **Multi-container deployment** with Docker Compose
-  **GPU acceleration** with NVIDIA Docker runtime
-  **Automated deployment** with DEPLOY.sh script
-  **Ollama integration** for local vision models
-  **MongoDB support** for OCR history storage
-  **Service orchestration** with health checks and dependencies
-  **Pre-configured** for production use

---

##  Requirements

- **Docker Engine** 20.10+
- **Docker Compose** 2.0+
- **NVIDIA Docker runtime** (for GPU support)
- **8GB+ disk space** for Ollama models
- **Recommended**: NVIDIA GPU with 40GB+ VRAM for large models

---

##  Quick Start

### Option 1: Automated Deployment (Recommended)

```bash
cd deploy-docker
sudo bash setup-gpu.sh    # Install NVIDIA Docker runtime
bash DEPLOY.sh            # Deploy & verify everything
```

This will:
- ✅ Install NVIDIA Docker runtime
- ✅ Build Docker images
- ✅ Start all services
- ✅ Verify connectivity
- ✅ Check Ollama and MongoDB status

### Option 2: Manual Deployment

```bash
cd deploy-docker
sudo bash setup-gpu.sh    # Install NVIDIA Docker runtime
docker-compose up -d      # Start services
```

Monitor startup:
```bash
docker-compose logs -f ocr-app
```

### After Deployment

Pull a vision model:
```bash
docker exec ollama-service ollama pull nemotron3:33b
```

Access the application:
- **Web UI**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Ollama API**: http://localhost:11434

---

##  Installation

### 1. Prerequisites

Ensure Docker is installed:
```bash
docker --version
docker compose version
```

### 2. Setup NVIDIA Docker Runtime

For GPU support, install the NVIDIA Docker runtime:

```bash
cd deploy-docker
sudo bash setup-gpu.sh
```

This script:
- Adds NVIDIA Docker GPG key
- Registers NVIDIA Docker repository
- Installs `nvidia-docker2`
- Restarts Docker daemon

**Verification:**
```bash
docker run --rm --gpus all nvidia/cuda:11.8.0-runtime-ubuntu22.04 nvidia-smi
```

### 3. Deploy Services

Using the automated script:
```bash
bash DEPLOY.sh
```

Or manually:
```bash
docker-compose build
docker-compose up -d
```

---

##  Configuration

### Docker Compose Environment

All settings are in `docker-compose.yml`. Key variables:

| Variable | Default | Purpose |
|----------|---------|---------|
| `OLLAMA_HOST` | `http://ollama:11434` | Ollama service endpoint |
| `OLLAMA_MODEL` | `nemotron3:33b` | Vision model to use |
| `OCR_MAX_PARALLEL` | `1` | Parallel PDF page processing |
| `MONGODB_URI` | `mongodb://admin:password@mongo:27017` | Database connection |
| `NVIDIA_SMI_PATH` | `nvidia-smi` | GPU monitoring utility |

See `docker-compose.yml` for the complete configuration.

### Using External Services

**External Ollama (running on host):**

Modify `docker-compose.yml`:
```yaml
ocr-app:
  environment:
    OLLAMA_HOST: "http://172.17.0.1:11434"  # Linux
    # or
    OLLAMA_HOST: "http://host.docker.internal:11434"  # macOS/Windows
```

**External MongoDB:**

```yaml
ocr-app:
  environment:
    MONGODB_URI: "mongodb+srv://USER:PASS@cluster.mongodb.net/DB"
```

### Customizing Model and Performance

Adjust in `docker-compose.yml`:

```yaml
ollama:
  environment:
    OLLAMA_NUM_THREAD: "8"  # Limit CPU threads
    OLLAMA_NUM_GPU: "1"     # Number of GPUs

ocr-app:
  environment:
    OCR_MAX_PARALLEL: "2"   # Parallel processing
    OCR_PDF_SCALE: "3.0"    # PDF rasterization quality
```

---

##  API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/ocr/upload` | Upload file and get OCR result |
| `POST` | `/ocr/upload-stream` | Stream OCR output (SSE) |
| `POST` | `/ocr/async` | Create background job |
| `GET` | `/ocr/result/{job_id}` | Get job results |
| `GET` | `/ocr/history` | Retrieve OCR history |

**Example:**
```bash
curl -X POST http://localhost:8000/ocr/upload \
  -F "file=@document.pdf" \
  -F "format=markdown"
```

Response:
```json
{
  "filename": "document.pdf",
  "pages": [
    {
      "page": 1,
      "text": "# Title\nContent..."
    }
  ],
  "format": "markdown"
}
```

---

##  Available Ollama Models

Pull any Ollama-compatible vision model:

```bash
# List available models
docker exec ollama-service ollama list

# Pull a model
docker exec ollama-service ollama pull nemotron3:33b
```

Popular vision models:
- `nemotron3:33b` – 31GB VRAM
- `llama3.2-vision` – Smaller, faster
- `qwen3-vl:8b` – Multilingual, compact
- `gemma4:e4b` – Efficient, 12GB VRAM

**VRAM Reference:**

| Model | VRAM | GPU Recommendation |
|-------|------|-------------------|
| `gemma4:e4b` | ~12GB | RTX 3090, RTX 4080 |
| `llama3.2-vision` | ~7GB | RTX 3080, A100 |
| `nemotron3:33b` | ~31GB | A100 80GB |
| `qwen3-vl:8b` | ~45GB | A100, H100 |

---

##  Troubleshooting

### Services fail to start

```bash
# Check logs
docker-compose logs ocr-app

# Rebuild without cache
docker-compose build --no-cache
docker-compose up -d
```

### GPU not detected

```bash
# Verify NVIDIA Docker runtime
docker run --rm --gpus all nvidia/cuda:11.8.0-runtime-ubuntu22.04 nvidia-smi

# Check container GPU access
docker-compose exec ocr-app nvidia-smi

# Check Ollama GPU usage
docker-compose exec ollama nvidia-smi
```

### Ollama model not found

```bash
# List models
docker exec ollama-service ollama list

# Pull model
docker exec ollama-service ollama pull nemotron3:33b

# Check Ollama logs
docker-compose logs ollama
```

### MongoDB connection error

```bash
# Check MongoDB health
docker exec mongo-ocr mongosh --eval "db.adminCommand('ping')"

# View MongoDB logs
docker-compose logs mongo
```

### Out of memory

1. Reduce `OCR_MAX_PARALLEL` in `docker-compose.yml`
2. Use smaller model (e.g., `llama3.2-vision`)
3. Increase Docker memory limit
4. Scale down `OCR_PDF_SCALE` for lower resolution

### CPU usage too high

Add to `docker-compose.yml`:
```yaml
ollama:
  environment:
    OLLAMA_NUM_THREAD: "8"  # Adjust based on CPU cores
```

---

##  Common Commands

```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f ocr-app
docker-compose logs -f ollama

# Stop services
docker-compose down

# Full reset (remove volumes)
docker-compose down -v

# Pull new Ollama model
docker exec ollama-service ollama pull <model-name>

# Check GPU usage
docker-compose exec ocr-app nvidia-smi

# Rebuild and restart
docker-compose build --no-cache
docker-compose up -d
```

---

##  Directory Structure

```text
deploy-docker/
├── Dockerfile              # Multi-stage OCR app build
├── docker-compose.yml      # Service orchestration
├── setup-gpu.sh            # NVIDIA Docker runtime setup
├── DEPLOY.sh               # Automated deployment script
├── .env                    # Environment variables
├── .env.example            # Example configuration
├── .dockerignore           # Build exclusions
├── README.md               # This file
└── CHANGES.md              # Compatibility notes
```

---

##  Performance Optimization

### GPU Memory Management

Limit GPU memory usage in `docker-compose.yml`:
```yaml
ollama:
  environment:
    OLLAMA_NUM_GPU: "1"        # Use 1 GPU
    # OLLAMA_NUM_PARALLEL: "1"  # Sequential inference
```

### Batch Processing

For large batches:
- Use `/ocr/async` endpoint for background jobs
- Reduce `OCR_MAX_PARALLEL` to manage memory
- Monitor with `docker stats`

### Model Selection

Choose based on your GPU:
- **12GB VRAM**: `gemma4:e4b`
- **16GB VRAM**: `llama3.2-vision`
- **40GB VRAM**: `nemotron3:33b`
- **80GB VRAM**: `qwen3-vl:8b`

---

##  Health Checks

Services include health checks:

```bash
# View health status
docker-compose ps

# Columns: STATUS shows (healthy), (starting), or (unhealthy)
```

Health check endpoints:
- **ocr-app**: TCP socket on port 8000
- **ollama**: HTTP `/api/tags`
- **mongo**: `mongosh` ping command

---

##  Support & Issues

- **GitHub Issues**: https://github.com/CaoMinhh/local-vision-ocr/issues
- **Main Project**: https://github.com/CaoMinhh/local-vision-ocr

---

##  License

MIT License – See main repository for details.
