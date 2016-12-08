# How I built my blog with Grunt
<hr>
<br>

Most of the contents of this blog used to live in [WordPress](https://kalimadev.wordpress.com/), and it was all
good. But after a while I started noticing small things. For example, the
analytics is very minimal. Or the editor is quite slow, with a very poor
support for synthax highlighting (_well, basically none_). And these are all
things that I know how to fix! So I decided to move the blog somewhere else,
and implement all the things as I like them to be! I am a developer after
all, right? 😎

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

# Markdown, please!

# Be social

# Feedback

# Structured data

# Putting all together with Grunt
