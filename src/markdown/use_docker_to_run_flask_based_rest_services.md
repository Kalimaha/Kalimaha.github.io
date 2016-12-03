Many articles of this kind exist, but most of these tutorials start from
the easiest [Flask](www.google.com) example possible:

```
from flask import Flask


app = Flask(__name__)


@app.route("/")
def hello():
    return "Hello World!"

if __name__ == "__main__":
    app.run()
```
