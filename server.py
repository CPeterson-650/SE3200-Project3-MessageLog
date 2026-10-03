from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import os


HOST = "localhost"
PORT = 8080

MESSAGE_FILE = "messages.txt"


class MessageHandler(BaseHTTPRequestHandler):

    # -------------------------
    # CORS
    # -------------------------

    def send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")


    # -------------------------
    # OPTIONS
    # -------------------------

    def do_OPTIONS(self):
        self.send_response(204)

        self.send_cors_headers()

        self.end_headers()


    # -------------------------
    # GET
    # -------------------------

    def do_GET(self):

        if self.path == "/messages":

            messages = []

            if os.path.exists(MESSAGE_FILE):

                with open(MESSAGE_FILE, "r") as file:

                    for line in file:

                        line = line.strip()

                        if line:

                            messages.append(
                                json.loads(line)
                            )


            response_data = json.dumps(messages)

            self.send_response(200)

            self.send_header(
                "Content-Type",
                "application/json"
            )

            self.send_cors_headers()

            self.end_headers()

            self.wfile.write(
                response_data.encode("utf-8")
            )


        else:

            self.send_not_found()


    # -------------------------
    # POST
    # -------------------------

    def do_POST(self):

        if self.path == "/messages":

            content_length = int(
                self.headers.get(
                    "Content-Length",
                    0
                )
            )

            request_body = self.rfile.read(
                content_length
            )

            message = request_body.decode("utf-8")


            with open(MESSAGE_FILE, "a") as file:

                file.write(
                    json.dumps(message) + "\n"
                )


            self.send_response(201)

            self.send_cors_headers()

            self.end_headers()


        else:

            self.send_not_found()


    # -------------------------
    # 404
    # -------------------------

    def send_not_found(self):

        message = "404 Not Found: The requested route does not exist."

        self.send_response(404)

        self.send_header(
            "Content-Type",
            "text/plain"
        )

        self.send_cors_headers()

        self.end_headers()

        self.wfile.write(
            message.encode("utf-8")
        )


# -------------------------
# START SERVER
# -------------------------

server = HTTPServer(
    (HOST, PORT),
    MessageHandler
)


print(
    "Message server running at "
    + f"http://{HOST}:{PORT}"
)


server.serve_forever()