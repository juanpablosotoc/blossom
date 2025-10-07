FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# ffmpeg: audio processing (pydub, etc.)
# build-essential/gcc: C-extension wheels (e.g., audioop-lts)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    build-essential \
    gcc \
  && rm -rf /var/lib/apt/lists/*

# Bring in local libraries
COPY libraries/ /app/libraries/

# Copy JS assets
COPY services/ai/temporary_binary_files /app/temporary_binary_files

# Install Python deps
COPY services/ai/requirements/docker-requirements.txt /app/
RUN python -m pip install --upgrade pip setuptools wheel && \
    pip install -r /app/docker-requirements.txt

# Copy the service code as a PACKAGE under /app/<package>
COPY services/ai/ /app/ai/

# Make local libs importable
ENV PYTHONPATH=/app:/app/libraries

EXPOSE 80

# Launch as a package module
CMD ["python", "-m", "ai.application"]