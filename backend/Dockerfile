# Use Python base image
FROM python:3.12-slim
# Set the working directory inside the container
WORKDIR /app

# Copy requirements.txt and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Expose port 8000 for the backend API
EXPOSE 8000

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
