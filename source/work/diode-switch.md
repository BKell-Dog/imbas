---
layout: article.njk
title: Lossless Diode Switch in RF Filter
image: "VSWR.webp"
imageTransform: "scale(0.9) translateY(-220px);"
---

### Lossless Diode Switch in RF Filter

This client makes radios for military aircraft. For that reason, we can't go into details beyond this: the tier-1 supplier sent back an RF anti-jamming filter since *it was too noisy*. Our client (tier-2) identified the failure point, and gave us the task of designing and validating a new DC-biased diode switch inside their filter.

A large and understated part of this project was sourcing the *military-grade components* that would be necessary to meet the rigorous standards: our requirements for noise, weight, and cost were very tight. Blocking high frequency noise was naturally our toughest constraint, since radio signals had to pass through the filter *losslessly* while blocking outside interference.

Regular electronics vendors failed our client on the first try, and we had to source from a scientific components company for extremely low-loss and impedance matched diodes, inductors, connectors, &c.

{% woodcut "VSWR.webp", "scale(0.9) translateY(-220px);" %}

We had to test these components very precisely as well, there had to be no sign of the signal losses that the tier-1 had identified. We soldered the components on in-house, we put the new filter under a *series of RF stress tests* and tests designed to compare the noise floor of a clean sample signal to one originating in an already-noisy environment.

Our new filter passed these tests beautifully to our and our client's satisfaction. The client ordered parts for our filter in production quantity and is using them today.

## We Can Do Similar Work For You

{% include "components/contact.njk" %}