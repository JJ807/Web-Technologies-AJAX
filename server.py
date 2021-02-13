#!/usr/bin/env python
 
import os
from http.server import HTTPServer, CGIHTTPRequestHandler
os.chdir('.')
 
port = int(os.getenv('VCAP_APP_PORT'))
#port = 8000
 
server_object = HTTPServer(server_address=('', port), RequestHandlerClass=CGIHTTPRequestHandler)
# Start the web server
server_object.serve_forever()