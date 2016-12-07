# Dependencies

* [nodejs](https://nodejs.org/en/) installed
* [grunt-cli](http://gruntjs.com/getting-started) installed

# Usage

Install all the dependencies with:

```
npm install
```

Create the blog posts with:

```
grunt
```

# How to add an article

Add a new `.md` file in the `src/contents` folder, e.g. `my_post.md`.
The name must be in snake case, capitalize the words as required.

To add a summary to the post, create a new `.md` file in `src/summaries` with
the same name of the post file (_all small caps this time_).

To add an image to the post, add a new `.png` file in `src/images` with the
same name of the post (_all small caps again_).

The HTML files will be stored in the `posts` folder.
