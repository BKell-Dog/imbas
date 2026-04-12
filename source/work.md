---
layout: article.njk
permalink: /work/
---

## Our Track Record

Here you'll find a few case studies of work we've done in the past.

{% for item in collections.work %}
{% if item.data.image %}
<h3>{{ item.data.title }}</h3>
<a href="{{ item.url }}">
	{% woodcut item.data.image, item.data.imageTransform, item.data.mobileImageTransform %}
</a>
{% endif %}
{% endfor %}

---

<style>p>a{text-decoration: underline;}</style>

Not a hardware project? We also [help small businesses](/business/) identify and adopt the right technology for their workflow.