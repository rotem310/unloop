import http.server, sys
class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0")
        super().end_headers()
port = int(sys.argv[1]) if len(sys.argv) > 1 else 8460
http.server.test(HandlerClass=lambda *a, **k: H(*a, directory="landing-v2", **k), port=port)
