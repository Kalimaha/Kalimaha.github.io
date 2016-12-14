# Setup a project for continuous development with Ruby on Rails
<hr>
<br>

[Ruby on Rails](http://rubyonrails.org/) (_RoR_) is a popular web framework
based on the [Ruby](https://www.ruby-lang.org/it/) programming language.
According to [BuiltWith](https://builtwith.com/) there are more than 700.000
websites using RoR. This framework implements the MVC pattern and it provides
the basic structure for database connection, CRUD web-services and the
related web pages.

RoR promotes the DRY (_Don’t Repeat Yourself_) philosophy and it is strongly
based on the Coding Over Convention principle. As per its name, by using RoR
you develop **ON RAILS**, meaning that everything is already pre-configured
and pre-organized.

The framework provides a number of useful scripts that can be run through
the CLI and it gives the impression that lots of things happen by magic.
You are therefore required to learn a lot of spells and the learning curve
may be a bit steep (_well, at least for me_).

The final goal of this experiment is to have fully functional RoR web-app
suitable for continuous development. The source code will be hosted on GitHub,
the final app will be deployed on Heroku and it will have a front-end based
on Bootstrap. What is more, the software will have automated tests hosted by
TravisCI and its code coverage will be evaluated through Coveralls.

# Resources

| Resource               | Platform                                                      |
|------------------------|---------------------------------------------------------------|
| Source Code            | [GitHub](https://github.com/Kalimaha/RubyMovieDB)             |
| Live Demo              | [Heroku](https://rmdb.herokuapp.com/)                         |
| Continuous Integration | [TravisCI](https://travis-ci.org/Kalimaha/RubyMovieDB)        |
| Tests Coverage         | [Coveralls](https://coveralls.io/github/Kalimaha/RubyMovieDB) |

# Setup the web-app

The project is very simple and it is based on the excellent
[Getting Started guide](http://guides.rubyonrails.org/getting_started.html)
available on the RoR web-site, with some extras. The web-app represents a
small clone of the [IMDB](http://www.imdb.com/), the RubyMovieDB, limited to
movies and directors. As said before, the main objective of this article is to
setup a working environment for the continuous development. The starting point
is very humble, but there is plenty of room for improvements! To create the
web-app, simply run:

```
rails new RubyMovieDB
```
<br>

This command generates the structure for the whole project, the initial
source code, tests, dependencies and so forth. To install the dependencies,
move to the project’s root and execute:

```
bundle install
```
<br>

After that the project is ready for the first run. Start-up the server as
follows:

```
rails s
```
<br>

and visit [http://localhost:3000/](http://localhost:3000/) to visualize the
default RoR welcome page.

# Add Bootstrap
The look-and-feel of an application is always very important, so, before
proceeding with the actual implementation of the project, it is good to take
care of the make-up of the web pages.

[Bootstrap](http://getbootstrap.com/) is a very popular front-end framework
that provides a grid system and a widgets toolkit. The use of this framework
allows developers to create nice-looking projects that can also be easily
modified and improved by graphic designers with no hassle.

To add Bootstrap to the project it is necessary to include its `gem` in the
project’s `Gemfile`:

```
gem 'bootstrap-sass', '~> 3.2.0'
gem 'autoprefixer-rails'
```
<br>

After that the package must be installed through the aforementioned:

```
bundle install
```
<br>

Bootstrap uses [SASS](http://sass-lang.com/), so it is necessary to rename
the main CSS (_located at `app/assets/stylesheets`_) file from
`application.css` to `application.css.sass`, and include the following
statements in it:

```
@import 'bootstrap-sprockets';
@import 'bootstrap';
```
<br>

The last step required is to modify the `app/assets/javascripts/application.js`
file in order to include the following:

```
//= require bootstrap-sprockets
```
<br>

This statement must be added right after the [JQuery](https://jquery.com/)
inclusion in the same file. After that Bootstrap can be used in the
application. The `app/views/layouts/application.html.erb` file holds the main
structure of the application, and the statement:

```
<%= yield %>
```
<br>

acts as a placeholder for the user’s code. Such placeholder can be wrapped
by a Bootstrap container in order to start using the grid system and the
widgets toolkit as follows:

```
<body>
  <div class="container">
    <%= yield %>
  </div>
</body>
```
<br>

Another change that is required in this file is the inclusion of the
viewport settings in the head section, in order to have a fully
responsive web-site. The whole `app/views/layouts/application.html.erb` file
is listed below:

```
<!DOCTYPE html>
<html>
  <head>
    <title>The Ruby Movie DB</title>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'>
    <meta name='format-detection' content='telephone=no'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
    <%= stylesheet_link_tag    'application', media: 'all', 'data-turbolinks-track' => true %>
    <%= javascript_include_tag 'application', 'data-turbolinks-track' => true %>
    <%= csrf_meta_tags %>
  </head>
  <body>
    <div class="container">
      <%= yield %>
    </div>
  </body>
</html>
```

# Add FontAwesome
[FontAwesome](http://fontawesome.io/) is a font which contains a set of
general purpose icons and it can be included in the project by adding the
relative `gem` in the `Gemfile`:

```
gem 'font-awesome-rails', '~> 4.1.0.0'
```
<br>

Once again, run:

```
bundle install
```
<br>

to download the dependency. After that the CSS must be included in the
aforementioned `app/views/layouts/application.html.erb` file by adding the
following statement:

```
<link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">
```
<br>

This statements includes FontAwesome CSS through its CDN.

# The movie resource
The main purpose of the RubyMovieDB is the management of a movies DB through
CRUD services. To achieve this goal it is necessary to create a resource,
a controller and the related views. RoR provides one very useful command
to do so:

```
rails g scaffold Movie title:string year:int synopsis:text
```
<br>

Where `g` is short for generate, while `scaffold` is the shortcut to
generate the aforementioned resources. This statements also generates a
DB migration, so to make it effective you need to execute the following:

```
rake db:migrate
```
<br>

Which alters the DB by adding the new table `Movie` as specified by the
scaffold command. Once the model, its controller, and the related views
have been created, it is possible to fill the gaps (_if any_) and add the
missing code as described in the _Getting Started_ guide of RoR.

Bootstrap and Font Awesome, introduced in the previous paragraphs, help making
the views nicer. For example, tables can be easily improved adding the table
class. Another nice trick consists in adding Bootstrap classes and FontAwesome
icons to the buttons, for example:

```
<%= link_to '<i class="fa fa-magic"></i> New Movie'.html_safe, new_movie_path, class: 'btn btn-primary' %>
```
<br>

# Adding a new model
RoR allows you to work on your project incrementally, through the migration
mechanism. For example, I now need to make the RubyMovieDB a little more
complete, so I want to add the directors of the movies. Through the
aforementioned scaffold command I can then generate a new model, controller
and web views for my new model:

```
rails g scaffold Director first_name:string last_name:string birthday:date
```
<br>

The new model has an impact on the DB, therefore it needs to be updated as
follows:

```
rake db:migrate
```
<br>

Through this statement RoR updates the DB structure by adding a new table.
What is more, there is a clear one-to-many relationship between a director
and its movies. Such relationship can be added to the model through the
migration statement, as follows:

```
rails g migration AddDirectorIdToMovies director:references
```
<br>

The command generates a new migration that must be execute with the usual
`rake db:migrate` statement. After the migration has been executed, the `Movie`
table contains a reference to a director through its ID.

RoR generates everything we need for the new model, but does not update what
is already in place. To select a director for the movie, we should include a
dropdown in the creation form as follows:

```
<div class="field">
  <%= f.label :director %><br>
  <%= f.collection_select :director_id, Director.all, :id, :full_name, {:prompt => 'Please select a director'} %>
</div>
```
<br>

Such dropdown will be automatically populated with the content from the DB
through the `f.collection_select` statement. The `:full_name` statement is
referred to a new method that has been added to the director’s model:

```
def full_name
  "#{first_name} #{last_name}"
end
```
<br>

Make sure to allow the new `director_id` parameter in the `movie_controller`,
otherwise this will not be written in the DB:

```
def movie_params
  params.require(:movie).permit(:title, :year, :synopsis, :director_id)
end
```
<br>

These changes will allow us to link new movies to existing directors. To
display this information we then need to alter the `show` method in the
`movies_controller`:

```
def show
  @director = Director.find(@movie.director_id)
end
```
<br>

And subsequently the related view, by adding:

```
<p>
  <strong>Director:</strong>
  <%= @director.full_name %>
</p>
```
<br>

One last change is required not to break the tests: fixtures must be adapted
to include the director’s id, both in `directors.yml`:

```
one:
  id: 1
  first_name: James
  last_name: Cameron
  birthday: 1954-08-16
```
<br>

and in `movies.yml`:

```
one:
  title: The Terminator
  year: 1984
  synopsis: Description of the movie.
  director_id: 1
```
<br>

# Deploy on Heroku
[Heroku](http://www.heroku.com/) is a cloud
[Platform-as-a-Service (PaaS)](https://en.wikipedia.org/wiki/Platform_as_a_service)
that can be used to deploy RoR projects. The Heroku deployment can be
configured through the `Procfile` that must be stored in the root of the project.
Such file is plain simple, as it contains only one line:

```
web: bundle exec rails server -p $PORT
```
<br>

The only big difference between the development environment and the production
in this case is the DB. RoR uses [SQLite](https://sqlite.org/) by default, a
DB that is not supported by Heroku, which offers
[PostgreSQL](https://www.postgresql.org/) instead.

That is not a problem, as RoR can be configured to use different DBs for
different environments. To achieve such a goal, we need to modify the
`Gemfile` as follows:

```
# Use sqlite3 as the database for Active Record
# gem 'sqlite3'

# PostgreSQL
gem 'pg'

# Use SQLite in the test and development environments
group :development, :test do
  gem 'sqlite3'
  gem 'byebug'
end

group :development do
  gem 'web-console', '~> 2.0'
  gem 'spring'
  gem 'sqlite3'
end
```
<br>

By doing so, SQLite will be used in the development and test environments
only, while PostgreSQL will be used in production.

To deploy the app, head to Heroku, create a new app, and link the GitHub
repository to it. Then select `Deploy Branch` in the `Manual Deploy` section.
You can now view your app, but you should receive an error at this point.

That’s because Heroku doesn’t automatically migrate the DB. The next command,
that must be run from the CLI, is used to overcome this problem:

```
heroku run rake db:migrate --app=rmdb
```
<br>
You app is now app and running in the cloud!

# Tests
The aforementioned scaffold command generates automated tests and fixtures
(_sample data_) for the models and the controllers. The tests for the
controllers are very useful to check whether all the CRUD functionalities
have been implemented and that these are working as expected. Such tests
can be automated through a continuous integration environment,
as described further on.

# Continuous integration
[TravisCI](https://travis-ci.org) is an online platform for continuous
integration that can be linked to any GitHub repository. A configuration file,
named `.travis.yml`, must be added in the root of the project in order to
setup the TravisCI builds. Such file specifies the language of the project,
the version and the scripts to be executed before and after the tests. The
configuration file used for this project is the following:

```
language: ruby

rvm:
  - 2.2

env:
  - DB=sqlite
  - DB=postgresql

before_script:
  - psql -c 'create database myapp_test' -U postgres

script:
  - RAILS_ENV=test bundle exec rake db:migrate --trace
  - bundle exec rake db:test:prepare
  - bundle exec rake test

bundler_args: --binstubs=./bundler_stubs

after_success:
  - coveralls
```
<br>

The script section is used to run all the required DB migrations before the
tests, while the after_success section tells TravisCI to send the code
coverage to the [Coveralls](https://coveralls.io/) platform after the
tests have been successfully completed.

Please note that it is possible to run the tests against different DBs. This is
achieved with the `env` and `before_script` sections of the configuration file.
Such configuration is very useful when you use different DB for different
environments, as seen in the previous paragraph for the Heroku deployment.
TravisCI will start two sub-builds and execute the tests against both
SQLite **and** PostgreSQL.

# Test coverage
[Coveralls](https://coveralls.io/) is an online platform that can be used to
track the test coverage of GitHub projects. The Coveralls gem must be included
in the `Gemfile`:

```
gem 'coveralls', require: false
```
<br>

After the inclusion the bundle install command must be executed to fetch the
required libraries. After that, it is also necessary to alter the
`test/test_helper.rb` file in order to include Coveralls in the test process.
Following an example of the complete file:

```
ENV['RAILS_ENV'] ||= 'test'

# Coveralls
require 'coveralls'
Coveralls.wear!('rails')

require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'

class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all
end
```

Coveralls generates a report about which lines of code are covered by unit
tests and which are not, so that you can fill the gaps and provide a better
tests coverage.

# Conclusions
RoR is a powerful frameworks that allows you to easily create web-apps based
on CRUD RESTful services and the Model-View-Controller architecture. Many
things happen by magic, therefore a bit of practice is required to learn all
the spells. That’s not a great issue, considering that the documentation is
very good and that there’s a huge community of very active users. You will
basically find the answer to your problems in few Google searches. If you
prefer a framework to a boilerplate solution, probably RoR is a very good
choice to implement your next web-site.
