FROM python:3.9-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Set environment variables
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1

# Ensure .env file is properly loaded
RUN pip install python-dotenv

# Expose the port the app runs on
EXPOSE 5001

# Command to run the application
# Ensure Flask listens on 0.0.0.0 to be accessible from outside the container
CMD ["python", "-c", "from app import create_app; app = create_app(); app.run(host='0.0.0.0', port=5001, debug=False)"]
