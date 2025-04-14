import logging

logging.basicConfig(filename='error.log', level=logging.ERROR,
                    format='%(asctime)s %(levelname)s: %(message)s')

def log_error(context, message):
    log_msg = f"Error in {context}: {message}"
    logging.error(log_msg)
    print(log_msg)  # For development/debugging

def handle_rate_limit(response):
    if response.status_code == 403:
        reset_time = response.headers.get('X-RateLimit-Reset', 'unknown')
        raise Exception(f"Rate limit exceeded. Try again after {reset_time}")
