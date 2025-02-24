/**
 * RELEASE hijax.v1.0.js
 * Hijax.js
 * https://raw.githubusercontent.com/doooby/hijax-js/refs/heads/main/dist/hijax.v1.0.js
 */

const hijax = {
  fetch: (url, options) => window.fetch(url, options),
  onFail: undefined,
}

class HijaxedForm {
  constructor (form) {
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

  async process () {
    try {
      const result = await hijax.fetch(
        this.url,
        {
          method: this.method,
          credentials: (this.includeCredentials ? 'include' : undefined),
          headers: this.headers,
          body: this.formData,
        }
      )
      if (result.ok) {
        this.target.outerHTML = await result.text()
      } else {
        hijax.onFail?.(null, result, this)
      }
    } catch (error) {
      hijax.onFail?.(error, null, this)
    }
  }
}

export default hijax

document.addEventListener('DOMContentLoaded', function () {
  document.body.addEventListener('submit', function (event) {
    if (event.target.matches('form[data-hijax]')) {
      event.preventDefault()
      const form = new HijaxedForm(event.target)
      if (!form.element.dispatchEvent(
        new CustomEvent('hijax:before', {
          cancelable: true,
          detail: { form },
        })
      )) return
      form.process()
    }
  })
})
