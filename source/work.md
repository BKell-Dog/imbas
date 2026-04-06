---
layout: article.njk
permalink: /work/
---

### Our Track Record

Here you'll find a small sample of work we've done for previous clients.

{%- for item in collections.work | sort(false, false, 'data.title') %}
<br>
<a href="{{ item.url }}">{{ item.data.title }}</a>
{%- endfor %}