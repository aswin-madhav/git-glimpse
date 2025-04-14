import requests
import time
from config import Config
from utils import log_error, handle_rate_limit
from flask import current_app

def fetch_from_github(endpoint, params=None, token=None):
    headers = {
        'Accept': 'application/vnd.github.v3+json'
    }

    if not token:
        raise Exception("User authentication token is required to fetch data from GitHub.")
    
    headers['Authorization'] = f'token {token}'
    url = f"{Config.GITHUB_API_BASE}{endpoint}"
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 403:
        handle_rate_limit(response)
    response.raise_for_status()
    return response.json()

def analyze_repo(repo_url, token=None):
    try:
        parts = repo_url.rstrip('/').split('/')
        owner = parts[-2]
        repo = parts[-1]
    except Exception as e:
        log_error("analyze_repo", str(e))
        return {"error": "Invalid repository URL"}
    metadata = get_repo_metadata(owner, repo, token=token)
    return {"metadata": metadata, "message": "Analysis complete."}

def get_repo_metadata(owner, repo, token=None):
    cache_key = f"metadata_{owner}_{repo}"
    cached = current_app.cache.get(cache_key)
    if cached:
        return cached
    try:
        # Get basic repository data
        data = fetch_from_github(f"/repos/{owner}/{repo}", token=token)
        
        # Get language data
        languages_data = fetch_from_github(f"/repos/{owner}/{repo}/languages", token=token)
        
        # For issues, we need to use the search API to get accurate counts
        # GitHub's repository API doesn't always provide accurate counts
        
        # Get open issues count - try multiple approaches for reliability
        # First, get from repository data
        open_issues_count = data.get("open_issues_count", 0)
        
        # Then try the search API which is sometimes more accurate
        try:
            # Search for open issues in the repository
            open_search_query = f"repo:{owner}/{repo} is:issue is:open"
            open_search_result = fetch_from_github(f"/search/issues", 
                                               params={"q": open_search_query}, 
                                               token=token)
            
            # Extract open issues count from search result
            if isinstance(open_search_result, dict) and "total_count" in open_search_result:
                # Only update if the search result looks valid and non-zero
                search_count = open_search_result.get("total_count", 0)
                if search_count > 0 or open_issues_count == 0:
                    open_issues_count = search_count
        except Exception as e:
            log_error("get_open_issues_count", str(e))
        
        # Get total issues count using search API
        total_issues = open_issues_count  # Default to open issues count
        try:
            # Search for all issues (open and closed) in the repository
            total_search_query = f"repo:{owner}/{repo} is:issue"
            total_search_result = fetch_from_github(f"/search/issues", 
                                                 params={"q": total_search_query}, 
                                                 token=token)
            
            # Extract total count from search result
            if isinstance(total_search_result, dict) and "total_count" in total_search_result:
                total_issues = total_search_result.get("total_count", open_issues_count)
        except Exception as e:
            log_error("get_total_issues_count", str(e))
        
        # We already have the total_issues from the search API
        
        # Build result object
        result = {
            "name": data.get("name"),
            "full_name": data.get("full_name"),
            "description": data.get("description"),
            "stars": data.get("stargazers_count"),
            "forks": data.get("forks_count"),
            "open_issues": open_issues_count,
            "total_issues": total_issues,
            "language": data.get("language"),
            "languages": languages_data
        }
        if result:
            current_app.cache.set(cache_key, result)
        return result
    except Exception as e:
        log_error("get_repo_metadata", str(e))
        return {"error": str(e)}

def get_repo_contributors(owner, repo, token=None):
    cache_key = f"contributors_{owner}_{repo}"
    cached = current_app.cache.get(cache_key)
    if cached:
        return cached
    try:
        data = fetch_from_github(f"/repos/{owner}/{repo}/contributors", token=token)
        contributors = [{
            "login": contributor.get("login"),
            "contributions": contributor.get("contributions")
        } for contributor in data]
        current_app.cache.set(cache_key, contributors)
        return contributors
    except Exception as e:
        log_error("get_repo_contributors", str(e))
        return {"error": str(e)}

def get_commit_activity(owner, repo, token=None):
    cache_key = f"commit_activity_{owner}_{repo}"
    cached = current_app.cache.get(cache_key)
    if cached:
        return cached
    try:
        # GitHub's stats endpoints sometimes return 202 while they generate stats
        data = fetch_from_github(f"/repos/{owner}/{repo}/stats/commit_activity", token=token)
        
        # Validate the data structure
        if not data or not isinstance(data, list) or len(data) == 0:
            log_error("get_commit_activity", f"No valid commit activity data for {owner}/{repo}")
            # Return a more specific error message
            return {"error": "insufficient_history", "message": "This repository doesn't have enough commit history."}
        
        current_app.cache.set(cache_key, data)
        return data
    except requests.exceptions.HTTPError as e:
        status_code = e.response.status_code if hasattr(e, 'response') else 0
        if status_code == 404:
            log_error("get_commit_activity", f"Repository not found: {owner}/{repo}")
            return {"error": "not_found", "message": "Repository not found"}
        elif status_code == 403:
            log_error("get_commit_activity", f"Rate limit exceeded or access denied: {owner}/{repo}")
            return {"error": "access_denied", "message": "Rate limit exceeded or access denied"}
        else:
            log_error("get_commit_activity", str(e))
            return {"error": "api_error", "message": "GitHub API error"}
    except Exception as e:
        log_error("get_commit_activity", str(e))
        return {"error": "unknown_error", "message": str(e)}

def get_commit_frequency(owner, repo, token=None):
    cache_key = f"commit_frequency_{owner}_{repo}"
    cached = current_app.cache.get(cache_key)
    if cached:
        return cached
    try:
        activity = get_commit_activity(owner, repo, token=token)
        if isinstance(activity, dict) and activity.get("error"):
            # Return error information
            return {"error": activity.get("error")}
            
        # Initialize day of week counters
        days_of_week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        day_counts = {day: 0 for day in days_of_week}
        
        # Sum commits by day of week across all weeks
        valid_weeks = 0
        for week in activity:
            if 'days' in week and isinstance(week['days'], list) and len(week['days']) == 7:
                valid_weeks += 1
                for i, count in enumerate(week['days']):
                    # GitHub API returns days in order: Sun, Mon, Tue, Wed, Thu, Fri, Sat
                    day_counts[days_of_week[i]] += count
        
        # If we didn't get any valid weeks, return empty data
        if valid_weeks == 0:
            log_error("get_commit_frequency", f"No valid weeks found for {owner}/{repo}")
            return {"error": "No commit data available"}
        
        # Calculate average per week for additional info
        total_commits = sum(day_counts.values())
        average_per_week = total_commits / valid_weeks if valid_weeks > 0 else 0
        
        # Combine day counts with average
        result = {
            **day_counts,
            "average_commits_per_week": average_per_week
        }
        
        current_app.cache.set(cache_key, result)
        return result
    except Exception as e:
        log_error("get_commit_frequency", str(e))
        return {"error": str(e)}

def get_status(token=None):
    try:
        data = fetch_from_github("/rate_limit", token=token)
        return data
    except Exception as e:
        log_error("get_status", str(e))
        return {"error": str(e)}

def get_error_logs():
    # In a production system, logs would be stored persistently.
    return {"error_logs": "Check error.log for details."}
