const load = template_name => {
  $.ajax({
    url: `src/templates/${template_name}.handlebars`,

    success:  function(content) { render(content, template_name) },
    error:    function(error)   { load('404') }
  })
}

const render = (content, template_name) => {
  const source        = $(content).filter(`#${template_name}`).html() ||
                        $(content).filter('#404').html()
  const template      = Handlebars.compile(source)
  const html          = template({})

  $('#placeholder').html(html)
}
