# Use Docker to run Flask-based REST services
<hr>
<br>

Many articles of this kind exist, but most of these tutorials start from
the easiest [Flask](http://flask.pocoo.org/) example possible:

```
from flask import Flask


app = Flask(__name__)


@app.route("/")
def hello():
    return "Hello World!"

if __name__ == "__main__":
    app.run()

```
<br>
Although these examples are very useful to understand the Docker setup,
the objective of this post is to present a situation that is closer
(_just a little bit_) to the real life. The final Docker image will contain
the REST services, and it will be possible to install the whole application
on any machine supporting Docker. In addition to having a fully functional
web application that can be quickly deployed, this approach also allows
the versioning, the configurability, the portability and the share of the
deploy objects, a.k.a. the Docker images.

# Architecture

The architecture is composed by two back-end modules: the main REST service
and an additional service implemented as a Flask blueprint. A [Flask blueprint](http://flask.pocoo.org/docs/0.10/blueprints/) “_works similarly to
a Flask application object, but it is not actually an application. Rather it
is a blueprint of how to construct or extend an application_“.
The use of such objects allows the implementation of a modular back-end.

<img class="img-responsive center-block" src="../src/images/simple_flask_01.png">

Back-end projects have been organized in a core and a rest package to isolate
even more the responsibilities of each element. The structure of such projects
is shown below:

```
simple_flask/
├── requirements.txt
├── setup.py
├── simple_flask
│   ├── core
│   │   └── core.py
│   └── rest
│       └── rest.py
└── simple_flask_test
    ├── core
    │   └── core_test.py
    └── rest
        └── rest_test.py
```
<br>

Enters Docker. The final goal is to encapsulate the whole application
inside Docker. As shown in the next figure this process will be seamless for
the final user, that will keep interacting with the application with no extra
settings required.

<img class="img-responsive center-block" src="../src/images/simple_flask_02.png">

# Source Code

The source code of all the projects used in this tutorial is available on
GitHub: feel free to download, fork and/or star it!

| Project                 | URL                                                                                                        |
|-------------------------|------------------------------------------------------------------------------------------------------------|
| Simple Flask            | [https://github.com/Kalimaha/simple_flask](https://github.com/Kalimaha/simple_flask)                       |
| Simple Flask Blueprint  | [https://github.com/Kalimaha/simple_flask_blueprint](https://github.com/Kalimaha/simple_flask_blueprint)   |
| Simple Flask Dockerizer | [https://github.com/Kalimaha/simple_flask_dockerizer](https://github.com/Kalimaha/simple_flask_dockerizer) |

# Flask Blueprint

As mentioned before blueprints are objects used to create a modular
application. This simple component follows the structure previously described
and contains a core library and, of course, a blueprint. The only function of
the core is used to greet the user:

```
def say_hallo(name=None):
  s = 'Hallo ' + str(name) + '!' if name is not None else 'Hallo!'
  return s
```
<br>

The blueprint itself is very simple as well: it exposes two routes to greet
the user, one generic, and one customizable with the user name. The resulting
service takes advantage of the core library to do so:

```
from flask import Blueprint
from simple_flask_blueprint.core.blueprint_core import say_hallo


bp = Blueprint('simple_flask_blueprint', __name__)


@bp.route('/')
def say_hallo_service():
    return say_hallo()

@bp.route('/&lt;name&gt;/')
def say_hallo_to_guest_service(name):
    return say_hallo(name)

```
<br>

As shown by the code the development of the service is very similar to the
standard Flask, with the only exception of the Blueprint object declared at
line 5.

# Flask REST Service

The main back-end module has a core library as well, with the same
`say_hallo` function, which returns a message that is only slightly
different from the previous one:

```
s = 'Hallo ' + str(name) + ' from CORE!' if name is not None else 'Hallo from CORE!'
```
<br>

This difference will be used to test that both the main service and the
blueprint are working correctly. The main REST service, defined in `rest.py`,
register the blueprint on the `/blueprint` entry point as follows:

```
from simple_flask_blueprint.rest.blueprint_rest import bp


class RootREST:

    def __init__(self, host, run_flask):
        [...]
        self.app.register_blueprint(bp, url_prefix='/blueprint')
```
<br>

In addition to that the `RootREST` class exposes two routes, similar to the
ones described for the blueprint, but it also starts the Flask engine:

```
if self.run_flask:
    self.app.run(host=self.host, debug=True)
```
<br>

Once the engine is up and running, it is possible to invoke the REST service
through the browser at [http://localhost:5000/](http://localhost:5000/)
(_that will display `Hallo from CORE!`_) or
[http://localhost:5000/Kalimaha/](http://localhost:5000/Kalimaha/)
(_which will display `Hallo Kalimaha from CORE!` instead_).

As mentioned before the service has been designed to be modular through the
use of blueprints. It is possible to test such blueprint by hitting the
[http://localhost:5000/blueprint/](http://localhost:5000/blueprint/) URL
(`Hallo!`), or
[http://localhost:5000/blueprint/Kalimaha/](http://localhost:5000/blueprint/Kalimaha/ )
(`Hallo Kalimaha!`).

# Docker

The most important file is the
[Dockerfile](https://github.com/Kalimaha/simple_flask_dockerizer/blob/master/Dockerfile),
that basically tells Docker what to do. Some parts of this file deserve
to be highlighted, starting with:

```
FROM ubuntu:14.04
RUN apt-get update
```
<br>

These instructions generate a new container starting from
[Ubuntu](http://www.ubuntu.com/) and update its repositories.
In the next step Docker is instructed to install
[Python](https://www.python.org/), and few other useful things, such as
[Virtualenv](https://virtualenv.pypa.io/en/latest/), in the newly create
container:

```
RUN apt-get install -y -q build-essential python-gdal python-simplejson
RUN apt-get install -y python python-pip wget
RUN apt-get install -y python-dev
RUN pip install virtualenv
```
<br>

Subsequently the script creates a folder for the source code, creates and
run a virtual environment in it, and finally adds and installs all the
requirements:

```
RUN mkdir deployment
ADD requirements.txt /deployment/requirements.txt
ADD start.py /deployment/start.py
RUN virtualenv /deployment/env/
RUN /deployment/env/bin/pip install wheel
RUN /deployment/env/bin/pip install -r /deployment/requirements.txt
```
<br>

Requirements are specified through a simple text file:

```
watchdog
Flask
flask-cors
https://github.com/Kalimaha/simple_flask/archive/master.zip
https://github.com/Kalimaha/simple_flask_blueprint/archive/master.zip
```
<br>

This file tells Docker to install watchdog, Flask and flask-cors from
Python repositories, while back-end modules will be retrieved and installed
straight from their GitHub repositories. The last file required to dockerize
the project is a simple Python script:

```
from simple_flask.rest import rest as rest_engine


rest_engine.run_engine('0.0.0.0')
```
<br>

This file imports and run the main REST engine of the application.
The host of this application has to be set to `0.0.0.0`, as shown at line 4,
in order to allow users to access the service inside Docker.
Time to run the build (_and don’t forget the `.` at the end!_):

```
docker build -t simple_flask .
```
<br>

Once a new Docker image has been created it is possible to run it through
the following instruction:

```
docker run -it -p 5000:5000 simple_flask /deployment/env/bin/python /deployment/start.py
```
<br>

This instruction runs the `simple_flask` image (_created in the previous step_),
links the internal port 5000 with the host port 5000 (`-p 5000:5000`), and
executes, through Virtualenv, the starting script
(`/deployment/env/bin/python /deployment/start.py`). It is possible to test
the service through the URL’s specified in the _Flask REST Service section_.
