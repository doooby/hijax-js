/**
 * RELEASE hijax.v1.1.js
 * Hijax.js
 * https://raw.githubusercontent.com/doooby/hijax-js/refs/heads/main/dist/hijax.v1.1.js
 */

const hijax = {
  fetch: (url, options) => fetch(url, options),
  submit: (element) => {
    const form = new HijaxedForm(element)
    if (!element.dispatchEvent(
      new CustomEvent('hijax:before', {
        cancelable: true,
        detail: { form },
      })
    )) return
    form.process()
  },
  onFail(error, response, client) {
    console.log(response, client)
    if (error) console.error(error)
  },
}

class HijaxedForm {
  constructor(form) {
    this.element = form
    let target = form.dataset.hijaxTarget
    this.target = target
      ? document.getElementById(target)
      : form
    this.url = form.action
    this.method = form.method
    this.headers = {}
    this.formData = new FormData(form)
    this.includeCredentials = true
  }

  async process() {
    try {
      const response = await hijax.fetch(
        this.url,
        {
          method: this.method,
          credentials: (this.includeCredentials ? 'include' : undefined),
          headers: this.headers,
          body: this.getSanitizedBody(),
        }
      )
      if (response.ok) {
        this.target.outerHTML = await response.text()
      } else {
        hijax.onFail?.(null, response, this)
      }
    } catch (error) {
      hijax.onFail?.(error, null, this)
    }
  }

  getSanitizedBody() {
    switch (this.method.toUpperCase()) {
      case "GET":
      case "HEAD":
        return
      default:
        return this.formData
    }
  }
}

export default hijax

document.addEventListener('DOMContentLoaded', function() {
  document.body.addEventListener('submit', function(event) {
    if (event.target.matches('form[data-hijax]')) {
      event.preventDefault()
      hijax.submit(event.target)
    }
  })
})
