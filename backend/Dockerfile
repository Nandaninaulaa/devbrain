FROM python:3.11-slim

WORKDIR /app

# Build tools needed for chroma-hnswlib and similar native deps.
RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

# Chroma's persistent store lives here — mount a volume at this path
# in docker-compose so data survives container restarts.
RUN mkdir -p /app/data/chroma

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
