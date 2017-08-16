# Docker Compose and the Schrödinger's cat
As developers, we work every day with [Docker](https://www.docker.com/). And
if you don't, you should! The main purpose of Docker is to insure portability
between your development machine, the staging and the production environments.
As long as you write and test your code inside a Docker container, you can be
confident that such container, once deployed into production, will keep working
as expected. You can finally use the "_it works on my machine!_" sentence! 🙂

Another great technology we deal with every day is
[Docker Compose](https://docs.docker.com/compose/). With Compose, you can
define and link together different containers to simulate a bigger architecture.
A typical use case is represented by a first container which encapsulates a
web-app, linked to a second container with the DB. Great, right?

One thing we don't do every day though is to create new projects, the famous
"_initial commit_". Usually, someone else already set up the project, possibly
a long time ago, and configured, among other things, its Docker and Compose
settings. And, most of the times, you don't have to deal with, or change, such
settings.

## Leave this world a little better than you found it

The other day my colleague and I picked what it seemed an harmless card from
our wall, so we decided to start with some nice refactoring.
"_It'll be quick mate_", were our famous last words. But this is another story.

On our path to enlightenment we had to explore the scripts that run tests in
Docker (_and therefore in the CI_), and we came across a `wait` script that
goes more or less like that:

```
#! /bin/sh
set -e

while ! nc -w 1 $DB_HOST $DB_PORT 2>/dev/null
do
  sleep 1
done
```
<br>

What are you waiting for?

The codebase we were refactoring is a typical Docker Compose use case. There is
a main container which holds the source code, and a second one with the DB.
The aforementioned script is used by the CI to wait for the DB inside the
container to be up and running before running the tests.

Without the `wait` script we can be in a state where both containers are
healthy, from Docker's point of view, but the source code inside them
(_the DB in our case_) is not yet ready to be executed.
Like the [Schrödinger's cat](https://en.wikipedia.org/wiki/Schr%C3%B6dinger%27s_cat),
our DB can be both dead and alive! Well, sort of. 🙂

## Enter Docker Compose Health Checks

Docker Compose, in its version 2.1, introduced a nice feature to overcome this
problem: [healthchecks](https://docs.docker.com/compose/compose-file/#healthcheck)!
With this feature, it is possible to define a conditional dependency between
two containers, and this condition is basically that the container we depend on
is healthy. What does _healthy_ mean though? Let's consider the following,
simplistic, example:

```yaml
version: '2.1'

services:

  webapp:
    image: myapp
    depends_on:
      database:
        condition: service_healthy  

  database:
    image: postgres:9.4
    healthcheck:
      test: ["CMD-SHELL", "pg_isready"]
      interval: 5s
      timeout: 30s
      retries: 3
```
<br>

We have a first container, `webapp`, which runs our source code, and it
depends on a second container being healthy. The definition of healthy, in this
example, is that PostgreSQL's [`pg_isready`](https://www.postgresql.org/docs/9.3/static/app-pg-isready.html)
function returns `0`, _A.K.A._ the DB is up, running and accepting connections.

Thanks to Compose healthchecks we don't need all the `wait` scripts (_or worse_)
workarounds anymore and we can leave the composition responsibility to, well,
Docker Compose!
