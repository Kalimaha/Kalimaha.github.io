const build_page = (post_title) => {
  load_template('imports')
  load_template('social')
  load_google_analytics()
  load_markdown(post_title, 'post_content')
  load_disqus()
  load_social_media()
}

const load_markdown = (templateID, divID = templateID) => {
  $.ajax({
    url: `../src/markdown/${templateID}.md`,

    success:  function(content) {
      const converter = new showdown.Converter()
      const html      = converter.makeHtml(content)

      $(`#${divID}`).html(html)

      hljs.highlightBlock($('pre').get(0))
      $('a').addClass('keyword')
    }
  })
}

const load_template = (templateID, divID = templateID) => {
  $.ajax({
    url: `../src/templates/${templateID}.hbs`,

    success:  function(content) {
      const source    = $(content).filter(`#${templateID}`).html().trim()

      $(`#${divID}`).html(source)
    }
  })
}

const load_google_analytics = () => {
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  ga('create', 'UA-87710589-1', 'auto');
  ga('send', 'pageview');
}

const load_disqus = () => {
  (function() {
    var d = document, s = d.createElement('script');
    s.src = '//guido-barbaglia.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
  })();
}

const load_social_media = () => {
  const title     = $(document).find('title').text().trim()
  const base_url  = 'http://guido-barbaglia.blog'
  const url       = base_url + window.location.pathname

  setTimeout(function() {
    $('#twitter').attr('href', `https://twitter.com/intent/tweet?text=${title}&url=${url}&via=Kalimaha`)
    $('#facebook').attr('href', `http://www.facebook.com/sharer/sharer.php?u=${url}&title=${title}`)
    $('#google-plus').attr('href', `https://plus.google.com/share?url=${url}`)
    $('#reddit').attr('href', `http://www.reddit.com/submit?url=${url}&title=${title}`)
    $('#linkedin').attr('href', `http://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`)
  }, 3000)
}
