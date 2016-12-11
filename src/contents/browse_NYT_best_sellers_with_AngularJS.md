# Browse NYT best sellers with AngularJS
<hr>
<br>

[AngularJS](https://angularjs.org/) is a popular JavaScript front-end framework
that is mainly maintained by Google. This projects aims to make the HTML more
readable by adding custom elements and controllers, so that a developer can
understand the flow of the application by just reading the HTML, with no need
to dig into the JavaScript code. AngularJS also provides routing capabilities
and it is mainly used to create
[Single Page Applications](https://en.wikipedia.org/wiki/Single-page_application).
After having spent some time reading about this framework, I have decided to
implement a very simple front-end application with AngularJS to better
understand its potential. The result is a single page application that takes
advantage of the
[New York Times API](https://en.wikipedia.org/wiki/Single-page_application) to
fetch and display the top 20 best seller books.

# Resources
There are several online courses that allow you to learn AngularJS for free.
I’d suggest the [W3School](http://www.w3schools.com/angular/) (_an evergreen_), [Codecademy](https://www.codecademy.com/learn/learn-angularjs) and [Code School](https://www.codeschool.com/courses/shaping-up-with-angular-js) to start,
but also [Thinkster](https://thinkster.io/topics/angular) and [YouTube](https://www.youtube.com/results?search_query=angularjs), where users
dump an impressive amount of step-by-step tutorials.

When I started working on this project, I wanted to focus on AngularJS, in
order to learn it in the best possible way. AngularJS is a front-end framework,
so I didn’t want to waste my energies in setting up databases and services.
But I needed a datasource! After a while I finally found the [PublicAPIs](https://www.publicapis.com/) directory, which lists an
impressive number of APIs that can be potentially used for similar use cases.
An interesting alternative is the [JSONPlaceholder](http://jsonplaceholder.typicode.com/) project, which is a free REST service that can be used to test [CRUD operations](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete)
with fake data.

The little application described in the next sections is available on GitHub,
so you may also consider to watch, fork or star the project!

# Overview
The single page application of this example is divided into three pages. In
the first one, the user can select a literary genre, while in the second the
top 20 best-seller book of the selected genre are listed. Finally, a short
description of the selected book, a link to the corresponding Amazon web page
and the book review (_if any_) are displayed in the last section. A [live demo](http://guido-barbaglia.blog/NYTBestSellers/) of the web app is available
online.

# Initial setup
The first thing we need to do is to import the AngularJS library in the main
HTML file. After that, we modify the body tag of our `index.html` page to
include the `ngApp` directive. This instruction tells AngularJS which is
the root tag of the application.

```
<html>
  <head>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.9/angular.js"</script>
    <script src="src/js/app.js"</script>
  </head>
  <body ng-app="NYTBestSellers">
  </body>
</html>
```
<br>

We also need to include a simple `app.js` script, where we will initialize
the AngularJS application. In the script, we define a variable called app that
stores the AngularJS module. This module has the same name that we defined
through the `ngApp` directive in the HTML file.

```
(function () {
  'use strict';

  var app = angular.module('NYTBestSellers', []);
}());
```
<br>

# Routing
In more recent versions of AngularJS the routing module has been divided from
the core library, so we need to import it in the main HTML, at line 4.

```
<html>
  <head>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.9/angular.js"</script>
    <script src = "http://ajax.googleapis.com/ajax/libs/angularjs/1.4.9/angular-route.js"></script>
    <script src="src/js/app.js"</script>
  </head>
  <body ng-app="NYTBestSellers">
  </body>
</html>
```
<br>

We need to define 3 different routes: the list of genres, the list of genre’s
best-sellers, and the details of the selected book. To do so, we create a file
called `router.js` in `src/js`, and we import this script in the `index.html`.

```
(function () {
  'use strict';

  var app = angular.module('NYTBestSellers', ['ngRoute']);

  app.config(function ($routeProvider) {
    $routeProvider.when('/genres', {
      templateUrl: 'src/html/genres.html',
      controller: 'GenresController'
    }).when('/genres/:genre', {
      templateUrl: 'src/html/genre.html',
      controller: 'GenreController'
    }).when('/genres/:genre/:isbn', {
      templateUrl: 'src/html/book.html'
    }).otherwise({
      redirectTo: '/genres'
    });
  });
}());
```
<br>

We need to import the `ngRoute` module to allow users to navigate through the
pages. Routes are defined in the configuration of our AngularJS module,
through the use of the `$routeProvider` object. Each route defines the endpoint
of each page (_e.g. `/genres`_), but also the template (_through the `templateUrl` instruction_) and the controller (_e.g. `GenresController`_) associated with it.
It is also possible to define dynamic parameters for the route through the use
of colons (_e.g. `:isbn`_). The route defined at line 14 by the instruction
otherwise will catch any other request and redirect the user to the genres page.

We will now take advantage of another AngularJS directive to link this piece of
code to the HTML page. In the body section we define three areas: an header,
a footer, and the main content. Header and footer will remain the same in all
the pages, but we want the main content to change according to the user
navigation. To do so, we add the `ngView` directive to our main `div`.
AngularJS will render the templates defined in the `routes.js` script in the
main `div`, by leaving the rest of the page unaltered.

```
<body>
  <body ng-app="NYTBestSellers">
    <!-- Header. -->
    ...

    <!-- Main content. -->
    <div ng-view></div>

    <!-- Footer. -->
    ...
</body>
```
<br>

# Consume RESTful services
In the `router.js` file we defined, for each route, a template and a controller.
The latter is in charge of the business logic of the page, while the template
handles the presentation layer. To make the web app consume data through the
NYT API, we need to define its behaviour in the controller. For example,
we can define the `GenresController` as follows:

```
(function () {
  'use strict';

  var app = angular.module('NYTBestSellers');

  app.controller('GenresController', function ($scope, $routeParams, $http) {
    var url = 'http://api.nytimes.com/svc/books/v3/lists/names.json?api-key=sample-key';
    $http.get(url).then(function (response) {
      $scope.genres = response.data.results;
    }).catch(function (e) {
      $scope.error = e;
    });
  });
}());
```
<br>

When it is defined, the controller imports three objects: `$scope`,
`$routeParams` and `$http`. The first is used to exchange data with the
templates, the second to fetch data from the routes (_e.g. `/:isbn`_), while
`$http` is used to access remote resources. This object is used to invoke a
URL (_and pass parameters to it, if required_), and it returns a promise.
The result of the asynchronous call is then stored in the `$scope` object, so
that it can be used by the template.

# Templating
The template makes use of another AngularJS directive: `ngRepeat`. In this
example, the template access the genres object from the `$scope`, and iterates
over it. At each iteration a portion of HTML is filled with information from
the object (_e.g. `g.display_name`_) and rendered.

```
<h1>
  <div class="row">
    <div class="col-lg-12 text-center">
      <i class="fa fa-spinner fa-pulse fa-5x" ng-hide="genres.length"></i>
    </div>
    <div ng-repeat="g in genres">
      <div class="col-lg-3">
        <a href="#genres/{{g.list_name_encoded}}">
          <div class="thumbnail">
            <div class="caption">
              <h5>
                {{g.display_name}}
              </h5>
              <p class="date">
                From {{g.oldest_published_date | date}} to {{g.newest_published_date | date}}
              </p>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</h1>
```
<br>

# Custom HTML tags
This example makes use of several built-in directives of AngularJS: `ngApp`,
`ngView`, `ngRepeat`, and so forth. It is also possible to define custom
directives. The last route of our application shows the details of the
selected book. We want to define a new HTML tag, for example `<book>`, that
will render all the information. Therefore, the template defined in the
route configuration will simply look like that:

```
<book></book>
```
<br>

We need to define the new directive, so we create a new script named `book.js`
with the following content:

```
(function () {
  'use strict';

  var app = angular.module('NYTBestSellers');

  app.directive('book', function () {
    return {
      restrict: 'E',
      templateUrl: 'src/html/directives/book.html',
      controller: function ($scope, $routeParams, $http) {
        $scope.id = $routeParams.id;
        $scope.isbn = $routeParams.isbn;
        var url = 'http://api.nytimes.com/svc/books/v3/lists/' + $routeParams.genre + '.json?sort-by=rank&sort-order=ASC&api-key=sample-key',
            i,
            b;
        $http.get(url).then(function (response) {
          for (i = 0; i < response.data.results.books.length; i += 1) {
            b = response.data.results.books[i];
            if (b.isbns[0].isbn13 === $routeParams.isbn) {
              $scope.book = b;
              break;
            }
          }
        }).catch(function (e) {
          $scope.error = e;
        });
      }
    };
  });
}());
```
<br>

The `restrict` option tells AngularJS that we are creating a new element, but
it is also possible to create attributes, comments and classes. The
`templateUrl` defines the HTML file that will be rendered inside our new tag,
while the `controller` defines the business logic of the new directive.

# Conslusions
AngularJS is a very powerful front-end framework that allows you to create
single page applications. It lets you modularize your application, define
routes and bind together the data and the presentation layers. Everything you
may need, in one framework. This can be an advantage, but also a limitation.
An alternative solution is to combine several libraries to achieve the same
goal of AngularJS, as per the (_simplistic_) image below.

<img class="img-responsive center-block" src="../src/images/angular_01.png">

[Handlebars](http://handlebarsjs.com/) (_or [Mustache](https://mustache.github.io/),
or [Spacebars](http://meteorcapture.com/spacebars/), or..._) could be used for the templating, [RequireJS](http://requirejs.org/) for the modularization,
[Backbone](http://backbonejs.org/) for the routing, and
[Q](http://documentup.com/kriskowal/q/) for the promises. Which are the pros
and cons of AngularJS compared to the alternative scenario?

**Pro:** Everything you need is in one place. You need to learn, use, but
most importantly, debug, only one framework. AngularJS has a strong community,
and there are many resources available to learn how to use it. The integration
of different technologies requires more learning time, and it could also
lead to integration problems among the different modules (_versions, bugs, …_).

**Cons:** You are limited to one framework. When you combine different
technologies, you have the freedom to switch any component with a better one,
if it is convenient in terms of time and performances. Although more time is
required to learn how to use different technologies, each library is highly
specialized and it may provide more features and higher performances if
compared to a more generic framework.

Nothing is completely black or white, of course. For example, it is still
possible to use AngularJS with Require, and it is probably possible to
introduce other technologies as well. But then things start becoming a bit
messy, so it would be probably better to chose either AngularJS or a
components-based approach.

Should I use AngularJS then? Same old song and dance: it depends! On the
requirements, time available, resources. But AngularJS is definitely a
valid framework, and I strongly suggest you to give it a shot!
