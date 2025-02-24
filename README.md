# Hijax.js
As in interception of forms to make the request as ajax and use the result HTML to replace something in the document.

## Is it any good?
[yes](https://news.ycombinator.com/item?id=3067434)

## Use
```html
<form
  id="some-id"
  data-hijax
  data-hijax-target="some-id"
>
</form>
```

If target not specified, replaces the form itself. Always "outerHTML" is used.
