#!/bin/bash

# Install NVIDIA Docker Runtime
# Run this with: sudo bash setup-gpu.sh

set -e

echo "Installing NVIDIA Docker runtime..."

# Detect Ubuntu version
distribution=$(. /etc/os-release; echo $ID$VERSION_ID)

# Add NVIDIA Docker GPG key
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | apt-key add -

# Add NVIDIA Docker repository
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | tee /etc/apt/sources.list.d/nvidia-docker.list

# Install nvidia-docker2
apt-get update
apt-get install -y nvidia-docker2

# Restart Docker daemon
systemctl restart docker

echo "✅ NVIDIA Docker runtime installed successfully!"
echo ""
echo "To enable GPU for a container, use:"
echo "  deploy: "
echo "    resources:"
echo "      reservations:"
echo "        devices:"
echo "          - driver: nvidia"
echo "            count: all"
echo "            capabilities: [gpu]"
