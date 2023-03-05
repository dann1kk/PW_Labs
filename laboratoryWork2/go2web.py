import os
import socket
from bs4 import BeautifulSoup
import sys
import sqlite3
import re

CACHE_DB = "cache.db"

conn = sqlite3.connect("cache.db")
cursor = conn.cursor()

# create the cache table if it doesn't exist
cursor.execute("""
    CREATE TABLE IF NOT EXISTS cache (
        url TEXT PRIMARY KEY,
        response BLOB
    )
""")

# commit changes, close the connection
conn.commit()
conn.close()

HELP_MESSAGE = """ 
Options:
  go2web -u <URL>         # make an HTTP request to the specified URL and print the response
  go2web -s <search-term> # make an HTTP request to search the term using your favorite search engine and print top 10 results
  go2web -h               # show this help
  """


def search(term):
    search_terms = term.split()
    search_query = "+".join(search_terms)
    target_port = 80
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client.connect(("www.google.com", target_port))
    client.settimeout(4)

    results = []
    start_index = 0
    print("The top 10 results are: \n")
    while len(results) < 10:
        request = "GET /search?q=%s&start=%d HTTP/1.1\r\nHost: www.google.com\r\n\r\n" % (
            search_query, start_index)
        client.send(request.encode())

        response = b""
        try:
            while True:
                data = client.recv(4096)
                if not data:
                    break
                response += data
        except socket.timeout as e:
            pass

        start = response.find(b'<!doctype html>')
        end = response.find(b'</html>') + 7
        html_response = response[start:end]
        soup = BeautifulSoup(html_response, 'html.parser')
        tags = soup.find_all(class_="egMi0")
        for i, elem in enumerate(tags):
            if len(results) >= 10:
                break
            print("%d. " % int(len(results) + 1), end='')
            link = elem.find("a")["href"].replace('/url?q=', '')
            title = elem.find("h3").get_text()
            print(title)
            print("Link:", link, end='\n\n')
            results.append((title, link))
        start_index += 10


def access(url):
    target_port = 80
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client.settimeout(2)
    http_len = 7
    http = url.find("http://")

    if http == -1:
        http_len = 8

    path_start = url[http_len:].find("/")
    if path_start == -1:
        path_start = len(url)
    else:
        path_start += http_len

    # Extract the path and the query string
    path_and_query = url[path_start:]
    path_end = path_and_query.find("?")
    if path_end == -1:
        path = path_and_query
    else:
        path = path_and_query[:path_end]

    host = url[http_len:path_start]

    print("Making request on", host, "at", path_and_query, "\n")

    # check cache
    conn = sqlite3.connect(CACHE_DB)
    cursor = conn.cursor()
    cursor.execute("SELECT response FROM cache WHERE url = ?", (url,))
    cached_response = cursor.fetchone()
    if cached_response is not None:
        # use cached response
        print("Response retrieved from cache!")
        response = cached_response[0]
        conn.close()
    else:
        # not in cache
        client.connect((host, target_port))
        request = "GET /%s HTTP/1.1\r\nHost: %s\r\n\r\n" % (
            path_and_query, host)
        client.send(request.encode())

        response = b""
        try:
            while True:
                response = response + client.recv(4096)
        except socket.timeout as e:
            pass

        # cache the response
        cursor.execute(
            "INSERT INTO cache (url, response) VALUES (?, ?)", (url, response))
        conn.commit()
        conn.close()

    # check for redirects
    status_code = int(response.split(b" ")[1])
    location_header = None
    if status_code >= 300 and status_code < 400:
        location_header = [h for h in response.split(
            b"\r\n") if h.startswith(b"Location: ")]
    if location_header:
        new_url = location_header[0][len(b"Location: "):].decode()
        print("Following redirect to", new_url)
        http_len = 7
        http = new_url.find("http://")
        if http == -1:
            http_len = 8

        path_start = new_url[http_len:].find("/")
        if path_start == -1:
            path_start = len(new_url)
        else:
            path_start += http_len
        path_and_query = new_url[path_start:]
        path_end = path_and_query.find("?")
        if path_end == -1:
            path = path_and_query
        else:
            path = path_and_query[:path_end]
        host = new_url[http_len:path_start]
        # close the previous connection
        client.close()

        while True:
            access(new_url)
    else:
        pass

        start = response.find(b'<html')
        end = response.find(b'</html>') + 7
        html_response = response[start:end]
        soup = BeautifulSoup(html_response, 'html.parser')

        # remove style, head, and script tags
        for el in soup.find_all(["style", "head", "script"]):
            el.decompose()

        text = soup.get_text()

        # replace multiple blank lines with just one
        text = re.sub('\n{2,}', '\n', text)

        print(text)

def main():
    n = len(sys.argv)

    if n == 3 and sys.argv[1] == '-u':
        url = sys.argv[2]
        access(url)

    if n == 3 and sys.argv[1] == '-s':
        term = sys.argv[2]
        search(term)

    if n == 2 and sys.argv[1] == '-h':
        print(HELP_MESSAGE)


main()
