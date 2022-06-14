# Sortee

Sortee is a tool to manage Load Order of [Tealium iQ](https://tealiumiq.com) Extensions.
Sortee sorts extensions by provided function. The sort process is executed per each of the extension scopes

# Usage

To use Sortee copy the contents of the dist/sortee.js file into the developer toos console of your browser while having Tealium iQ open.

Then you can provide a comparison function to the Sortee function:

```javascript
Sortee(function (a, b) {
  if (a.title < b.title) return -1;
  if (a.title > b.title) return 1;
  return 0;
});
```

Comparison functions will receive two Extension objects to compare between.
Comparison function should return -1 if the first extension should be before the second one, 1 if the first extension should be after the second one, 0 if there should be no order change.

# FAQ

**Q: Is Sortee supporting the sorting of the tags?**
No, Sortee currently doesn't support sorting of the Tags. If there will be enough interest in doing that the Sortee can be modified to support such case.

**Q: Is changind the scope supported by Sortee?**
No, changing the scope is currently not supported.
