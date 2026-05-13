# Build stage
FROM python:3.11-slim AS builder

WORKDIR /tmp

# Install build dependencies for Pillow (PyMuPDF is pre-built wheel from PyPI)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libfreetype6-dev \
    libjpeg-dev \
    zlib1g-dev \
    libwebp-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Final stage
FROM python:3.11-slim

WORKDIR /app

# Install runtime dependencies for Pillow (PyMuPDF wheels include all needed libs)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libjpeg62-turbo \
    libfreetype6 \
    libwebp7 \
    zlib1g \
    && rm -rf /var/lib/apt/lists/*

# Copy Python dependencies from builder
COPY --from=builder /root/.local /root/.local

# Set PATH to use pip installed packages
ENV PATH=/root/.local/bin:$PATH
ENV PYTHONUNBUFFERED=1

# Copy application code
COPY . .

# Create default .env from .env.example if it exists
RUN if [ -f .env.example ]; then cp .env.example .env; fi

# Expose the FastAPI port
EXPOSE 8000

# Health check - check if uvicorn is responding on port 8000
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD python -c "import socket; socket.create_connection(('localhost', 8000), timeout=5)" || exit 1

# Run the application
CMD ["python", "app.py"]
