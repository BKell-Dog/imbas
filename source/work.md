---
layout: article.njk
permalink: /work/
---

### Our Track Record

Here you'll find a few case studies of work we've done in the past.

{%- for item in collections.work | sort(false, false, 'data.title') %}
{% if item.data.image %}
<h2>{{ item.data.title }}</h2>
<a href="{{ item.url }}">
	{% woodcut item.data.image item.data.imageTransform item.data.mobileImageTransform %}
</a>
{% endif %}
{%- endfor %}