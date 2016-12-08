# How I built my blog with Grunt
<hr>
<br>

Most of the contents of this blog used to live in [WordPress](https://kalimadev.wordpress.com/),
and it was all good. But after a while I started noticing small things.
For example, the analytics is very minimal. Or the editor is quite slow,
with a very poor support for syntax highlighting (_well, basically none_).
And these are all things that I know how to fix! So I decided to move the
blog somewhere else, and implement all the things as I like them to be!
I am a developer after all, right? 😎

# Custom DNS

First thing first, I want my name on it! At the time they just started
selling the new `.blog` domains, and I got mine at a very affordable price.
That was easy.

# It has to be free!

The DNS was cheap enough, but what about the hosting? A blog is just a bounce
of static contents, how much would it cost me? Well, if you host the whole thing
on GitHub it's all free! Perfect!

But, how do I connect my domain name with my repository? My first solution was
to use the [GoDaddy](https://it.godaddy.com/)'s redirect feature with
masking, but... Well, they just take your content and put it in a giant
`<frameset>`... Bad GoDaddy!

So, read the documentation! OK, on the GitHub side, I just had to create a
file named `CNAME` in the root of my project and put my domain name in it, as
simple as:

```
guido-barbaglia.blog
```
<br>

On the GoDaddy side (_Manage DNS, or something similar_), I had to remove
the default `A` and `CNAME` records and add the GitHub ones:

| Type  | Name | Value              |
|-------|------|--------------------|
| A     | @    | 192.30.252.153     |
| A     | @    | 192.30.252.154     |
| CNAME | www  | kalimaha.github.io |

# Mobile first

You have probably realized that I am not a designer by now...
But I want to have a decent looking blog, and it has to be readable on desktop,
tablet, mobile and everything else. How can I achieve all of this with the
minimum effort?

I usually rely on [Bootstrap](http://getbootstrap.com/), which allows me to
focus on the business logic of my front-end stuff withouth worring much about
the look and feel. I just need to use Bootstrap's classes and its nice grid
system, and everything looks decent enough. What is more, it looks nice at
every screen size, and I don't have to do anything.

Hooray! 🎉

# Markdown, please!

One of the reasons why I "left" WordPress was the editor. The WYSIWYG is slow,
and the code editing is not nice enough. The biggest pain was the syntax
highlighting, unsopported, which forced me to write my code in
[Gist](https://gist.github.com) and embed the relative script into the post. Not
so nice.

On the other hand, there is a solution that I use every day to document my code,
a solution that also let me write code snippets with no struggle at all: markdown!

My plan is simple: I write my post with the markdown syntax, and then something
translates it into HTML. That something is the
[ShowdownJS](https://github.com/showdownjs/showdown), which work nicely both in
NodeJS and in the browser.

The only thing that's missing in such library is the syntax highlighting, so I
just added [Hihghlight](https://www.npmjs.com/package/highlight), which
automagically detects the language of the snippets and applies the correct
color scheme.

# Be social

Hopefully people will read my posts, and maybe someone will find such posts
worth sharing with others on the major social networks. I then needed to provide
a nice set of share buttons at the end of every article. I first tried some
JavaScript library, but nothing was quite right. I then realized that it's not
rocket science, I just need some nice looking icons that point to the right
links. The icon set is provided by the awesome
[FontAwesome](http://fontawesome.io/), and creating the links was as easy as
Googling it:

```
<div>
  <a href="https://twitter.com/intent/tweet?text={{title}}&url={{url}}">
    <i class="fa fa-twitter fa-2x"></i>
  </a>
  <a href="http://www.linkedin.com/shareArticle?mini=true&url={{url}}&title={{title}}">
    <i class="fa fa-linkedin fa-2x"></i>
  </a>
  <a href="http://www.reddit.com/submit?url={{url}}&title={{title}}">
    <i class="fa fa-reddit fa-2x"></i>
  </a>
  <a href="http://www.facebook.com/sharer/sharer.php?u={{url}}&title={{title}}">
    <i class="fa fa-facebook fa-2x"></i>
  </a>
  <a href="https://plus.google.com/share?url={{url}}">
    <i class="fa fa-google-plus fa-2x"></i>
  </a>
</div>
```
<br>

# Feedback

As we seen before, my users are super interested in my posts and they share them
all over the internet. But, what if they want to discuss my super interesting
solutions with me? To provide such opportunity to my beloved readers, I've
added [Disqus](https://disqus.com/), an online community that is widely used
for comments on blogs and websites.
[Speak to me](https://en.wikipedia.org/wiki/Speak_to_Me) mates!

# Structured data

[If a tree falls in a forest and no one is around to hear it, does it make a
sound?](https://en.wikipedia.org/wiki/If_a_tree_falls_in_a_forest)
We agreed that my contents are incredibly interesting, but how do you
find them? Well, through Google right?

Apparently, Google understands a particular JSON dialect, namely
[JSON-LD](https://developers.google.com/schemas/formats/json-ld), that is used
to describe the content of your page. There are several templates that can be
used for different types of contents: articles, recipes, and so forth. Such
JSON can be anywhere in the page, embedded in a `script` tag. The JSON-LD I am
using for my articles looks like that:

```
<script type="application/ld+json">
  {
    "@context":"http://schema.org",
    "@type":"BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "http://guido-barbaglia.blog/posts/how_i_built_my_blog_with_grunt.html"
    },
    "headline":"How I built my blog with Grunt",
    "description":"In the beginning it was WordPress. But then I wanted something more personal, so I ended up building the whole blog from scratch with the help of Grunt.",
    "author": {
        "@type": "Person",
        "name": "Guido Barbaglia"
    },
    "datePublished": "2016-12-08T10:42:48.917Z",
    "dateModified": "2016-12-08T10:42:48.917Z",
    "publisher": {
      "@type": "Organization",
      "name": "Guido Barbaglia",
      "logo": {
        "@type": "ImageObject",
        "url": "http://guido-barbaglia.blog/src/images/portrait.jpg",
        "width": "150",
        "height": 60
      }
    },
    "image": {
      "@type": "ImageObject",
      "url": "http://guido-barbaglia.blog/src/images/how_i_built_my_blog_with_grunt.png",
      "height": 150,
      "width": "150"
    }
  }
</script>
```

# Putting all together with Grunt

At this point I have all the pieces sorted out, but how do I put them together?
The first solution I have implemented was a blueprint HTML page with a little
JavaScript function invoked in the `onload` which loaded and populated an
[Handlebars](http://handlebarsjs.com/). The problem of this solution is that
your content is not immediately available to your readers, and to Google
crawlers. Basically I had a blog full of empty pages. 🤔

The current solution uses [Grunt](http://gruntjs.com/) to pre-process my
markdown files and produce nice HTML files that are immediately available for
the readers (_and Google!_). The Grunt task I use is dead simple. The first
step harvests a given directory to fetch all the content (_markdown_) files:

```
const get_filenames = (grunt) => {
  var filenames = [];

  grunt.file.recurse('./src/contents', function(a, b, c, filename) {
    filenames.push(filename)
  });

  return filenames
};
```
<br>

Then, for each file, Grunt:

* loads the markdown file
* converts it into HTML
* highlight the code snippets
* load the Handlebars template
* injects the content
* creates and inject the JSON-LD
* write the HTML file

So basically, all I have to do is to write my posts using the markdown syntax
and then run one single command:

```
grunt
```
<br>

I then push all the changes to my GitHub repository and my blog is online.
Mission accomplished! 😎
