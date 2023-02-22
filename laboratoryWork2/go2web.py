import socket, requests
from bs4 import BeautifulSoup
import sys

API_KEY = "AIzaSyA9cabI5MpJoLesHt0G0tr5ujvUnh8wn8E"
SEARCH_ENGINE_ID = "77d97acf84c3d498e"

HELP_MESSAGE = """Usage: python3 go2web.py OPTION [ARGUMENT]
Makes HTTP requests and Google searches.

Options:
  -u <URL>             Makes an HTTP request to URL and prints the response
  -s <search-term>     Searches the term using Google search engine and prints top 10 results
  -h                   Shows this help menu"""

def search(term):
    # Split the search term and join the words with a plus sign
    term = "+".join(term.split())
    
    # construct the URL for the API request
    url = f"https://www.googleapis.com/customsearch/v1?key={API_KEY}&cx={SEARCH_ENGINE_ID}&q={term}"
    
    # send the API request and get the JSON response
    response = requests.get(url).json()
    
    # extract the search results from the JSON response
    items = response.get("items", [])
    
    print("Here are the top 10 results:")
    for i, item in enumerate(items):
        print(f"{i+1}. {item['title']}")
        print(f"Link: {item['link']}\n")

def access(url):
    # Send a GET request to the URL
    response = requests.get(url, timeout=10)

    # Handle errors
    response.raise_for_status()

    # Parse the HTML content
    soup = BeautifulSoup(response.text, 'html.parser')

    # Print the text content of the HTML page, without the tags
    for text in soup.stripped_strings:
        print(text)
    
if __name__ == "__main__":
    n = len(sys.argv)

    if n == 2 and sys.argv[1] == '-h':
        print(HELP_MESSAGE)

    if n == 3 and sys.argv[1] == '-s':
        term = sys.argv[2]
        search(term)
        
    if n == 3 and sys.argv[1] == '-u':
        url = sys.argv[2]
        access(url)
        
